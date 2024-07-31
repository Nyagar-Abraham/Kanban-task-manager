'use client';

import { icons } from '@/constants';
import { useOpen } from '@/context/OpenContext';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LogoProps {
	place?: string;
}

const Logo: React.FC<LogoProps> = ({ place }) => {
	const [image, setImage] = useState('');
	const { theme } = useTheme();
	const { sideBarOpen } = useOpen();

	useEffect(() => {
		function handleResize() {
			const width = window.innerWidth;
			if (width < 768) {
				setImage(icons.logoMobile);
			} else {
				if (theme === 'dark') {
					setImage(icons.logoLight);
				} else {
					setImage(icons.logoDark);
				}
			}
		}

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [theme]);

	const renderLogo = (additionalClasses: string) => (
		<div
			className={`flex-none bg-white-darkgray text-darkgray-white py-5 px-4 md:w-[200px] ${additionalClasses}`}
		>
			{image && <Image src={image} alt="logo" />}
		</div>
	);

	if (place === 'side') {
		return renderLogo(sideBarOpen ? 'block' : 'hidden');
	}

	if (place === 'nav') {
		return renderLogo(sideBarOpen ? 'hidden' : 'block');
	}

	if (place === 'mobile') {
		return renderLogo('max-md:flex md:hidden !p-0');
	}

	return null;
};

export default Logo;
