import { ErrorResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';

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
