import Input from '../components/Input';
import { Form, redirect, useNavigation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { QueryClient } from '@tanstack/react-query';
import type { ActionFunctionArgs } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRef, useState } from 'react';

export const action =
	(queryClient: QueryClient) =>
	async ({ request }: ActionFunctionArgs) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		try {
			await axios.post('/api/v1/auth/login', data);
			queryClient.invalidateQueries({ queryKey: ['user'] });

			toast.success('Login successful');
			return redirect('/');
		} catch (error: any) {
			toast.error(error?.response?.data?.msg || 'Something went wrong');

			return error;
		}
	};

const Login = () => {
	const recaptchaRef = useRef<ReCAPTCHA | null>(null);
	const [captchaToken, setCaptchaToken] = useState('');
	const navigation = useNavigation();
	const isSubmitting = navigation.state === 'submitting';

	const handleCaptchaChange = (token: string | null) => {
		setCaptchaToken(token || '');
	};

	const handleBeforeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		if (!captchaToken) {
			e.preventDefault();
			toast.error('Please complete the reCAPTCHA');
		}
	};

	return (
		<Form method="post" onSubmit={handleBeforeSubmit}>
			<div>Login</div>

			<Input
				label="Mail"
				id="email"
				type="text"
				name="email"
				required
				defaultValue="test@test.com"
			/>
			<Input
				label="Password"
				id="Password"
				name="password"
				type="password"
				required
				defaultValue="PetrenkoTest"
			/>
			<input type="hidden" name="captchaToken" value={captchaToken} />
			<ReCAPTCHA
				sitekey="6Ld9_2UrAAAAAAHl_KFMGmCuqM-hhtk7NhCwOgXj"
				onChange={handleCaptchaChange}
				ref={recaptchaRef}
			/>
			<br />
			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Logging in...' : 'Login'}
			</button>
		</Form>
	);
};

export default Login;
