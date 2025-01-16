import { ResourceWithOptions } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';

import { prisma } from '../client.js';
import enableLogging from '../../../audit/logger.feature.js';

import { isOrgAdminOrSuperuser, isSuperuser, navigation } from './common.js';

export function createOrganizationAdminResource(): ResourceWithOptions {
  return {
    resource: {
      model: getModelByName('OrganizationAdmin'),
      client: prisma,
    },
    features: [enableLogging()],
    options: {
      navigation: navigation.users,
      actions: {
        new: { isAccessible: isOrgAdminOrSuperuser },
        search: { isAccessible: isOrgAdminOrSuperuser },
        list: { isAccessible: isSuperuser },
        show: { isAccessible: isOrgAdminOrSuperuser },
        edit: { isAccessible: isOrgAdminOrSuperuser },
        delete: { isAccessible: isOrgAdminOrSuperuser },
        bulkDelete: { isAccessible: isOrgAdminOrSuperuser },
      },
    },
  };
}
