import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//middleware
import errorHandlerMiddleware from './middleware/ErroeHandlerMiddleware.js';
import authenticateUser from './middleware/authMiddleware.js';

// cloudinary

import { v2 as cloudinary } from 'cloudinary';
import uploadRoute from './routes/upload.js';
// cloudinary

import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

// for get Data from site (req)

app.use(express.json());
app.use(cookieParser()); // чтобы можно было получать куки (для получения пользователя)

// разрешить запросы между разными портами
app.use(
	cors({
		origin: 'http://localhost:5173', // или ['http://localhost:5173']
		credentials: true, // если используешь cookies
	})
);

import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import posts from './routes/posts.js';

// for test on client
app.get('/api/v1/test', (req, res) => {
	res.json({ msg: 'test route' });
});

// работа фронт и бек на одном порту (только для продакшн)
// Для ES-модуля нужна эта конструкция
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

// Для продакшина будет смотреть в папку билда
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client/build/index.html'));
	});
}
// работа фронт и бек на одном порту  (только для продакшн)

// for img, upload to cloudinary
app.use('/api/v1/upload', uploadRoute);
// for img

// login / register
app.use('/api/v1/auth', authRouter);
// login / register

// ищем юзера при загрузке страницы
app.use('/api/v1/users', authenticateUser, userRouter);

// все что касается товаров
app.use('/api/v1/posts', posts);

// обрабатывает и отправляет ошибки назад на фронт
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT;

try {
	await mongoose.connect(process.env.MONGO_URL);
	app.listen(PORT, () => console.log(`Сервер запущен используя порт ${PORT}`));
} catch (error) {
	console.log(error);
	process.exit(1);
}
