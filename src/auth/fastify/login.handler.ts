import * as process from 'node:process';

import { FastifyReply, FastifyRequest } from 'fastify';

import { toQueryString } from '../../utils.js';
import { generateOAuthState } from '../utils.js';

declare module 'fastify' {
  interface Session {
    cookie: string;
    oauth2State: string;
  }
}

export const getLoginPath = (admin) => {
  const { loginPath } = admin.options;
  return loginPath.startsWith('/') ? loginPath : `/${loginPath}`;
};

export const getLoginInitiatePath = (admin) => `${getLoginPath(admin)}/initiate`;

export const loginHandler = (fastifyInstance, admin) => {
  const loginPath = getLoginPath(admin);
  const loginInitPath = getLoginInitiatePath(admin);

  fastifyInstance.get(loginPath, async (req, reply) => {
    const baseProps = {
      action: admin.options.loginPath,
      errorMessage: null,
    };
    const login = await admin.renderLogin({
      ...baseProps,
    });
    reply.type('text/html');
    return reply.send(login);
  });

  fastifyInstance.get(loginInitPath, async (req: FastifyRequest, reply: FastifyReply) => {
    const oauth2State = generateOAuthState();
    req.session.set('oauth2State', oauth2State);

    const params = {
      response_type: 'code',
      client_id: process.env.OAUTH2_CLIENT_ID,
      redirect_uri: process.env.OAUTH2_CALLBACK_URL,
      state: oauth2State,
    };

    const queryString = toQueryString(params);
    const loginUrl = `${process.env.OAUTH2_AUTH_URL}?${queryString}`;

    return reply.redirect(loginUrl, 302);
  });
};
