import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
import { Link } from 'react-router-dom';

import { type Post } from './Home.tsx';
import { useDeletePost } from '../hooks/useDeletePost.ts';
import { useDashboardContext } from '../pages/Layout';
import classes from './styles/plp.module.css';

export const PostSingl = ({
	_id,
	title,
	description,
	createdAt,
	imageUrl,
}: Post) => {
	const date = day(createdAt).format('MMM Do, YYYY');
	const { user } = useDashboardContext();

	const { mutate: deletePost, isPending } = useDeletePost();

	const handleDelete = () => {
		if (confirm('Delete post?')) {
			deletePost(_id);
		}
	};

	return (
		<div key={_id} className={classes.product}>
			<h2>
				<Link to={`/posts/${_id}`}>{title}</Link>
			</h2>
			{imageUrl && <img className={classes.img} src={imageUrl} />}

			<p>{description}</p>
			<small>{date}</small>

			{user?.role === 'admin' && (
				<>
					<button onClick={handleDelete} disabled={isPending}>
						Delete
					</button>
					/ <Link to={`/posts/${_id}/edit`}>Edit</Link>
				</>
			)}
		</div>
	);
};
