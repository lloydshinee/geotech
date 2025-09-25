"use client";

import { getUserLocations } from "@/actions/locations.action";
import { SiteHeader } from "@/components/site-header";
import { UserLocation } from "@prisma/client";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const UserMap = dynamic(() => import("./UserMap"), {
  ssr: false, // disable server-side rendering
});

export default function MapPage() {
  const [locations, setLocations] = useState<UserLocation[]>([]);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchLocations = async () => {
      const locations = await getUserLocations(session.user.id);
      setLocations(locations);
    };

    fetchLocations();
  }, [status, session?.user?.id]);

  return (
    <main>
      <SiteHeader title="Map" />
      <UserMap locations={locations} />
    </main>
  );
}
