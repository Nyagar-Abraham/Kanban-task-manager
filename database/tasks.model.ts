import { Schema, models, model, Document } from 'mongoose';

export interface ITask extends Document {
	title: string;
	description: string;
	status: string;
	subTasks?: Schema.Types.ObjectId[];
	board: Schema.Types.ObjectId;
	column?: Schema.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	subTasks: [
		{
			type: Schema.Types.ObjectId,
			ref: 'SubTask',
		},
	],
	board: {
		type: Schema.Types.ObjectId,
		ref: 'Board',
		required: true,
	},
	column: {
		type: Schema.Types.ObjectId,
		ref: 'Column',
	},
});

const Task = models?.Task || model<ITask>('Task', TaskSchema);

export default Task;
