import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Clock3,
  CheckCircle2,
  MapPin,
  Search,
  Bell,
  CreditCard,
  Building2,
  ChevronRight,
  CircleUserRound,
} from "lucide-react";

import { useAuth } from "../../context/authContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserDashboard = () => {
  const { user } = useAuth();

  const displayName = user?.name || user?.fullName || "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  /*
   * Demo dashboard data.
   * Later these can come directly from your backend APIs.
   */

  const stats = [
    {
      title: "Total Bookings",
      value: "12",
      description: "All workspace bookings",
      icon: CalendarDays,
      trend: "+2 this month",
      href: "/dashboard/bookings",
    },
    {
      title: "Upcoming",
      value: "3",
      description: "Confirmed upcoming bookings",
      icon: Clock3,
      trend: "Next 7 days",
      href: "/dashboard/bookings",
    },
    {
      title: "Inquiries",
      value: "5",
      description: "Conversations with owners",
      icon: MessageSquare,
      trend: "2 awaiting reply",
      href: "/dashboard/inquiries",
    },
    {
      title: "Saved Spaces",
      value: "8",
      description: "Workspaces you liked",
      icon: Building2,
      trend: "Explore more",
      href: "/spaces",
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      title: "Modern Executive Workspace",
      location: "Downtown Business District",
      date: "Aug 28, 2026",
      time: "09:00 AM – 05:00 PM",
      status: "Confirmed",
      price: "$120",
    },
    {
      id: 2,
      title: "Creative Meeting Studio",
      location: "Central Avenue",
      date: "Sep 02, 2026",
      time: "10:00 AM – 02:00 PM",
      status: "Pending",
      price: "$85",
    },
    {
      id: 3,
      title: "Private Team Office",
      location: "Tech Park",
      date: "Sep 08, 2026",
      time: "09:00 AM – 06:00 PM",
      status: "Confirmed",
      price: "$160",
    },
  ];

  const recentInquiries = [
    {
      id: 1,
      title: "Private meeting room availability",
      space: "Downtown Business District",
      time: "2 hours ago",
      status: "Owner replied",
    },
    {
      id: 2,
      title: "Monthly office pricing",
      space: "Tech Park",
      time: "Yesterday",
      status: "Awaiting reply",
    },
    {
      id: 3,
      title: "Weekend workspace access",
      space: "Central Avenue",
      time: "2 days ago",
      status: "Owner replied",
    },
  ];

  const activities = [
    {
      title: "Booking confirmed",
      description: "Modern Executive Workspace",
      time: "Today, 10:42 AM",
      icon: CheckCircle2,
    },
    {
      title: "Inquiry sent",
      description: "Private Team Office",
      time: "Yesterday, 04:20 PM",
      icon: MessageSquare,
    },
    {
      title: "Payment completed",
      description: "Creative Meeting Studio",
      time: "Aug 21, 2026",
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-w-0 space-y-6 pb-8 sm:space-y-8 sm:pb-10">
      {/* =====================================================
          HERO / WELCOME
      ====================================================== */}

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:rounded-3xl"
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[var(--primary)]/10 blur-3xl sm:h-64 sm:w-64" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[var(--primary)]/5 blur-3xl sm:h-72 sm:w-72" />

        <div className="relative flex min-w-0 flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          {/* Welcome content */}
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <Avatar className="hidden h-12 w-12 shrink-0 border-2 border-[var(--primary)]/20 sm:flex sm:h-14 sm:w-14">
              <AvatarImage src={user?.profilePicture} alt={displayName} />

              <AvatarFallback className="bg-[var(--primary)] text-base font-bold text-white sm:text-lg">
                {initials || <CircleUserRound size={22} />}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--primary)] sm:text-sm">
                <Sparkles size={15} className="shrink-0" />

                <span className="truncate">Workspace Dashboard</span>
              </div>

              <h1 className="break-words text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl lg:text-4xl">
                Welcome back, {displayName}!
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                Manage your bookings, discover new workspaces, track inquiries,
                and keep everything organized from one place.
              </p>
            </div>
          </div>

          {/* Hero actions */}
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row lg:w-auto lg:shrink-0">
            <Button
              asChild
              variant="outline"
              className="h-10 w-full rounded-xl border-[var(--border)] px-4 sm:w-auto"
            >
              <Link
                to="/dashboard/inquiries"
                className="flex w-full items-center justify-center gap-2"
              >
                <MessageSquare size={17} className="shrink-0" />

                <span className="truncate">Inquiries</span>
              </Link>
            </Button>

            <Button
              asChild
              className="h-10 w-full rounded-xl bg-[var(--primary)] px-4 text-white hover:bg-[var(--primary-dark)] sm:w-auto"
            >
              <Link
                to="/spaces"
                className="flex w-full items-center justify-center gap-2"
              >
                <Search size={17} className="shrink-0" />

                <span className="truncate">Find a Workspace</span>
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* =====================================================
          STATS
      ====================================================== */}

      <section className="min-w-0">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[var(--text)]">Overview</h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Your workspace activity at a glance.
          </p>
        </div>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.07,
                  duration: 0.4,
                }}
                className="min-w-0"
              >
                <Link to={stat.href} className="group block h-full min-w-0">
                  <Card className="h-full min-w-0 rounded-2xl border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--primary)]/40 group-hover:shadow-lg">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] sm:h-11 sm:w-11">
                          <Icon size={20} className="shrink-0" />
                        </div>

                        <ArrowRight
                          size={17}
                          className="shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary)]"
                        />
                      </div>

                      <div className="mt-4 min-w-0 sm:mt-5">
                        <p className="truncate text-sm font-medium text-[var(--muted)]">
                          {stat.title}
                        </p>

                        <span className="mt-1 block text-3xl font-bold tracking-tight text-[var(--text)]">
                          {stat.value}
                        </span>

                        <p className="mt-1 truncate text-xs text-[var(--muted)]">
                          {stat.description}
                        </p>

                        <div className="mt-3 flex min-w-0 items-center gap-1 text-xs font-semibold text-[var(--primary)] sm:mt-4">
                          <span className="min-w-0 truncate">{stat.trend}</span>

                          <ChevronRight size={13} className="shrink-0" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT GRID
      ====================================================== */}

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
        {/* ===================================================
            UPCOMING BOOKINGS
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="min-w-0"
        >
          <Card className="min-w-0 overflow-hidden rounded-2xl border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <CardHeader className="border-b border-[var(--border)] px-4 py-4 sm:px-6">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-[var(--text)]">
                    Upcoming Bookings
                  </h2>

                  <p className="mt-1 truncate text-xs text-[var(--muted)]">
                    Your next workspace reservations.
                  </p>
                </div>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="shrink-0 rounded-lg px-2.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] sm:px-3"
                >
                  <Link
                    to="/dashboard/bookings"
                    className="flex items-center gap-1.5"
                  >
                    <span>View all</span>

                    <ArrowRight size={15} className="shrink-0" />
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {upcomingBookings.map((booking, index) => (
                <Link
                  key={booking.id}
                  to="/dashboard/bookings"
                  className={`group block min-w-0 px-4 py-4 transition hover:bg-[var(--background)] sm:px-6 sm:py-5 ${
                    index !== upcomingBookings.length - 1
                      ? "border-b border-[var(--border)]"
                      : ""
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] sm:flex">
                      <CalendarDays size={20} className="shrink-0" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-[var(--text)] group-hover:text-[var(--primary)]">
                            {booking.title}
                          </h3>

                          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-[var(--muted)]">
                            <MapPin size={13} className="shrink-0" />

                            <span className="truncate">{booking.location}</span>
                          </div>
                        </div>

                        {/* Status */}
                        <Badge
                          className={`w-fit max-w-full shrink-0 rounded-full border-0 px-2.5 py-1 text-[11px] ${
                            booking.status === "Confirmed"
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
                              : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10"
                          }`}
                        >
                          {booking.status === "Confirmed" ? (
                            <CheckCircle2 size={12} className="mr-1 shrink-0" />
                          ) : (
                            <Clock3 size={12} className="mr-1 shrink-0" />
                          )}

                          <span className="truncate">{booking.status}</span>
                        </Badge>
                      </div>

                      {/* Booking meta */}
                      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--muted)] sm:gap-x-5">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <CalendarDays size={13} className="shrink-0" />

                          <span className="truncate">{booking.date}</span>
                        </span>

                        <span className="flex min-w-0 items-center gap-1.5">
                          <Clock3 size={13} className="shrink-0" />

                          <span className="truncate">{booking.time}</span>
                        </span>

                        <span className="shrink-0 font-semibold text-[var(--text)]">
                          {booking.price}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight
                      size={18}
                      className="mt-2 hidden shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary)] sm:block"
                    />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* ===================================================
            QUICK ACTIONS
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="min-w-0"
        >
          <Card className="min-w-0 rounded-2xl border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <CardHeader className="px-4 pb-3 pt-5 sm:px-6">
              <h2 className="font-semibold text-[var(--text)]">
                Quick Actions
              </h2>

              <p className="mt-1 text-xs text-[var(--muted)]">
                Common things you can do.
              </p>
            </CardHeader>

            <CardContent className="space-y-2 px-4 pb-5 sm:px-6">
              {/* Find workspace */}
              <Link
                to="/spaces"
                className="group flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] p-3 transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Search size={17} className="shrink-0" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">
                    Find a Workspace
                  </p>

                  <p className="truncate text-xs text-[var(--muted)]">
                    Explore available spaces
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className="shrink-0 text-[var(--muted)] group-hover:text-[var(--primary)]"
                />
              </Link>

              {/* Manage bookings */}
              <Link
                to="/dashboard/bookings"
                className="group flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] p-3 transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <CalendarDays size={17} className="shrink-0" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">
                    Manage Bookings
                  </p>

                  <p className="truncate text-xs text-[var(--muted)]">
                    View your reservations
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className="shrink-0 text-[var(--muted)] group-hover:text-[var(--primary)]"
                />
              </Link>

              {/* Inquiries */}
              <Link
                to="/dashboard/inquiries"
                className="group flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] p-3 transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                  <MessageSquare size={17} className="shrink-0" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">
                    Check Inquiries
                  </p>

                  <p className="truncate text-xs text-[var(--muted)]">
                    Continue owner conversations
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className="shrink-0 text-[var(--muted)] group-hover:text-[var(--primary)]"
                />
              </Link>

              {/* Notifications */}
              <Link
                to="/dashboard/notifications"
                className="group flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] p-3 transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                  <Bell size={17} className="shrink-0" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">
                    Notifications
                  </p>

                  <p className="truncate text-xs text-[var(--muted)]">
                    Check recent updates
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className="shrink-0 text-[var(--muted)] group-hover:text-[var(--primary)]"
                />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* =====================================================
          LOWER CONTENT
      ====================================================== */}

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        {/* ===================================================
            RECENT INQUIRIES
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="min-w-0"
        >
          <Card className="min-w-0 overflow-hidden rounded-2xl border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <CardHeader className="border-b border-[var(--border)] px-4 py-4 sm:px-6">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-[var(--text)]">
                    Recent Inquiries
                  </h2>

                  <p className="mt-1 truncate text-xs text-[var(--muted)]">
                    Your latest conversations.
                  </p>
                </div>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="shrink-0 rounded-lg px-2.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] sm:px-3"
                >
                  <Link
                    to="/dashboard/inquiries"
                    className="flex items-center gap-1.5"
                  >
                    <span>View all</span>

                    <ArrowRight size={15} className="shrink-0" />
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {recentInquiries.map((inquiry, index) => (
                <Link
                  key={inquiry.id}
                  to="/dashboard/inquiries"
                  className={`group flex min-w-0 items-center gap-3 px-4 py-4 transition hover:bg-[var(--background)] sm:px-6 ${
                    index !== recentInquiries.length - 1
                      ? "border-b border-[var(--border)]"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                    <MessageSquare size={18} className="shrink-0" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--text)] group-hover:text-[var(--primary)]">
                      {inquiry.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-[var(--muted)]">
                      {inquiry.space}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-[var(--muted)]">
                      {inquiry.time}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`max-w-[110px] shrink-0 truncate rounded-full px-2 py-1 text-[10px] sm:max-w-none sm:text-xs ${
                      inquiry.status === "Owner replied"
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600"
                        : "border-amber-500/20 bg-amber-500/5 text-amber-600"
                    }`}
                  >
                    {inquiry.status}
                  </Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* ===================================================
            RECENT ACTIVITY
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="min-w-0"
        >
          <Card className="min-w-0 rounded-2xl border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <CardHeader className="px-4 py-4 sm:px-6">
              <h2 className="font-semibold text-[var(--text)]">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-[var(--muted)]">
                Latest updates from your account.
              </p>
            </CardHeader>

            <CardContent className="px-4 pb-5 sm:px-6">
              <div className="relative space-y-5">
                {/* Timeline line */}
                <div className="absolute bottom-4 left-[18px] top-4 w-px bg-[var(--border)]" />

                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      key={activity.title}
                      className="relative flex min-w-0 gap-3"
                    >
                      {/* Activity icon */}
                      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--primary)]">
                        <Icon size={16} className="shrink-0" />
                      </div>

                      {/* Activity content */}
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="truncate text-sm font-semibold text-[var(--text)]">
                          {activity.title}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                          {activity.description}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-[var(--muted)]">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* =====================================================
          DISCOVER CTA
      ====================================================== */}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative min-w-0 overflow-hidden rounded-2xl bg-[var(--primary)]"
      >
        <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-white/10 blur-2xl sm:h-64 sm:w-64" />

        <div className="relative flex min-w-0 flex-col gap-5 p-5 sm:p-7 md:flex-row md:items-center md:justify-between md:p-8">
          {/* CTA content */}
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/80 sm:text-sm">
              <Sparkles size={16} className="shrink-0" />

              <span>Discover your next workspace</span>
            </div>

            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Need a better place to work?
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-white/75">
              Browse flexible offices, meeting rooms, studios and professional
              workspaces that fit your needs.
            </p>
          </div>

          {/* CTA button */}
          <Button
            asChild
            className="relative h-11 w-full shrink-0 rounded-xl bg-white px-5 font-semibold text-[var(--primary)] hover:bg-white/90 sm:w-auto"
          >
            <Link
              to="/spaces"
              className="flex w-full items-center justify-center gap-2"
            >
              <Search size={17} className="shrink-0" />

              <span className="whitespace-nowrap">Explore Spaces</span>
            </Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

export default UserDashboard;
