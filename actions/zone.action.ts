"use server";

import prisma from "@/lib/prisma";
import { DangerLevel, DisasterType, ZoneStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

export async function createZone(data: FormData) {
  try {
    const geoJson = JSON.parse(data.get("geoJson") as string);

    const zone = await prisma.zone.create({
      data: {
        name: data.get("name") as string,
        description: data.get("description") as string,
        status: data.get("status") as ZoneStatus,
        geoJson,
        disasterType: data.get("disasterType") as DisasterType,
        dangerLevel: data.get("dangerLevel") as DangerLevel,
        discussion: {
          create: {
            content: `Discussion for zone ${data.get("name")} \n ${data.get(
              "description"
            )}`,
          },
        },
      },
    });

    // ✅ Find affected user locations
    const userLocations = await prisma.userLocation.findMany();
    const affected: { zoneId: number; userLocationId: number }[] = [];

    userLocations.forEach((loc) => {
      const locPoint = point([loc.longitude, loc.latitude]);
      if (booleanPointInPolygon(locPoint, geoJson)) {
        affected.push({ zoneId: zone.id, userLocationId: loc.id });
      }
    });

    if (affected.length > 0) {
      await prisma.affectedUserLocation.createMany({ data: affected });
    }

    revalidatePath("/");
    return zone;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create zone");
  }
}

export async function getZones() {
  try {
    return await prisma.zone.findMany({
      include: { affectedUserLocations: true },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getActiveZones() {
  try {
    return await prisma.zone.findMany({
      where: { status: "ACTIVE" },
    });
  } catch (error) {
    console.log(error);
  }
}
