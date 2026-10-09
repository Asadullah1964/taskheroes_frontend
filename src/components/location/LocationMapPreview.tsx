"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Compass,
} from "lucide-react";
import {
  calculateDistance,
  formatDistance,
  Coordinates,
  matchCityFromText,
  getCurrentPosition,
} from "@/utils/location";

interface LocationMapPreviewProps {
  location: string;
  coordinates?: Coordinates | null;
  title?: string;
}

export default function LocationMapPreview({
  location,
  coordinates,
  title = "Task Location",
}: LocationMapPreviewProps) {
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [resolvedCoords, setResolvedCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    let target = coordinates;
    if (!target || (!target.lat && !target.lng)) {
      const match = matchCityFromText(location);
      if (match) {
        target = { lat: match.lat, lng: match.lng };
      }
    }
    setResolvedCoords(target || null);
  }, [location, coordinates]);

  const handleCalculateDistance = async () => {
    try {
      const pos = await getCurrentPosition();
      setUserCoords(pos);

      if (resolvedCoords) {
        const d = calculateDistance(pos.lat, pos.lng, resolvedCoords.lat, resolvedCoords.lng);
        setDistance(d);
      }
    } catch (e) {
      console.warn("Could not get position for distance preview", e);
    }
  };

  const mapQuery = resolvedCoords
    ? `${resolvedCoords.lat},${resolvedCoords.lng}`
    : encodeURIComponent(location);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const osmUrl = resolvedCoords
    ? `https://www.openstreetmap.org/?mlat=${resolvedCoords.lat}&mlon=${resolvedCoords.lng}#map=14/${resolvedCoords.lat}/${resolvedCoords.lng}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(location)}`;

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-950 dark:text-neutral-100">
              {title}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Local service area
            </p>
          </div>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-xl bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          <span>Open Maps</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Styled Location Pin Canvas / Map Mockup */}
      <div className="relative mt-3 h-36 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-100 p-4 dark:from-neutral-800 dark:via-neutral-850 dark:to-neutral-800">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, #666 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />

        {/* Pulse radar rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-24 w-24 animate-ping rounded-full bg-blue-500/15" />
            <div className="absolute h-16 w-16 rounded-full border border-blue-400/30 bg-blue-500/10 dark:border-blue-400/20" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Location pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 text-xs font-medium text-neutral-800 backdrop-blur-sm dark:bg-neutral-900/90 dark:text-neutral-200">
          <span className="truncate max-w-[200px]">{location}</span>
          {distance !== null ? (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
              {formatDistance(distance)}
            </span>
          ) : (
            <button
              onClick={handleCalculateDistance}
              className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline dark:text-blue-400"
            >
              <Navigation className="h-3 w-3" />
              <span>Check distance</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
