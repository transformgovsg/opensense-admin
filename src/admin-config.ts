import { componentLoader, Components } from './component-loader.js';
import {
  createDataSourceAccessResource,
  createDataSourceOwnershipResource,
  createMembershipResource,
  createOrganizationAdminResource,
  createOrganizationResource,
  createSuperuserResource,
  createUserResource,
} from './data-sources/prisma/index.js';
import {
  metabaseDatabaseResource,
  metabaseFieldResource,
  metabaseTableResource,
} from './data-sources/metabase/index.js';
import loggerResource from './audit/logger.resource.js';

export default {
  rootPath: '/admin',
  dashboard: {
    component: Components.Dashboard,
  },
  resources: [
    createUserResource(),
    createSuperuserResource(),
    createOrganizationResource(),
    createOrganizationAdminResource(),
    createMembershipResource(),
    createDataSourceAccessResource(),
    createDataSourceOwnershipResource(),
    loggerResource,
    metabaseDatabaseResource,
    metabaseTableResource,
    metabaseFieldResource,
  ],
  branding: {
    companyName: 'Sense - Management',
    logo: '/public/logo_light.png',
    withMadeWithLove: false,
  },
  locale: {
    language: 'en',
    translations: {
      en: {
        messages: {
          'modal-subTitle': '',
        },
      },
    },
  },
  componentLoader,
};
