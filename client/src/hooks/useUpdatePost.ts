import { useMutation, useQueryClient } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import { uploadImageToServer } from '../utils/uploadImageToServer';
import { toast } from 'react-toastify';

export function useUpdatePost(postId: string, prevPublicId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			const imageFile = formData.get('image') as File;

			let imageUrl: string | undefined = undefined;
			let publicId: string | undefined = prevPublicId;

			// Если пользователь загрузил новый файл
			if (imageFile && imageFile.size > 0) {
				const uploadResult = await uploadImageToServer(imageFile);
				imageUrl = uploadResult.imageUrl;
				publicId = uploadResult.publicId;
			}

			const title = {
				en: formData.get('title_en') as string,
				de: formData.get('title_de') as string,
				uk: formData.get('title_uk') as string,
			};

			const content = {
				en: formData.get('content_en') as string,
				de: formData.get('content_de') as string,
				uk: formData.get('content_uk') as string,
			};

			const description = {
				en: formData.get('description_en') as string,
				de: formData.get('description_de') as string,
				uk: formData.get('description_uk') as string,
			};

			const isPopular = formData.get('isPopular') === 'on';

			const res = await customFetch.patch(`/posts/${postId}`, {
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
			queryClient.invalidateQueries({ queryKey: ['post', postId] });
			toast.success('Updated post');
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.msg || 'Error');
		},
	});
}
