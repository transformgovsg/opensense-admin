import { CurrentAdmin } from 'adminjs';

import { prisma } from '../../data-sources/prisma/client.js';

export async function getUserWithPrivileges(email: string): Promise<CurrentAdmin | null> {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
    select: {
      id: true,
      email: true,
      Superuser: {
        select: {
          id: true,
        },
      },
      admins: {
        select: {
          organizationId: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    isSuperuser: user.Superuser.length > 0,
    organizations: user.admins.map((admin) => admin.organizationId),
  };
}

export function hasAdminAccess(adminUser: CurrentAdmin): boolean {
  return adminUser.isSuperuser || (adminUser.organizations || []).length > 0;
}
