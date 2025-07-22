import { useMutation, useQueryClient } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

function useToggleLike(postId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const res = await customFetch.put(`/posts/${postId}/like`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			queryClient.invalidateQueries({ queryKey: ['post', postId] });
		},
		onError: (error: any) => {
			if (error.response?.status === 401) {
				toast.error(error.response.data.msg || 'Need log in');
			} else {
				toast.error('Error');
			}
		},
	});
}

export default useToggleLike;
