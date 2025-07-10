-- CreateTable
CREATE TABLE "AuthSessions" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "AuthSessions_pkey" PRIMARY KEY ("pkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthSessions_sessionId_id_key" ON "AuthSessions"("sessionId", "id");
