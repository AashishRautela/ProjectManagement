import { ProjectMemberController } from '../../../controllers/index.js';
import {
  AuthMiddleware,
  AuthorizeAccess,
  ProjectMemberMiddleware
} from '../../../middlewares/index.js';

import express from 'express';
const router = express.Router();

router.post(
  '/',
  AuthMiddleware.authenticateUser,
  AuthorizeAccess.authorizeAccess({ module: 'member', action: 'add' }),
  ProjectMemberMiddleware.validateAddMemberRequest,
  ProjectMemberController.addMember
);

// remove member
router.delete(
  '/:memberId',
  AuthMiddleware.authenticateUser,
  AuthorizeAccess.authorizeAccess({ module: 'member', action: 'remove' }),
  ProjectMemberController.removeMember
);

export default router;
