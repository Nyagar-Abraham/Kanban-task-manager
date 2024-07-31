import { Schema, models, model, Document } from 'mongoose';

export interface ISubTask extends Document {
	title: string;
	isCompleted: boolean;
}

const SubTaskSchema = new Schema<ISubTask>({
	title: {
		type: String,
		required: true,
	},
	isCompleted: {
		type: Boolean,
		required: true,
	},
});

const SubTask = models?.SubTask || model<ISubTask>('SubTask', SubTaskSchema);

export default SubTask;
