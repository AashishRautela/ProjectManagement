import { UserService } from '../services/index.js';
import { asyncHandler } from '../utils/helpers/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import { randomInt } from 'crypto';
import { sendOtpJob } from '../queues/otp.queue.js';

export const createUser = asyncHandler(async (req, res) => {
  const data = req.body;
  const otp = randomInt(100000, 999999).toString();
  const otpRes = await sendOtpJob({ email: req.body.email, otp: otp });
  console.log('otpRes-->', otpRes);
  const user = await UserService.createUser(data);

  const successResponse = SuccessResponse();
  successResponse.data = user;

  return res.status(StatusCodes.CREATED).json(successResponse);
});

export const verifyUser = asyncHandler(async (req, res) => {});
