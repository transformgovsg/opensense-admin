import logger from '../../logger.js';

import { prisma } from './client.js';

export async function checkPrisma(): Promise<boolean> {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error(error, 'Database connection error');
    return false;
  }
}
