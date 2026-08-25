// pages/owner/MySpaces.jsx

import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  const fetchSpaces = async () => {
    try {
      setLoading(true);

      const data = await getOwnerSpaces();

      setSpaces(data?.spaces || data?.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load spaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

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
      toast.error(error.message || "Failed to save workspace");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace?",
    );

    if (!confirmed) return;

    try {
      await deleteSpace(id);

      setSpaces((prev) => prev.filter((space) => space._id !== id));

      toast.success("Workspace deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete workspace");
    }
  };

  const handleEdit = (space) => {
    setEditingSpace(space);
    setShowForm(true);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[var(--secondary)]">Owner</p>

            <h1 className="text-3xl font-bold text-[var(--text)]">My Spaces</h1>

            <p className="mt-1 text-[var(--muted)]">
              Manage your workspace listings.
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => {
                setEditingSpace(null);
                setShowForm(true);
              }}
              className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white"
            >
              + Add Space
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-8">
            <SpaceForm
              space={editingSpace}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingSpace(null);
              }}
              loading={saving}
            />
          </div>
        )}

        {spaces.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
            <h2 className="text-xl font-semibold text-[var(--text)]">
              No spaces yet
            </h2>

            <p className="mt-2 text-[var(--muted)]">
              Add your first workspace to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <div key={space._id}>
                <SpaceCard space={space} />

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(space)}
                    className="flex-1 rounded-lg border border-[var(--secondary)] px-3 py-2 text-sm font-medium text-[var(--secondary)]"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(space._id)}
                    className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySpaces;
