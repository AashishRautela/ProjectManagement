import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '../common';

export const generateRandomColorLight = () => {
  const colors = [
    '#F06D85',
    '#2EB6C9',
    '#F0C76D',
    '#20B486',
    '#0078D7',
    '#904EE2',
    '#45B6DA',
    '#602EC9',
    '#FF914D'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const errorResponse = ErrorResponse();
      errorResponse.error = error;
      errorResponse.message = error.message || 'Something went wrong';

      return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(errorResponse);
    }
  };
};
