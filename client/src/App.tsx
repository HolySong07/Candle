import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
	Layout,
	About,
	Home,
	Register,
	Error,
	Login,
	AddProduct,
	Admin,
	PostDetail,
	EditPost,
} from './pages/index.tsx';
import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { HelmetProvider } from 'react-helmet-async';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 10,
		},
	},
});

export const checkDefaultTheme = () => {
	const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
	document.body.classList.toggle('dark-theme', isDarkTheme);
	return isDarkTheme;
};

import { loader as loaderUser } from './pages/Layout.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		errorElement: <Error />,
		loader: loaderUser(queryClient),
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: 'addproduct',
				element: <AddProduct />,
			},
			{ path: '/posts/:id', element: <PostDetail /> },
			{ path: '/posts/:id/edit', element: <EditPost /> },
			{
				path: 'about',
				element: <About />,
			},
			{
				path: 'register',
				element: <Register />,
				action: registerAction,
			},
			{
				path: 'login',
				element: <Login />,
				action: loginAction(queryClient),
			},
		],
	},
	{
		path: 'admin',
		element: <Admin />,
		loader: loaderUser(queryClient),
		errorElement: <Error />,
	},
]);

const App: React.FC = () => {
	return (
		<div>
			<HelmetProvider>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
					<ReactQueryDevtools initialIsOpen={false} />
					<ToastContainer position="top-center" />
				</QueryClientProvider>
			</HelmetProvider>
		</div>
	);
};

export default App;
