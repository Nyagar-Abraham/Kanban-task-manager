import Logo from '@/components/shared/Logo';
import SideBar from '@/components/shared/SideBar';
import { Provider } from '@/context/OpenContext';
import { getAllBoards } from '@/lib/actions/actions';
import React from 'react';

interface LayoutProps {
	children: React.ReactNode;
	params: { id: string };
}
const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
	const [boards] = await Promise.all([getAllBoards()]);

	return (
		<Provider>
			<main className="min-h-[100dvh] transition-all duration-700 items-stretch flex  overflow-x-hidden max-w-full">
				<div className="flex max-md:hidden flex-col border-r border-gray/50">
					<Logo place="side" />
					<SideBar boards={JSON.stringify(boards)} />
				</div>
				<section className="flex-1 max-md:w-screen ">{children}</section>
			</main>
		</Provider>
	);
};

export default Layout;
