import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/errors/appError.js';
import { UserRepository } from '../repository/index.js';

export const createUser = async (data) => {
  try {
    const user = await UserRepository.create(data);
    if (!user) {
      throw new AppError(
        ['Something went wrong while create user'],
        StatusCodes.BAD_REQUEST
      );
    }
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  } catch (error) {
    console.log('error -->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while creating user'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
