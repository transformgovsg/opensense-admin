-- AlterTable
ALTER TABLE "DataSource" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "DataSource" ADD CONSTRAINT "DataSource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
