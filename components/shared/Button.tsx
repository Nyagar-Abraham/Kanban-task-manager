import Image from 'next/image';
import React from 'react';

interface Props {
	type: string;
	children: React.ReactNode;
	size?: string;
	onClick?: any;
	disabled?: boolean;
	position?: string;
	icon?: string;
	className?: string;
}

const Button = ({
	type,
	children,
	size = 'large',
	onClick,
	disabled,
	position,
	icon,
	className,
}: Props) => {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={` flex items-center justify-center gap-2 
  rounded-full text-sm font-semibold
	${className && className}
  ${size === 'large' && 'px-6 py-2'}
  ${size === 'small' && 'px-6 py-1'}
	${disabled && 'cursor-not-allowed'}
  
  ${
		type === 'primary' &&
		'bg-primary hover:bg-primaryLight text-white disabled:bg-primary/70'
	}
  ${
		type === 'secondary' &&
		'hover:bg-veryLightGray bg-lightestGray text-primary disabled:bg-gray/70'
	}
  ${
		type === 'danger' &&
		'bg-danger hover:bg-dangerLight text-white disabled:bg-danger/70'
	}
  `}
		>
			{position && position === 'left' && (
				// @ts-ignore
				<Image src={icon} alt="icon" />
			)}
			{children}
			{position &&
				position ===
					// @ts-ignore
					'right' && <Image src={icon} alt="icon" />}
		</button>
	);
};

export default Button;
