import crypto from 'crypto';

export function generateOAuthState() {
  return crypto.randomBytes(32).toString('hex');
}
