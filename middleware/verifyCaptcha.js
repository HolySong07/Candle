import axios from 'axios';
import { UnauthenticatedError } from '../errors/customError.js';

export const verifyCaptcha = async (req, res, next) => {
	const { captchaToken } = req.body;
	const secretKey = process.env.RECAPTCHA_SECRET_KEY;

	if (!captchaToken) {
		throw new UnauthenticatedError('reCAPTCHA token is missing');
	}

	try {
		const response = await axios.post(
			'https://www.google.com/recaptcha/api/siteverify',
			null,
			{
				params: {
					secret: secretKey,
					response: captchaToken,
				},
			}
		);

		const { success } = response.data;

		if (!success) {
			throw new UnauthenticatedError('reCAPTCHA verification failed');
		}

		next();
	} catch (error) {
		next(new UnauthenticatedError('Error verifying reCAPTCHA'));
	}
};
