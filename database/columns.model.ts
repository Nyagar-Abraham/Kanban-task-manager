import { Schema, models, model, Document } from 'mongoose';

export interface IColumn extends Document {
	name: string;
	tasks?: Schema.Types.ObjectId[];
	boards?: Schema.Types.ObjectId[];
}

const ColumnSchema = new Schema<IColumn>({
	name: {
		type: String,
		required: true,
	},
	tasks: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Task',
		},
	],
	boards: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Board',
		},
	],
});

const Column = models?.Column || model<IColumn>('Column', ColumnSchema);

export default Column;
