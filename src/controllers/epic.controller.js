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

export const getEpicDetails = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const { id } = req.params;
  const epic = await EpicService.getEpicDetails(id);

  successResponse.data = epic;
  return res.status(StatusCodes.CREATED).send(successResponse);
});
