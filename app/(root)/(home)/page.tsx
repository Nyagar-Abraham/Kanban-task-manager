import Navbar from '@/components/shared/Navbar';
import OpenSideBar from '@/components/shared/OpenSideBar';
import { getAllBoards } from '@/lib/actions/actions';
export default async function Home({ params }: any) {
	const [boards] = await Promise.all([getAllBoards()]);

	return (
		<main className=" bg-lightgray-dark h-full relative">
			<Navbar
				boards={JSON.stringify(boards)}
				nav={false}
				name="Task Management App"
			/>
			<div className="flex items-center justify-center p-6 h-[85%]  ">
				<div className="max-w-[500px] p-4 rounded-lg text-sm text-gray text-center">
					<p className="">
						Our Task Management App is designed to streamline your workflow and
						enhance productivity by efficiently organizing and managing your
						tasks. Whether you are an individual managing personal tasks or a
						team coordinating projects, this app offers a comprehensive solution
						to stay on top of your workload.
					</p>

					<p className="text-lg font-semibold text-primary mt-5">
						navigate to a board to get started
					</p>
				</div>
			</div>
			<OpenSideBar />
		</main>
	);
}
