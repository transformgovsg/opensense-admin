/*
  Warnings:

  - You are about to drop the `DataSource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DataSource" DROP CONSTRAINT "DataSource_orgId_fkey";

-- DropForeignKey
ALTER TABLE "DataSourceAccess" DROP CONSTRAINT "DataSourceAccess_dataSourceId_fkey";

-- DropTable
DROP TABLE "DataSource";
