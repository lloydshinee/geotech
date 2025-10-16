"use client";

import { AlertTriangle, MapPin, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FullUserLocation } from "@/lib/types";

export function AffectedLocationAlert({
  affectedLocations,
}: {
  affectedLocations: FullUserLocation[];
}) {
  // flatten all affected zones from all user locations
  const activeWarnings = affectedLocations.flatMap((loc) =>
    loc.affectedUserLocations
      .filter((a) => a.zone.status === "ACTIVE") // ✅ only show active zones
      .map((a) => ({
        locationName: loc.name,
        zoneName: a.zone.name,
        zoneDescription: a.zone.description,
        disasterType: a.zone.disasterType,
        dangerLevel: a.zone.dangerLevel,
        zoneId: a.zone.id,
      }))
  );

  if (activeWarnings.length === 0) return null;

  return (
    <div className="space-y-4">
      {activeWarnings.map((warning, idx) => (
        <Card
          key={idx}
          className="border-red-500 bg-red-50 dark:bg-red-950/20 dark:border-red-800"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-red-700 dark:text-red-400">
                  Warning at {warning.locationName}
                </CardTitle>
              </div>
              <Badge
                variant="destructive"
                className="uppercase tracking-wide text-xs"
              >
                {warning.dangerLevel}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3 h-3" />
              <span>{warning.zoneName}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">{warning.zoneDescription}</p>
            <div className="flex justify-between items-center">
              <Badge
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                <ShieldAlert className="w-3 h-3" />
                {warning.disasterType}
              </Badge>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  // 🔥 Optional: center the map on this zone
                  console.log("View on Map", warning.zoneId);
                }}
              >
                View on Map
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
