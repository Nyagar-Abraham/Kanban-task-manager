import Image from 'next/image';
import React, { PropsWithChildren } from 'react';

interface Props {
	children: React.ReactNode;
	type: 'primary' | 'secondary';
	position?: 'left' | 'right';
	icon?: string;
	className?: string;
	onClick?: any;
}

const SimpleButton: React.FC<PropsWithChildren<Props>> = ({
	children,
	type,
	position,
	icon,
	className,
	onClick,
}: Props) => {
	return (
		<button
			onClick={onClick}
			className={`py-1 font-semibold text-sm flex items-center justify-center gap-2 capitalize  ${
				className && className
			}
        ${type === 'primary' ? 'text-primary hover' : ''}
        ${type === 'secondary' ? 'text-gray hover' : ''}
      `}
		>
			{position === 'left' && (
				<Image src={icon as string} alt="icon" width={16} height={16} />
			)}
			{children}
			{position === 'right' && (
				<Image src={icon as string} alt="icon" width={16} height={16} />
			)}
		</button>
	);
};

export default SimpleButton;
