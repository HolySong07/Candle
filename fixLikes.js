import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Подключаемся к MongoDB
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('✅ Connected to MongoDB');
		addLikesField();
	})
	.catch((err) => console.error('❌ MongoDB connection error:', err));

// Импорт модели Post
import Post from './models/Post.js'; // укажи путь до своей модели, если отличается

// Обновление всех постов без поля likes
async function addLikesField() {
	try {
		const result = await Post.updateMany(
			{ likes: { $exists: false } }, // только если likes нет
			{ $set: { likes: [] } }
		);

		console.log(`🎉 Updated ${result.modifiedCount} posts`);
		process.exit(0);
	} catch (error) {
		console.error('❌ Error updating posts:', error);
		process.exit(1);
	}
}
