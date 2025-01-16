import axios from 'axios';
import { CurrentAdmin } from 'adminjs';

import logger from '../../logger.js';
import { CognitoAuthToken, IdToken } from '../cognito.types.js';
import { verifyAndDecodeToken } from '../jwt-tokens.js';
import { expireAllSessions, registerSessionInList } from '../../redis.js';

import { injectUserPrivileges, hasAdminAccess, renderLoginWithError } from './privileges.js';

async function obtainToken(code: string) {
  const { OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_TOKEN_URL, OAUTH2_CALLBACK_URL } = process.env;

  // Exchange the authorization code for an access token
  const tokenResponse = await axios.post<CognitoAuthToken>(OAUTH2_TOKEN_URL, null, {
    params: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: OAUTH2_CALLBACK_URL,
      client_id: OAUTH2_CLIENT_ID,
      client_secret: OAUTH2_CLIENT_SECRET,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return tokenResponse.data;
}

export const callbackHandler = (fastifyInstance, admin) => {
  const callbackPath = '/auth/oauth/aws-cognito/callback';

  fastifyInstance.get(callbackPath, async (req, reply) => {
    try {
      const { code, state } = req.query;

      if (state !== req.session.get('oauth2State')) {
        logger.error('Session mismatch');
        return reply.status(403).send('Session State Mismatch, this incident has been reported.');
      }

      const token = await obtainToken(code);

      let adminUser: CurrentAdmin;

      try {
        const decoded = await verifyAndDecodeToken<IdToken>(token.id_token);

        if (typeof decoded === 'string') {
          adminUser = JSON.parse(decoded);
        } else {
          adminUser = decoded;
        }

        adminUser.email = adminUser.email.toLowerCase();
      } catch (decodeError) {
        logger.error(decodeError, 'JWT decode error');
        const login = await admin.renderLogin({
          action: admin.options.loginPath,
          errorMessage: 'invalidCredentials',
        });
        reply.type('text/html');
        return reply.send(login);
      }

      await injectUserPrivileges(adminUser);

      if (!hasAdminAccess(adminUser)) {
        const login = await renderLoginWithError(admin);
        reply.type('text/html');
        return reply.send(login);
      }

      req.session.set('adminUser', adminUser);
      await expireAllSessions(adminUser.email);
      await registerSessionInList(adminUser.email, req.session.sessionId);

      if (req.session.redirectTo) {
        return reply.redirect(req.session.redirectTo, 302);
      }
      return reply.redirect(admin.options.rootPath, 302);
    } catch (error) {
      logger.error(error);
      return reply.status(500).send('Authentication failed');
    }
  });
};
