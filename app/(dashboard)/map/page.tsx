"use client";

import { SiteHeader } from "@/components/site-header";
import dynamic from "next/dynamic";

const AdminMap = dynamic(() => import("./AdminMap"), {
  ssr: false, // disable server-side rendering
});

export default function MapPage() {
  return (
    <main>
      <SiteHeader title="Map" />
      <AdminMap />{" "}
    </main>
  );
}
