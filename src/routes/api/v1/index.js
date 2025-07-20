import express from 'express';
import UserRoutes from './user.routes.js';
import AuthRoutes from './auth.routes.js';

const router = express.Router();

router.use('/user', UserRoutes);
router.use('/auth', AuthRoutes);

export default router;
