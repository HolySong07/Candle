import useToggleLike from '../hooks/useToggleLike';
import { toast } from 'react-toastify';

import { useDashboardContext } from '../pages/Layout';

const Likes = ({ id, likes }) => {
	const { user } = useDashboardContext();

	const { mutate, isPending } = useToggleLike(id);
	const liked = likes.includes(user?._Id);

	return (
		<button onClick={() => mutate()} disabled={isPending}>
			❤️ Like ({likes.length})
		</button>
	);
};

export default Likes;
