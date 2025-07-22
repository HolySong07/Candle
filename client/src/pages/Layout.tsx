import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkDefaultTheme } from '../App';
import classes from './styles/layout.module.css';
import { useLoaderData } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

type DashboardContextType = {
	user: any;
	isDarkTheme: boolean;
	toggleDarkTheme: () => void;
	logoutUser: () => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(
	undefined
);

const fetchCurrentUser = async () => {
	try {
		const { data } = await customFetch.get('/users/current-user', {
			withCredentials: true,
		});
		return data.user;
	} catch (error: any) {
		if (error?.response?.status === 401) {
			console.log('user 401');
			return null;
		}
		// другие ошибки
		throw error;
	}
};

export const loader = (queryClient: QueryClient) => async () => {
	try {
		const data = await queryClient.fetchQuery({
			queryKey: ['user'],
			queryFn: fetchCurrentUser,
		});
		return data;
	} catch (error) {
		return null;
	}
};

const Layout = () => {
	const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
	const [isAuthError, setIsAuthError] = useState(false);

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// 💡 получаем данные из loader
	const loadedUser = useLoaderData() as any;

	// Получаем юзера из запроса (react-query)
	const { data: user } = useQuery({
		queryKey: ['user'],
		queryFn: fetchCurrentUser,
		initialData: loadedUser,
		initialDataUpdatedAt: Date.now(),
		staleTime: 1000 * 60 * 10,
		retry: false,
	});

	// Удаляем юзера при логауте
	const logoutUser = async () => {
		await customFetch.get('/auth/logout');
		queryClient.setQueryData(['user'], null);
		toast.success('Logged out');
		navigate('/');
	};

	// logout при 401
	useEffect(() => {
		if (isAuthError) {
			logoutUser();
		}
	}, [isAuthError]);

	const toggleDarkTheme = () => {
		const newDarkTheme = !isDarkTheme;
		setIsDarkTheme(newDarkTheme);
		document.body.classList.toggle('dark-theme', newDarkTheme);
		localStorage.setItem('darkTheme', String(newDarkTheme));
	};

	return (
		<DashboardContext.Provider
			value={{
				user,
				isDarkTheme,
				toggleDarkTheme,
				logoutUser,
			}}
		>
			<Navbar />
			<div className={classes.topWrapper}>
				<div className={classes.main}>
					<Outlet />
				</div>
				<Sidebar />
			</div>
		</DashboardContext.Provider>
	);
};

export default Layout;

export const useDashboardContext = () => {
	const context = useContext(DashboardContext);
	if (!context) {
		throw new Error(
			'useDashboardContext must be used within DashboardContext.Provider'
		);
	}
	return context;
};
