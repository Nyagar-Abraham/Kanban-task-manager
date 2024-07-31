import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
	mongoose.set('strictQuery', true);

	const MONGODB_URL = process.env.MONGODB_URL;



	if (!MONGODB_URL) {
		console.error('MISSING MONGODB URL');
		throw new Error('MISSING MONGODB URL');
	}

	if (isConnected) {
		return;
	}

	try {
		await mongoose.connect(MONGODB_URL, {
			dbName: 'kanban',
		});

		isConnected = true;

		console.log('MongoDB is connected');
	} catch (error) {
		console.error('Mongo connection failed', error);
		throw error;
	}
};
