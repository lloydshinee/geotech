"use client";

import { Facility, Zone } from "@prisma/client";
import dynamic from "next/dynamic";

const AdminMap = dynamic(() => import("./AdminMap"), {
  ssr: false, // disable server-side rendering
});

export default function Admin({
  facilities,
  zones,
}: {
  facilities: Facility[];
  zones: Zone[];
}) {
  const activeZones = zones.filter((zone) => zone.status === "ACTIVE");

  return <AdminMap facilities={facilities} zones={activeZones} />;
}
