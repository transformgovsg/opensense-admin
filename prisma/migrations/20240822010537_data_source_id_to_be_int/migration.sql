/*
  Warnings:

  - Changed the type of `dataSourceId` on the `DataSourceAccess` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DataSourceAccess" DROP COLUMN "dataSourceId",
ADD COLUMN     "dataSourceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DataSourceAccess_dataSourceId_userId_key" ON "DataSourceAccess"("dataSourceId", "userId");
