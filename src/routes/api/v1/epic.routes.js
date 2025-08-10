import { EpicController } from '../../../controllers/index.js';
import {
  AuthMiddleware,
  AuthorizeAccess,
  EpicMiddleware
} from '../../../middlewares/index.js';

import express from 'express';
const router = express.Router();

router.post(
  '/',
  AuthMiddleware.authenticateUser,
  AuthorizeAccess.authorizeAccess({ module: 'task', action: 'create' }),
  EpicMiddleware.validateCreateEpicRequest,
  EpicController.createEpic
);

export default router;
