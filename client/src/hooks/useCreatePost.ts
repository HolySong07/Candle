import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadImageToServer } from '../utils/uploadImageToServer.ts';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

type CloudImg = {
	imageUrl: string;
	publicId: string;
};

export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			const imageFile = formData.get('image') as File;

			if (!imageFile || imageFile.size === 0) {
				throw new Error('pls, add img');
			}

			const { imageUrl, publicId } = await uploadImageToServer(imageFile);

			const title = {
				en: formData.get('title_en') as string,
				de: formData.get('title_de') as string,
				uk: formData.get('title_uk') as string,
			};

			const description = {
				en: formData.get('description_en') as string,
				de: formData.get('description_de') as string,
				uk: formData.get('description_uk') as string,
			};

			const content = {
				en: formData.get('content_en') as string,
				de: formData.get('content_de') as string,
				uk: formData.get('content_uk') as string,
			};

			const isPopular = formData.get('isPopular') === 'on';

			const res = await customFetch.post('/posts/create', {
				title,
				content,
				description,
				imageUrl,
				publicId,
				isPopular,
			});

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			toast.success('New product added');
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.msg || 'Error creating product');
		},
	});
}
