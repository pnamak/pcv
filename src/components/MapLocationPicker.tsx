"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ChurchMap = dynamic(
  () => import("@/components/ChurchMap").then((m) => m.ChurchMap),
  { ssr: false }
);

interface MapPickerProps {
  defaultLat?: number | null;
  defaultLng?: number | null;
}

export function MapLocationPicker({ defaultLat, defaultLng }: MapPickerProps) {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(
    defaultLat != null && defaultLng != null
      ? { lat: defaultLat, lng: defaultLng }
      : null
  );

  return (
    <div>
      <p className="mb-2 text-sm text-gray-600">
        Click on the map to set church location
      </p>
      <ChurchMap
        churches={[]}
        height="300px"
        onLocationSelect={(lat, lng) => setLocation({ lat, lng })}
        selectedLocation={location}
      />
      <input type="hidden" name="latitude" value={location?.lat ?? ""} />
      <input type="hidden" name="longitude" value={location?.lng ?? ""} />
      {location && (
        <p className="mt-2 text-xs text-gray-500">
          Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
}
