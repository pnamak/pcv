"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export interface MapChurch {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  presbytery?: string | null;
  pastorName?: string | null;
  memberCount?: number | null;
}

interface ChurchMapProps {
  churches: MapChurch[];
  height?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function ChurchMap({
  churches,
  height = "400px",
  onLocationSelect,
  selectedLocation,
}: ChurchMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-pcv-cream-dark text-sm text-gray-500"
        style={{ height }}
      >
        Loading map...
      </div>
    );
  }

  const center: [number, number] =
    churches.length > 0
      ? [churches[0].latitude, churches[0].longitude]
      : [-16.5, 167.5];

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height, width: "100%" }}
      className="rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {onLocationSelect && <MapClickHandler onLocationSelect={onLocationSelect} />}
      {churches.map((church) => (
        <Marker key={church.id} position={[church.latitude, church.longitude]}>
          <Popup>
            <strong>{church.name}</strong>
            {church.presbytery && (
              <p className="text-xs text-gray-600">{church.presbytery}</p>
            )}
            {church.pastorName && (
              <p className="text-xs">Pastor: {church.pastorName}</p>
            )}
            {church.memberCount != null && (
              <p className="text-xs">{church.memberCount} members</p>
            )}
          </Popup>
        </Marker>
      ))}
      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
      )}
    </MapContainer>
  );
}
