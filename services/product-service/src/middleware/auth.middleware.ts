import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

export const configureJWT = (): void => {
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-jwt-secret',
  }, async (payload, done) => {
    try {
      // We trust the user ID from the token since it was signed by user-service
      return done(null, { _id: payload.sub });
    } catch (error) {
      return done(error, false);
    }
  }));
};