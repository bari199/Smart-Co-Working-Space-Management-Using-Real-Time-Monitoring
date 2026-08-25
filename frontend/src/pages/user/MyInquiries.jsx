import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, RefreshCw, Search, Inbox } from "lucide-react";
import { toast } from "sonner";

import InquiryCard from "../../components/inquiry/InquiryCard";
import Loading from "../../components/common/Loading";
import { getMyInquiries } from "../services/inquiryService";

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadInquiries = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyInquiries();

        if (!mounted) return;

        const inquiryData = Array.isArray(response?.inquiries)
          ? response.inquiries
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

        setInquiries(inquiryData);
      } catch (error) {
        console.error("MY INQUIRIES ERROR:", error);

        if (!mounted) return;

        const message = error?.message || "Failed to load your inquiries";

        setError(message);
        setInquiries([]);
        toast.error(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInquiries();

    return () => {
      mounted = false;
    };
  }, []);

  // Search
  const filteredInquiries = inquiries.filter((inquiry) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) return true;

    return (
      inquiry?.subject?.toLowerCase().includes(searchValue) ||
      inquiry?.message?.toLowerCase().includes(searchValue) ||
      inquiry?.space?.name?.toLowerCase().includes(searchValue) ||
      inquiry?.spaceName?.toLowerCase().includes(searchValue) ||
      inquiry?.status?.toLowerCase().includes(searchValue)
    );
  });

  // Retry
  const handleRetry = () => {
    window.location.reload();
  };

  // Loading
  if (loading) {
    return (
      <div className="min-w-0">
        <PageHeader />

        <div className="mt-8">
          <Loading />
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-w-0">
        <PageHeader />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/60 dark:bg-red-950/20"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <MessageSquare size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-red-700 dark:text-red-400">
                  Unable to load inquiries
                </h2>

                <p className="mt-1 text-sm leading-6 text-red-600 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Empty
  if (inquiries.length === 0) {
    return (
      <div className="min-w-0">
        <PageHeader />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
        >
          <div className="flex flex-col items-center px-6 py-16 text-center sm:px-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <Inbox size={28} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-[var(--text)]">
              No inquiries yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              You haven't sent any workspace inquiries yet. When you contact a
              workspace owner, your conversations and replies will appear here.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      {/* PAGE HEADER */}
      <PageHeader />

      {/* TOOLBAR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries..."
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
          />
        </div>

        {/* Result Count */}
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <MessageSquare size={16} />

          <span>
            {filteredInquiries.length}{" "}
            {filteredInquiries.length === 1 ? "inquiry" : "inquiries"}
          </span>
        </div>
      </motion.div>

      {/* INQUIRIES */}
      <div className="mt-6">
        {filteredInquiries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--background)] text-[var(--muted)]">
              <Search size={21} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
              No matching inquiries
            </h3>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Try searching with a different keyword.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredInquiries.map((inquiry, index) => (
                <motion.div
                  key={inquiry?._id || `inquiry-${index}`}
                  layout
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(index * 0.04, 0.2),
                  }}
                >
                  <InquiryCard inquiry={inquiry} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   PAGE HEADER
========================================================= */

const PageHeader = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--primary)]">
        <MessageSquare size={16} />
        Conversations
      </div>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
        My Inquiries
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
        Keep track of your workspace questions, conversations, and owner
        responses in one place.
      </p>
    </motion.div>
  );
};

export default MyInquiries;
