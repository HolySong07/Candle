import {
	UnauthenticatedError,
	UnauthorizedError,
	BadRequestError,
} from '../Errors/customError.js';
import verifyJWT from '../utils/tokenUtils.js';

const authenticateUser = (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		throw new UnauthenticatedError('authentication invalid');
	}

	try {
		const { userId, role } = verifyJWT(token);

		const testUser = userId === '6821a3892d2a1f27b1bdbe52';
		req.user = { userId, role, testUser };

		next();
	} catch (error) {
		throw new UnauthenticatedError('authentication invalid');
	}
};

export const authenticateUserForPost = (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		throw new UnauthenticatedError('authentication invalid');
	}

	console.log(token);

	try {
		const { role } = verifyJWT(token);

		console.log(role);
		if (role !== 'admin') {
			return next(
				new UnauthorizedError('Access denied you are not an administrator')
			);
		}

		next();
	} catch (error) {
		throw new UnauthenticatedError('authentication invalid');
	}
};

export default authenticateUser;
