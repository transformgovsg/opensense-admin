import 'source-map-support/register.js';
import * as path from 'node:path';
import * as process from 'node:process';

import AdminJS from 'adminjs';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { fastifyStatic } from '@fastify/static';
import RedisStore from 'connect-redis';
import { AuthenticationOptions } from '@adminjs/fastify';
import { FastifySessionOptions } from '@fastify/session';

import logger from './logger.js';
import { buildAuthenticatedRouter } from './auth/fastify/buildAuthenticatedRouter.js';
import { bindUserApi } from './api/user.api.js';
import { bindHealthCheckApi } from './api/health-check.api.js';
import { genReqIdAmznTraceId } from './utils.js';
import { redisClient } from './redis.js';
import adminConfig from './admin-config.js';

const start = async () => {
  const host = process.env.APP_HOST || 'localhost';
  const port = parseInt(process.env.APP_PORT || '8051', 10);
  const ttl = parseInt(process.env.APP_SESSION_TTL || '3600', 10);

  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
    genReqId: genReqIdAmznTraceId,
    trustProxy: true,
  });

  const admin = new AdminJS(adminConfig);

  const authOptions: AuthenticationOptions = {
    cookiePassword: process.env.COOKIE_PASSWORD,
  };

  const sessionOptions: FastifySessionOptions = {
    secret: process.env.SESSION_SECRET,
    store: new RedisStore({
      client: redisClient,
      ttl,
    }),
  };

  await buildAuthenticatedRouter(admin, authOptions, app, sessionOptions);

  bindUserApi(app);
  bindHealthCheckApi(app);

  app.register(fastifyStatic, {
    root: path.join(import.meta.dirname, '..', 'public'),
    prefix: '/public/',
  });

  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    if (admin.options.rootPath !== req.routeOptions.url) {
      return reply.redirect(admin.options.rootPath);
    }
    return reply.status(500).send('rootPath misconfigured');
  });

  app.listen({ host, port }, (err) => {
    if (err) {
      logger.error(err);
    } else {
      logger.fatal(`AdminJS started on http://${host}:${port}${admin.options.rootPath}`);
    }
  });

  // await not needed
  admin.initialize();
};

start();
