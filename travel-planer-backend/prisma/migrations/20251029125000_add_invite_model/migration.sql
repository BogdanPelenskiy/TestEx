/*
  Warnings:

  - The primary key for the `Invite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Invite` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdById` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Collaboration` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expiresAt` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'OWNER', 'COLLABORATOR');

-- DropForeignKey
ALTER TABLE "public"."Collaboration" DROP CONSTRAINT "Collaboration_tripId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Collaboration" DROP CONSTRAINT "Collaboration_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invite" DROP CONSTRAINT "Invite_tripId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Place" DROP CONSTRAINT "Place_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Place" DROP CONSTRAINT "Place_tripId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Trip" DROP CONSTRAINT "Trip_createdById_fkey";

-- DropIndex
DROP INDEX "public"."Place_tripId_dayNumber_idx";

-- AlterTable
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_pkey",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "token" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Invite_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "createdById",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "createdById",
DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "public"."Collaboration";

-- CreateTable
CREATE TABLE "_TripCollaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TripCollaborators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TripCollaborators_B_index" ON "_TripCollaborators"("B");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TripCollaborators" ADD CONSTRAINT "_TripCollaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TripCollaborators" ADD CONSTRAINT "_TripCollaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
