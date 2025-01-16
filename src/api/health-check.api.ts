import { FastifyInstance } from 'fastify';

import { checkPrisma } from '../data-sources/prisma/prisma.health.js';
import { checkMetabase } from '../data-sources/metabase/metabase.health.js';
import logger from '../logger.js';

type HealthCheckFunction = () => Promise<boolean>;

const healthChecks: Record<string, HealthCheckFunction> = {
  checkPrisma,
  checkMetabase,
};

export function bindHealthCheckApi(fastify: FastifyInstance) {
  fastify.get('/health', async (req, reply) => {
    // Use Promise.all to run all health checks in parallel
    const healthStatusEntries = await Promise.all(
      Object.entries(healthChecks).map(async ([checkName, checkFunction]) => {
        try {
          const result = await checkFunction();
          return [checkName, result];
        } catch (error) {
          logger.error(`Error during health check ${checkName}:`, error);
          return [checkName, false];
        }
      })
    );

    // Convert the array of [key, value] pairs back into an object
    const checks = Object.fromEntries(healthStatusEntries);

    // Determine overall health status
    const healthy = Object.values(checks).every((status) => status);

    // Respond with the structured health status
    return reply.status(healthy ? 200 : 500).send({
      healthy,
      checks,
    });
  });
}
