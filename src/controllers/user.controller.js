import { UserService } from '../services/index.js';
import { asyncHandler } from '../utils/helpers/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import { randomInt } from 'crypto';
import { sendOtpJob } from '../queues/otp.queue.js';

export const createUser = asyncHandler(async (req, res) => {
  const data = req.body;
  const otp = randomInt(100000, 999999).toString();
  await sendOtpJob({ email: req.body.email, otp: otp });
  await UserService.createUser(data);

  const successResponse = SuccessResponse();
  successResponse.message = 'Otp is sent to your email.Please Verify';

  return res.status(StatusCodes.CREATED).json(successResponse);
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await UserService.verifyAndRegisterUser({ email, otp });

  const successResponse = SuccessResponse();
  successResponse.data = {};
  return res.status(StatusCodes.CREATED).json(successResponse);
});
