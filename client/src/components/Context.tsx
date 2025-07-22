import { useState, createContext, useContext } from 'react';
import customFetch from '../utils/customFetch';
import { redirect, useNavigate } from 'react-router-dom';

import { checkDefaultTheme } from '../App';

import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';

const DashboardContext = createContext();

type queryCli = {
	ensureQueryData: (arg0: {
		queryKey: string[];
		queryFn: () => Promise<any>;
	}) => any;
};

const userQuery = {
	queryKey: ['user'],
	queryFn: async () => {
		const { data } = await customFetch('/users/current-user');
		return data;
	},
};

export const loader = (queryClient: queryCli) => async () => {
	try {
		return await queryClient.ensureQueryData(userQuery);
	} catch (error) {
		return redirect('/');
	}
};

const Context = () => {
	const { user } = useQuery(userQuery).data;
	const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
	const navigate = useNavigate();

	const logoutUser = async () => {
		await customFetch.get('/auth/logout');
		toast.success('Logging out...');
		navigate('/');
	};

	const toggleDarkTheme = () => {
		const newDarkTheme = !isDarkTheme;

		setIsDarkTheme(newDarkTheme);

		document.body.classList.toggle('dark-theme', newDarkTheme);
		localStorage.setItem('darkTheme', newDarkTheme);
	};

	return (
		<DashboardContext.Provider
			value={{
				user,
				isDarkTheme,
				toggleDarkTheme,
				logoutUser,
			}}
		></DashboardContext.Provider>
	);
};

export const useDashboardContext = () => useContext(DashboardContext);

export default Context;
