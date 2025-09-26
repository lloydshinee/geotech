"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function updateLocation(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);

  try {
    const location = await prisma.userLocation.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        latitude,
        longitude,
      },
    });
    return location;
  } catch (error) {
    console.error("Error updating location:", error);
    throw new Error("Failed to update location");
  }
}

export async function getUserLocations(userId: number) {
  try {
    return await prisma.userLocation.findMany({ where: { userId } });
  } catch (error) {
    console.log(error);
    throw new Error("Error");
  }
}

export async function deleteUserLocation(locationId: number) {
  try {
    await prisma.userLocation.delete({ where: { id: locationId } });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}

export async function getUserLocation(locationId: number) {
  try {
    return await prisma.userLocation.findUnique({ where: { id: locationId } });
  } catch (error) {
    console.log(error);
    throw new Error("Error");
  }
}
