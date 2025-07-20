import { AuthController } from '../../../controllers/index.js';
import { AuthMiddleware } from '../../../middlewares/index.js';

import express from 'express';
const router = express.Router();

router.post('/login', AuthMiddleware.validateLoginRqst, AuthController.login);

export default router;
