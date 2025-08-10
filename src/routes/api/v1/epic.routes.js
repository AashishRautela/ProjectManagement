import { EpicController } from '../../../controllers/index.js';
import {
  AuthMiddleware,
  AuthorizeAccess,
  EpicMiddleware
} from '../../../middlewares/index.js';

import express from 'express';
const router = express.Router();

const module = 'task';
router.post(
  '/',
  AuthMiddleware.authenticateUser,
  AuthorizeAccess.authorizeAccess({ module, action: 'create' }),
  EpicMiddleware.validateCreateEpicRequest,
  EpicController.createEpic
);

router.get(
  '/:id/:projectId',
  AuthMiddleware.authenticateUser,
  AuthorizeAccess.authorizeAccess({ module, action: 'view' }),
  EpicController.getEpicDetails
);

export default router;
