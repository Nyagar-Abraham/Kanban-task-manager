import { Schema, models, model, Document } from 'mongoose';

export interface IBoard extends Document {
    name: string;
    columns?: Schema.Types.ObjectId[];
}

const BoardSchema = new Schema<IBoard>({
    name: {
        type: String,
        required: true
    },
    columns: [{
        type: Schema.Types.ObjectId,
        ref: 'Column'
    }]
});

const Board = models?.Board || model<IBoard>('Board', BoardSchema);

export default Board;
