'use client';

import { icons } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Theme from '../theme/Theme';
import { usePathname } from 'next/navigation';

const MobileNav = ({ boards }: { boards: string | undefined }) => {
	const [open, setOpen] = useState(false);

	const pathname = usePathname();

	const id = pathname.split('/').at(2);

	const Boards = boards && JSON.parse(boards);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	return (
		<div className="relative md:hidden">
			<button onClick={handleToggle} className="px-2">
				<Image src={open ? icons.chevronUp : icons.chevronDown} alt="icon" />
			</button>

			{open && (
				<>
					<div
						className="bg-dark fixed inset-0 z-30 opacity-60"
						onClick={() => setOpen(false)}
					/>

					<div className="fixed top-20 left-3 right-3 bottom-6 z-40 flex justify-center items-center">
						<div className="bg-white-darkgray w-[300px] mt-12 rounded-lg">
							<h2 className="h4 mt-8 uppercase pl-4 mb-2">
								All boards ({Boards.length})
							</h2>
							<ul className="my-1 space-y-1">
								{Boards.map((board: any) => (
									<Link
										key={board._id}
										href={`/boards/${board._id}`}
										className={`bg-transparent px-4 flex gap-4 w-full text-xs font-semibold items-center text-gray py-2 rounded-r-full ${
											id && id === board._id && 'bg-primary text-white'
										}`}
									>
										<Image src={icons.board} alt="board" className="invert" />
										<span>{board.name}</span>
									</Link>
								))}
							</ul>
							<div className="py-4 flex items-center justify-center">
								<Theme />
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default MobileNav;
