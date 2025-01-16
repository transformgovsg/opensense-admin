/*
  Warnings:

  - You are about to drop the column `userId` on the `DataSource` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DataSource" DROP CONSTRAINT "DataSource_userId_fkey";

-- AlterTable
ALTER TABLE "DataSource" DROP COLUMN "userId";
