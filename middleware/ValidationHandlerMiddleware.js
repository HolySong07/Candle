import User from '../models/UserModel.js';
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from '../Errors/customError.js';
import { validationResult, body } from 'express-validator';

const withValidationErrors = (validateValues) => {
	return [
		validateValues,
		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const errorMessages = errors.array().map((error) => error.msg);

				if (errorMessages[0].startsWith('no post')) {
					throw new NotFoundError(errorMessages);
				}

				if (errorMessages[0].startsWith('not authorized')) {
					throw UnauthorizedError('not authorized to access this route');
				}

				throw new BadRequestError(errorMessages);
			}
			next();
		},
	];
};

export const validateRegisterInput = withValidationErrors([
	body('name').notEmpty().withMessage('name is required'),
	body('email')
		.notEmpty()
		.withMessage('email is required')
		.isEmail()
		.withMessage('invalid email format')
		.custom(async (email) => {
			const user = await User.findOne({ email });
			if (user) {
				throw new BadRequestError('email already exists');
			}
		}),
	body('password')
		.notEmpty()
		.withMessage('password is required')
		.isLength({ min: 8 })
		.withMessage('password must be at least 8 characters long'),
]);

export const validateLoginInput = withValidationErrors([
	body('email')
		.notEmpty()
		.withMessage('email is required')
		.isEmail()
		.withMessage('invalid email format'),
	body('password').notEmpty().withMessage('password is required'),
]);

export const validatePostInput = withValidationErrors([
	body('title').notEmpty().withMessage('title is required'),
	body('content').notEmpty().withMessage('content is required'),
]);
