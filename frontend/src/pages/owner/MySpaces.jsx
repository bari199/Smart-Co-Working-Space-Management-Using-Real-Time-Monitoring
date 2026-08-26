// pages/owner/MySpaces.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  LayoutGrid,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Building2,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

import SpaceCard from "../../components/space/SpaceCard";
import SpaceForm from "../../components/space/SpaceForm";
import Loading from "../../components/common/Loading";

import {
  getOwnerSpaces,
  createSpace,
  updateSpace,
  deleteSpace,
} from "../services/spaceService";

const MySpaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSpaces = async () => {
    try {
      setLoading(true);

      const data = await getOwnerSpaces();

      setSpaces(
        data?.spaces || data?.data || (Array.isArray(data) ? data : []),
      );
    } catch (error) {
      toast.error(error?.message || "Failed to load spaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const openCreateForm = () => {
    setEditingSpace(null);
    setShowForm(true);
  };

  const openEditForm = (space) => {
    setEditingSpace(space);
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingSpace(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      if (editingSpace) {
        await updateSpace(editingSpace._id, formData);
        toast.success("Workspace updated successfully");
      } else {
        await createSpace(formData);
        toast.success("Workspace created successfully");
      }

      setShowForm(false);
      setEditingSpace(null);

      await fetchSpaces();
    } catch (error) {
      toast.error(error?.message || "Failed to save workspace");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await deleteSpace(deleteId);

      setSpaces((prev) => prev.filter((space) => space._id !== deleteId));

      toast.success("Workspace deleted successfully");

      setDeleteId(null);
    } catch (error) {
      toast.error(error?.message || "Failed to delete workspace");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-w-0 bg-[var(--background)]">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                <Building2 size={17} />
              </div>

              <Badge
                variant="secondary"
                className="border-0 bg-[var(--surfaceAlt)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]"
              >
                Owner
              </Badge>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">
              My Spaces
            </h1>

            <p className="mt-0.5 text-xs text-[var(--muted)] sm:text-sm">
              Manage and organize your workspace listings.
            </p>
          </div>

          {!showForm && (
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSpaces}
                disabled={loading}
                className="h-9 flex-1 gap-1.5 border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--text)] hover:bg-[var(--surfaceAlt)] sm:flex-none"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />

                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <Button
                size="sm"
                onClick={openCreateForm}
                className="h-9 flex-1 gap-1.5 bg-[var(--primary)] px-3 text-xs font-semibold text-white shadow-sm hover:bg-[var(--primary)]/90 sm:flex-none"
              >
                <Plus size={15} />
                Add Space
              </Button>
            </div>
          )}
        </motion.div>

        {/* =====================================================
            QUICK STATS
        ====================================================== */}

        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.05,
            }}
            className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {/* Total */}
            <Card className="border-[var(--border)] bg-[var(--surface)] shadow-none">
              <CardContent className="flex items-center gap-3 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <LayoutGrid size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] text-[var(--muted)]">
                    Total Spaces
                  </p>

                  <p className="text-lg font-bold leading-tight text-[var(--text)]">
                    {spaces.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Listings */}
            <Card className="border-[var(--border)] bg-[var(--surface)] shadow-none">
              <CardContent className="flex items-center gap-3 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Building2 size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] text-[var(--muted)]">Listings</p>

                  <p className="text-lg font-bold leading-tight text-[var(--text)]">
                    {spaces.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Workspace type */}
            <Card className="hidden border-[var(--border)] bg-[var(--surface)] shadow-none sm:block">
              <CardContent className="flex items-center gap-3 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <LayoutGrid size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] text-[var(--muted)]">
                    Workspace Type
                  </p>

                  <p className="truncate text-sm font-bold text-[var(--text)]">
                    Flexible
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* =====================================================
            SPACE FORM
        ====================================================== */}

        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div
              key="space-form"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 10,
              }}
              transition={{ duration: 0.25 }}
              className="mb-5"
            >
              <Card className="overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--border)] px-4 py-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base font-semibold text-[var(--text)]">
                      {editingSpace ? "Edit Workspace" : "Add New Workspace"}
                    </CardTitle>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      {editingSpace
                        ? "Update your workspace information."
                        : "Create a new workspace listing."}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={closeForm}
                    disabled={saving}
                    className="h-8 w-8 shrink-0 text-[var(--muted)] hover:bg-[var(--surfaceAlt)] hover:text-[var(--text)]"
                  >
                    <X size={17} />
                  </Button>
                </CardHeader>

                <CardContent className="p-4 sm:p-5">
                  <SpaceForm
                    space={editingSpace}
                    onSubmit={handleSubmit}
                    onCancel={closeForm}
                    loading={saving}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {!showForm && spaces.length === 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-10 text-center"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <Building2 size={22} />
            </div>

            <h2 className="text-base font-semibold text-[var(--text)]">
              No spaces yet
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[var(--muted)]">
              Create your first workspace listing and start managing your
              available spaces.
            </p>

            <Button
              onClick={openCreateForm}
              size="sm"
              className="mt-4 h-9 gap-1.5 bg-[var(--primary)] px-4 text-xs font-semibold text-white hover:bg-[var(--primary)]/90"
            >
              <Plus size={15} />
              Create Space
            </Button>
          </motion.div>
        )}

        {/* =====================================================
            SPACES GRID
        ====================================================== */}

        {!showForm && spaces.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {spaces.map((space, index) => (
              <motion.div
                key={space._id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.04,
                }}
                className="group min-w-0"
              >
                {/* =================================================
                    SPACE CARD
                ================================================== */}

                <SpaceCard space={space} />

                {/* =================================================
                    CARD ACTION BAR
                ================================================== */}

                <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1.5">
                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditForm(space)}
                    className="h-8 flex-1 gap-1.5 rounded-md px-2.5 text-xs font-medium text-[var(--text)] hover:bg-[var(--surfaceAlt)] hover:text-[var(--primary)]"
                  >
                    <Pencil size={13} strokeWidth={2} />

                    <span>Edit</span>
                  </Button>

                  {/* Divider */}
                  <div className="h-5 w-px bg-[var(--border)]" />

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(space._id)}
                    className="h-8 flex-1 gap-1.5 rounded-md px-2.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                  >
                    <Trash2 size={13} strokeWidth={2} />

                    <span>Delete</span>
                  </Button>

                  {/* More visual affordance */}
                  <div className="hidden h-5 w-px bg-[var(--border)] sm:block" />

                  <div className="hidden h-8 w-8 items-center justify-center rounded-md text-[var(--muted)] sm:flex">
                    <MoreHorizontal size={15} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* =========================================================
          DELETE CONFIRMATION
      ========================================================== */}

      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteId(null);
          }
        }}
      >
        <AlertDialogContent className="max-w-sm border-[var(--border)] bg-[var(--surface)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base text-[var(--text)]">
              Delete workspace?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-xs leading-5 text-[var(--muted)]">
              This action cannot be undone. The workspace will be permanently
              removed from your listings.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel
              disabled={deleting}
              className="h-9 border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)]"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={handleDelete}
              className="h-9 bg-red-600 text-xs font-semibold text-white hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete Space"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MySpaces;
