import { Router } from 'express';
import passport from 'passport';
import { createUser, getUsers, updateUser, deleteUser, getProfile } from '../controllers/user.controller';

const router = Router();

// Protected routes
router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile);
router.put('/profile', passport.authenticate('jwt', { session: false }), updateUser);
router.delete('/profile', passport.authenticate('jwt', { session: false }), deleteUser);

// Admin routes
router.get('/', passport.authenticate('jwt', { session: false }), getUsers);
router.post('/', passport.authenticate('jwt', { session: false }), createUser);

export { router as userRoutes };