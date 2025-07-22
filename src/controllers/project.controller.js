import { ProjectService } from '../services/index.js';
import { asyncHandler } from '../utils/helpers/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';

export const createProject = asyncHandler(async (req, res) => {
  const user = req.user;
  const successResponse = SuccessResponse();
  await ProjectService.create(req.body, user);
  return res.status(StatusCodes.CREATED).send(successResponse);
});

export const getProjectDetails = asyncHandler(async (req, res) => {});
