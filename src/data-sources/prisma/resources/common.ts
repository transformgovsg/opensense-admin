import { IsFunction } from 'adminjs';

import { componentLoader } from '../../../component-loader.js';

export const navigation = {
  advanced: {
    name: 'Advanced',
    icon: 'AlertOctagon',
  },
  users: {
    name: 'Users and Organizations',
    icon: 'Users',
  },
  data: {
    name: 'Metadata and Sources',
    icon: 'Database',
  },
};
export const owningRelationCommon = () => ({
  componentLoader,
  licenseKey: process.env.ADMIN_JS_RELATIONS_LICENSE_KEY,
});

export const isSuperuser: IsFunction = (context) => context.currentAdmin.isSuperuser === true;

export const isOrgAdminOrSuperuser: IsFunction = (context) => {
  const adminOfAnyOrg = context.currentAdmin?.organizations?.length > 0;
  return isSuperuser(context) || adminOfAnyOrg;
};
