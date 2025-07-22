import { useCreatePost } from '../hooks/useCreatePost';
import { useNavigate } from 'react-router-dom';

const AddProduct: React.FC = () => {
	const navigate = useNavigate();
	const { mutate, isPending } = useCreatePost();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		mutate(formData, {
			onSuccess: () => {
				navigate('/');
			},
		});
	};

	return (
		<div>
			<h1>Create Post</h1>
			<form onSubmit={handleSubmit} encType="multipart/form-data">
				{['en', 'de', 'uk'].map((lang) => (
					<div key={lang}>
						<h3>{lang.toUpperCase()}</h3>
						<input
							name={`title_${lang}`}
							placeholder={`Title (${lang})`}
							defaultValue={`Title (${lang})`}
							required
						/>
						<br />
						<textarea
							name={`description_${lang}`}
							placeholder={`description (${lang})`}
							defaultValue={`description (${lang})`}
							required
						/>
						<br />
						<textarea
							name={`content_${lang}`}
							placeholder={`Content (${lang})`}
							defaultValue={`Content (${lang})`}
							required
						/>
					</div>
				))}

				<div>
					<label>
						Upload image:
						<input type="file" name="image" accept="image/*" required />
					</label>
				</div>

				<div>
					<label>
						<input type="checkbox" name="isPopular" />
						Mark as popular
					</label>
				</div>

				<br />
				<button type="submit" disabled={isPending}>
					{isPending ? 'Submitting...' : 'Submit'}
				</button>
			</form>
		</div>
	);
};

export default AddProduct;
