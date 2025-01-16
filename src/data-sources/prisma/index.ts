import AdminJS from 'adminjs';
import Prisma from '@adminjs/prisma';

import { ZenstackResource } from './zenstack-resource.js';

AdminJS.registerAdapter({
  Database: Prisma.Database,
  Resource: ZenstackResource,
});

export { createDataSourceAccessResource } from './resources/data-source-access.resource.js';
export { createDataSourceOwnershipResource } from './resources/data-source-ownership.resource.js';
export { createMembershipResource } from './resources/membership.resource.js';
export { createOrganizationResource } from './resources/organization.resource.js';
export { createOrganizationAdminResource } from './resources/organization-admin.resource.js';
export { createSuperuserResource } from './resources/superuser.resource.js';
export { createUserResource } from './resources/user.resource.js';
