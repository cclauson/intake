-- DropTable
DROP TABLE IF EXISTS "Item";

-- CreateEnum
CREATE TYPE "NutritionSource" AS ENUM ('verified', 'estimated', 'unknown');

-- CreateTable
CREATE TABLE "NutritionalDataItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUnit" TEXT NOT NULL,
    "defaultServings" TEXT[],
    "calories" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fiber" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "sodium" DOUBLE PRECISION,
    "source" "NutritionSource" NOT NULL DEFAULT 'unknown',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionalDataItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealSchema" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealSchemaIngredient" (
    "id" TEXT NOT NULL,
    "mealSchemaId" TEXT NOT NULL,
    "nutritionalDataItemId" TEXT NOT NULL,
    "defaultQuantity" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealSchemaIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealLogEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mealSchemaId" TEXT,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeOfDay" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealLogItem" (
    "id" TEXT NOT NULL,
    "mealLogEntryId" TEXT NOT NULL,
    "nutritionalDataItemId" TEXT,
    "quantity" DOUBLE PRECISION,
    "name" TEXT,
    "calories" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fiber" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "sodium" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealLogItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NutritionalDataItem_userId_idx" ON "NutritionalDataItem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionalDataItem_userId_name_key" ON "NutritionalDataItem"("userId", "name");

-- CreateIndex
CREATE INDEX "MealSchema_userId_idx" ON "MealSchema"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MealSchema_userId_name_key" ON "MealSchema"("userId", "name");

-- CreateIndex
CREATE INDEX "MealSchemaIngredient_mealSchemaId_idx" ON "MealSchemaIngredient"("mealSchemaId");

-- CreateIndex
CREATE UNIQUE INDEX "MealSchemaIngredient_mealSchemaId_nutritionalDataItemId_key" ON "MealSchemaIngredient"("mealSchemaId", "nutritionalDataItemId");

-- CreateIndex
CREATE INDEX "MealLogEntry_userId_loggedAt_idx" ON "MealLogEntry"("userId", "loggedAt");

-- CreateIndex
CREATE INDEX "MealLogEntry_userId_idx" ON "MealLogEntry"("userId");

-- CreateIndex
CREATE INDEX "MealLogItem_mealLogEntryId_idx" ON "MealLogItem"("mealLogEntryId");

-- AddForeignKey
ALTER TABLE "MealSchemaIngredient" ADD CONSTRAINT "MealSchemaIngredient_mealSchemaId_fkey" FOREIGN KEY ("mealSchemaId") REFERENCES "MealSchema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealSchemaIngredient" ADD CONSTRAINT "MealSchemaIngredient_nutritionalDataItemId_fkey" FOREIGN KEY ("nutritionalDataItemId") REFERENCES "NutritionalDataItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLogEntry" ADD CONSTRAINT "MealLogEntry_mealSchemaId_fkey" FOREIGN KEY ("mealSchemaId") REFERENCES "MealSchema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLogItem" ADD CONSTRAINT "MealLogItem_mealLogEntryId_fkey" FOREIGN KEY ("mealLogEntryId") REFERENCES "MealLogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLogItem" ADD CONSTRAINT "MealLogItem_nutritionalDataItemId_fkey" FOREIGN KEY ("nutritionalDataItemId") REFERENCES "NutritionalDataItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
