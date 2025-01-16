import { createLoggerResource } from '@adminjs/logger';
import { getModelByName } from '@adminjs/prisma';

import { componentLoader } from '../component-loader.js';
import { prisma } from '../data-sources/prisma/client.js';
import { isOrgAdminOrSuperuser } from '../data-sources/prisma/resources/common.js';

const loggerResource = createLoggerResource({
  componentLoader,
  resource: {
    model: getModelByName('AuditLog'),
    client: prisma,
  },
  featureOptions: {
    componentLoader,
    propertiesMapping: {
      user: 'userId',
    },
    resourceOptions: {
      navigation: {
        name: 'Audit Log',
        icon: 'AlertOctagon',
      },
    },
  },
});

export default {
  ...loggerResource,
  options: {
    ...loggerResource.options,
    actions: {
      ...loggerResource.options.actions,
      show: {
        ...loggerResource.options.actions.show,
        isAccessible: isOrgAdminOrSuperuser,
      },
      list: {
        ...loggerResource.options.actions.list,
        isAccessible: isOrgAdminOrSuperuser,
      },
    },
  },
};
