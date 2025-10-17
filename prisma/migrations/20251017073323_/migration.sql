/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "phoneNumber" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AffectedUserLocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "zoneId" INTEGER NOT NULL,
    "status" TEXT,
    "isNotifiend" BOOLEAN NOT NULL DEFAULT false,
    "userLocationId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AffectedUserLocation_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AffectedUserLocation_userLocationId_fkey" FOREIGN KEY ("userLocationId") REFERENCES "UserLocation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AffectedUserLocation" ("createdAt", "id", "status", "userLocationId", "zoneId") SELECT "createdAt", "id", "status", "userLocationId", "zoneId" FROM "AffectedUserLocation";
DROP TABLE "AffectedUserLocation";
ALTER TABLE "new_AffectedUserLocation" RENAME TO "AffectedUserLocation";
CREATE UNIQUE INDEX "AffectedUserLocation_zoneId_userLocationId_key" ON "AffectedUserLocation"("zoneId", "userLocationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
