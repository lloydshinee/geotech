"use client";

import dynamic from "next/dynamic";

const AdminMap = dynamic(() => import("./AdminMap"), {
  ssr: false, // disable server-side rendering
});

export default function Page() {
  return <AdminMap />;
}
