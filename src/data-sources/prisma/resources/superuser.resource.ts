import { ResourceWithOptions } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';

import { prisma } from '../client.js';
import enableLogging from '../../../audit/logger.feature.js';

import { isSuperuser, navigation } from './common.js';

export function createSuperuserResource(): ResourceWithOptions {
  return {
    resource: {
      model: getModelByName('Superuser'),
      client: prisma,
    },
    features: [enableLogging()],
    options: {
      navigation: navigation.users,
      actions: {
        new: { isAccessible: isSuperuser },
        search: { isAccessible: isSuperuser },
        list: { isAccessible: isSuperuser },
        show: { isAccessible: isSuperuser },
        edit: { isAccessible: isSuperuser },
        delete: { isAccessible: isSuperuser },
        bulkDelete: { isAccessible: isSuperuser },
      },
    },
  };
}
