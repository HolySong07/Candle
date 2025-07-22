import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchFullPost } from '../api/fetchFullPost'; // 👈 функция запроса к /posts/full/:id
import { useUpdatePost } from '../hooks/useUpdatePost'; // 👈 хук мутации

import classes from './styles/form.module.css';

const EditPost = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { i18n } = useTranslation();

	const {
		data: post,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['post', id],
		queryFn: () => fetchFullPost(id!),
		enabled: !!id,
	});

	const { mutate: updatePost, isPending } = useUpdatePost(id!, post?.publicId);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		updatePost(formData, {
			onSuccess: () => navigate('/'),
		});
	};

	if (isLoading) return <p>Loading...</p>;
	if (isError || !post) return <p>Error to loading post</p>;

	return (
		<div>
			<h1>Edit post</h1>
			<form className={classes.form} onSubmit={handleSubmit}>
				{['en', 'de', 'uk'].map((lang) => (
					<div key={lang}>
						<h3>{lang.toUpperCase()}</h3>
						<input
							name={`title_${lang}`}
							defaultValue={post.title?.[lang] || ''}
							placeholder={`Title (${lang})`}
							required
						/>
						<textarea
							name={`content_${lang}`}
							defaultValue={post.content?.[lang] || ''}
							placeholder={`Content (${lang})`}
							required
						/>
						<textarea
							name={`description_${lang}`}
							defaultValue={post.description?.[lang] || ''}
							placeholder={`Description (${lang})`}
						/>
					</div>
				))}

				<div>
					<p>Img:</p>
					<img
						src={post.imageUrl}
						alt="Current"
						style={{ width: 200, borderRadius: 8 }}
					/>
				</div>

				<div>
					<label>
						Load new img? (optional):
						<input type="file" name="image" accept="image/*" />
					</label>
				</div>

				<div>
					<label>
						<input type="checkbox" name="isPopular" defaultChecked={post.isPopular} />
						popular?
					</label>
				</div>

				<br />
				<button type="submit" disabled={isPending}>
					{isPending ? 'apdate...' : 'save'}
				</button>
			</form>
		</div>
	);
};

export default EditPost;
