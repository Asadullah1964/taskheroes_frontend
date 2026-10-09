export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CityData {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export const POPULAR_CITIES: CityData[] = [
  { name: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777 },
  { name: "Delhi NCR", state: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Chandigarh", state: "Punjab/Haryana", lat: 30.7333, lng: 76.7794 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
];

// Haversine formula to compute great-circle distance in kilometers
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  return `${km.toFixed(1)} km away`;
}

// Browser Geolocation
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

// Reverse Geocoding with OpenStreetMap Nominatim (Free, no key needed)
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ city: string; area: string; displayName: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );

    if (!res.ok) throw new Error("Failed to reverse geocode");

    const data = await res.json();
    const addr = data.address || {};

    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.suburb ||
      addr.county ||
      addr.state_district ||
      "";

    const area =
      addr.neighbourhood ||
      addr.suburb ||
      addr.road ||
      addr.residential ||
      "";

    const displayName = [area, city, addr.state].filter(Boolean).join(", ");

    return {
      city: city || "Current Location",
      area,
      displayName: displayName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    };
  } catch (error) {
    // Fallback: match nearest city
    const nearest = findNearestCity(lat, lng);
    return {
      city: nearest?.name || "Local Area",
      area: "",
      displayName: nearest ? `${nearest.name}, ${nearest.state}` : `${lat.toFixed(2)}, ${lng.toFixed(2)}`,
    };
  }
}

export function findNearestCity(lat: number, lng: number): CityData | null {
  let closest: CityData | null = null;
  let minDistance = Infinity;

  for (const city of POPULAR_CITIES) {
    const dist = calculateDistance(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  return closest;
}

export function matchCityFromText(text: string): CityData | null {
  if (!text) return null;
  const lower = text.toLowerCase();
  return (
    POPULAR_CITIES.find(
      (c) =>
        lower.includes(c.name.toLowerCase()) ||
        lower.includes(c.state.toLowerCase())
    ) || null
  );
}
