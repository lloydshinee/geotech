import { Prisma } from "@prisma/client";

export type DiscussionWithZone = Prisma.DiscussionGetPayload<{
  include: {
    comments: true;
    zone: {
      include: {
        affectedUserLocations: true;
      };
    };
  };
}>;
