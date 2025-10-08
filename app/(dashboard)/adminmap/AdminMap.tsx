"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "leaflet.fullscreen/Control.FullScreen.css";
import "leaflet.fullscreen";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Prisma types
import { Facility, Zone } from "@prisma/client";
import { createFacility } from "@/actions/facility.action";
import { createZone } from "@/actions/zone.action";
import AdminMapForm from "./admin-map-form";
import { getDisasterIconHTML, getFacilityIconHTML } from "@/lib/icons";

export default function AdminMap({
  facilities,
  zones,
}: {
  facilities: Facility[];
  zones: Zone[];
}) {
  const mapRef = useRef<L.Map | null>(null);
  const [drawnGeoJson, setDrawnGeoJson] = useState<any>(null);
  const [drawnLatLng, setDrawnLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Dialog + form state
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"facility" | "zone" | "">("");
  const [formData, setFormData] = useState<any>({});
  const [lastLayer, setLastLayer] = useState<L.Layer | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const tubodBounds: L.LatLngBoundsExpression = [
        [8.142, 124.026],
        [8.292, 124.306],
      ];

      const map = L.map("admin-map", {
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

      // Fullscreen
      L.control.fullscreen().addTo(map);

      // Draw controls
      const drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          circle: false,
          circlemarker: false,
        },
      });
      map.addControl(drawControl);

      // Handle created shapes
      map.on(L.Draw.Event.CREATED, function (e: any) {
        const layer = e.layer;
        map.addLayer(layer);

        if (e.layerType === "marker") {
          const { lat, lng } = layer.getLatLng();
          setDrawnLatLng({ lat, lng });
          setDrawnGeoJson(null);
        } else {
          const geoJson = layer.toGeoJSON();
          setDrawnGeoJson(geoJson);
          setDrawnLatLng(null);
        }

        setLastLayer(layer); // save reference
        setOpen(true); // open dialog
      });
    }

    const map = mapRef.current!;

    // Render existing facilities
    facilities.forEach((f) => {
      L.marker([f.latitude, f.longitude], {
        icon: L.divIcon({
          html: getFacilityIconHTML(f.type),
          className: "custom-marker", // optional wrapper class
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      })
        .addTo(map)
        .bindPopup(`<strong>${f.name}</strong><br/>${f.type}`);
    });

    zones.forEach((z) => {
      // Determine color from danger level
      const color =
        z.dangerLevel === "HIGH"
          ? "red"
          : z.dangerLevel === "MEDIUM"
          ? "orange"
          : "green";

      // Create the GeoJSON layer
      const layer = L.geoJSON(z.geoJson as any, {
        style: { color },
      }).addTo(map);

      // Build the popup HTML
      const popupHTML = `
    <div class="p-1 text-sm">
      <div class="flex items-center gap-2">
        ${getDisasterIconHTML(z.disasterType)}
        <strong>${z.name}</strong>
      </div>
      <div class="mt-1">
        <span class="font-semibold">Disaster:</span> ${z.disasterType}<br/>
        <span class="font-semibold">Danger:</span>
        <span class="${
          z.dangerLevel === "HIGH"
            ? "text-red-600"
            : z.dangerLevel === "MEDIUM"
            ? "text-orange-500"
            : "text-green-600"
        }">
          ${z.dangerLevel}
        </span>
      </div>
    </div>
  `;

      layer.bindPopup(popupHTML);
    });
  }, [facilities, zones]);

  const handleSubmit = async () => {
    try {
      if (type === "facility" && drawnLatLng) {
        const facilityData = new FormData();
        facilityData.append("name", formData.name);
        facilityData.append("type", formData.type);
        facilityData.append("latitude", drawnLatLng.lat.toString());
        facilityData.append("longitude", drawnLatLng.lng.toString());

        await createFacility(facilityData);
        toast.success(`${formData.name} facility has been added.`);
      }

      if (type === "zone" && drawnGeoJson) {
        const zoneData = new FormData();
        zoneData.append("name", formData.name);
        zoneData.append("description", formData.description);
        zoneData.append("status", "ACTIVE");
        zoneData.append("disasterType", formData.disasterType);
        zoneData.append("dangerLevel", formData.dangerLevel);
        zoneData.append("geoJson", JSON.stringify(drawnGeoJson));

        await createZone(zoneData);

        // Remove the temporary blue layer
        if (lastLayer && mapRef.current) {
          mapRef.current.removeLayer(lastLayer);
        }

        // Add with your custom style
        L.geoJSON(drawnGeoJson as any, {
          style: {
            color:
              formData.dangerLevel === "HIGH"
                ? "red"
                : formData.dangerLevel === "MEDIUM"
                ? "orange"
                : "green",
          },
        })
          .addTo(mapRef.current!)
          .bindPopup(
            `<strong>${formData.name}</strong><br/>${formData.disasterType} (${formData.dangerLevel})`
          );

        toast.success(`${formData.name} zone has been added.`);
      }

      setOpen(false);
      setFormData({});
      setType("");
    } catch (err) {
      toast.error("Error saving data. Please try again.");
      console.log(err);
    }
  };

  return (
    <>
      <div id="admin-map" className="w-full h-[70vh]" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {type === "zone" ? "Add Zone" : "Add Facility"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Select onValueChange={(v: any) => setType(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facility">Facility</SelectItem>
                <SelectItem value="zone">Zone</SelectItem>
              </SelectContent>
            </Select>

            {type && (
              <AdminMapForm
                formType={type}
                defaultValues={formData} // supports editing
                onChange={(data) => setFormData(data)}
              />
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
