import { useMutation, useQueryClient } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export function useDeletePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (postId: string) => {
			await customFetch.delete(`/posts/${postId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			toast.success('Пост удалён');
		},
		onError: () => {
			toast.error('Ошибка при удалении поста');
		},
	});
}
