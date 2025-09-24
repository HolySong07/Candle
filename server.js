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

// for get Data from site (req)
const app = express();

// щоб можна було отримати куки (для отримання користувача)
app.use(express.json());
app.use(cookieParser());

// для запитів між різними портами
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true, // якщо використовуєш файли cookie
	})
);

import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import posts from './routes/posts.js';

// робота фронт і бек одному порту (тільки для продакшн)
// Для ES-модуля потрібна ця конструкція
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

// Для продакшина дивитиметься в папку білда
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client/build/index.html'));
	});
}
// робота фронт і бек на одному порту (тільки для продакшн)

// обробляє та відправляє помилки назад на фронт
app.use(errorHandlerMiddleware);

// for img, upload to cloudinary
app.use('/api/v1/upload', uploadRoute);
// for img

// login / register
app.use('/api/v1/auth', authRouter);

// шукаємо користувача під час завантаження сторінки
app.use('/api/v1/users', authenticateUser, userRouter);

// все щодо товарів
app.use('/api/v1/posts', posts);

const PORT = process.env.PORT;

try {
	await mongoose.connect(process.env.MONGO_URL);
	app.listen(PORT, () =>
		console.log(`Сервер запущено, використовуючи порт ${PORT}`)
	);
} catch (error) {
	console.log(error);
	process.exit(1);
}
