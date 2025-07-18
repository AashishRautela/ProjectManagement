import { ErrorResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';

export const validateCreateUser = (req, res, next) => {
  const { firstName, email, password } = req.body;
  const errorResponse = ErrorResponse();

  if (!firstName || !email || !password) {
    errorResponse.message = 'Request data missing';
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  // Add basic validations
  if (!validator.isEmail(email)) {
    errorResponse.message = 'Please enter a valida email';
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  if (password.length < 6) {
    errorResponse.message = 'Password should be greater than 6 character';
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  next();
};

export const validateOtp = (req, res, next) => {
  const { email, otp } = req.body;
  const errorResponse = ErrorResponse();

  if (!email || !otp) {
    errorResponse.message = 'Request data missing';
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  // Add basic validations
  if (!validator.isEmail(email)) {
    errorResponse.message = 'Please enter a valid email';
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  if (otp.length < 6) {
    errorResponse.message = 'Otp should be of 6 character';
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  next();
};
