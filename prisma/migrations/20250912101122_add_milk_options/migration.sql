-- CreateEnum
CREATE TYPE "MilkOption" AS ENUM ('regular', 'oat', 'almond', 'soy');

-- AlterEnum
ALTER TYPE "SizeOption" ADD VALUE 'single';

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "hasMilk" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "MilkUpcharge" (
    "id" SERIAL NOT NULL,
    "milkType" "MilkOption" NOT NULL,
    "upcharge" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MilkUpcharge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MilkUpcharge_milkType_key" ON "MilkUpcharge"("milkType");
