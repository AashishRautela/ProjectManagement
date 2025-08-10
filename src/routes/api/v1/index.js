import express from 'express';
import UserRoutes from './user.routes.js';
import AuthRoutes from './auth.routes.js';
import ProjectRouter from './project.routes.js';
import ProjectMemberRouter from './projectMember.routes.js';
import EpicRoutes from './epic.routes.js';

const router = express.Router();

router.use('/user', UserRoutes);
router.use('/auth', AuthRoutes);
router.use('/project', ProjectRouter);
router.use('/member', ProjectMemberRouter);
router.use('/epic', EpicRoutes);

export default router;
