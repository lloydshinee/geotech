"use client";

import { UserLocation } from "@prisma/client";
import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export default function UserMap({ locations }: { locations: UserLocation[] }) {
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
      mapRef.current = map;

      // Basemap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
    }

    const map = mapRef.current!;
    const markers: L.Marker[] = [];

    // ✅ Define icon properly
    const DefaultIcon = L.icon({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

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

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }

    // ✅ Ensure Leaflet recalculates map size
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [locations]);

  return (
    <div
      id="user-map"
      className="w-full h-[90vh]" // or h-screen if you want fullscreen
    />
  );
}
