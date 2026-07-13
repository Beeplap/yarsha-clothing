"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compare_at_price: "",
    stock_quantity: "",
    category_id: "",
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("categories").select("id, name").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
      
      // Auto-generate slug from name
      if (name === "name") {
        setFormData(prev => ({
          ...prev,
          slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
        }));
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let imageUrls: string[] = [];

      // 1. Upload Image to Storage if exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrls = [publicUrl];
      }

      // 2. Insert Product
      const { error: insertError } = await supabase.from("products").insert({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        stock_quantity: parseInt(formData.stock_quantity, 10),
        category_id: formData.category_id || null,
        is_featured: formData.is_featured,
        images: imageUrls.length > 0 ? imageUrls : null
      });

      if (insertError) throw new Error(insertError.message);

      router.push("/admin/products");
      router.refresh();
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Add New Product</h1>
        <Link href="/admin/products" className="admin-nav-link" style={{ textDecoration: 'underline' }}>
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-container">
        {error && <div className="auth-error" style={{ marginBottom: "1.5rem" }}>{error}</div>}
        
        <div className="admin-form-grid">
          <div className="admin-form-card">
            <h2 className="admin-form-card__title">Basic Details</h2>
            
            <div className="auth-field">
              <label>Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="auth-input" />
            </div>

            <div className="auth-field" style={{ marginTop: '1rem' }}>
              <label>Slug</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="auth-input" />
            </div>

            <div className="auth-field" style={{ marginTop: '1rem' }}>
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="auth-input" rows={4} />
            </div>
            
            <div className="auth-field" style={{ marginTop: '1rem' }}>
              <label>Category</label>
              <select name="category_id" value={formData.category_id} onChange={handleChange} className="auth-input" required>
                <option value="">Select category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="admin-form-sidebar">
            <div className="admin-form-card">
              <h2 className="admin-form-card__title">Pricing & Inventory</h2>
              
              <div className="auth-field">
                <label>Price (Rs.)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="auth-input" />
              </div>

              <div className="auth-field" style={{ marginTop: '1rem' }}>
                <label>Compare at Price (Rs.)</label>
                <input type="number" name="compare_at_price" value={formData.compare_at_price} onChange={handleChange} min="0" step="0.01" className="auth-input" />
              </div>

              <div className="auth-field" style={{ marginTop: '1rem' }}>
                <label>Stock Quantity</label>
                <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required min="0" className="auth-input" />
              </div>
            </div>

            <div className="admin-form-card" style={{ marginTop: '1.5rem' }}>
              <h2 className="admin-form-card__title">Media</h2>
              
              <div className="auth-field">
                <label>Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="auth-input" style={{ padding: '0.5rem' }} />
              </div>
            </div>

            <div className="admin-form-card" style={{ marginTop: '1.5rem' }}>
              <div className="auth-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" name="is_featured" id="is_featured" checked={formData.is_featured} onChange={handleChange} />
                <label htmlFor="is_featured" style={{ margin: 0, fontWeight: 500 }}>Feature this product on homepage</label>
              </div>
            </div>
            
            <button type="submit" className="auth-button" style={{ marginTop: '1.5rem' }} disabled={submitting}>
              {submitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
