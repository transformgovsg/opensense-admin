-- CreateTable
CREATE TABLE "data_source_ownership" (
    "id" TEXT NOT NULL,
    "data_source_id" INTEGER NOT NULL,
    "organization_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_source_ownership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "data_source_ownership_data_source_id_idx" ON "data_source_ownership" USING HASH ("data_source_id");

-- CreateIndex
CREATE INDEX "data_source_ownership_organization_id_idx" ON "data_source_ownership" USING HASH ("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "data_source_ownership_data_source_id_organization_id_key" ON "data_source_ownership"("data_source_id", "organization_id");

-- AddForeignKey
ALTER TABLE "data_source_ownership" ADD CONSTRAINT "data_source_ownership_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
