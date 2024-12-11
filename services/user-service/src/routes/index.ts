import { Router } from 'express';
import { testRoutes } from './test.routes';
import { userRoutes } from './user.routes';

const router = Router();

router.use('/test', testRoutes);
router.use('/users', userRoutes);

export { router as routes };