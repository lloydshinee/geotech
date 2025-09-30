"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

type FormType = "facility" | "zone";

interface AdminMapFormProps {
  formType: FormType;
  defaultValues?: any; // pre-fill for editing
  onChange: (data: any) => void; // bubble up state
}

export default function AdminMapForm({
  formType,
  defaultValues = {},
  onChange,
}: AdminMapFormProps) {
  const [formData, setFormData] = useState<any>(defaultValues);

  // Update parent whenever formData changes
  useEffect(() => {
    onChange(formData);
  }, [formData]);

  return (
    <div className="space-y-2">
      {formType === "facility" && (
        <>
          <Input
            placeholder="Facility Name"
            defaultValue={defaultValues?.name || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, name: e.target.value }))
            }
          />
          <Select
            defaultValue={defaultValues?.type}
            onValueChange={(v) =>
              setFormData((prev: any) => ({ ...prev, type: v }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Facility Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOSPITAL">Hospital</SelectItem>
              <SelectItem value="CLINIC">Clinic</SelectItem>
              <SelectItem value="FIRESTATION">Fire Station</SelectItem>
              <SelectItem value="POLICE">Police</SelectItem>
              <SelectItem value="EVAC_CENTER">Evacuation Center</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}

      {formType === "zone" && (
        <>
          <Input
            placeholder="Zone Name"
            defaultValue={defaultValues?.name || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            placeholder="Description"
            defaultValue={defaultValues?.description || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <Select
            defaultValue={defaultValues?.disasterType}
            onValueChange={(v) =>
              setFormData((prev: any) => ({ ...prev, disasterType: v }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Disaster Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FLOOD">Flood</SelectItem>
              <SelectItem value="FIRE">Fire</SelectItem>
              <SelectItem value="EARTHQUAKE">Earthquake</SelectItem>
              <SelectItem value="LANDSLIDE">Landslide</SelectItem>
              <SelectItem value="TYPHOON">Typhoon</SelectItem>
            </SelectContent>
          </Select>
          <Select
            defaultValue={defaultValues?.dangerLevel}
            onValueChange={(v) =>
              setFormData((prev: any) => ({ ...prev, dangerLevel: v }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Danger Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
}
