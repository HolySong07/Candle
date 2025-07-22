import { redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';

import { useLoaderData } from 'react-router-dom';

import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const loader = (queryClient: QueryClient) => async () => {
	try {
		return await queryClient.ensureQueryData({
			queryKey: ['user2'],
			queryFn: async () => {
				console.log('Запрос к current-user');
				const { data } = await customFetch('/users/current-user');
				console.log('Ответ:', data);
				return data.user;
			},
			staleTime: 10000 * 60 * 10, // кэш на 10 мин
		});
	} catch (error) {
		toast.error('need to be logged in');
		return redirect('/');
	}
};

const Admin = () => {
	const user = useLoaderData();

	console.log(user);

	return <p>Hello {user.name}, this is page for your info. For future work</p>;
};

export default Admin;
