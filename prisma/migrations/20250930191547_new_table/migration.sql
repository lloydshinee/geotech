-- CreateTable
CREATE TABLE "AffectedUserLocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "zoneId" INTEGER NOT NULL,
    "userLocationId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AffectedUserLocation_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AffectedUserLocation_userLocationId_fkey" FOREIGN KEY ("userLocationId") REFERENCES "UserLocation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AffectedUserLocation_zoneId_userLocationId_key" ON "AffectedUserLocation"("zoneId", "userLocationId");
