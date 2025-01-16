import AdminJS from 'adminjs';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { toQueryString } from '../../utils.js';

const getLogoutPath = (admin: AdminJS) => {
  const { logoutPath } = admin.options;

  return logoutPath.startsWith('/') ? logoutPath : `/${logoutPath}`;
};

export const logoutHandler = (fastifyApp: FastifyInstance, admin: AdminJS): void => {
  const logoutPath = getLogoutPath(admin);

  fastifyApp.get(logoutPath, async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.session) {
      await request.session.destroy();
    }
    if (process.env.OAUTH2_LOGOUT_URL) {
      const params = toQueryString({
        client_id: process.env.OAUTH2_CLIENT_ID,
        logout_uri: process.env.OAUTH2_LOGOUT_CALLBACK_URL,
      });
      return reply.redirect(`${process.env.OAUTH2_LOGOUT_URL}?${params}`, 302);
    }
    return reply.redirect(admin.options.loginPath);
  });

  fastifyApp.get('/auth/oauth/aws-cognito/logout', async (request, reply) => {
    if (request.session) {
      await request.session.destroy();
    }
    return reply.redirect(admin.options.loginPath);
  });
};
