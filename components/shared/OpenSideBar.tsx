'use client';

import { icons } from '@/constants';
import { useOpen } from '@/context/OpenContext';
import Image from 'next/image';

const OpenSideBar = () => {
	const { setOpenSideBar, sideBarOpen } = useOpen();
	return (
		<div
			onClick={() => setOpenSideBar(true)}
			className={`px-4 py-2  rounded-r-xl bg-primary   w-[50px]
      ${!sideBarOpen ? 'absolute left-0 bottom-20' : 'hidden'}
    `}
		>
			<Image src={icons.showSidebar} alt="icon" height={40} width={40} />
		</div>
	);
};

export default OpenSideBar;
