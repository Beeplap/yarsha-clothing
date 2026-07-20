"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  gender: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, [supabase]);

  const getParentName = (parentId: string | null) => {
    if (!parentId) return "None";
    const parent = categories.find((c) => c.id === parentId);
    return parent ? parent.name : "Unknown";
  };

  return (
    <div className="admin-page p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button className="bg-[var(--navy)] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors">
          Add Category
        </button>
      </div>

      <div className="admin-panel rounded-lg shadow-sm border border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--foreground)]/60">Loading categories...</div>
        ) : (
          <table className="admin-table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Parent</th>
                <th>Gender</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="font-medium">{category.name}</td>
                  <td className="text-[var(--foreground)]/70">{category.slug}</td>
                  <td>
                    {category.parent_id ? (
                      <span className="admin-badge admin-badge-info">{getParentName(category.parent_id)}</span>
                    ) : (
                      <span className="text-[var(--foreground)]/50">Main Category</span>
                    )}
                  </td>
                  <td>
                    <span className="admin-badge">{category.gender || 'None'}</span>
                  </td>
                  <td className="text-right font-medium">
                    <button className="text-[var(--accent)] hover:underline mr-4">Edit</button>
                    <button className="text-red-700 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-[var(--foreground)]/50">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
