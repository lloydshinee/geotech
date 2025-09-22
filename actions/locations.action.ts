"use server";

import prisma from "@/lib/prisma";

export async function createLocation(data: FormData) {
  try {
    await prisma.userLocation.create({
      data: {
        name: data.get("name") as string,
        description: data.get("description") as string,
        latitude: parseFloat(data.get("latitude") as string),
        longitude: parseFloat(data.get("longitude") as string),
        userId: parseInt(data.get("userId") as string, 10),
      },
    });
  } catch (error) {
    console.log(error);
  }
}
