-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "record_id" INTEGER NOT NULL,
    "record_title" VARCHAR(128),
    "difference" JSON,
    "action" VARCHAR(128) NOT NULL,
    "resource" VARCHAR(128) NOT NULL,
    "user_id" VARCHAR(128) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at");
