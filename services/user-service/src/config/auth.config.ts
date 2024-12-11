export const authConfig = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.NODE_ENV === 'production'
      ? 'https://auth.mpt.solutions/api/v1/auth/google/callback'
      : `http://localhost:3001/api/v1/auth/google/callback`,
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: '/api/v1/auth/github/callback',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '1d',
  },
};