/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `MenuSize` table. All the data in the column will be lost.
  - You are about to drop the `ContactForm` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[menuItemId,size]` on the table `MenuSize` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `menuItemId` to the `MenuSize` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `size` on the `MenuSize` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SizeOption" AS ENUM ('small', 'large');

-- DropForeignKey
ALTER TABLE "MenuSize" DROP CONSTRAINT "MenuSize_itemId_fkey";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "updatedAt",
ADD COLUMN     "ingredients" TEXT[];

-- AlterTable
ALTER TABLE "MenuSize" DROP COLUMN "itemId",
ADD COLUMN     "menuItemId" INTEGER NOT NULL,
DROP COLUMN "size",
ADD COLUMN     "size" "SizeOption" NOT NULL;

-- DropTable
DROP TABLE "ContactForm";

-- CreateIndex
CREATE UNIQUE INDEX "MenuSize_menuItemId_size_key" ON "MenuSize"("menuItemId", "size");

-- AddForeignKey
ALTER TABLE "MenuSize" ADD CONSTRAINT "MenuSize_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
