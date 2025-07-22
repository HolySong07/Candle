import useToggleLike from '../hooks/useToggleLike';

interface LikesProps {
	id: string;
	likes: string[];
}

const Likes: React.FC<LikesProps> = ({ id, likes }) => {
	const { mutate, isPending } = useToggleLike(id);

	return (
		<button onClick={() => mutate()} disabled={isPending}>
			❤️ Like ({likes.length})
		</button>
	);
};

export default Likes;
