"use client";

import { useState } from "react";
import {
  MapPin,
  Navigation,
  Loader2,
  Check,
} from "lucide-react";
import {
  POPULAR_CITIES,
  getCurrentPosition,
  reverseGeocode,
  Coordinates,
} from "@/utils/location";

interface LocationPickerProps {
  value: string;
  onChange: (location: string, coordinates?: Coordinates | null, city?: string) => void;
  placeholder?: string;
  error?: string;
}

export default function LocationPicker({
  value,
  onChange,
  placeholder = "e.g., Bandra West, Mumbai",
  error,
}: LocationPickerProps) {
  const [detecting, setDetecting] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string>("");

  const handleDetectLocation = async () => {
    try {
      setDetecting(true);
      const coords = await getCurrentPosition();
      const geo = await reverseGeocode(coords.lat, coords.lng);

      const locationStr = geo.displayName || `${geo.city}`;
      setDetectedCity(geo.city);
      onChange(locationStr, coords, geo.city);
    } catch (err: any) {
      console.warn("Location error:", err);
      // Fallback
      alert(
        err?.message?.includes("denied")
          ? "Location access was denied. Please select your city from the quick options below."
          : "Could not auto-detect location. Please pick a city or type manually."
      );
    } finally {
      setDetecting(false);
    }
  };

  const handleSelectCity = (cityName: string, lat: number, lng: number) => {
    setDetectedCity(cityName);
    onChange(cityName, { lat, lng }, cityName);
  };

  return (
    <div className="space-y-3">
      <div className="relative flex items-center">
        <MapPin className="absolute left-3.5 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-2xl border bg-white py-3 pl-10 pr-32 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 ${
            error
              ? "border-red-300 ring-4 ring-red-100 dark:border-red-500/40 dark:ring-red-500/10"
              : "border-neutral-200 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10 dark:border-neutral-800 dark:focus:border-neutral-400 dark:focus:ring-white/10"
          }`}
        />

        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={detecting}
          className="absolute right-2 flex items-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:bg-neutral-200 disabled:opacity-60 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          title="Use browser GPS to detect your location"
        >
          {detecting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Detecting...</span>
            </>
          ) : (
            <>
              <Navigation className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Auto-detect</span>
            </>
          )}
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Quick city suggestions */}
      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Popular Cities
        </p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_CITIES.slice(0, 8).map((city) => {
            const isSelected = value.toLowerCase().includes(city.name.toLowerCase());
            return (
              <button
                key={city.name}
                type="button"
                onClick={() => handleSelectCity(city.name, city.lat, city.lng)}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  isSelected
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                {isSelected && <Check className="h-3 w-3" />}
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
