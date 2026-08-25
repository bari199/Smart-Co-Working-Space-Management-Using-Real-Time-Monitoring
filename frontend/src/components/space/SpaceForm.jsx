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

const SpaceForm = ({ space = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState(initialState);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (space) {
      setFormData({
        name: space.name || "",
        description: space.description || "",
        location: space.location || "",
        area: space.area || "",
        capacity: space.capacity || "",
        workspaceType: space.workspaceType || "private cabin",
        price: space.price || "",
        amenities: Array.isArray(space.amenities)
          ? space.amenities.join(", ")
          : space.amenities || "",
        availability: space.availability || "available",
        image: null,
      });
      setPreview(space.image || "");
    } else {
      setFormData(initialState);
      setPreview("");
    }
  }, [space]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "image") {
      const file = files?.[0] || null;
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) setPreview(URL.createObjectURL(file));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        .forEach((amenity) => data.append("amenities", amenity));
    }

    if (formData.image) data.append("image", formData.image);

    await onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
    >
      <div className="mb-6">
        <p className="text-sm font-medium text-[var(--secondary)]">Owner</p>
        <h2 className="mt-1 text-2xl font-bold text-[var(--text)]">
          {space ? "Edit Workspace" : "Add New Workspace"}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {space
            ? "Update your workspace information."
            : "Create a workspace listing for customers."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Workspace Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Modern Business Hub"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe your workspace..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g. Salt Lake, Kolkata"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="area">Area (sq ft)</Label>
            <Input
              id="area"
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              min="1"
              placeholder="500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              placeholder="20"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Workspace Type</Label>
            <Select
              value={formData.workspaceType}
              onValueChange={handleSelectChange("workspaceType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private cabin">Private Cabin</SelectItem>
                <SelectItem value="shared desk">Shared Desk</SelectItem>
                <SelectItem value="meeting room">Meeting Room</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price / Day (₹)</Label>
            <Input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              placeholder="1000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amenities">Amenities</Label>
          <Input
            id="amenities"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="WiFi, AC, Parking, Coffee"
          />
          <p className="text-xs text-[var(--muted)]">
            Separate amenities using commas.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Availability</Label>
          <Select
            value={formData.availability}
            onValueChange={handleSelectChange("availability")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Workspace Image</Label>
          <Input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-[var(--accent)]/30 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[var(--primary)]"
          />

          <AnimatePresence>
            {preview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]"
              >
                <img
                  src={preview}
                  alt="Workspace preview"
                  className="h-56 w-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-[var(--primary)] text-white hover:opacity-90"
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
