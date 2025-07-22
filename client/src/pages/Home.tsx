import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import { HomeFirstBlock } from '../components/HomeFirstBlock';
import { PostSingl } from './PostSingl';
import { useState } from 'react';
import classes from './styles/plp.module.css';

export type Post = {
	_id: string;
	title: string;
	description: string;
	content: string;
	createdAt: string;
	imageUrl: string;
};

const fetchPosts = async (
	lang: string,
	page: number = 1,
	limit: number = 4
): Promise<any> => {
	const res = await customFetch.get(
		`/posts?lang=${lang}&page=${page}&limit=${limit}`
	);

	if (res.status !== 200) throw new Error('Failed to fetch posts');
	return res.data;
};

export const Home: React.FC = () => {
	const { i18n } = useTranslation();
	const [page, setPage] = useState(1);
	const limit = 4;

	const { data, isLoading, isError } = useQuery({
		queryKey: ['posts', i18n.language, page],
		queryFn: () => fetchPosts(i18n.language, page, limit),
	});

	if (isLoading) return <div>Loading posts...</div>;
	if (isError || !data) return <div>Error loading posts.</div>;

	const { totalPages } = data;

	return (
		<div>
			<HomeFirstBlock />

			<div>
				<h2>Posts</h2>
				<div className={classes.wrapperProduct}>
					{data.posts.map((post: Post) => {
						return <PostSingl key={post._id} {...post} />;
					})}
				</div>

				<div style={{ margin: '20px 0' }}>
					<button
						onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
						disabled={page === 1}
					>
						Prev
					</button>
					<span style={{ margin: '0 10px' }}>
						Page {page} {totalPages ? `of ${totalPages}` : ''}
					</span>
					<button
						onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
						disabled={page === totalPages}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default Home;
