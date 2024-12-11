import { Router } from 'express';
import passport from 'passport';

const router = Router();

/**
 * @swagger
 * /test/protected:
 *   get:
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     description: Test protected route
 *     responses:
 *       200:
 *         description: Protected data
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      message: 'You have accessed a protected route',
      user: req.user
    });
  }
);

export { router as testRoutes };