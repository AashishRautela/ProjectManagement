import express from 'express';
import UserRoutes from './user.routes.js';
import AuthRoutes from './auth.routes.js';
import ProjectRouter from './project.router.js';

const router = express.Router();

router.use('/user', UserRoutes);
router.use('/auth', AuthRoutes);
router.use('/project', ProjectRouter);

export default router;
