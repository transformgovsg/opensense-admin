import { PrismaClient } from '@prisma/client';
import cuid2 from '@paralleldrive/cuid2';

const prisma = new PrismaClient();

function generateIdentity() {
  const username = cuid2.createId();
  return { username, email: `${username}@test.com` };
}

export const createUser = async () => {
  const { email } = generateIdentity();

  return prisma.user.create({
    data: {
      email,
      remoteId: email,
    },
  });
};

export const addUserToOrg = async (orgName: string, userId: string, as: 'member' | 'admin' = 'member') => {
  const org = await prisma.organization.findFirst({
    where: {
      name: orgName,
    },
  });

  if (as === 'member') {
    return prisma.membership.create({
      data: {
        organizationId: org.id,
        userId,
      },
    });
  }

  return prisma.organizationAdmin.create({
    data: {
      organizationId: org.id,
      userId,
    },
  });
};
