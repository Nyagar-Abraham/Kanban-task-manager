'use client';

import Image from 'next/image';
import Modal from './Dialog';
import MenuBar from './MenuBar';
import { icons } from '@/constants';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { updateSubTask, updateTask } from '@/lib/actions/actions';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa6';
import { DialogClose } from '../ui/dialog';

const Task = ({ task }: { task: string }) => {
	const [submittingTask, setSubmittingTask] = useState(false);
	const [submittingSubTask, setSubmittingSubTask] = useState(false);
	const pathname = usePathname();
	const Task = JSON.parse(task);
	const { subTasks } = Task;

	const Done = subTasks.filter((t: any) => t?.isCompleted === true);

	const handleValueChange = async (value: string) => {
		if (value) {
			setSubmittingTask(true);
			try {
				await updateTask({
					boardId: pathname.split('/').at(2)!,
					taskId: Task._id,
					updateData: {
						status: value,
					},
					path: `/boards/${pathname.split('/').at(2)}`,
				});
			} catch (error) {
				console.error('Error updating task status:', error);
			} finally {
				setSubmittingTask(false);
			}
		}
	};

	const handleSubTaskClick = async (subTaskId: string) => {
		setSubmittingSubTask(true);
		try {
			await updateSubTask({
				id: subTaskId,
				path: `/boards/${pathname.split('/').at(2)}`,
			});
		} catch (error) {
			console.error('Error updating subtask:', error);
		} finally {
			setSubmittingSubTask(false);
		}
	};

	return (
		<Modal
			trigger={
				<div className="p-3 text-start rounded-lg shadow-md bg-white-darkgray text-darkgray-white w-[260px]">
					<h3 className="h3 my-3">{Task?.title}</h3>
					<p className="text-xs text-gray">
						{Done?.length} of {subTasks?.length} subTasks
					</p>
				</div>
			}
		>
			<div className="space-y-1 rounded-lg mt-8">
				<div className="flex gap-7 items-start mr-8">
					<h3 className="h3 mb-4 flex-1">{Task?.title}</h3>
					<MenuBar Item={task} item="task" id={Task?._id} />
				</div>
				<p className="text-xs text-gray mt-1 mb-3">{Task?.description}</p>
			</div>

			<p className="h3 !font-base !text-mediumGray-VeryLightGray">
				{Done?.length} of {subTasks?.length} subTasks
			</p>

			<div className="flex flex-col gap-2">
				{subTasks?.map((subTask: any) => (
					<div
						key={subTask?._id}
						className="px-3 py-2 flex gap-2 items-center bg-light-darkGray relative rounded-lg"
					>
						{submittingSubTask && (
							<span className="absolute right-4 top-1/2 -translate-y-1/2">
								<FaSpinner className="text-white animate-spin" />
							</span>
						)}
						<button
							onClick={() => handleSubTaskClick(subTask?._id)}
							className={`h-3 w-3 rounded-sm border flex items-center justify-center border-gray/50 ${
								subTask?.isCompleted ? 'bg-primary' : 'bg-veryLightGray'
							}`}
						>
							{subTask?.isCompleted && <Image src={icons.check} alt="check" />}
						</button>
						<p
							className={`text-sm ${
								subTask?.isCompleted
									? 'line-through text-gray'
									: 'text-mediumGray-VeryLightGray'
							}`}
						>
							{subTask?.title}
						</p>
					</div>
				))}
			</div>

			<div className="flex flex-col gap-2">
				<label className="text-mediumgray-verylightgray text-sm font-semibold">
					Current Status
				</label>
				<Select onValueChange={handleValueChange}>
					<SelectTrigger className="bg-white-dark border border-gray/40 h-[40px] focus:outline-none focus:ring-2 focus:ring-primary/70 relative">
						{submittingTask && (
							<span className="absolute right-4 top-1/2 -translate-y-1/2">
								<FaSpinner className="text-white animate-spin" />
							</span>
						)}
						<SelectValue placeholder={Task?.status} />
					</SelectTrigger>
					<SelectContent className="border border-gray/40 bg-white-dark">
						<SelectItem value="Todo">Todo</SelectItem>
						<SelectItem value="Doing">Doing</SelectItem>
						<SelectItem value="Done">Done</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</Modal>
	);
};

export default Task;
