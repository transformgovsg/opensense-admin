import { Before, ResourceWithOptions, ValidationError } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import { owningRelationSettingsFeature, RelationType, targetRelationSettingsFeature } from '@adminjs/relations';

import { prisma } from '../client.js';
import enableLogging from '../../../audit/logger.feature.js';

import { isOrgAdminOrSuperuser, isSuperuser, navigation, owningRelationCommon } from './common.js';

export function createUserResource(): ResourceWithOptions {
  const lowercaseEmails: Before = (request) => {
    if (request.payload.email) {
      request.payload.email = request.payload.email.toLowerCase();
    }
    return request;
  };

  const checkOrgId: Before = (request, context) => {
    if (!isSuperuser(context) && !request.query.organization) {
      throw new ValidationError({}, { message: 'Please add an user from Organization > Users' });
    }

    const userOrganizations: string[] = context.currentAdmin?.organizations || [];

    if (!isSuperuser(context) && !userOrganizations.includes(request.query.organization)) {
      throw new ValidationError(
        {
          organization: {
            type: 'Forbidden',
            message: 'You are not authorized to add users to this organization',
          },
        },
        { message: 'You are not authorized to add users to this organization' }
      );
    }

    return request;
  };

  return {
    resource: {
      model: getModelByName('User'),
      client: prisma,
    },
    features: [
      targetRelationSettingsFeature(),
      owningRelationSettingsFeature({
        ...owningRelationCommon(),
        relations: {
          canAccessDatabases: {
            type: RelationType.ManyToMany,
            junction: {
              joinKey: 'user',
              inverseJoinKey: 'dataSourceId',
              throughResourceId: 'DataSourceAccess',
            },
            target: {
              resourceId: 'database',
            },
            deleteOptions: {
              enableDeleteRelation: true,
              enableDeleteRelatedRecord: true,
            },
          },
          organizationAdminOf: {
            type: RelationType.ManyToMany,
            junction: {
              joinKey: 'user',
              inverseJoinKey: 'organization',
              throughResourceId: 'OrganizationAdmin',
            },
            target: {
              resourceId: 'Organization',
            },
            deleteOptions: {
              enableDeleteRelation: true,
              enableDeleteRelatedRecord: false,
            },
          },
        },
      }),
      enableLogging(),
    ],
    options: {
      navigation: navigation.users,
      listProperties: ['id', 'email', 'updatedAt'],
      actions: {
        list: { isAccessible: isOrgAdminOrSuperuser },
        show: { isAccessible: isOrgAdminOrSuperuser },
        new: {
          isAccessible: isOrgAdminOrSuperuser,
          before: [checkOrgId, lowercaseEmails],
        },
        edit: {
          isAccessible: isSuperuser,
          before: [lowercaseEmails],
        },
        delete: { isAccessible: isOrgAdminOrSuperuser },
        deleteRelation: {
          isAccessible: isOrgAdminOrSuperuser,
        },
        bulkDelete: { isAccessible: isSuperuser },
      },
    },
  };
}
