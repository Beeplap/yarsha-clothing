import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Products</h1>
        <Link href="/admin/products/new" className="auth-button" style={{ width: "auto", margin: 0, display: "inline-flex" }}>
          Add Product
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-table__product">
                    <img 
                      src={product.images?.[0] || "/placeholder-product.jpg"} 
                      alt={product.name}
                      className="admin-table__img"
                    />
                    <span className="admin-table__name">{product.name}</span>
                  </div>
                </td>
                <td>{product.categories?.name || "Uncategorized"}</td>
                <td>Rs. {Number(product.price).toLocaleString()}</td>
                <td>
                  <span className={`admin-badge ${product.stock_quantity <= 5 ? "admin-badge--danger" : "admin-badge--success"}`}>
                    {product.stock_quantity} in stock
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${product.is_featured ? "admin-badge--brand" : "admin-badge--neutral"}`}>
                    {product.is_featured ? "Featured" : "Standard"}
                  </span>
                </td>
                <td>
                  <button className="admin-table__action">Edit</button>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem" }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
