-- CreateTable
CREATE TABLE "Pet" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'cat',
    "color" TEXT NOT NULL DEFAULT '#FFFFFF',
    "accessories" JSONB NOT NULL DEFAULT '[]',
    "mood" TEXT NOT NULL DEFAULT 'happy',
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pet_userId_key" ON "Pet"("userId");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
