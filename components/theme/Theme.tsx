'use client';

import { icons } from '@/constants';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function Theme() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="py-2 px-4 rounded-lg flex flex-none items-center bg-lightgray-dark gap-3">
			<Image src={icons.lightTheme} alt="sun icon" />
			<div
				onClick={() => {
					if (theme === 'dark') {
						setTheme('light');
					} else {
						setTheme('dark');
					}
				}}
				className={` bg-primary rounded-full h-[20px] w-[40px] flex items-center p-1 justify-center
      
      `}
			>
				<div
					className={`h-[14px] w-[14px] rounded-full bg-white ${
						theme === 'dark' ? 'translate-x-[75%]' : ' -translate-x-[75%]'
					}`}
				/>
			</div>
			<Image src={icons.darkTheme} alt="moon icon" />
		</div>
	);
}
