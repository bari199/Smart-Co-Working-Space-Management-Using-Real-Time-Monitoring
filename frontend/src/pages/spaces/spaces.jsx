import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

import SpaceGrid from "../../components/space/SpaceGrid";
import Loading from "../../components/common/Loading";
import { getSpaces } from "../services/spaceService";

const Spaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [spaceType, setSpaceType] = useState("all");
  const [location, setLocation] = useState("all");
  const [price, setPrice] = useState("all");
  const [amenity, setAmenity] = useState("all");

  useEffect(() => {
    const loadSpaces = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSpaces();

        setSpaces(data?.spaces || data?.data || data || []);
      } catch (error) {
        setError(error?.message || "Failed to load workspaces.");
      } finally {
        setLoading(false);
      }
    };

    loadSpaces();
  }, []);

  // Unique locations
  const locations = useMemo(() => {
    const values = spaces.map((space) => space?.location).filter(Boolean);

    return [...new Set(values)];
  }, [spaces]);

  // Unique amenities
  const amenities = useMemo(() => {
    const values = spaces.flatMap((space) =>
      Array.isArray(space?.amenities) ? space.amenities : [],
    );

    return [...new Set(values.map((item) => item.trim()))];
  }, [spaces]);

  // Filter spaces
  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        space?.name?.toLowerCase().includes(searchValue) ||
        space?.description?.toLowerCase().includes(searchValue) ||
        space?.location?.toLowerCase().includes(searchValue);

      const matchesType =
        spaceType === "all" || space?.workspaceType === spaceType;

      const matchesLocation =
        location === "all" || space?.location === location;

      const spacePrice = Number(space?.price || 0);

      let matchesPrice = true;

      if (price === "under-500") {
        matchesPrice = spacePrice < 500;
      }

      if (price === "500-1000") {
        matchesPrice = spacePrice >= 500 && spacePrice <= 1000;
      }

      if (price === "1000-2000") {
        matchesPrice = spacePrice > 1000 && spacePrice <= 2000;
      }

      if (price === "above-2000") {
        matchesPrice = spacePrice > 2000;
      }

      const spaceAmenities = Array.isArray(space?.amenities)
        ? space.amenities.map((item) => item.trim().toLowerCase())
        : [];

      const matchesAmenity =
        amenity === "all" || spaceAmenities.includes(amenity.toLowerCase());

      return (
        matchesSearch &&
        matchesType &&
        matchesLocation &&
        matchesPrice &&
        matchesAmenity
      );
    });
  }, [spaces, search, spaceType, location, price, amenity]);

  const clearFilters = () => {
    setSearch("");
    setSpaceType("all");
    setLocation("all");
    setPrice("all");
    setAmenity("all");
  };

  const hasFilters =
    search ||
    spaceType !== "all" ||
    location !== "all" ||
    price !== "all" ||
    amenity !== "all";

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="mb-7">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--secondary)]">
          Find your workspace
        </p>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] md:text-4xl">
              Explore Workspaces
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Discover comfortable and flexible workspaces that fit your needs.
            </p>
          </div>

          {/* Result Count */}
          {!loading && !error && (
            <p className="text-xs font-medium text-[var(--muted)]">
              {filteredSpaces.length}{" "}
              {filteredSpaces.length === 1 ? "workspace" : "workspaces"} found
            </p>
          )}
        </div>
      </div>

      {/* =====================================================
          SEARCH + FILTERS
      ====================================================== */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workspace by name, location or description..."
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-10 pr-10 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--text)]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Space Type */}
          <div className="relative">
            <SlidersHorizontal
              size={15}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--muted)]"
            />

            <select
              value={spaceType}
              onChange={(e) => setSpaceType(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-9 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="all">All Space Types</option>

              <option value="private cabin">Private Cabin</option>

              <option value="shared desk">Shared Desk</option>

              <option value="meeting room">Meeting Room</option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin
              size={15}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--primary)]"
            />

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-9 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="all">All Locations</option>

              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
          </div>

          {/* Price */}
          <div className="relative">
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 pr-9 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="all">All Prices</option>

              <option value="under-500">Under ₹500 / day</option>

              <option value="500-1000">₹500 – ₹1,000 / day</option>

              <option value="1000-2000">₹1,000 – ₹2,000 / day</option>

              <option value="above-2000">Above ₹2,000 / day</option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
          </div>

          {/* Amenities */}
          <div className="relative">
            <select
              value={amenity}
              onChange={(e) => setAmenity(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 pr-9 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="all">All Amenities</option>

              {amenities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
          </div>
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
            <div className="flex flex-wrap items-center gap-2">
              {search && (
                <span className="rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--primary)]">
                  Search: {search}
                </span>
              )}

              {spaceType !== "all" && (
                <span className="rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-[11px] font-medium capitalize text-[var(--primary)]">
                  {spaceType}
                </span>
              )}

              {location !== "all" && (
                <span className="rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--primary)]">
                  {location}
                </span>
              )}

              {price !== "all" && (
                <span className="rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--primary)]">
                  Price filter
                </span>
              )}

              {amenity !== "all" && (
                <span className="rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--primary)]">
                  {amenity}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--primary)]"
            >
              <X size={13} />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : filteredSpaces.length > 0 ? (
        <SpaceGrid spaces={filteredSpaces} />
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-14 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)]/10">
            <Search size={20} className="text-[var(--primary)]" />
          </div>

          <h3 className="mt-4 text-base font-bold text-[var(--text)]">
            No workspaces found
          </h3>

          <p className="mx-auto mt-1.5 max-w-md text-sm text-[var(--muted)]">
            Try changing your search or filters to find available workspaces.
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default Spaces;
