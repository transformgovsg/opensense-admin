/* eslint no-console: "off" */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a Superuser
  await prisma.user.create({
    data: {
      email: 'aniruddha_adhikary+e2e@tech.gov.sg',
      remoteId: 'aniruddha_adhikary+e2e@tech.gov.sg',
      Superuser: {
        create: {},
      },
    },
  });

  // Create an Organization Admin
  const orgAdminUser = await prisma.user.create({
    data: {
      email: 'aniruddha_adhikary+e2e-org@tech.gov.sg',
      remoteId: 'aniruddha_adhikary+e2e-org@tech.gov.sg',
    },
  });

  const organization = await prisma.organization.create({
    data: {
      name: 'Test Organization',
      organizationAdmins: {
        create: {
          userId: orgAdminUser.id,
        },
      },
    },
  });

  // Create a regular User
  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      remoteId: 'user@example.com',
    },
  });

  // Add the regular user to the organization via Membership
  await prisma.membership.create({
    data: {
      userId: regularUser.id,
      organizationId: organization.id,
    },
  });

  // Create another Organization and User
  const otherOrganization = await prisma.organization.create({
    data: {
      name: 'Other Organization',
    },
  });

  const otherUser = await prisma.user.create({
    data: {
      email: 'otheruser@example.com',
      remoteId: 'otheruser@example.com',
    },
  });

  await prisma.membership.create({
    data: {
      userId: otherUser.id,
      organizationId: otherOrganization.id,
    },
  });

  // Create DataSourceOwnership
  const dataSourceOwnership = await prisma.dataSourceOwnership.create({
    data: {
      dataSourceId: 1,
      organizationId: organization.id,
    },
  });

  // Grant DataSourceAccess to the regular user
  await prisma.dataSourceAccess.create({
    data: {
      dataSourceId: dataSourceOwnership.dataSourceId,
      userId: regularUser.id,
    },
  });

  // Create Audit Logs
  // await prisma.auditLog.createMany({
  //   data: [
  //     {
  //       recordId: 'record-1',
  //       action: 'CREATE',
  //       resource: 'User',
  //       userId: superuser.id,
  //     },
  //     {
  //       recordId: 'record-2',
  //       action: 'UPDATE',
  //       resource: 'Organization',
  //       userId: orgAdminUser.id,
  //     },
  //   ],
  // });

  console.log('Database seeded successfully 🌱');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
