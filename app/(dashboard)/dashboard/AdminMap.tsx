"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

// 🎨 function to get color by danger level
function getZoneColor(level: string) {
  switch (level) {
    case "low":
      return "green";
    case "medium":
      return "orange";
    case "high":
      return "red";
    default:
      return "blue"; // fallback
  }
}

export default function AdminMap() {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return; // ✅ prevent re-init

    // 📍 Tubod bounding box
    const tubodBounds: L.LatLngBoundsExpression = [
      [8.142, 124.026], // southwest
      [8.292, 124.306], // northeast
    ];

    const map = L.map("map", {
      center: [8.21337, 124.242851],
      zoom: 14,
      maxBounds: tubodBounds, // 🚧 restrict to Tubod
      maxBoundsViscosity: 1.0, // prevent panning out
      minZoom: 13, // optional: limit zoom out
      maxZoom: 18, // optional: limit zoom in
    });

    mapRef.current = map;

    // Base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Enable drawing only polygons
    const drawControl = new (L as any).Control.Draw({
      draw: {
        marker: false,
        circle: true,
        rectangle: true,
        polyline: true,
        polygon: true,
      },
      edit: { featureGroup: drawnItems },
    });
    map.addControl(drawControl);

    // When polygon is created
    map.on((L as any).Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;

      const dangerLevel = prompt(
        "Enter danger level (low, medium, high):",
        "low"
      )?.toLowerCase();

      layer.setStyle({
        color: getZoneColor(dangerLevel || "low"),
        fillColor: getZoneColor(dangerLevel || "low"),
        fillOpacity: 0.5,
      });

      drawnItems.addLayer(layer);

      const geojson = layer.toGeoJSON();
      geojson.properties = { dangerLevel };
      console.log("Polygon GeoJSON:", geojson);
    });
  }, []);

  return <div id="map" className="h-screen w-full" />;
}
