'use server';

import { connectToDatabase } from '../mongoose';
import Column from '@/database/columns.model';
import Board from '@/database/boards.model';
import {
	createBoardParams,
	createTaskParams,
	updateBoardParams,
	updateTaskParams,
} from '../shared.type';
import Task from '@/database/tasks.model';
import SubTask from '@/database/subtasks.model';
import { revalidatePath } from 'next/cache';

import { redirect } from 'next/navigation';

export async function createBoard(params: createBoardParams) {
	try {
		await connectToDatabase();

		const { columns, name, path } = params;

		const isBoard = await Board.findOne({ name });

		if (isBoard) return;

		// Create the board
		const board = await Board.create({
			name,
		});

		// Create columns and update board and columns with references
		for (const columnName of columns) {
			const column = await Column.findOne({ name: columnName });

			if (column) {
				console.log('found');
				await Board.findByIdAndUpdate(board?._id, {
					$addToSet: { columns: column?._id },
				});

				await Column.findByIdAndUpdate(column?._id, {
					$addToSet: { boards: board?._id },
				});
			} else {
				console.log('created');
				const newColumn = await Column.create({
					name: columnName,
					boards: [board._id], // Initializing the boards field with the board ID
				});

				await Board.findByIdAndUpdate(board?._id, {
					$addToSet: { columns: newColumn?._id },
				});
			}
		}

		// Optionally, populate the board with its columns to return a fully populated document
		const finalBoard = await Board.findById(board._id).lean();
		revalidatePath(path);
		return finalBoard;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function updateBoard(params: updateBoardParams) {
	try {
		await connectToDatabase();

		const { updateData, path, boardId } = params;

		const board = await Board.findByIdAndUpdate(
			boardId,
			{ name: updateData.name },
			{ new: true }
		);

		if (updateData.columns?.length) {
			for (const column of updateData.columns) {
				if (column.type === 'added') {
					const name = column.item;

					const col = await Column.findOne({ name });

					if (col) {
						//add to board
						await Board.findByIdAndUpdate(boardId, {
							$addToSet: { columns: col._id },
						});

						await Column.findByIdAndUpdate(col._id, {
							$addToSet: { boards: board._id },
						});
					} else {
						const newColumn = await Column.create({
							name,
							boards: [board._id],
						});

						//add to board
						await Board.findByIdAndUpdate(boardId, {
							$addToSet: { columns: newColumn._id },
						});
					}
				} else if (column.type === 'removed') {
					const name = column.item;

					const col = await Column.findOne({ name });
					//remove to board
					await Board.findByIdAndUpdate(boardId, {
						$pull: { columns: col._id },
					});
					await Column.findByIdAndUpdate(col._id, {
						$pull: { boards: board._id },
					});
				}
			}
		}

		revalidatePath(path);
		redirect(path);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getAllBoards() {
	try {
		await connectToDatabase();

		const boards = await Board.find({});

		return boards;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getBoardByID(params: { boardId: string }) {
	try {
		await connectToDatabase();
		const { boardId } = params;

		const board = await Board.findById(boardId)
			.populate({
				path: 'columns',
				populate: {
					path: 'tasks',
					populate: {
						path: 'subTasks',
						model: SubTask,
					},
					model: Task,
				},
				model: Column,
			})
			.lean();

		return board;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
//create  task
export async function createTask(params: createTaskParams) {
	try {
		await connectToDatabase();

		const { board, subTasks, title, description, status, path } = params;

		const exist = await Task.findOne({ title });
		if (exist) return;
		// Create the task
		const task = await Task.create({
			title,
			description,
			status,
			board,
		});

		// Create subtasks and add their IDs to the task's subTasks field
		for (const subTaskTitle of subTasks) {
			const newSubTask = await SubTask.create({
				title: subTaskTitle,
				isCompleted: false,
			});

			await Task.findByIdAndUpdate(task._id, {
				$addToSet: { subTasks: newSubTask._id },
			});
		}

		// Find the column where the task belongs based on status
		const taskColumn = await Column.findOne({ name: status });

		if (taskColumn) {
			console.log('found');
			// Add the task ID to the column's tasks field
			await Column.findByIdAndUpdate(taskColumn._id, {
				$addToSet: { tasks: task._id },
			});

			const TaskBoard = await Board.findById(board);

			if (!TaskBoard.columns.includes(taskColumn._id)) {
				await Board.findByIdAndUpdate(board, {
					$addToSet: { columns: taskColumn?._id },
				});
			}

			// Update the task with the column ID
			const finalTask = await Task.findByIdAndUpdate(task._id, {
				column: taskColumn._id,
			}).lean();
		} else {
			console.log('creating');
			const newColumn = await Column.create({
				name: status,
				boards: [board],
				tasks: [task._id],
			});

			await Board.findByIdAndUpdate(board, {
				$addToSet: { columns: newColumn?._id },
			});

			await Task.findByIdAndUpdate(task._id, { column: newColumn._id });
		}

		revalidatePath(path);
		redirect(path);
	} catch (error) {
		console.error('Error creating task:', error);
		throw error;
	}
}
//update task
export async function updateTask(params: updateTaskParams) {
	try {
		await connectToDatabase();
		const { boardId, taskId, updateData, path } = params;

		// Update Task
		let task = await Task.findByIdAndUpdate(
			taskId,
			{
				title: updateData.title,
				description: updateData.description,
			},
			{ new: true }
		);
		//subtask
		if (updateData?.subTasks?.length) {
			for (const subTask of updateData?.subTasks) {
				if (subTask.type === 'added') {
					const newSubtask = await SubTask.create({
						title: subTask.item,
						isCompleted: false,
					});

					await Task.findByIdAndUpdate(task._id, {
						$addToSet: { subTasks: newSubtask._id },
					});
				} else if (subTask.type === 'removed') {
					const removedSubtask = await SubTask.findOne({
						title: subTask.item,
					});

					await Task.findByIdAndUpdate(task._id, {
						$pull: { subTasks: removedSubtask._id },
					});
				}
			}
		}

		//status/column
		if (updateData?.status !== undefined && updateData.status !== task.status) {
			const column = await Column.findOne({ name: updateData.status });

			if (column) {
				console.log('update');
				const board = await Board.findById(boardId);

				if (!column?.boards?.includes(board._id)) {
					await Column.findByIdAndUpdate(column?._id, {
						$addToSet: { boards: board._id },
					});
				}
				if (!board?.columns?.includes(column?._id)) {
					await Board.findByIdAndUpdate(board._id, {
						$addToSet: { columns: column._id },
					});
				}
				// Find the new column by status and add the task to it
				const newColumn = await Column.findOneAndUpdate(
					{ name: updateData.status },
					{ $addToSet: { tasks: taskId } },
					{ new: true }
				);

				// Remove the task from the previous column
				await Column.findByIdAndUpdate(task.column, {
					$pull: { tasks: taskId },
				});

				// Update the task with the new column reference
				await Task.findByIdAndUpdate(
					taskId,
					{ column: newColumn._id },
					{ new: true }
				);
			} else {
				console.log('creating');
				const newColumn = await Column.create({
					name: updateData.status,
				});

				const board = await Board.findByIdAndUpdate(boardId, {
					$addToSet: { columns: newColumn._id },
				});

				await Column.findByIdAndUpdate(newColumn._id, {
					$addToSet: {
						boards: board._id,
						tasks: task._id,
					},
				});

				// Remove the task from the previous column
				await Column.findByIdAndUpdate(task.column, {
					$pull: { tasks: taskId },
				});

				await Task.findByIdAndUpdate(task._id, { column: newColumn._id });
			}
		}

		revalidatePath(path);
		redirect(path);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function updateSubTask(params: { id: string; path: string }) {
	try {
		await connectToDatabase();

		const { path, id } = params;

		const subtask = await SubTask.findById(id);
		await SubTask.findByIdAndUpdate(id, { isCompleted: !subtask.isCompleted });

		revalidatePath(path);
		redirect(path);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

//delete board

export async function deleteBoard(params: { boardId: string; path: string }) {
	try {
		await connectToDatabase();

		const { boardId, path } = params;

		// Delete the board
		const board = await Board.findByIdAndDelete(boardId);

		if (!board) {
			throw new Error(`Board with ID ${boardId} not found`);
		}

		// Remove the board ID from all columns
		await Column.updateMany(
			{ boards: board._id },
			{ $pull: { boards: board._id } }
		);

		// Find columns that no longer belong to any boards
		const emptyColumns = await Column.find({ boards: { $size: 0 } });

		// Delete empty columns
		for (const column of emptyColumns) {
			await Column.findByIdAndDelete(column._id);
		}

		// Find and delete tasks related to the board
		const tasks = await Task.find({ board: board._id });

		for (const task of tasks) {
			const subTasks = task?.subTasks;
			// Delete subtasks of each task
			for (const subTask of subTasks)
				await SubTask.deleteMany({ _id: subTask._id });
		}

		// Delete tasks of the board
		await Task.deleteMany({ board: board._id });

		// Revalidate path
		redirect(path);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

//deleting task
export async function deleteTask(params: { taskId: string; path: string }) {
	try {
		await connectToDatabase();

		const { taskId, path } = params;

		const task = await Task.findByIdAndDelete(taskId);

		for (const subTask of task.subTasks) {
			await SubTask.findByIdAndDelete(subTask._id);
		}

		revalidatePath(path);
		redirect(path);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function createColumn(params: {
	name: string;
	boardId: string;
	path: string;
}) {
	try {
		await connectToDatabase();

		const { name, boardId, path } = params;

		const column = await Column.findOne({ name });

		if (column) {
			const board = await Board.findByIdAndUpdate(boardId, {
				$addToSet: { columns: column._id },
			});

			await column.findByIdAndUpdate(column._id, {
				$addToSet: { boards: board._id },
			});
		} else {
			const newColumn = await Column.create({
				name,
				boards: [boardId],
			});
			await Board.findByIdAndUpdate(boardId, {
				$addToSet: { columns: newColumn._id },
			});
		}

		revalidatePath(path);

		redirect(path);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

// export async function getAllBoards() {
// 	try {
// 		await connectToDatabase();

// 	 const boards = 	await Board.find({})
// 			.populate('columns')
// 			.lean();

// 		return boards;
// 	} catch (error) {
// 		console.error(error);
// 		throw error;
// 	}
// }
