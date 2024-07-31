import React from 'react';
import Task from './Task';
import { FaPlus } from 'react-icons/fa6';

const Column = ({ column }: { column: string }) => {
	const Column = JSON.parse(column);

	//@ts-ignore
	if (Column?.tasks?.length)
		return (
			<div className=" h-full ">
				<h3 className="text-sm  uppercase font-semibold text-gray flex gap-2 items-center mb-6">
					<span
						className={`h-[14px] w-[14px] rounded-full 
          ${Column.name.trim() === 'Todo' && 'bg-sky-600'}
          ${Column.name.trim() === 'Done' && 'bg-green-600'}
          ${Column.name.trim() === 'Doing' && 'bg-purple-600'}
          `}
					/>
					<span>
						{
							//@ts-ignore
							Column?.name
						}
						({Column?.tasks?.length})
					</span>
				</h3>

				<div className="flex flex-col gap-4">
					{
						//@ts-ignore
						Column?.tasks.map((task) => (
							<Task key={task?._id} task={JSON.stringify(task)} />
						))
					}
				</div>
			</div>
		);
};

export default Column;
