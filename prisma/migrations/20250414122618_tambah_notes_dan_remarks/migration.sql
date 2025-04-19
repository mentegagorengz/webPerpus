/*
  Warnings:

  - You are about to drop the column `type` on the `Penelitian` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Penelitian" DROP COLUMN "type",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "availability" SET DEFAULT 'Tersedia';
