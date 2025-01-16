-- DropForeignKey
ALTER TABLE "data_source_accesses" DROP CONSTRAINT "data_source_accesses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "data_source_ownership" DROP CONSTRAINT "data_source_ownership_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_user_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_admins" DROP CONSTRAINT "organization_admins_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_admins" DROP CONSTRAINT "organization_admins_user_id_fkey";

-- DropForeignKey
ALTER TABLE "superusers" DROP CONSTRAINT "superusers_user_id_fkey";

-- DropIndex
DROP INDEX "organization_admins_organization_id_key";

-- DropIndex
DROP INDEX "organization_admins_user_id_key";

-- AddForeignKey
ALTER TABLE "superusers" ADD CONSTRAINT "superusers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_admins" ADD CONSTRAINT "organization_admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_admins" ADD CONSTRAINT "organization_admins_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_source_accesses" ADD CONSTRAINT "data_source_accesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_source_ownership" ADD CONSTRAINT "data_source_ownership_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
