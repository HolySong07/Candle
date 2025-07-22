import { Router } from 'express';
import { validatePostInput } from '../middleware/ValidationHandlerMiddleware.js';
import { authenticateUserForPost } from '../middleware/authMiddleware.js';
import { toggleLike } from '../controllers/postController.js';
import authenticateUser from '../middleware/authMiddleware.js';

import { createPost } from '../controllers/postController.js'; /* getAllPosts */
import { getPosts } from '../controllers/postController.js';
import {
	getPost,
	getPopular,
	deletePost,
	updatePost,
	getPostFull,
	contact,
} from '../controllers/postController.js';
import { verifyCaptcha } from '../middleware/verifyCaptcha.js';
import rateLimiter from 'express-rate-limit';

const router = Router();

router.post(
	'/create',
	authenticateUserForPost,
	createPost
); /* , validatePostInput */

// load all posts

const apiLimiter = rateLimiter({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 50,
	message: { msg: 'IP rate limit exceeded, retry in 15 minutes.' },
});

router
	.get('/popular', getPopular)
	.use('/contact', apiLimiter, verifyCaptcha, contact)
	.get('/full/:id', getPostFull)
	.get('/', getPosts)
	.get('/:id', getPost)
	.put('/:id/like', authenticateUser, toggleLike)
	.delete('/:id', authenticateUserForPost, deletePost);

router.patch('/:id', authenticateUserForPost, updatePost);

export default router;
