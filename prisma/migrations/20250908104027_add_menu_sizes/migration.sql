/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `ingredients` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `MenuItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "imageUrl",
DROP COLUMN "ingredients",
DROP COLUMN "price";

-- CreateTable
CREATE TABLE "MenuSize" (
    "id" SERIAL NOT NULL,
    "size" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "MenuSize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MenuSize" ADD CONSTRAINT "MenuSize_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
