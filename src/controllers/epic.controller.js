import { EpicService } from '../services/index.js';
import { asyncHandler } from '../utils/helpers/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';

export const createEpic = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const user = req.user;

  await EpicService.createEpic(req.body, user);
  return res.status(StatusCodes.CREATED).send(successResponse);
});
