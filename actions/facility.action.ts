"use server";

import prisma from "@/lib/prisma";
import { FacilityType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createFacility(data: FormData) {
  try {
    await prisma.facility.create({
      data: {
        name: data.get("name") as string,
        type: data.get("type") as FacilityType,
        latitude: Number(data.get("latitude")),
        longitude: Number(data.get("longitude")),
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}

export async function getFacilities() {
  try {
    return await prisma.facility.findMany();
  } catch (error) {
    console.log(error);
  }
}
