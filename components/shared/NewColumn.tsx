import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import Modal from './Dialog';
import ColumnForm from '../forms/ColumnForm';

const NewColumn = () => {
	return (
		<div className="ml-auto text-gray p-6 flex items-center bg-veryLightGray-dark rounded-lg  justify-center w-[260px] min-w-[260px]h-[80%]  ">
			<Modal
				trigger={
					<button className=" flex items-center hover:text-primary gap-2 self-stretch ">
						<FaPlus />
						<span className="font-bold">add column</span>
					</button>
				}
			>
				<ColumnForm />
			</Modal>
		</div>
	);
};

export default NewColumn;

// 'use client';

// import React, { useState } from 'react';
// import { FaPlus } from 'react-icons/fa6';
// import Modal from './Dialog';
// import ColumnForm from '../forms/ColumnForm';

// const NewColumn = () => {
// 	const [open, setOpen] = useState(false);

// 	return (
// 		<div className="ml-auto text-gray p-6 flex items-center bg-veryLightGray-dark rounded-lg justify-center w-[260px] min-w-[260px] h-full">
// 			<Modal
// 				trigger={
// 					<button
// 						className="flex items-center hover:text-primary gap-2 self-stretch"
// 						onClick={() => setOpen(true)}
// 					>
// 						<FaPlus />
// 						<span className="font-bold">add column</span>
// 					</button>
// 				}
// 				isOpen={open}
// 				onClose={() => setOpen(false)}
// 			>
// 				<ColumnForm onClose={() => setOpen(false)} />
// 			</Modal>
// 		</div>
// 	);
// };

// export default NewColumn;
