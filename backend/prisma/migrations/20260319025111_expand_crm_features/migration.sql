/*
  Warnings:

  - You are about to drop the column `sent` on the `broadcasts` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "bot_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bot_name" TEXT NOT NULL,
    "short_description" TEXT,
    "full_description" TEXT,
    "welcome_message" TEXT,
    "manager_chat_id" TEXT,
    "telegram_username" TEXT,
    "phone" TEXT,
    "order_template" TEXT,
    "city" TEXT DEFAULT 'Ростов-на-Дону',
    "delivery_price_outside" INTEGER DEFAULT 500,
    "delivery_price_inside" INTEGER DEFAULT 0,
    "currency" TEXT DEFAULT '₽',
    "min_order_amount" INTEGER DEFAULT 0,
    "is_bot_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_broadcasts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "message" TEXT NOT NULL,
    "target" TEXT NOT NULL DEFAULT 'all',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" DATETIME
);
INSERT INTO "new_broadcasts" ("created_at", "id", "message", "sent_at") SELECT "created_at", "id", "message", "sent_at" FROM "broadcasts";
DROP TABLE "broadcasts";
ALTER TABLE "new_broadcasts" RENAME TO "broadcasts";
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telegram_id" TEXT NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("created_at", "first_name", "id", "last_name", "phone", "telegram_id", "username") SELECT "created_at", "first_name", "id", "last_name", "phone", "telegram_id", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
