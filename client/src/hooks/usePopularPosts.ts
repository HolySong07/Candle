import { useQuery } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';

export function usePopularPosts() {
	return useQuery({
		queryKey: ['posts'],
		queryFn: async () => {
			const res = await customFetch.get('/posts/popular');
			return res.data;
		},
	});
}
