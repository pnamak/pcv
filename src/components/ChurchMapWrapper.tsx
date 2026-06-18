"use client";

import dynamic from "next/dynamic";
import type { MapChurch } from "@/components/ChurchMap";

const ChurchMap = dynamic(
  () => import("@/components/ChurchMap").then((m) => m.ChurchMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl bg-pcv-cream-dark text-sm text-gray-500">
        Loading map...
      </div>
    ),
  }
);

interface Props {
  churches: MapChurch[];
  height?: string;
  className?: string;
}

export function ChurchMapWrapper({ churches, height = "400px", className }: Props) {
  return (
    <div className={className}>
      <ChurchMap churches={churches} height={height} />
    </div>
  );
}
