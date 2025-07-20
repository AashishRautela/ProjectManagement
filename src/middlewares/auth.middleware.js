import { ErrorResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repository/index.js';

export const validateLoginRqst = async (req, res, next) => {
  const { email, password } = req.body;
  const errorResponse = ErrorResponse();

  if (!email.trim() || !password.trim()) {
    errorResponse.message = 'Request data missing';
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  if (!validator.isEmail(email)) {
    errorResponse.message = 'Please enter a valida email';
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
  next();
};

export const authenticateUser = async (req, res, next) => {
  const { accessToken } = req.cookies;
  const errorResponse = ErrorResponse();

  if (!accessToken) {
    errorResponse.message = 'Unauthorized request';
    return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
  }

  try {
    const { _id } = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const user = await UserRepository.findByPk(_id);

    if (!user) {
      errorResponse.message = 'Invalid token';
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    req.user = user;
    next();
  } catch (err) {
    console.log('JWT verify error:', err.message);
    errorResponse.message = 'Token expired or invalid';
    return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
  }
};
