import fastifyCookie from '@fastify/cookie';
import fastifyFormBody from '@fastify/formbody';
import FastifySessionPlugin from '@fastify/session';
import AdminJS, { Router as AdminRouter } from 'adminjs';
import { FastifyInstance } from 'fastify';
import { AuthenticationOptions, buildRouter } from '@adminjs/fastify';

import { loginHandler } from './login.handler.js';
import { callbackHandler } from './callback.handler.js';
import { logoutHandler } from './logout.handler.js';
import { injectUserPrivileges, hasAdminAccess, renderLoginWithError } from './privileges.js';

const withProtectedRoutesHandler = (fastifyApp, admin) => {
  const { rootPath } = admin.options;
  // eslint-disable-next-line consistent-return
  fastifyApp.addHook('preHandler', async (request, reply) => {
    const buildComponentRoute = AdminRouter.routes.find((r) => r.action === 'bundleComponents')?.path;
    const assets = [...AdminRouter.assets.map((a) => a.path), ...Object.values(admin.options?.assets ?? {}).flat()];
    if (assets.find((a) => request.url.match(a))) {
      /* empty */
    } else if (buildComponentRoute && request.url.match(buildComponentRoute)) {
      /* empty */
    } else if (
      !request.url.startsWith(rootPath) ||
      request.url.startsWith(admin.options.loginPath) ||
      request.url.startsWith(admin.options.logoutPath)
    ) {
      /* empty */
    } else {
      const adminUser = request.session.get('adminUser');
      if (!adminUser) {
        // If the redirection is caused by API call to some action just redirect to resource
        const [redirectTo] = request.url.split('/actions');
        request.session.redirectTo = redirectTo.includes(`${rootPath}/api`) ? rootPath : redirectTo;
        return reply.redirect(admin.options.loginPath);
      }

      // Check user privileges
      await injectUserPrivileges(adminUser);

      request.session.set('adminUser', adminUser);
      if (!hasAdminAccess(adminUser)) {
        const login = await renderLoginWithError(admin);
        reply.type('text/html');
        return reply.send(login);
      }
    }
  });
};

export const buildAuthenticatedRouter = async (
  admin: AdminJS,
  auth: AuthenticationOptions,
  fastifyApp: FastifyInstance,
  sessionOptions?: FastifySessionPlugin.FastifySessionOptions
): Promise<void> => {
  if (auth.authenticate || auth.provider) {
    throw new Error('authenticate and provider must remain null');
  }

  await fastifyApp.register(fastifyCookie, {
    secret: auth.cookiePassword,
  });
  await fastifyApp.register(FastifySessionPlugin, {
    secret: auth.cookiePassword,
    cookieName: auth.cookieName ?? 'adminjs',
    cookie: sessionOptions?.cookie ?? { secure: false },
    ...(sessionOptions ?? {}),
  });
  await fastifyApp.register(fastifyFormBody);

  await buildRouter(admin, fastifyApp);
  withProtectedRoutesHandler(fastifyApp, admin);
  loginHandler(fastifyApp, admin);
  callbackHandler(fastifyApp, admin);
  logoutHandler(fastifyApp, admin);
};
