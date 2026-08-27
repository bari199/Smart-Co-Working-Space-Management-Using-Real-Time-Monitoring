import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  MessageSquare,
  Plus,
  UserRound,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

import { useAuth } from "../../context/authContext";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const OwnerDashboard = () => {
  const { user } = useAuth();

  const displayName = user?.name || user?.fullName || user?.username || "Owner";

  const stats = [
    {
      title: "My Spaces",
      description: "Manage your workspace listings",
      icon: Building2,
      to: "/owner/spaces",
    },
    {
      title: "Bookings",
      description: "Review customer bookings",
      icon: CalendarDays,
      to: "/owner/bookings",
    },
    {
      title: "Inquiries",
      description: "Respond to customer requests",
      icon: MessageSquare,
      to: "/owner/inquiries",
    },
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full min-w-0">
      <div className="mx-auto w-full max-w-7xl space-y-5 px-0">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="
            flex w-full min-w-0
            flex-col gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Header Content */}

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <div
                className="
                  flex h-7 w-7 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-[var(--primary)]/10
                  text-[var(--primary)]
                "
              >
                <LayoutDashboard size={15} />
              </div>

              <span
                className="
                  truncate
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-[var(--muted)]
                "
              >
                Owner Dashboard
              </span>
            </div>

            <h1
              className="
                truncate
                text-2xl
                font-bold
                tracking-tight
                text-[var(--text)]
                sm:text-3xl
              "
            >
              Welcome, {displayName}
              <span className="ml-1">👋</span>
            </h1>

            <p
              className="
                mt-1
                max-w-xl
                text-sm
                leading-5
                text-[var(--muted)]
              "
            >
              Manage your spaces, bookings and customer inquiries from one
              place.
            </p>
          </div>

          {/* Add Space */}

          <Button
            asChild
            className="
              w-full
              shrink-0
              bg-[var(--primary)]
              text-white
              shadow-sm
              hover:bg-[var(--primary)]/90
              sm:w-auto
            "
          >
            <Link
              to="/owner/spaces"
              className="flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <Plus size={16} />
              <span>Add Space</span>
            </Link>
          </Button>
        </motion.div>

        {/* =====================================================
            NAVIGATION CARDS
        ====================================================== */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="
            grid
            w-full
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="min-w-0"
              >
                <Link to={item.to} className="block h-full min-w-0">
                  <Card
                    className="
                      group
                      h-full
                      min-w-0
                      border-[var(--border)]
                      bg-[var(--surface)]
                      shadow-none
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:border-[var(--primary)]/40
                      hover:shadow-md
                    "
                  >
                    <CardContent className="p-4">
                      <div
                        className="
                          flex
                          min-w-0
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        {/* Icon + Content */}

                        <div
                          className="
                            flex
                            min-w-0
                            flex-1
                            items-center
                            gap-3
                          "
                        >
                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-[var(--primary)]/10
                              text-[var(--primary)]
                              transition-colors
                              group-hover:bg-[var(--primary)]
                              group-hover:text-white
                            "
                          >
                            <Icon size={19} strokeWidth={2} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h2
                              className="
                                truncate
                                text-sm
                                font-semibold
                                text-[var(--text)]
                              "
                            >
                              {item.title}
                            </h2>

                            <p
                              className="
                                mt-0.5
                                line-clamp-2
                                text-xs
                                leading-5
                                text-[var(--muted)]
                              "
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <ArrowUpRight
                          size={17}
                          className="
                            mt-0.5
                            shrink-0
                            text-[var(--muted)]
                            transition-all
                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                            group-hover:text-[var(--primary)]
                          "
                        />
                      </div>

                      {/* Bottom Link */}

                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-between
                          gap-2
                          border-t
                          border-[var(--border)]
                          pt-3
                        "
                      >
                        <span
                          className="
                            min-w-0
                            truncate
                            text-xs
                            font-medium
                            text-[var(--muted)]
                          "
                        >
                          Open {item.title}
                        </span>

                        <ChevronRight
                          size={15}
                          className="
                            shrink-0
                            text-[var(--muted)]
                            transition-transform
                            group-hover:translate-x-0.5
                          "
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.3,
          }}
          className="w-full min-w-0"
        >
          <Card
            className="
              w-full
              border-[var(--border)]
              bg-[var(--surface)]
              shadow-none
            "
          >
            <CardContent className="p-4">
              <div
                className="
                  flex
                  w-full
                  min-w-0
                  flex-col
                  gap-4
                "
              >
                {/* Quick Action Heading */}

                <div className="min-w-0">
                  <h2
                    className="
                      text-sm
                      font-semibold
                      text-[var(--text)]
                    "
                  >
                    Quick Actions
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      leading-5
                      text-[var(--muted)]
                    "
                  >
                    Quickly access the most common owner tasks.
                  </p>
                </div>

                {/* Buttons */}

                <div
                  className="
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-2
                    sm:grid-cols-2
                    lg:grid-cols-3
                  "
                >
                  {/* Manage Spaces */}

                  <Button
                    asChild
                    size="sm"
                    className="
                      w-full
                      min-w-0
                      bg-[var(--primary)]
                      text-white
                      hover:bg-[var(--primary)]/90
                    "
                  >
                    <Link
                      to="/owner/spaces"
                      className="
                        flex
                        w-full
                        min-w-0
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <Building2 size={15} className="shrink-0" />

                      <span className="truncate">Manage Spaces</span>
                    </Link>
                  </Button>

                  {/* View Bookings */}

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="
                      w-full
                      min-w-0
                      border-[var(--border)]
                      bg-transparent
                      text-[var(--text)]
                      hover:bg-[var(--background)]
                    "
                  >
                    <Link
                      to="/owner/bookings"
                      className="
                        flex
                        w-full
                        min-w-0
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <CalendarDays size={15} className="shrink-0" />

                      <span className="truncate">View Bookings</span>
                    </Link>
                  </Button>

                  {/* Inquiries */}

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="
                      w-full
                      min-w-0
                      border-[var(--border)]
                      bg-transparent
                      text-[var(--text)]
                      hover:bg-[var(--background)]
                    "
                  >
                    <Link
                      to="/owner/inquiries"
                      className="
                        flex
                        w-full
                        min-w-0
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <MessageSquare size={15} className="shrink-0" />

                      <span className="truncate">Inquiries</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* =====================================================
            BOTTOM INFO
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.3,
          }}
          className="
            grid
            w-full
            min-w-0
            grid-cols-1
            gap-3
            sm:grid-cols-2
          "
        >
          {/* Manage Spaces Info */}

          <Card
            className="
              min-w-0
              border-[var(--border)]
              bg-[var(--surfaceAlt)]
              shadow-none
            "
          >
            <CardContent className="p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[var(--primary)]
                    text-white
                  "
                >
                  <Building2 size={17} />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-[var(--text)]
                    "
                  >
                    Manage your spaces
                  </p>

                  <p
                    className="
                      mt-0.5
                      line-clamp-2
                      text-xs
                      leading-5
                      text-[var(--muted)]
                    "
                  >
                    Keep listings updated and ready for customers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stay Connected Info */}

          <Card
            className="
              min-w-0
              border-[var(--border)]
              bg-[var(--surfaceAlt)]
              shadow-none
            "
          >
            <CardContent className="p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[var(--primary)]
                    text-white
                  "
                >
                  <MessageSquare size={17} />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-[var(--text)]
                    "
                  >
                    Stay connected
                  </p>

                  <p
                    className="
                      mt-0.5
                      line-clamp-2
                      text-xs
                      leading-5
                      text-[var(--muted)]
                    "
                  >
                    Respond to inquiries and booking requests quickly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
