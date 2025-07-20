import { ProjectController } from '../../../controllers/index.js';
import { AuthMiddleware } from '../../../middlewares/index.js';

import express from 'express';
const router = express.Router();

router.post('/', ProjectController.createProject);

export default router;
