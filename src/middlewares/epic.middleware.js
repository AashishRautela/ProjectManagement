import { ErrorResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';

export const validateCreateEpicRequest = async (req, res, next) => {
  const errorResponse = ErrorResponse();

  try {
    const { projectId, title = '' } = req.body;

    if (!projectId || !title.trim()) {
      errorResponse.message = 'Request data missing';
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (title.trim().length < 10 || title.trim().length > 50) {
      errorResponse.message = 'Epic name must be between 10-50 characters';
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    next();
  } catch (error) {
    console.error('Error in validateEpicProjectRqst middleware:', error);
    errorResponse.message =
      'Something went wrong while validating epic creation data';
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};
