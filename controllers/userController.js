import User from '../models/UserModel.js';
import { StatusCodes } from 'http-status-codes';

export const getCurrentUser = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.user.userId });

		if (!user) {
			throw new Error('user not found');
		}

		const userWithoutPassword = user.toJSON(); // вызвали метод с Юзер модели и удалили тем методом пароль
		res.status(StatusCodes.OK).json({ user: userWithoutPassword });
	} catch (error) {
		next(error);
	}
};
