import { StatusCodes } from 'http-status-codes';
import { ProjectMemberService } from '../services/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { asyncHandler } from '../utils/helpers/index.js';

export const addMember = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const user = req.user;
  await ProjectMemberService.addMember(req.body, user);
  successResponse.data = {};
  return res.status(StatusCodes.CREATED).json(successResponse);
});
