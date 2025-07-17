import { UserController } from '../../../controllers/index.js';
import express from 'express';
import { UserMiddleware } from '../../../middlewares/index.js';
const router = express.Router();

router.post('/', UserMiddleware.validateCreateUser, UserController.createUser);

export default router;
