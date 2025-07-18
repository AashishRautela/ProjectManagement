import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/errors/appError.js';
import { UserRepository } from '../repository/index.js';
import { deleteDataFromRedis, getDataFromRedis } from './redis.service.js';

export const createUser = async (data) => {
  try {
    const user = await UserRepository.create(data);
    if (!user) {
      throw new AppError(
        ['Something went wrong while create user'],
        StatusCodes.BAD_REQUEST
      );
    }
    return;
  } catch (error) {
    console.log('error -->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while creating user'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const verifyAndRegisterUser = async (data) => {
  try {
    const storedOtp = await getDataFromRedis(data.email);

    if (storedOtp != data.otp) {
      throw new AppError(['Invalid otp'], StatusCodes.BAD_REQUEST);
    }
    const user = await UserRepository.verifyUser(data.email);
    await deleteDataFromRedis(data.email);
    delete user.password;
    return;
  } catch (error) {
    console.log('error -->', error);
    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while creating user'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
