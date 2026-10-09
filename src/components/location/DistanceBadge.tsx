"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import {
  calculateDistance,
  formatDistance,
  Coordinates,
  matchCityFromText,
} from "@/utils/location";

interface DistanceBadgeProps {
  location: string;
  coordinates?: Coordinates | null;
  userCoordinates?: Coordinates | null;
  className?: string;
}

export default function DistanceBadge({
  location,
  coordinates,
  userCoordinates,
  className = "",
}: DistanceBadgeProps) {
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!userCoordinates) {
      setDistance(null);
      return;
    }

    let targetCoords = coordinates;

    if (!targetCoords || (!targetCoords.lat && !targetCoords.lng)) {
      const matched = matchCityFromText(location);
      if (matched) {
        targetCoords = { lat: matched.lat, lng: matched.lng };
      }
    }

    if (targetCoords && targetCoords.lat && targetCoords.lng) {
      const d = calculateDistance(
        userCoordinates.lat,
        userCoordinates.lng,
        targetCoords.lat,
        targetCoords.lng
      );
      setDistance(d);
    } else {
      setDistance(null);
    }
  }, [location, coordinates, userCoordinates]);

  if (distance === null) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 ${className}`}
      >
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{location}</span>
      </span>
    );
  }

  const isNearby = distance <= 5;
  const isModerate = distance > 5 && distance <= 25;

  const toneClass = isNearby
    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
    : isModerate
    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
    : "bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneClass} ${className}`}
      title={`${location} - approx. ${formatDistance(distance)}`}
    >
      <MapPin className="h-3 w-3 shrink-0" />
      <span className="truncate max-w-[120px]">{location}</span>
      <span className="opacity-80">({formatDistance(distance)})</span>
    </span>
  );
}
