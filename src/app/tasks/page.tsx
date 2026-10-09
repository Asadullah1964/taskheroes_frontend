"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Navigation,
  SlidersHorizontal,
  X,
  Sparkles,
  RotateCcw,
  Check,
} from "lucide-react";
import { getTasks } from "@/services/task";
import TaskCard from "@/components/tasks/TaskCard";
import { Task } from "@/types/task";
import {
  Coordinates,
  getCurrentPosition,
  reverseGeocode,
  calculateDistance,
  POPULAR_CITIES,
  matchCityFromText,
} from "@/utils/location";

const CATEGORIES = [
  "All",
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Delivery",
  "Painting",
  "Gardening",
  "Moving",
  "Tutoring",
  "Computer Repair",
  "Home Repair",
];

const RADIUS_OPTIONS = [
  { label: "Any Distance", value: 0 },
  { label: "Within 5 km", value: 5 },
  { label: "Within 10 km", value: 10 },
  { label: "Within 25 km", value: 25 },
  { label: "Within 50 km", value: 50 },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [locationQuery, setLocationQuery] = useState("");
  const [maxRadius, setMaxRadius] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"newest" | "nearest" | "budget_high" | "budget_low">("newest");

  // Geolocation
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [userCity, setUserCity] = useState<string>("");
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocation = async () => {
    try {
      setDetectingLocation(true);
      const coords = await getCurrentPosition();
      setUserCoords(coords);

      const geo = await reverseGeocode(coords.lat, coords.lng);
      setUserCity(geo.city);
      setLocationQuery(geo.city);
      setSortBy("nearest");
    } catch (err) {
      console.warn("Could not get user location:", err);
      alert("Could not detect your GPS location. Please choose a city below.");
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setLocationQuery("");
    setMaxRadius(0);
    setSortBy("newest");
  };

  // Filter and Sort Tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (t) => t.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Location query
    if (locationQuery.trim()) {
      const locQ = locationQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.location.toLowerCase().includes(locQ) ||
          (t.city && t.city.toLowerCase().includes(locQ))
      );
    }

    // Distance Radius filter (if userCoords available)
    if (userCoords && maxRadius > 0) {
      result = result.filter((t) => {
        let taskCoords = t.coordinates;
        if (!taskCoords || (!taskCoords.lat && !taskCoords.lng)) {
          const match = matchCityFromText(t.location);
          if (match) taskCoords = { lat: match.lat, lng: match.lng };
        }
        if (!taskCoords || !taskCoords.lat || !taskCoords.lng) return true;

        const dist = calculateDistance(
          userCoords.lat,
          userCoords.lng,
          taskCoords.lat,
          taskCoords.lng
        );
        return dist <= maxRadius;
      });
    }

    // Sorting
    if (sortBy === "nearest" && userCoords) {
      result.sort((a, b) => {
        const getDist = (task: Task) => {
          let coords = task.coordinates;
          if (!coords || (!coords.lat && !coords.lng)) {
            const match = matchCityFromText(task.location);
            if (match) coords = { lat: match.lat, lng: match.lng };
          }
          if (!coords || !coords.lat) return 99999;
          return calculateDistance(userCoords.lat, userCoords.lng, coords.lat, coords.lng);
        };
        return getDist(a) - getDist(b);
      });
    } else if (sortBy === "budget_high") {
      result.sort((a, b) => b.budget - a.budget);
    } else if (sortBy === "budget_low") {
      result.sort((a, b) => a.budget - b.budget);
    } else {
      // Default: newest
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [tasks, search, selectedCategory, locationQuery, maxRadius, sortBy, userCoords]);

  return (
    <main className="min-h-screen bg-neutral-50 pb-16 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Local Task Marketplace</span>
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-100 sm:text-4xl">
                Browse Nearby Tasks
              </h1>

              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400 sm:text-base">
                Discover tasks posted by clients near you, compare budgets, and apply with confidence through TaskHeroes Escrow.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold shadow-sm transition ${
                  userCoords
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-850 dark:text-neutral-200"
                }`}
              >
                <Navigation className={`h-3.5 w-3.5 ${userCoords ? "text-emerald-600" : "text-blue-600"}`} />
                <span>
                  {detectingLocation
                    ? "Locating GPS..."
                    : userCity
                    ? `📍 Near ${userCity}`
                    : "Use My Location"}
                </span>
              </button>

              <Link
                href="/tasks/create"
                className="rounded-2xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                + Post a Task
              </Link>
            </div>
          </div>

          {/* Search & Location Filter Bar */}
          <div className="mt-8 grid gap-3 md:grid-cols-12">
            {/* Search Input */}
            <div className="relative md:col-span-5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks by keywords..."
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 py-3 pl-10 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-900/10 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-400"
              />
            </div>

            {/* Location Search Input */}
            <div className="relative md:col-span-4">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="City, area, or region..."
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 py-3 pl-10 pr-8 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-900/10 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-400"
              />
              {locationQuery && (
                <button
                  onClick={() => setLocationQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 py-3 px-4 text-sm font-medium text-neutral-800 outline-none transition focus:border-neutral-900 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-200"
              >
                <option value="newest">Newest First</option>
                {userCoords && <option value="nearest">📍 Nearest to Me</option>}
                <option value="budget_high">Highest Budget</option>
                <option value="budget_low">Lowest Budget</option>
              </select>
            </div>
          </div>

          {/* Quick City Selector Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-neutral-400 mr-1">
              Popular Cities:
            </span>
            {POPULAR_CITIES.slice(0, 7).map((city) => {
              const active = locationQuery.toLowerCase().includes(city.name.toLowerCase());
              return (
                <button
                  key={city.name}
                  onClick={() => setLocationQuery(active ? "" : city.name)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>

          {/* Radius selector (if userCoords available) */}
          {userCoords && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                Distance Radius:
              </span>
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMaxRadius(opt.value)}
                  className={`rounded-xl px-2.5 py-1 text-xs font-medium transition ${
                    maxRadius === opt.value
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Category Chips Scroll */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-semibold transition ${
                    isSelected
                      ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Results Counter & Active Filter Tags */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-2">
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
            Showing{" "}
            <span className="font-bold text-neutral-900 dark:text-neutral-100">
              {filteredAndSortedTasks.length}
            </span>{" "}
            {filteredAndSortedTasks.length === 1 ? "task" : "tasks"}
          </p>

          {(search || selectedCategory !== "All" || locationQuery || maxRadius > 0) && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* Tasks Grid */}
        <section className="mt-4">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <TaskCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-2xl dark:bg-neutral-800">
                🔍
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-100">
                No matching tasks found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                We couldn't find any tasks matching your filters. Try adjusting your search keywords, location radius, or category.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={handleClearFilters}
                  className="rounded-2xl border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  Clear All Filters
                </button>

                <Link
                  href="/tasks/create"
                  className="rounded-2xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                >
                  + Post a New Task
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredAndSortedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  userCoordinates={userCoords}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function TaskCardSkeleton() {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="animate-pulse">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="mt-2 h-4 w-1/3 rounded bg-neutral-100 dark:bg-neutral-800" />
          </div>
          <div className="h-7 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-3.5 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-3.5 w-5/6 rounded bg-neutral-100 dark:bg-neutral-800" />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
        </div>

        <div className="mt-5 h-10 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
  );
}