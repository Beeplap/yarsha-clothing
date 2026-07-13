export type UserRole = "customer" | "admin" | "manager";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  category_id: string | null;
  images: string[];
  is_featured: boolean;
  created_at: string;
  // Joined relation (optional)
  categories?: Category | null;
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  size?: string;
  created_at: string;
  // Joined relation (optional)
  products?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: Record<string, unknown>;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  size?: string;
  created_at: string;
  products?: Product;
}
