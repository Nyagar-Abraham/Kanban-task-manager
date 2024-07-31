export interface createBoardParams {
	name: string;
	columns: string[];
	path: string;
}
export interface createTaskParams {
	title: string;
	description: string;
	status: string;
	subTasks: string[];

	board: string;
	path: string;
}
export interface updateTaskParams {
	boardId: string;
	taskId: string;
	updateData: {
		title?: string;
		description?: string;
		status?: string;
    subTasks?: {item:string,type:string}[];
		board?: string;
	};
	path: string;
}

export interface updateBoardParams {
	boardId: string;

	updateData: {
		name?: string;
    columns?: {
      item: string,
      type: string;
    }[];
	};

	path: string;
}
