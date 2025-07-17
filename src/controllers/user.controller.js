import { UserService } from '../services/index.js';
import { asyncHandler } from '../utils/helpers/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';

export const createUser = asyncHandler(async (req, res) => {
  const data = req.body;
  const user = await UserService.createUser(data);

  const successResponse = SuccessResponse();
  successResponse.data = user;

  return res.status(StatusCodes.CREATED).json(successResponse);
});
