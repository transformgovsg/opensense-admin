# sense-admin

[Firewall Configuration](/docs/firewall_configuration.md)

## Overview

Admin Panel for Sense.

## Setting up

### Using Container (Optional)

```shell
docker compose build sense_admin
```

### Development Environment

> Make sure you have a PostgreSQL instance running. Alternatively, you can use Supabase or Neon.

#### Step 1: Git clone.

#### Step 2: Install dependencies.

```shell
npm install
```

#### Step 3: Copy `.env.example` to `.env` and fill it in.

#### Step 4: Run the Prisma migrations.

```shell
npx prisma migrate deploy
```

#### Optional: Seed your db with the first Superuser

```shell
npx prisma db seed -- --email '<your_email>@tech.gov.sg'
```

#### Step 5: Run ZenStack generation.

```shell
npx zenstack generate
```

#### Step 6: Start the auto-reloading development server.

```shell
npm run dev
```

## Database Schema Changes

To handle changes in your database schema, follow these steps:

1. **Update your Prisma schema file** located at `prisma/schema.prisma`.
2. After updating the schema, **generate a new migration** with the following command:

   ```shell
   npx prisma migrate dev --name descriptive_migration_name
   ```

   This command creates a new migration based on schema changes and applies it to the development database.
3. **Run ZenStack generation** to apply any changes in the schema or permissions:

   ```shell
   npx zenstack generate
   ```

   This step is necessary after any changes to the schema.zmodel file or when permissions are updated.
4. **Deploy migrations to production** using:

   ```shell
   npx prisma migrate deploy
   ```
   
## Running `e2e` tests

### Required Environment Variables
```shell
E2E_SU_USERNAME=e2e
E2E_SU_PASSWORD=
E2E_ADMIN_USERNAME=e2e-org
E2E_ADMIN_PASSWORD=
SENSE_ADMIN_BASE_URL=http://localhost:8051
```

### Running tests locally

```shell
# Reset the Database
npm run test:e2e:prepare-db

# Run the Tests in UI Mode
npx playwright test --ui
```

## Reference

### Environment Variables

#### `NODE_ENV=production`
Always run this in production mode, even during development.

#### `LOG_LEVEL=error`
Specifies the log level for the application. `error` will only log error messages.

#### `DATABASE_URL`
The connection URL for the PostgreSQL database. Format: `postgresql://<user>:<password>@<host>:<port>/<database>?schema=<schema>`.

#### `ADMIN_JS_RELATIONS_LICENSE_KEY`
The license key for AdminJS Relations, stored in Notion.

... [additional environment variables] ...

## APIs

### GET /api/v1/users/:email

#### Request Headers

- `x-api-key`: The API Key set in the env variable `API_KEY` (above).

#### Response Format

```json
{
    "id": "86a39452-2581-4e61-9410-105262f5e720",
    "remoteId": "bro@hive.gov.sg",
    "email": "bro@hive.gov.sg",
    "memberships": [
        {
            "role": "MEMBER",
            "organization": {
                "id": "70cff6c4-3c55-4819-9afe-703e358942d3",
                "name": "MFA"
            }
        }
    ],
    "accessRights": [
        {
            "dataSourceId": 4
        }
    ]
}
```

### GET /health

#### Response Format (Healthy)

HTTP Response Code `200`.

```json
{
  "healthy": true,
  "checks": {
    "checkPrisma": true,
    "checkMetabase": true
  }
}
```

#### Response Format (Unhealthy)

HTTP Response Code `500`.

```json
{
  "healthy": false,
  "checks": {
    "checkPrisma": false,
    "checkMetabase": true
  }
}
```

## Session Management

1. Session data is stored in Redis. (`src/app.ts`)
2. Only a single session is allowed per user. Upon logging in, previous sessions are destroyed (`src/redis.ts`).
