import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { LocationCard } from "./location-card";
import { AddLocationBanner } from "./new/add-location";

export default async function LocationsPage() {
  const locations = await prisma.userLocation.findMany();

  return (
    <main className="p-4 space-y-4 rounded-none">
      <SiteHeader title="Locations" />
      <AddLocationBanner />
      <section>
        {locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center px-4">
            <h2 className="text-2xl font-semibold mb-4">No Locations Found</h2>
            <p className="text-gray-600 mb-6">
              You havent added any locations yet. Start by adding a new
              location.
            </p>
            <Button>Add Location</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 p-4">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
