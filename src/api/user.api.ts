import { FastifyInstance, FastifyRequest } from 'fastify';

import { prisma } from '../data-sources/prisma/client.js';
import logger from '../logger.js';

import { verifyApiKey } from './api-auth.js';

type GetUserParams = {
  userId: string;
};

export function bindUserApi(fastify: FastifyInstance) {
  fastify.get(
    '/api/v1/users/:userId',
    { onRequest: [verifyApiKey] },
    async (
      req: FastifyRequest<{
        Params: GetUserParams;
      }>,
      reply
    ) => {
      const { userId } = req.params;

      try {
        const user = await prisma.user.findFirstOrThrow({
          where: {
            email: {
              equals: userId,
              mode: 'insensitive',
            },
          },
          include: {
            memberships: {
              select: {
                organization: true,
              },
            },
            admins: {
              select: {
                organization: true,
              },
            },
            accessRights: {
              select: {
                dataSourceId: true, // Only include the dataSourceId field
              },
            },
          },
        });

        return reply.send(user);
      } catch (error) {
        if (error.code === 'P2025') {
          return reply.status(404).send({ error: 'User not found' });
        }

        logger.error(error);
        return reply.status(500).send({
          error: 'Internal server error',
          details: error.message,
        });
      }
    }
  );
}
