import { getModelByName } from '@adminjs/prisma';
import { targetRelationSettingsFeature } from '@adminjs/relations';
import { ResourceWithOptions } from 'adminjs';

import { prisma } from '../client.js';
import enableLogging from '../../../audit/logger.feature.js';

import { isOrgAdminOrSuperuser, isSuperuser, navigation } from './common.js';

export function createDataSourceOwnershipResource(): ResourceWithOptions {
  return {
    resource: {
      model: getModelByName('DataSourceOwnership'),
      client: prisma,
    },
    features: [targetRelationSettingsFeature(), enableLogging()],
    options: {
      navigation: navigation.advanced,
      actions: {
        new: { isAccessible: isSuperuser },
        search: { isAccessible: isSuperuser },
        list: { isVisible: false },
        show: { isAccessible: isOrgAdminOrSuperuser },
        edit: { isAccessible: isSuperuser },
        delete: { isAccessible: isSuperuser },
        bulkDelete: { isAccessible: false },
      },
    },
  };
}
