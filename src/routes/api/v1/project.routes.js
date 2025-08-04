import { ProjectController } from '../../../controllers/index.js';
import {
  AuthMiddleware,
  AuthorizeAccess,
  ProjectMiddleware
} from '../../../middlewares/index.js';

import express from 'express';
const router = express.Router();

router.post(
  '/',
  AuthMiddleware.authenticateUser,
  ProjectMiddleware.validateCreateProjectRqst,
  ProjectController.createProject
);

router.get(
  '/:projectId',
  AuthMiddleware.authenticateUser,
  AuthorizeAccess.authorizeAccess({ module: 'project', action: 'view' }),
  ProjectController.getProjectDetails
);

export default router;
