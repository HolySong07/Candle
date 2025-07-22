import customFetch from '../utils/customFetch';

export async function fetchSinglePost(id: string) {
	const res = await customFetch.get(`/posts/full/${id}`);
	return res.data;
}
