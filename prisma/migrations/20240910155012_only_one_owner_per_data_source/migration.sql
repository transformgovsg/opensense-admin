/*
  Warnings:

  - A unique constraint covering the columns `[data_source_id]` on the table `data_source_ownership` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "data_source_ownership_data_source_id_organization_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "data_source_ownership_data_source_id_key" ON "data_source_ownership"("data_source_id");
