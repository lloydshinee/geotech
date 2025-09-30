"use client";

import { UserLocation, Facility, Zone } from "@prisma/client";
import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet.fullscreen/Control.FullScreen.css";
import "leaflet.fullscreen";

declare module "leaflet" {
  namespace control {
    function fullscreen(options?: any): L.Control;
  }
}

export default function UserMap({
  locations,
  facilities,
  zones,
}: {
  locations: UserLocation[];
  facilities: Facility[];
  zones: Zone[];
}) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const tubodBounds: L.LatLngBoundsExpression = [
        [8.142, 124.026],
        [8.292, 124.306],
      ];

      const map = L.map("user-map", {
        center: [8.21337, 124.242851],
        zoom: 14,
        maxBounds: tubodBounds,
        maxBoundsViscosity: 1.0,
        minZoom: 13,
        maxZoom: 18,
      });
      L.control.fullscreen().addTo(map);
      mapRef.current = map;

      // Basemap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
    }

    const map = mapRef.current!;
    const markers: L.Marker[] = [];

    // ✅ Default icon
    const DefaultIcon = L.icon({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // ✅ User locations
    locations.forEach((loc) => {
      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: DefaultIcon,
      }).addTo(map);
      marker.bindPopup(`
        <strong>${loc.name}</strong><br/>
        ${loc.description ?? ""}
      `);
      markers.push(marker);
    });

    // ✅ Facilities (blue pulsing marker)
    facilities.forEach((f) => {
      const marker = L.marker([f.latitude, f.longitude], {
        icon: L.divIcon({
          html: `<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>`,
          className: "custom-marker",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      }).addTo(map);

      marker.bindPopup(`<strong>${f.name}</strong><br/>${f.type}`);
      markers.push(marker);
    });

    // ✅ Zones (colored polygons)
    zones.forEach((z) => {
      L.geoJSON(z.geoJson as any, {
        style: {
          color:
            z.dangerLevel === "HIGH"
              ? "red"
              : z.dangerLevel === "MEDIUM"
              ? "orange"
              : "green",
          weight: 2,
          fillOpacity: 0.3,
        },
      })
        .addTo(map)
        .bindPopup(
          `<strong>${z.name}</strong><br/>${z.disasterType} (${z.dangerLevel})`
        );
    });

    // ✅ Fit map bounds to all features
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }

    // ✅ Ensure map resizes correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [locations, facilities, zones]);

  return (
    <div
      id="user-map"
      className="w-full h-[90vh]" // or h-screen if you want fullscreen
    />
  );
}
