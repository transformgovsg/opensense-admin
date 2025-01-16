import { owningRelationSettingsFeature, RelationType, targetRelationSettingsFeature } from '@adminjs/relations';
import { After, ResourceWithOptions } from 'adminjs';

import { owningRelationCommon } from '../../prisma/resources/common.js';
import enableLogging from '../../../audit/logger.feature.js';
import { MetabaseTableResource } from '../metabase-table.resource.js';

const redirectToDatabase: After<{ record: { params: { db_id: number } } }> = async (res) => {
  const dbId = res.record.params.db_id;
  return {
    ...res,
    redirectUrl: `/admin/resources/database/records/${dbId}/show?tab=tables`,
  };
};

export const metabaseTableResource: ResourceWithOptions = {
  resource: new MetabaseTableResource('table'),
  options: {
    listProperties: ['name', 'display_name', 'visibility_type'],
    editProperties: ['display_name', 'description', 'visibility_type'],
    actions: {
      edit: {
        after: [redirectToDatabase],
      },
      show: {},
      list: {
        isVisible: false,
      },
      search: {},
      delete: {
        isAccessible: false,
      },
      bulkDelete: {
        isAccessible: false,
      },
      new: {
        isAccessible: false,
      },
    },
    properties: {
      visibility_type: {
        availableValues: [
          { label: '🟢 Visible', value: 'normal' },
          { label: '🔴 Hidden', value: 'sensitive' },
        ],
      },
      description: {
        type: 'textarea',
        props: {
          rows: 10,
        },
      },
    },
  },
  features: [
    targetRelationSettingsFeature(),
    owningRelationSettingsFeature({
      ...owningRelationCommon(),
      relations: {
        fields: {
          type: RelationType.OneToMany,
          target: {
            resourceId: 'field',
            joinKey: 'table_id',
          },
        },
      },
    }),
    enableLogging(),
  ],
};
