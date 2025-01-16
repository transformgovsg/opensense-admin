import AdminJS, { CurrentAdmin } from 'adminjs';

import { getUserWithPrivileges, hasAdminAccess } from './auth-utils.js';

export async function injectUserPrivileges(adminUser: CurrentAdmin) {
  if (adminUser.email?.length <= 0) {
    return;
  }

  const user = await getUserWithPrivileges(adminUser.email);

  if (user) {
    Object.assign(adminUser, user);
  }
}

export async function renderLoginWithError(admin: AdminJS, errorMessage = 'No Superuser or Organisation Admin Access') {
  return admin.renderLogin({
    action: admin.options.loginPath,
    errorMessage,
  });
}

export { hasAdminAccess };
