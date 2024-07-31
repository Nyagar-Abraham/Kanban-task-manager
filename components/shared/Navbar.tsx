import { icons } from '@/constants';
import Button from './Button';

import MenuBar from './MenuBar';
import Modal from './Dialog';
import Logo from './Logo';
import TaskForm from '../forms/TaskForm';
import MobileNav from './MobileNav';

const Navbar = ({
	nav,
	name,
	disabled,
	boards,
	board,
}: {
	name?: string;
	disabled?: boolean;
	boards?: string;
	nav?: boolean;
	board?: string;
}) => {
	return (
		<div className="  border-b border-gray/50 flex  bg-white-darkgray text-darkgray-white ">
			<span className="">
				<Logo place="nav" />
			</span>

			<div className="flex justify-between flex-1 items-center px-3 py-3 ">
				<div className="flex items-center gap-2">
					<Logo place="mobile" />
					<h1 className="font-xl font-semibold  capitalize">{name}</h1>

					<MobileNav boards={boards} />
				</div>
				{nav && (
					<div className=" gap-4 flex items-center mr-3">
						<Modal
							trigger={
								<Button
									disabled={disabled}
									type="primary"
									size="large"
									icon={icons.addTaskMobile}
									position="left"
								>
									<span className="max-md:hidden">Add New Task</span>
								</Button>
							}
						>
							<TaskForm type="create" />
						</Modal>

						<MenuBar Item={board} item="board" />
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;
