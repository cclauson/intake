-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- Seed data
INSERT INTO "Item" ("name") VALUES ('Item 1'), ('Item 2'), ('Item 3')
ON CONFLICT DO NOTHING;
