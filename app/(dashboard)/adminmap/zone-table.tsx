"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ZoneTable({ zones }: { zones: any[] }) {
  return (
    <div className="rounded-2xl border shadow-sm bg-card m-4">
      <Table>
        <TableCaption>A list of all created zones.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Disaster Type</TableHead>
            <TableHead>Danger Level</TableHead>
            <TableHead>Affected Locations</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {zones?.map((zone) => (
            <TableRow key={zone.id}>
              <TableCell className="font-medium">{zone.name}</TableCell>
              <TableCell>{zone.description ?? "-"}</TableCell>
              <TableCell>
                <Badge variant="outline">{zone.disasterType}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    zone.dangerLevel === "HIGH"
                      ? "bg-red-500 text-white"
                      : zone.dangerLevel === "MEDIUM"
                      ? "bg-orange-500 text-white"
                      : "bg-green-500 text-white"
                  }
                >
                  {zone.dangerLevel}
                </Badge>
              </TableCell>
              <TableCell>{zone.affectedUserLocations?.length ?? 0}</TableCell>
              <TableCell>
                <Badge
                  variant={zone.status === "ACTIVE" ? "default" : "secondary"}
                >
                  {zone.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
