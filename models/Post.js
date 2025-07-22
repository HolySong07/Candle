import mongoose from 'mongoose';

const translationField = {
	en: { type: String, required: true },
	de: { type: String, required: true },
	uk: { type: String, required: true },
};

const postSchema = new mongoose.Schema({
	title: translationField,
	content: translationField,
	description: translationField,
	imageUrl: { type: String, required: true },
	isPopular: { type: Boolean, default: false },
	publicId: String,
	createdAt: { type: Date, default: Date.now },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('Post', postSchema);
