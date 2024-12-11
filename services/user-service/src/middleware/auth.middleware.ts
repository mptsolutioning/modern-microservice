import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/user.model';
import { authConfig } from '../config/auth.config';

export const configureAuth = (): void => {
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: authConfig.jwt.secret,
  }, async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));

  passport.use(new GoogleStrategy({
    clientID: authConfig.google.clientID,
    clientSecret: authConfig.google.clientSecret,
    callbackURL: authConfig.google.callbackURL,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({
        provider: 'google',
        providerId: profile.id
      });

      if (!user) {
        user = await User.create({
          email: profile.emails?.[0].value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          provider: 'google',
          providerId: profile.id,
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));

  passport.use(new GitHubStrategy({
    clientID: authConfig.github.clientID,
    clientSecret: authConfig.github.clientSecret,
    callbackURL: authConfig.github.callbackURL,
  }, async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void
  ) => {
    try {
      let user = await User.findOne({
        provider: 'github',
        providerId: profile.id
      });

      if (!user) {
        user = await User.create({
          email: profile.emails?.[0].value,
          firstName: profile.displayName?.split(' ')[0],
          lastName: profile.displayName?.split(' ')[1],
          provider: 'github',
          providerId: profile.id.toString(),
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));
};