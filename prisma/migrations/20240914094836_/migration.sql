-- AlterTable
ALTER TABLE "data_source_ownership" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "superusers" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
