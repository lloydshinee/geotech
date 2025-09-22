"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

function getZoneColor(level: string) {
  switch (level) {
    case "low":
      return "green";
    case "medium":
      return "orange";
    case "high":
      return "red";
    default:
      return "blue";
  }
}

export default function AdminMap() {
  const mapRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (mapRef.current) return;
    const tubodBounds: L.LatLngBoundsExpression = [
      [8.142, 124.026],
      [8.292, 124.306],
    ];
    const map = L.map("map", {
      center: [8.21337, 124.242851],
      zoom: 14,
      maxBounds: tubodBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 13,
      maxZoom: 18,
    });
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
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
