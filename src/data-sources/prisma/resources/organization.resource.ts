import { ResourceWithOptions } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import { owningRelationSettingsFeature, RelationType, targetRelationSettingsFeature } from '@adminjs/relations';

import { prisma } from '../client.js';
import enableLogging from '../../../audit/logger.feature.js';

import { isOrgAdminOrSuperuser, isSuperuser, navigation, owningRelationCommon } from './common.js';

export function createOrganizationResource(): ResourceWithOptions {
  return {
    resource: {
      model: getModelByName('Organization'),
      client: prisma,
    },
    features: [
      targetRelationSettingsFeature(),
      owningRelationSettingsFeature({
        ...owningRelationCommon(),
        relations: {
          admins: {
            type: RelationType.ManyToMany,
            junction: {
              joinKey: 'organization',
              inverseJoinKey: 'user',
              throughResourceId: 'OrganizationAdmin',
            },
            target: {
              resourceId: 'User',
            },
            deleteOptions: {
              enableDeleteRelation: true,
              enableDeleteRelatedRecord: true,
            },
          },
        },
      }),
      enableLogging(),
    ],
    options: {
      navigation: navigation.users,
      actions: {
        new: { isAccessible: isSuperuser },
        search: { isAccessible: isSuperuser },
        list: { isAccessible: isOrgAdminOrSuperuser },
        show: { isAccessible: isOrgAdminOrSuperuser },
        edit: { isAccessible: isSuperuser },
        delete: { isAccessible: isSuperuser },
        bulkDelete: { isAccessible: isSuperuser },
        deleteRelation: { isAccessible: isOrgAdminOrSuperuser },
      },
    },
  };
}
