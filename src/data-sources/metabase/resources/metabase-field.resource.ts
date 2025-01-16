import { After, ResourceWithOptions } from 'adminjs';

import { MetabaseFieldResource } from '../metabase-field.resource.js';
import enableLogging from '../../../audit/logger.feature.js';

const redirectToTable: After<{ record: { params: { table_id: number } } }> = async (res) => {
  const tableId = res.record.params.table_id;
  return {
    ...res,
    redirectUrl: `/admin/resources/table/records/${tableId}/show`,
  };
};

export const metabaseFieldResource: ResourceWithOptions = {
  resource: new MetabaseFieldResource('field'),
  options: {
    listProperties: ['name', 'display_name', 'visibility_type'],
    editProperties: ['display_name', 'description', 'visibility_type'],
    actions: {
      edit: {
        after: [redirectToTable],
      },
      show: {
        isVisible: false,
      },
      list: {
        isVisible: false,
      },
      bulkDelete: {
        isAccessible: false,
      },
      delete: {
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
  features: [enableLogging()],
};
