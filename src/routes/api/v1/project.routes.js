import { ProjectController } from '../../../controllers/index.js';
import {
  AuthMiddleware,
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

export default router;
