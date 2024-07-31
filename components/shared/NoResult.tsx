import BoardForm from '../forms/Board';
import ColumnForm from '../forms/ColumnForm';
import Button from './Button';
import Modal from './Dialog';

const NoResult = ({ boards }: { boards: string }) => {
	const Boards = boards && JSON.parse(boards);
	return (
		<div className="flex h-full items-center flex-1 justify-center">
			<div className="text-center">
				<p className="text-lg font-semibold text-gray my-5">
					The board is empty, Create a column to get started{' '}
				</p>

				<Modal
					trigger={
						<Button type="primary" size="large" className={'mx-auto'}>
							+ Create a Column
						</Button>
					}
				>
					{Boards?.length ? <ColumnForm /> : <BoardForm type="create" />}
				</Modal>
			</div>
		</div>
	);
};

export default NoResult;
