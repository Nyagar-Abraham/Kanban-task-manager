'use client';

import { icons } from '@/constants';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Modal from './Dialog';
import BoardForm from '../forms/Board';
import { deleteBoard, deleteTask } from '@/lib/actions/actions';
import { usePathname } from 'next/navigation';
import TaskForm from '../forms/TaskForm';

const MenuBar = ({
	item,
	Item,
	id,
}: {
	item?: string;
	id?: string;
	Item?: string;
}) => {
	const [open, setOpen] = useState(false);
	// const [modalOpen, setModalOpen] = useState('');
	const [deleting, setDeleting] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);
	const modalRef = useRef<HTMLDivElement | null>(null);
	const pathname = usePathname();

	useEffect(() => {
		function callback(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				if (!modalRef.current) {
					setOpen(false);
				} else {
					// setModalOpen('true')
				}
			}
		}

		document.addEventListener('click', callback);
		return () => {
			document.removeEventListener('click', callback);
		};
	}, []);

	const handleDelete = async () => {
		if (item === 'board') {
			setDeleting(true);
			await deleteBoard({
				boardId: pathname.split('/').at(2)!,
				path: `/`,
			});
		} else if (item === 'task') {
			await deleteTask({
				taskId: id!,
				path: `/boards/${pathname.split('/').at(2)}`,
			});
		}
		setDeleting(false);
	};

	return (
		<div ref={ref} className="relative">
			<button
				onClick={() => {
					setOpen(true);
				}}
			>
				<Image src={icons.ellipsis} alt="ellipsis" />
			</button>
			{open && (
				<div className="p-4  w-[180px] absolute top-full left-0 -translate-x-[90%] mt-4 z-10  rounded-lg  bg-white-dark shadow-md ">
					<Modal
						trigger={
							<p className="capitalize mb-1 text-sm font-semibold text-gray">
								edit {item}
							</p>
						}
					>
						<div ref={modalRef}>
							{item === 'task' && <TaskForm task={Item} type="edit" />}
							{item === 'board' && <BoardForm board={Item} type="edit" />}
						</div>
					</Modal>

					<div>
						<AlertDialog>
							<AlertDialogTrigger
								// onClick={() => setOpen(false)}
								className="text-danger bg-transparent hover:bg-transparent border-none"
							>
								delete {item}
							</AlertDialogTrigger>
							<AlertDialogContent className="border-none bg-white-dark ">
								<AlertDialogHeader>
									<AlertDialogTitle className="text-danger font-semibold ">
										Delete this board
									</AlertDialogTitle>
									<AlertDialogDescription className="text-gray text-sm ">
										This action cannot be undone. This will permanently delete
										board
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter className="flex gap-3 ">
									<AlertDialogAction
										disabled={deleting}
										onClick={handleDelete}
										className="flex-1 rounded-full border-none bg-danger hover:bg-dangerLight text-white "
									>
										{deleting ? 'Deleting...' : 'Delete'}
									</AlertDialogAction>
									<AlertDialogCancel className="flex-1 rounded-full border-none bg-lightestGray  hover:bg-veryLightGray text-primary ">
										Cancel
									</AlertDialogCancel>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			)}
		</div>
	);
};

export default MenuBar;
