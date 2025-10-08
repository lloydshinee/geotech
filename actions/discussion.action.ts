"use server"

import prisma from "@/lib/prisma";

export async function getDiscussions() {
  try {
    return await prisma.discussion.findMany({orderBy: {createdAt: "desc"}, include: {zone: {
      include: {affectedUserLocations: true}
    }}})
  } catch (error) {
    console.log(error);
  }
}