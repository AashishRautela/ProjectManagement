import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../services/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { asyncHandler } from '../utils/helpers/index.js';

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body);

  const successResponse = SuccessResponse();
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
  });

  successResponse.message = 'Login Successfull';
  successResponse.data = user;

  return res.status(StatusCodes.OK).send(successResponse);
});
