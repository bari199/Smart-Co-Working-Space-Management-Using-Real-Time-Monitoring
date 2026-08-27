import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

import {
  getSearchOptions,
  getSpaces,
  searchSpaces,
} from "../services/spaceService";

const Spaces = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /*
  ========================================================
  URL SEARCH VALUES
  ========================================================
  */

  const urlLocation = searchParams.get("location") || "";
  const urlWorkspaceType = searchParams.get("workspaceType") || "";

  /*
  ========================================================
  STATES
  ========================================================
  */

  const [spaces, setSpaces] = useState([]);

  const [locations, setLocations] = useState([]);
  const [workspaceTypes, setWorkspaceTypes] = useState([]);

  const [location, setLocation] = useState(urlLocation);
  const [workspaceType, setWorkspaceType] = useState(urlWorkspaceType);

  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const [error, setError] = useState("");

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  /*
  ========================================================
  FETCH SEARCH OPTIONS
  ========================================================
  */

  useEffect(() => {
    const fetchSearchOptions = async () => {
      try {
        setOptionsLoading(true);

        const response = await getSearchOptions();

        if (response?.success) {
          setLocations(response.locations || []);
          setWorkspaceTypes(response.workspaceTypes || []);
        }
      } catch (error) {
        console.error("Failed to fetch search options:", error);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchSearchOptions();
  }, []);

  /*
  ========================================================
  SYNC LOCAL FILTERS WITH URL
  ========================================================
  */

  useEffect(() => {
    setLocation(urlLocation);
    setWorkspaceType(urlWorkspaceType);
  }, [urlLocation, urlWorkspaceType]);

  /*
  ========================================================
  FETCH SPACES
  ========================================================
  */

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setLoading(true);
        setError("");

        let response;

        /*
        ----------------------------------------------------
        No filters
        ----------------------------------------------------
        */

        if (!urlLocation && !urlWorkspaceType) {
          response = await getSpaces();
        } else {
          /*
        ----------------------------------------------------
        Search filters
        ----------------------------------------------------
        */
          response = await searchSpaces({
            location: urlLocation,
            workspaceType: urlWorkspaceType,
          });
        }

        if (response?.success) {
          setSpaces(response.spaces || []);
        } else {
          setSpaces([]);

          setError(response?.message || "Failed to load workspaces.");
        }
      } catch (error) {
        console.error("Fetch spaces error:", error);

        setSpaces([]);

        setError(
          error?.message || "Something went wrong while loading workspaces.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, [urlLocation, urlWorkspaceType]);

  /*
  ========================================================
  APPLY FILTERS
  ========================================================
  */

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (workspaceType) {
      params.set("workspaceType", workspaceType);
    }

    setSearchParams(params);

    setMobileFiltersOpen(false);
  };

  /*
  ========================================================
  CLEAR FILTERS
  ========================================================
  */

  const handleClearFilters = () => {
    setLocation("");
    setWorkspaceType("");

    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  /*
  ========================================================
  ACTIVE FILTER COUNT
  ========================================================
  */

  const activeFilterCount = (urlLocation ? 1 : 0) + (urlWorkspaceType ? 1 : 0);

  /*
  ========================================================
  FORMAT WORKSPACE TYPE
  ========================================================
  */

  const formatWorkspaceType = (type) => {
    if (!type) return "Workspace";

    return type
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  /*
  ========================================================
  DISPLAY SPACES
  ========================================================
  */

  const displayedSpaces = useMemo(() => {
    return spaces;
  }, [spaces]);

  /*
  ========================================================
  LOADING
  ========================================================
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        {/* Header Skeleton */}

        <section className="border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="container-width px-4 py-10 sm:px-6 lg:px-8">
            <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-muted)]" />

            <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-lg bg-[var(--surface-muted)]" />

            <div className="mt-3 h-5 w-[500px] max-w-full animate-pulse rounded bg-[var(--surface-muted)]" />
          </div>
        </section>

        {/* Cards Skeleton */}

        <div className="container-width px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="h-52 animate-pulse bg-[var(--surface-muted)]" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--surface-muted)]" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--surface-muted)]" />

                  <div className="h-4 w-full animate-pulse rounded bg-[var(--surface-muted)]" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--surface-muted)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /*
  ========================================================
  MAIN UI
  ========================================================
  */

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container-width px-4 py-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}

          <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
            <Link to="/" className="transition hover:text-[var(--primary)]">
              Home
            </Link>

            <span>/</span>

            <span className="text-[var(--text)]">Workspaces</span>
          </div>

          {/* Heading */}

          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
                Find your workspace
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                Explore flexible coworking spaces, private offices and meeting
                rooms that fit the way you work.
              </p>
            </div>

            {/* Result Count */}

            <div className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surfaceAlt)] px-4 py-2 text-sm font-semibold text-[var(--text)]">
              {displayedSpaces.length}{" "}
              {displayedSpaces.length === 1 ? "workspace" : "workspaces"}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SEARCH / FILTER BAR
      ================================================== */}

      <section className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur">
        <div className="container-width px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Location */}

            <div className="flex min-h-[48px] flex-1 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4">
              <MapPin size={18} className="shrink-0 text-[var(--secondary)]" />

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Location
                </p>

                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={optionsLoading}
                  className="mt-0.5 w-full bg-transparent text-sm font-medium text-[var(--text)] outline-none"
                >
                  <option value="">
                    {optionsLoading ? "Loading locations..." : "Any location"}
                  </option>

                  {locations.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Workspace Type */}

            <div className="flex min-h-[48px] flex-1 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4">
              <Building2
                size={18}
                className="shrink-0 text-[var(--secondary)]"
              />

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Space Type
                </p>

                <select
                  value={workspaceType}
                  onChange={(e) => setWorkspaceType(e.target.value)}
                  disabled={optionsLoading}
                  className="mt-0.5 w-full bg-transparent text-sm font-medium text-[var(--text)] outline-none"
                >
                  <option value="">
                    {optionsLoading ? "Loading space types..." : "Any space"}
                  </option>

                  {workspaceTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatWorkspaceType(type)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Apply */}

            <button
              type="button"
              onClick={handleApplyFilters}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)]"
            >
              <Search size={17} />
              Search
            </button>

            {/* Clear */}

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surfaceAlt)]"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>

          {/* Active Filters */}

          {activeFilterCount > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[var(--muted)]">
                Active filters:
              </span>

              {urlLocation && (
                <button
                  type="button"
                  onClick={() => {
                    setLocation("");

                    const params = new URLSearchParams(searchParams);

                    params.delete("location");

                    setSearchParams(params);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]"
                >
                  <MapPin size={12} />
                  {urlLocation}
                  <X size={12} />
                </button>
              )}

              {urlWorkspaceType && (
                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceType("");

                    const params = new URLSearchParams(searchParams);

                    params.delete("workspaceType");

                    setSearchParams(params);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]"
                >
                  <Building2 size={12} />
                  {formatWorkspaceType(urlWorkspaceType)}
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <main className="container-width px-4 py-8 sm:px-6 lg:px-8">
        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==================================================
            NO RESULTS
        ================================================== */}

        {!error && displayedSpaces.length === 0 && (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surfaceAlt)] text-[var(--secondary)]">
              <Search size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[var(--text)]">
              No workspaces found
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              We couldn't find any available workspaces matching your current
              search. Try another location or workspace type.
            </p>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)]"
              >
                <X size={16} />
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* ==================================================
            RESULTS
        ================================================== */}

        {!error && displayedSpaces.length > 0 && (
          <>
            {/* Result Header */}

            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--muted)]">
                  Showing{" "}
                  <span className="font-bold text-[var(--text)]">
                    {displayedSpaces.length}
                  </span>{" "}
                  available{" "}
                  {displayedSpaces.length === 1 ? "workspace" : "workspaces"}
                </p>
              </div>

              {/* Mobile filter */}

              <button
                type="button"
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)] lg:hidden"
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1.5 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown
                  size={14}
                  className={
                    mobileFiltersOpen
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />
              </button>
            </div>

            {/* Mobile filter panel */}

            {mobileFiltersOpen && (
              <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 lg:hidden">
                <div className="grid gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[var(--text)]">
                      Location
                    </label>

                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] outline-none"
                    >
                      <option value="">Any location</option>

                      {locations.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[var(--text)]">
                      Space Type
                    </label>

                    <select
                      value={workspaceType}
                      onChange={(e) => setWorkspaceType(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] outline-none"
                    >
                      <option value="">Any space</option>

                      {workspaceTypes.map((type) => (
                        <option key={type} value={type}>
                          {formatWorkspaceType(type)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleApplyFilters}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white"
                    >
                      <Check size={16} />
                      Apply
                    </button>

                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text)]"
                    >
                      <X size={16} />
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                SPACE GRID
            ================================================== */}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {displayedSpaces.map((space) => {
                const image =
                  space?.image ||
                  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80";

                const ownerName = space?.owner?.name || "Workspace Owner";

                return (
                  <article
                    key={space._id}
                    className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image */}

                    <Link
                      to={`/spaces/${space._id}`}
                      className="relative block h-56 overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={space?.name || "Workspace"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80";
                        }}
                      />

                      {/* Image Overlay */}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Availability */}

                      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-green-700 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        Available
                      </div>

                      {/* Type */}

                      {space?.workspaceType && (
                        <div className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-bold capitalize text-white backdrop-blur">
                          {formatWorkspaceType(space.workspaceType)}
                        </div>
                      )}
                    </Link>

                    {/* Card Content */}

                    <div className="p-5">
                      {/* Name */}

                      <Link
                        to={`/spaces/${space._id}`}
                        className="line-clamp-1 text-lg font-bold tracking-tight text-[var(--text)] transition hover:text-[var(--primary)]"
                      >
                        {space?.name || "Unnamed Workspace"}
                      </Link>

                      {/* Location */}

                      <div className="mt-2 flex items-center gap-1.5 text-sm text-[var(--muted)]">
                        <MapPin size={14} className="shrink-0" />

                        <span className="line-clamp-1">
                          {space?.location || "Location unavailable"}
                        </span>
                      </div>

                      {/* Description */}

                      {space?.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                          {space.description}
                        </p>
                      )}

                      {/* Details */}

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-[var(--surfaceAlt)] px-3 py-2">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">
                            Capacity
                          </p>

                          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
                            <Users
                              size={13}
                              className="text-[var(--secondary)]"
                            />
                            {space?.capacity || 0} people
                          </div>
                        </div>

                        <div className="rounded-lg bg-[var(--surfaceAlt)] px-3 py-2">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">
                            Area
                          </p>

                          <p className="mt-1 text-xs font-semibold text-[var(--text)]">
                            {space?.area || 0} sq ft
                          </p>
                        </div>
                      </div>

                      {/* Amenities */}

                      {Array.isArray(space?.amenities) &&
                        space.amenities.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {space.amenities.slice(0, 3).map((amenity) => (
                              <span
                                key={amenity}
                                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-medium text-[var(--muted)]"
                              >
                                {amenity}
                              </span>
                            ))}

                            {space.amenities.length > 3 && (
                              <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-semibold text-[var(--muted)]">
                                +{space.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                      {/* Divider */}

                      <div className="my-4 h-px bg-[var(--border)]" />

                      {/* Bottom */}

                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-medium text-[var(--muted)]">
                            Starting from
                          </p>

                          <div className="mt-0.5 flex items-baseline gap-1">
                            <span className="text-xl font-bold text-[var(--text)]">
                              ₹
                              {Number(space?.price || 0).toLocaleString(
                                "en-IN",
                              )}
                            </span>

                            <span className="text-[10px] text-[var(--muted)]">
                              / day
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/spaces/${space._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
                        >
                          View Details
                          <ArrowRight size={14} />
                        </Link>
                      </div>

                      {/* Owner */}

                      <p className="mt-3 text-[10px] text-[var(--muted)]">
                        Listed by{" "}
                        <span className="font-semibold text-[var(--text)]">
                          {ownerName}
                        </span>
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Spaces;
