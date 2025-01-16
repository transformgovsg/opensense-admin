import jwksClient from 'jwks-rsa';
import jwt, { GetPublicKeyOrSecret } from 'jsonwebtoken';

const client = jwksClient({
  jwksUri: process.env.OAUTH2_JWKS_URL,
  cache: true,
});

const getKey: GetPublicKeyOrSecret = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
};

// Function to verify the token
export function verifyAndDecodeToken<T>(token: string): Promise<string | T> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {}, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as T);
      }
    });
  });
}
