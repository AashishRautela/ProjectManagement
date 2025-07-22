import { asyncHandler } from '../utils/helpers/index.js';

export const addMember = asyncHandler(async (req, res) => {
  const userRole = req.userRole;
  res.send(userRole);
});
