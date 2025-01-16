import { ResourceWithOptions } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import { targetRelationSettingsFeature } from '@adminjs/relations';

import { prisma } from '../client.js';
import enableLogging from '../../../audit/logger.feature.js';

import { isOrgAdminOrSuperuser, navigation } from './common.js';

export function createMembershipResource(): ResourceWithOptions {
  return {
    resource: {
      model: getModelByName('Membership'),
      client: prisma,
    },
    features: [targetRelationSettingsFeature(), enableLogging()],
    options: {
      navigation: navigation.advanced,
      actions: {
        new: { isAccessible: isOrgAdminOrSuperuser },
        search: { isAccessible: isOrgAdminOrSuperuser },
        list: { isVisible: false },
        show: { isAccessible: isOrgAdminOrSuperuser },
        edit: { isAccessible: isOrgAdminOrSuperuser },
        delete: { isAccessible: isOrgAdminOrSuperuser },
        bulkDelete: { isAccessible: isOrgAdminOrSuperuser },
      },
    },
  };
}
