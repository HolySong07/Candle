import customFetch from '../utils/customFetch.ts';

export async function uploadImageToServer(
	file: File
): Promise<{ imageUrl: string; publicId: string }> {
	const formData = new FormData();
	formData.append('image', file);

	try {
		const res = await customFetch.post('/upload', formData);
		return {
			imageUrl: res.data.imageUrl,
			publicId: res.data.publicId,
		};
	} catch (error) {
		console.error('Image upload failed:', error);
		throw new Error('Image upload failed');
	}
}
