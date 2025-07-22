import Post from '../models/Post.js';
import 'express-async-errors';
import { v2 as cloudinary } from 'cloudinary';

import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

export const contact = async (req, res) => {
	const { name, phone, messenger, product } = req.body;

	if (!name || !phone || !product) {
		return res.status(400).json({ msg: 'Please fill in all fields' });
	}

	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		});

		await transporter.sendMail({
			//from: email,
			to: process.env.GMAIL_MY,
			subject: `Новое сообщение от ${name}`,
			text: `My name - ${name}, my number - ${phone}, a wont product - ${product}, Please write to me in ${messenger}`,
		});

		res.status(200).json({ msg: 'Сообщение отправлено!' });
	} catch (error) {
		console.error('Ошибка отправки:', error);
		res.status(500).json({ msg: 'Не удалось отправить сообщение' });
	}
};

export const createPost = async (req, res) => {
	const { title, content, description, imageUrl, publicId, isPopular } = req.body;

	const _id = new mongoose.Types.ObjectId();

	if (!title?.en || !content?.en || !description?.en || !imageUrl) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	try {
		const newPost = new Post({
			_id,
			title,
			content,
			description,
			imageUrl,
			publicId,
			likes: [],
			isPopular: Boolean(isPopular),
		});
		await newPost.save();
		return res.status(201).json({ message: 'Post created', post: newPost });
	} catch (err) {
		return res.status(500).json({ error: 'Server error' });
	}
};

export const getPosts = async (req, res) => {
	try {
		// Получаем язык с реквеста
		const lang = req.query.lang || 'en';

		// Параметры пагинации
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 5;
		const skip = (page - 1) * limit;

		// Получаем общее количество документов (для расчёта общего числа страниц)
		const totalDocuments = await Post.countDocuments();

		// Выполняем поиск с сортировкой по дате,
		// пропуская нужное количество документов и ограничивая выдачу
		const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

		// Переводим посты в нужный формат в зависимости от языка
		const translatedPosts = posts.map((post) => ({
			_id: post._id,
			title: post.title[lang] || post.title.en,
			content: post.content[lang] || post.content.en,
			description: post.description[lang] || post.description.en,
			createdAt: post.createdAt,
			imageUrl: post.imageUrl,
			publicId: post.publicId,
			likes: post.likes,
		}));

		// Вычисляем общее число страниц
		const totalPages = Math.ceil(totalDocuments / limit);

		// для ФЕ сенд обьект
		res.json({
			posts: translatedPosts,
			totalDocuments,
			totalPages,
			currentPage: page,
		});
	} catch (err) {
		res.status(500).json({ error: 'Server error' });
	}
};

export const getPost = async (req, res) => {
	const { id } = req.params;
	const lang = req.query.lang || 'en';

	try {
		const post = await Post.findById(id);
		if (!post) return res.status(404).json({ error: 'Not found' });

		res.json({
			_id: post._id,
			title: post.title[lang] || post.title.en,
			content: post.content[lang] || post.content.en,
			description: post.description[lang] || post.description.en,
			createdAt: post.createdAt,
			imageUrl: post.imageUrl,
			publicId: post.publicId,
			likes: post.likes,
		});
	} catch (err) {
		res.status(500).json({ error: 'Server error' });
	}
};

export const getPopular = async (req, res) => {
	try {
		const posts = await Post.find({ isPopular: true }).sort({ createdAt: -1 });
		res.json(posts);
	} catch (error) {
		res.status(500).json({ msg: 'Failed to fetch popular posts' });
	}
};

export const deletePost = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await Post.findById(id);
		if (!post) return res.status(404).json({ msg: 'Post not found' });

		// Удаление изображения
		if (post.publicId) {
			await cloudinary.uploader.destroy(post.publicId);
		}

		// Удаление поста из MongoDB
		await Post.findByIdAndDelete(id);

		res.status(200).json({ msg: 'Post deleted successfully' });
	} catch (error) {
		console.error('Delete error:', error);
		res.status(500).json({ msg: 'Failed to delete post' });
	}
};

export const updatePost = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await Post.findById(id);
		if (!post) return res.status(404).json({ msg: 'Post not found' });

		const { title, content, description, imageUrl, publicId, isPopular } = req.body;

		// Если была замена картинки — удалим старую
		if (post.publicId && post.publicId !== publicId) {
			await cloudinary.uploader.destroy(post.publicId);
		}

		post.title = title;
		post.content = content;
		post.description = description;
		if (imageUrl) post.imageUrl = imageUrl;
		post.publicId = publicId;
		post.isPopular = isPopular;

		await post.save();

		res.status(200).json({ msg: 'Post updated successfully' });
	} catch (error) {
		console.error('Update post error:', error);
		res.status(500).json({ msg: 'Failed to update post' });
	}
};

export const getPostFull = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await Post.findById(id);
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		res.status(200).json(post); // 👈 отдаем весь пост
	} catch (error) {
		console.error('Error fetching full post:', error);
		res.status(500).json({ msg: 'Failed to fetch full post' });
	}
};

export const toggleLike = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user.userId;

		// Попытаемся убрать лайк
		const pullResult = await Post.updateOne(
			{ _id: postId, likes: userId },
			{ $pull: { likes: userId } }
		);

		let liked;
		if (pullResult.modifiedCount) {
			// был лайк – удалили
			liked = false;
		} else {
			// не было – добавляем
			await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });
			liked = true;
		}

		// Получаем текущее число лайков, не затрагивая другие поля
		const doc = await Post.findById(postId).select('likes').lean();
		const likesCount = doc?.likes.length || 0;

		console.log(liked, likesCount);
		return res.json({ liked, likesCount });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ msg: 'Server error' });
	}
};
