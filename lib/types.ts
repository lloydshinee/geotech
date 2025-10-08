import { Prisma } from "@prisma/client";

export type DiscussionWithZone = Prisma.DiscussionGetPayload<{
  include: {
    zone: {
      include: {
        affectedUserLocations: true;
      };
    };
  };
}>;
