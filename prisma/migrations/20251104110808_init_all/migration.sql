/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `themeId` on the `Place` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Place" DROP CONSTRAINT "Place_themeId_fkey";

-- AlterTable
ALTER TABLE "Badge" ALTER COLUMN "name_en" DROP NOT NULL,
ALTER COLUMN "criteriaJson" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "createdAt",
ALTER COLUMN "title_en" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "themeId",
ALTER COLUMN "name_en" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Theme" ALTER COLUMN "name_en" DROP NOT NULL;
