import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = {
  name: "",
  description: "",
  location: "",
  area: "",
  capacity: "",
  workspaceType: "private cabin",
  price: "",
  amenities: "",
  availability: "available",
  image: null,
};

const workspaceTypes = [
  {
    value: "private cabin",
    label: "Private Cabin",
  },
  {
    value: "shared desk",
    label: "Shared Desk",
  },
  {
    value: "meeting room",
    label: "Meeting Room",
  },
  {
    value: "dedicated desk",
    label: "Dedicated Desk",
  },
  {
    value: "hot desk",
    label: "Hot Desk",
  },
  {
    value: "conference room",
    label: "Conference Room",
  },
  {
    value: "virtual office",
    label: "Virtual Office",
  },
  {
    value: "training room",
    label: "Training Room",
  },
  {
    value: "creative studio",
    label: "Creative Studio",
  },
  {
    value: "event space",
    label: "Event Space",
  },
];

const SpaceForm = ({ space = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState(initialState);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (space) {
      setFormData({
        name: space?.name || "",
        description: space?.description || "",
        location: space?.location || "",
        area: space?.area || "",
        capacity: space?.capacity || "",
        workspaceType: space?.workspaceType || "private cabin",
        price: space?.price || "",
        amenities: Array.isArray(space?.amenities)
          ? space.amenities.join(", ")
          : space?.amenities || "",
        availability: space?.availability || "available",
        image: null,
      });

      setPreview(space?.image || "");
    } else {
      setFormData(initialState);
      setPreview("");
    }
  }, [space]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "image") {
      const file = files?.[0] || null;

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      if (file) {
        setPreview(URL.createObjectURL(file));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("area", formData.area);
    data.append("capacity", formData.capacity);
    data.append("workspaceType", formData.workspaceType);
    data.append("price", formData.price);
    data.append("availability", formData.availability);

    if (formData.amenities.trim()) {
      formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((amenity) => {
          data.append("amenities", amenity);
        });
    }

    if (formData.image) {
      data.append("image", formData.image);
    }

    await onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)]"
    >
      {/* Header */}
      <div className="border-b border-[var(--border)] px-4 py-3 sm:px-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">
          Owner
        </p>

        <h2 className="mt-0.5 text-lg font-bold tracking-tight text-[var(--text)] sm:text-xl">
          {space ? "Edit Workspace" : "Add New Workspace"}
        </h2>

        <p className="mt-0.5 text-xs text-[var(--muted)]">
          {space
            ? "Update your workspace information."
            : "Create a workspace listing for customers."}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="space-y-4">
          {/* Workspace Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-semibold text-[var(--text)]"
            >
              Workspace Name
            </Label>

            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Modern Business Hub"
              className="h-9 border-[var(--border)] bg-[var(--background)] text-xs shadow-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-xs font-semibold text-[var(--text)]"
            >
              Description
            </Label>

            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe your workspace..."
              className="min-h-[82px] resize-none border-[var(--border)] bg-[var(--background)] text-xs shadow-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label
              htmlFor="location"
              className="text-xs font-semibold text-[var(--text)]"
            >
              Location
            </Label>

            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g. Salt Lake, Kolkata"
              className="h-9 border-[var(--border)] bg-[var(--background)] text-xs shadow-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
            />
          </div>

          {/* Area + Capacity */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="area"
                className="text-xs font-semibold text-[var(--text)]"
              >
                Area (sq ft)
              </Label>

              <Input
                id="area"
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                min="1"
                placeholder="500"
                className="h-9 border-[var(--border)] bg-[var(--background)] text-xs shadow-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="capacity"
                className="text-xs font-semibold text-[var(--text)]"
              >
                Capacity
              </Label>

              <Input
                id="capacity"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                placeholder="20"
                className="h-9 border-[var(--border)] bg-[var(--background)] text-xs shadow-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
              />
            </div>
          </div>

          {/* Workspace Type + Price */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[var(--text)]">
                Workspace Type
              </Label>

              <Select
                value={formData.workspaceType}
                onValueChange={handleSelectChange("workspaceType")}
              >
                <SelectTrigger className="h-9 border-[var(--border)] bg-[var(--background)] text-xs shadow-none focus:ring-1 focus:ring-[var(--primary)]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>

                <SelectContent>
                  {workspaceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="price"
                className="text-xs font-semibold text-[var(--text)]"
              >
                Price / Day (₹)
              </Label>

              <Input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="1000"
                className="h-9 border-[var(--border)] bg-[var(--background)] text-xs shadow-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-1.5">
            <Label
              htmlFor="amenities"
              className="text-xs font-semibold text-[var(--text)]"
            >
              Amenities
            </Label>

            <Input
              id="amenities"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, AC, Parking, Coffee"
              className="h-9 border-[var(--border)] bg-[var(--background)] text-xs shadow-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
            />

            <p className="text-[10px] text-[var(--muted)]">
              Separate amenities using commas.
            </p>
          </div>

          {/* Availability */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[var(--text)]">
              Availability
            </Label>

            <Select
              value={formData.availability}
              onValueChange={handleSelectChange("availability")}
            >
              <SelectTrigger className="h-9 border-[var(--border)] bg-[var(--background)] text-xs shadow-none focus:ring-1 focus:ring-[var(--primary)]">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="available">Available</SelectItem>

                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image */}
          <div className="space-y-1.5">
            <Label
              htmlFor="image"
              className="text-xs font-semibold text-[var(--text)]"
            >
              Workspace Image
            </Label>

            <Input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="h-9 cursor-pointer border-[var(--border)] bg-[var(--background)] text-xs shadow-none file:mr-3 file:rounded-md file:border-0 file:bg-[var(--primary)]/10 file:px-2.5 file:py-1 file:text-[10px] file:font-semibold file:text-[var(--primary)]"
            />

            {/* Preview */}
            <AnimatePresence>
              {preview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-lg border border-[var(--border)]"
                >
                  <img
                    src={preview}
                    alt="Workspace preview"
                    className="h-44 w-full object-cover sm:h-52"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[var(--border)] pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-9 border-[var(--border)] bg-[var(--surface)] px-4 text-xs font-medium text-[var(--text)] shadow-none hover:bg-[var(--background)]"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="h-9 bg-[var(--primary)] px-4 text-xs font-semibold text-white shadow-sm hover:opacity-90"
          >
            {loading
              ? "Saving..."
              : space
                ? "Update Workspace"
                : "Create Workspace"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default SpaceForm;
