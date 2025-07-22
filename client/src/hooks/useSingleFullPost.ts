import customFetch from '../utils/customFetch';

export async function fetchFullPost(id: string) {
	const res = await customFetch.get(`/posts/full/${id}`);
	return res.data;
}
