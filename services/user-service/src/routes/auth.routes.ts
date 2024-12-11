import { Router, Request, Response, RequestHandler } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { IUser } from '../models/user.model';

const router = Router();

interface AuthRequest extends Request {
  user: IUser;
}

type AuthRequestHandler = RequestHandler<any, any, any, any, { user: IUser }>;

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     description: Authenticate with Google
 *     responses:
 *       302:
 *         description: Redirects to Google login
 */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  ((req, res) => {
    const user = req.user as IUser;
    const token = jwt.sign(
      { sub: user._id },
      authConfig.jwt.secret,
      { expiresIn: authConfig.jwt.expiresIn }
    );
    res.redirect(`/api/v1/auth/success?token=${token}`);
  }) as AuthRequestHandler
);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     tags: [Auth]
 *     description: Authenticate with GitHub
 *     responses:
 *       302:
 *         description: Redirects to GitHub login
 */
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  ((req, res) => {
    const user = req.user as IUser;
    const token = jwt.sign(
      { sub: user._id },
      authConfig.jwt.secret,
      { expiresIn: authConfig.jwt.expiresIn }
    );
    res.redirect(`/api/v1/auth/success?token=${token}`);
  }) as AuthRequestHandler
);

router.get('/success', (req: Request, res: Response) => {
  const { token } = req.query;

  // For development, return a simple page with the token
  res.send(`
    <html>
      <body>
        <h1>Authentication Successful</h1>
        <p>Your token: ${token}</p>
        <script>
          // Store token in localStorage
          localStorage.setItem('token', '${token}');
        </script>
      </body>
    </html>
  `);
});

export { router as authRoutes };