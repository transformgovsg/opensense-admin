-- CreateIndex
CREATE INDEX "users_email_idx" ON "users" USING HASH ("email");

-- CreateIndex
CREATE INDEX "users_remote_id_idx" ON "users" USING HASH ("remote_id");
