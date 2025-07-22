import Input from '../components/Input';
import { Form, redirect, useNavigation } from 'react-router-dom';

import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRef, useState } from 'react';

import type { ActionFunctionArgs } from 'react-router-dom';
import customFetch from '../utils/customFetch.ts';

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	if (!data.captchaToken) {
		return {
			error: 'Please complete reCAPTCHA',
		};
	}

	try {
		await customFetch.post('/auth/register', data);
		toast.success('Registration successful');
		return redirect('/login');
	} catch (error: any) {
		toast.error(error?.response?.data?.msg || 'Something went wrong');
		return error;
	}
};

export const Register = () => {
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
			<div>Registration</div>
			<Input label="Name" id="name" type="text" name="name" required />
			<Input label="Mail" id="email" type="text" name="email" required />
			<Input
				label="Password"
				id="Password"
				name="password"
				type="password"
				required
			/>
			<input type="hidden" name="captchaToken" value={captchaToken} />
			<ReCAPTCHA
				sitekey="6Ld9_2UrAAAAAAHl_KFMGmCuqM-hhtk7NhCwOgXj"
				onChange={handleCaptchaChange}
				ref={recaptchaRef}
			/>
			<br />
			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Submitting...' : 'Submit'}
			</button>
		</Form>
	);
};

export default Register;
