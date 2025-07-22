import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Настройка multer: сохраняет временные файлы в папку uploads
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
	try {
		console.log('Received image upload request:', req.file);

		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}

		const filePath = req.file.path;

		// Загрузка в Cloudinary
		const result = await cloudinary.uploader.upload(filePath, {
			folder: 'posts',
		});

		// Удаляем локальный файл
		fs.unlinkSync(filePath);

		// Отправляем ссылку на загруженное изображение
		//console.log(imageUrl);
		//console.log(publicId);
		res.json({
			imageUrl: result.secure_url,
			publicId: result.public_id,
		});
	} catch (error) {
		console.error('Cloudinary upload error:', error);
		res.status(500).json({ error: 'Image upload failed' });
	}
});

export default router;
