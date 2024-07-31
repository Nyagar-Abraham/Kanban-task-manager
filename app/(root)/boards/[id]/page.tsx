import Column from '@/components/shared/Column';
import Navbar from '@/components/shared/Navbar';
import NewColumn from '@/components/shared/NewColumn';
import NoResult from '@/components/shared/NoResult';
import OpenSideBar from '@/components/shared/OpenSideBar';
import { getAllBoards, getBoardByID } from '@/lib/actions/actions';

export async function generateMetadata({ params }: any) {
	const board = await getBoardByID({
		boardId: params.id,
	});
	// @ts-ignore
	return { title: `${board?.name}` };
}

export async function generateStaticParams() {
	const boards = await getAllBoards();
	const ids = boards.map((board: any) => ({ id: String(board._id) }));
	return ids;
}

export default async function Page({ params }: any) {
	const id = params.id;
	const [boards, board] = await Promise.all([
		getAllBoards(),
		getBoardByID({
			boardId: id,
		}),
	]);

	return (
		<main className="bg-lightgray-dark h-screen flex flex-col relative">
			<Navbar
				nav={true}
				boards={JSON.stringify(boards)}
				board={JSON.stringify(board)}
				disabled={
					// @ts-ignore
					board?.columns.length === 0
				}
				name={
					//@ts-ignore
					board?.name || 'You have no board'
				}
			/>

			<div className="flex-1 w-full flex overflow-hidden">
				{
					//@ts-ignore
					board?.columns?.length > 0 ? (
						<div className="px-8 w-full h-full py-4 flex gap-8 overflow-x-scroll no-scrollbar">
							{
								// @ts-ignore
								board?.columns?.map((column: any) => (
									<Column key={column?._id} column={JSON.stringify(column)} />
								))
							}
							<NewColumn />
						</div>
					) : (
						<NoResult boards={JSON.stringify(boards)} />
					)
				}
			</div>
			<OpenSideBar />
		</main>
	);
}
