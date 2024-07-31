import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import React from 'react';

interface Props {
	trigger: React.ReactNode;
	children: React.ReactNode;
}

const Modal = ({ trigger, children }: Props) => {
	return (
		<div>
			<Dialog>
				<DialogTrigger>{trigger}</DialogTrigger>
				<DialogContent className="border-none bg-white-dark">
					{children}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Modal;
