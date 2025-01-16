/* eslint no-console: "off" */

import { parseArgs } from 'node:util';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const options: { [key: string]: { type: 'string' } } = {
  email: { type: 'string' },
};

async function main() {
  const {
    values: { email },
  } = parseArgs({ options });

  if (!email) {
    throw new Error(
      'add user-defined arguements when running seed e.g. npx prisma db seed -- --email <your_email>@tech.gov.sg'
    );
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      remoteId: email,
      email,
    },
  });

  const superuser = await prisma.superuser.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
    },
  });

  console.log({ user, superuser });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
