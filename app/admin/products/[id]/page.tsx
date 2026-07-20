"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const SHOE_SIZES = ["EU 36", "EU 37", "EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"];
const COLOR_PALETTE = [
  { name: "Core Black", hex: "#000000" },
  { name: "Cloud White", hex: "#ffffff" },
  { name: "Heather Grey", hex: "#9e9e9e" },
  { name: "Collegiate Navy", hex: "#1a2536" },
  { name: "Solar Red", hex: "#d90429" },
  { name: "Royal Blue", hex: "#00509d" },
  { name: "Yarsha Tan", hex: "#b86a2c" },
  { name: "Olive Cargo", hex: "#4a5d4e" },
  { name: "Sand Beige", hex: "#d6c7b2" },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "variants" | "media" | "pricing" | "preview">("details");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    article_code: "",
    description: "",
    price: "",
    compare_at_price: "",
    stock_quantity: "",
    category_id: "",
    gender: "Unisex",
    is_featured: false,
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("categories").select("id, name").then(({ data }) => {
      if (data) setCategories(data);
    });

    if (id) {
      supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            setError(error.message);
          } else if (data) {
            setFormData({
              name: data.name || "",
              slug: data.slug || "",
              article_code: data.article_code || `YR-${(data.name || "ART").slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
              description: data.description || "",
              price: data.price ? data.price.toString() : "",
              compare_at_price: data.compare_at_price ? data.compare_at_price.toString() : "",
              stock_quantity: data.stock_quantity !== null ? data.stock_quantity.toString() : "0",
              category_id: data.category_id || "",
              gender: data.gender || "Unisex",
              is_featured: data.is_featured || false,
            });
            if (data.images && data.images.length > 0) {
              setExistingImages(data.images);
            }
            if (data.sizes) setSelectedSizes(data.sizes);
            if (data.colors) setSelectedColors(data.colors);
          }
          setLoading(false);
        });
    }
  }, [id, supabase]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim()) {
      setExistingImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let imageUrls = [...existingImages];

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        const {
          data: { publicUrl },
        } = supabase.storage.from("product-images").getPublicUrl(filePath);

        imageUrls.unshift(publicUrl);
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          price: parseFloat(formData.price || "0"),
          compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
          stock_quantity: parseInt(formData.stock_quantity || "0", 10),
          category_id: formData.category_id || null,
          is_featured: formData.is_featured,
          images: imageUrls.length > 0 ? imageUrls : null,
          sizes: selectedSizes,
          colors: selectedColors,
        })
        .eq("id", id);

      if (updateError) throw new Error(updateError.message);

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="admin-page" style={{ padding: "3rem", textAlign: "center" }}>Loading product specification...</div>;

  const selectedCategoryName = categories.find((c) => c.id === formData.category_id)?.name || "Uncategorized";

  return (
    <div className="admin-page" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header Bar */}
      <div
        className="admin-page__header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--color-neutral-200)",
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)" }}>
            Adidas Enterprise PIM Protocol • Article Modification
          </span>
          <h1 className="admin-page__title" style={{ fontSize: "2rem", margin: "0.2rem 0 0 0" }}>
            Edit Product: {formData.name}
          </h1>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link
            href="/admin/products"
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              color: "var(--foreground)",
              border: "1px solid var(--color-neutral-300)",
            }}
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="auth-button"
            style={{ width: "auto", padding: "0.6rem 1.8rem" }}
          >
            {submitting ? "Updating Product..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: "1.5rem" }}>{error}</div>}

      {/* Enterprise Multi-Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          borderBottom: "2px solid var(--color-neutral-200)",
          paddingBottom: "2px",
        }}
      >
        {[
          { id: "details", label: "1. Details & Taxonomy" },
          { id: "variants", label: "2. Sizes & Colorways" },
          { id: "media", label: "3. Digital Assets" },
          { id: "pricing", label: "4. Inventory & Pricing" },
          { id: "preview", label: "5. Live Storefront Preview" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "0.75rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: activeTab === tab.id ? "var(--accent)" : "var(--color-neutral-600)",
              borderBottom: activeTab === tab.id ? "3px solid var(--accent)" : "3px solid transparent",
              marginBottom: "-2px",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* TAB 1: DETAILS & TAXONOMY */}
        {activeTab === "details" && (
          <div className="admin-form-card" style={{ padding: "2rem" }}>
            <h2 className="admin-form-card__title" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
              General Information & Classification
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="auth-field">
                <label>Product Title / Model Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label>Article SKU / Code</label>
                <input
                  type="text"
                  name="article_code"
                  value={formData.article_code}
                  onChange={(e) => setFormData({ ...formData, article_code: e.target.value })}
                  required
                  className="auth-input"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
              <div className="auth-field">
                <label>URL Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label>Category Division</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="auth-input"
                >
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
              <div className="auth-field">
                <label>Gender / Target Audience</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="auth-input"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div className="auth-field" style={{ display: "flex", alignItems: "center", paddingTop: "1.8rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    style={{ width: "1.25rem", height: "1.25rem", accentColor: "var(--accent)" }}
                  />
                  Promote to Homepage "Top Products" Collection
                </label>
              </div>
            </div>

            <div className="auth-field" style={{ marginTop: "1.5rem" }}>
              <label>Product Description & Story</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="auth-input"
              />
            </div>
          </div>
        )}

        {/* TAB 2: VARIANTS, SIZES & COLORWAYS */}
        {activeTab === "variants" && (
          <div className="admin-form-card" style={{ padding: "2rem" }}>
            <h2 className="admin-form-card__title" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
              Sizing Matrix & Colorway Options
            </h2>

            {/* Apparel Sizes */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.75rem" }}>
                Apparel Size Chips
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {APPAREL_SIZES.map((size) => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      style={{
                        padding: "0.6rem 1.2rem",
                        borderRadius: "0.4rem",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        border: active ? "2px solid var(--accent)" : "1px solid var(--color-neutral-300)",
                        background: active ? "var(--accent)" : "var(--background)",
                        color: active ? "#ffffff" : "var(--foreground)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shoe Sizes */}
            <div style={{ marginBottom: "2.5rem" }}>
              <label style={{ fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.75rem" }}>
                Footwear Size Chips (EU Metric)
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {SHOE_SIZES.map((size) => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "0.4rem",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        border: active ? "2px solid var(--accent)" : "1px solid var(--color-neutral-300)",
                        background: active ? "var(--accent)" : "var(--background)",
                        color: active ? "#ffffff" : "var(--foreground)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colorways Selector */}
            <div>
              <label style={{ fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.75rem" }}>
                Colorway Swatches
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
                {COLOR_PALETTE.map((c) => {
                  const active = selectedColors.includes(c.name);
                  return (
                    <div
                      key={c.name}
                      onClick={() => toggleColor(c.name)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        border: active ? "2px solid var(--accent)" : "1px solid var(--color-neutral-300)",
                        background: active ? "color-mix(in srgb, var(--accent) 10%, var(--background))" : "var(--background)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span
                        style={{
                          width: "1.5rem",
                          height: "1.5rem",
                          borderRadius: "50%",
                          backgroundColor: c.hex,
                          border: c.hex === "#ffffff" ? "1px solid #ccc" : "none",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                        }}
                      />
                      <span style={{ fontSize: "0.875rem", fontWeight: active ? 700 : 500 }}>{c.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DIGITAL ASSETS & MEDIA */}
        {activeTab === "media" && (
          <div className="admin-form-card" style={{ padding: "2rem" }}>
            <h2 className="admin-form-card__title" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
              Digital Assets & Image Gallery
            </h2>

            {existingImages.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.75rem" }}>
                  Active Gallery Images ({existingImages.length}):
                </label>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {existingImages.map((url, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img
                        src={url}
                        alt={`Gallery ${idx + 1}`}
                        style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "0.5rem", border: "1px solid var(--color-neutral-300)" }}
                      />
                      <button
                        type="button"
                        onClick={() => setExistingImages((prev) => prev.filter((_, i) => i !== idx))}
                        style={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          background: "var(--color-error)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="auth-field" style={{ marginBottom: "1.5rem" }}>
              <label>Upload New Primary File Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="auth-input"
                style={{ padding: "0.75rem" }}
              />
            </div>

            <div className="auth-field">
              <label>Or Add Image URL Link</label>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="auth-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.4rem",
                    background: "var(--accent)",
                    color: "#fff",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRICING & INVENTORY */}
        {activeTab === "pricing" && (
          <div className="admin-form-card" style={{ padding: "2rem" }}>
            <h2 className="admin-form-card__title" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
              Pricing Structure & Inventory Control
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="auth-field">
                <label>Retail Selling Price (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label>Original MSRP / Compare at Price (Rs.)</label>
                <input
                  type="number"
                  name="compare_at_price"
                  value={formData.compare_at_price}
                  onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                  min="0"
                  step="0.01"
                  className="auth-input"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
              <div className="auth-field">
                <label>Stock Inventory Quantity</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  required
                  min="0"
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label>Inventory Status</label>
                <input
                  type="text"
                  disabled
                  value={parseInt(formData.stock_quantity || "0", 10) > 0 ? "In Stock (Ready for Dispatch)" : "Out of Stock"}
                  className="auth-input"
                  style={{ background: "color-mix(in srgb, var(--foreground) 5%, transparent)", fontWeight: 600 }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LIVE STOREFRONT PREVIEW */}
        {activeTab === "preview" && (
          <div className="admin-form-card" style={{ padding: "2rem" }}>
            <h2 className="admin-form-card__title" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
              Real-time Customer View Preview
            </h2>

            <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
              {/* Product Card Preview */}
              <div
                style={{
                  width: "300px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid var(--color-neutral-300)",
                  background: "var(--background)",
                  padding: "1rem",
                }}
              >
                <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "8px", overflow: "hidden", background: "#e0e0e0" }}>
                  <img
                    src={existingImages[0] || "/placeholder-product.jpg"}
                    alt={formData.name || "Product Preview"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {formData.compare_at_price && parseFloat(formData.compare_at_price) > parseFloat(formData.price || "0") && (
                    <span
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "var(--accent)",
                        color: "#fff",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      SALE
                    </span>
                  )}
                </div>
                <div style={{ paddingTop: "0.75rem" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>
                    {selectedCategoryName} • {formData.gender}
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0.25rem 0" }}>
                    {formData.name || "Product Title Here"}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 800, fontSize: "1rem" }}>
                      Rs. {parseFloat(formData.price || "0").toLocaleString()}
                    </span>
                    {formData.compare_at_price && (
                      <span style={{ textDecoration: "line-through", color: "#888", fontSize: "0.85rem" }}>
                        Rs. {parseFloat(formData.compare_at_price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Specification Summary */}
              <div style={{ flex: 1, padding: "1.5rem", background: "color-mix(in srgb, var(--foreground) 3%, transparent)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Article Summary</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem", fontSize: "0.9rem" }}>
                  <li><strong>SKU:</strong> {formData.article_code || "Pending"}</li>
                  <li><strong>Slug:</strong> /products/{formData.slug}</li>
                  <li><strong>Target Gender:</strong> {formData.gender}</li>
                  <li><strong>Category:</strong> {selectedCategoryName}</li>
                  <li><strong>Available Sizes ({selectedSizes.length}):</strong> {selectedSizes.join(", ") || "None"}</li>
                  <li><strong>Colorways ({selectedColors.length}):</strong> {selectedColors.join(", ") || "None"}</li>
                  <li><strong>Stock Count:</strong> {formData.stock_quantity} units</li>
                  <li><strong>Featured Item:</strong> {formData.is_featured ? "Yes (Appears on Homepage)" : "No"}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-neutral-200)" }}>
          <button
            type="button"
            onClick={() => {
              const tabs = ["details", "variants", "media", "pricing", "preview"];
              const idx = tabs.indexOf(activeTab);
              if (idx > 0) setActiveTab(tabs[idx - 1] as any);
            }}
            disabled={activeTab === "details"}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-neutral-300)",
              background: "var(--background)",
              cursor: activeTab === "details" ? "not-allowed" : "pointer",
              opacity: activeTab === "details" ? 0.5 : 1,
              fontWeight: 600,
            }}
          >
            ← Previous Step
          </button>

          {activeTab !== "preview" ? (
            <button
              type="button"
              onClick={() => {
                const tabs = ["details", "variants", "media", "pricing", "preview"];
                const idx = tabs.indexOf(activeTab);
                if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1] as any);
              }}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                background: "var(--foreground)",
                color: "var(--background)",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Next Step →
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="auth-button"
              style={{ width: "auto", padding: "0.75rem 2.5rem" }}
            >
              {submitting ? "Updating Article..." : "Save Product Changes"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
