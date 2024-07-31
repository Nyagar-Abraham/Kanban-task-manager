'use client';

import { useOpen } from '@/context/OpenContext';

import { icons } from '@/constants';
import SimpleButton from './SimpleButton';
import Theme from '../theme/Theme';
import { FaPlus } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import Modal from './Dialog';
import BoardForm from '../forms/Board';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const SideBar = ({ boards }: { boards: string }) => {
	const { sideBarOpen, setOpenSideBar } = useOpen();

	const pathname = usePathname();

	const id = pathname.split('/').at(2);
	return (
		<div
			className={`md:w-[200px]   justify-between max-md:hidden  flex-col flex-1   bg-white-darkgray border-none 
			${sideBarOpen ? 'flex' : 'hidden'}`}
		>
			<div className="">
				<h2 className="h4 mt-1  uppercase pl-4 mb-4">All boards ({3})</h2>
				<ul className="my-1 space-y-1">
					{boards &&
						JSON.parse(boards).map((board: any) => (
							<Link
						
								key={board._id}
								href={`/boards/${board._id}`}
								className={`bg-transparent px-4 flex gap-4 w-full text-xs font-semibold items-center text-gray py-2 rounded-r-full ${
									id && id === board._id && '!bg-primary !text-white'
									
								}`}
							>
								<Image src={icons.board} alt="board" className=" invert " />

								<span>{board.name}</span>
							</Link>
						))}
				</ul>
				<Modal
					trigger={
						<div className="flex items-center  pl-4 ">
							<Image src={icons.board} alt="board" className="mr-3 invert " />
							<FaPlus className="text-primary text-[9px]" />
							<SimpleButton type="primary" className="text-xs ">
								Create New Board
							</SimpleButton>
						</div>
					}
				>
					<BoardForm type="create" />
				</Modal>
			</div>
			<div className="flex flex-col items-center gap-4  mb-2">
				<Theme />
				<div className="self-start ml-8">
					<SimpleButton
						type="secondary"
						icon={icons.hideSidebar}
						position="left"
						onClick={() => setOpenSideBar(false)}
					>
						hide sidebar
					</SimpleButton>
				</div>
			</div>
		</div>
	);
};

export default SideBar;
