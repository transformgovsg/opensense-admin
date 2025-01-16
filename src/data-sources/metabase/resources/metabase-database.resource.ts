import { owningRelationSettingsFeature, RelationType, targetRelationSettingsFeature } from '@adminjs/relations';
import { ResourceWithOptions } from 'adminjs';

import { owningRelationCommon } from '../../prisma/resources/common.js';
import { MetabaseResource } from '../metabase.resource.js';
import enableLogging from '../../../audit/logger.feature.js';

export const metabaseDatabaseResource: ResourceWithOptions = {
  resource: new MetabaseResource('database'),
  options: {
    listProperties: ['name'],
    actions: {
      edit: {
        isAccessible: () => false,
      },
      show: {
        isAccessible: () => true,
      },
      list: {
        isAccessible: () => true,
      },
      search: {
        isAccessible: () => true,
      },
      delete: {
        isAccessible: () => false,
      },
      bulkDelete: {
        isAccessible: () => false,
      },
      new: {
        isAccessible: () => false,
      },
    },
  },
  features: [
    targetRelationSettingsFeature(),
    owningRelationSettingsFeature({
      ...owningRelationCommon(),
      relations: {
        owningOrganization: {
          type: RelationType.ManyToMany,
          junction: {
            joinKey: 'dataSourceId',
            inverseJoinKey: 'organization',
            throughResourceId: 'DataSourceOwnership',
          },
          target: {
            resourceId: 'Organization',
          },
        },
        usersWithDatabaseAccess: {
          type: RelationType.ManyToMany,
          junction: {
            joinKey: 'dataSourceId',
            inverseJoinKey: 'user',
            throughResourceId: 'DataSourceAccess',
          },
          target: {
            resourceId: 'User',
          },
        },
        tables: {
          type: RelationType.OneToMany,
          target: {
            resourceId: 'table',
            joinKey: 'db_id',
          },
        },
      },
    }),
    enableLogging(),
  ],
};
