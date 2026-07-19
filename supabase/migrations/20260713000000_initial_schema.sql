-- ============================================================
-- Yarsha Wears — Initial Database Schema
-- Supabase Migration
-- ============================================================

-- ===================
-- 1. Custom Enum Types
-- ===================

CREATE TYPE public.user_role AS ENUM ('customer', 'admin', 'manager');

CREATE TYPE public.order_status AS ENUM (
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

CREATE TYPE public.payment_status AS ENUM (
  'unpaid',
  'paid',
  'refunded'
);


-- ===================
-- 2. Tables
-- ===================

-- 3a. profiles
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  role        public.user_role NOT NULL DEFAULT 'customer',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.profiles IS 'Extended user profile linked 1-to-1 with auth.users.';

-- 3b. categories
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.categories IS 'Product categories (e.g. T-Shirts, Hoodies).';

-- 3c. products
CREATE TABLE public.products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  description       TEXT,
  price             NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price  NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  stock_quantity    INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  category_id       UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  images            TEXT[] DEFAULT '{}',
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.products IS 'Wears products available for sale.';

-- 3d. carts
CREATE TABLE public.carts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.carts IS 'One active shopping cart per user.';

-- 3e. cart_items
CREATE TABLE public.cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id     UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (cart_id, product_id)          -- prevent duplicate line items
);
COMMENT ON TABLE public.cart_items IS 'Individual items inside a shopping cart.';

-- 3f. orders
CREATE TABLE public.orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status            public.order_status NOT NULL DEFAULT 'pending',
  total_amount      NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_address  JSONB NOT NULL DEFAULT '{}',
  payment_status    public.payment_status NOT NULL DEFAULT 'unpaid',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.orders IS 'Customer orders with status and payment tracking.';

-- 3g. order_items
CREATE TABLE public.order_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id        UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity          INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase NUMERIC(10, 2) NOT NULL CHECK (price_at_purchase >= 0),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.order_items IS 'Snapshot of products at the moment of purchase.';


-- ============================================
-- 3. Helper function: check caller's role
-- ============================================
-- Defined after tables so public.profiles exists.

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;


-- ===================
-- 4. Indexes
-- ===================

CREATE INDEX idx_products_category   ON public.products(category_id);
CREATE INDEX idx_products_featured   ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_slug       ON public.products(slug);
CREATE INDEX idx_categories_slug     ON public.categories(slug);
CREATE INDEX idx_carts_user          ON public.carts(user_id);
CREATE INDEX idx_cart_items_cart     ON public.cart_items(cart_id);
CREATE INDEX idx_orders_user         ON public.orders(user_id);
CREATE INDEX idx_orders_status       ON public.orders(status);
CREATE INDEX idx_order_items_order   ON public.order_items(order_id);


-- ===================
-- 5. Enable RLS
-- ===================

ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;


-- ===================
-- 6. RLS Policies
-- ===================

-- ─── profiles ───────────────────────────────────────────────

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- Admins / Managers can read all profiles
CREATE POLICY "profiles_select_staff"
  ON public.profiles FOR SELECT
  USING (public.get_user_role() IN ('admin', 'manager'));

-- Users can insert their own profile (sign-up)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ─── categories ─────────────────────────────────────────────

-- Public read
CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  USING (true);

-- Staff write
CREATE POLICY "categories_insert_staff"
  ON public.categories FOR INSERT
  WITH CHECK (public.get_user_role() IN ('admin', 'manager'));

CREATE POLICY "categories_update_staff"
  ON public.categories FOR UPDATE
  USING (public.get_user_role() IN ('admin', 'manager'));

CREATE POLICY "categories_delete_staff"
  ON public.categories FOR DELETE
  USING (public.get_user_role() IN ('admin', 'manager'));

-- ─── products ───────────────────────────────────────────────

-- Public read
CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  USING (true);

-- Staff write
CREATE POLICY "products_insert_staff"
  ON public.products FOR INSERT
  WITH CHECK (public.get_user_role() IN ('admin', 'manager'));

CREATE POLICY "products_update_staff"
  ON public.products FOR UPDATE
  USING (public.get_user_role() IN ('admin', 'manager'));

CREATE POLICY "products_delete_staff"
  ON public.products FOR DELETE
  USING (public.get_user_role() IN ('admin', 'manager'));

-- ─── carts ──────────────────────────────────────────────────

-- Users can CRUD their own cart
CREATE POLICY "carts_select_own"
  ON public.carts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "carts_insert_own"
  ON public.carts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "carts_update_own"
  ON public.carts FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "carts_delete_own"
  ON public.carts FOR DELETE
  USING (user_id = auth.uid());

-- Staff full access
CREATE POLICY "carts_select_staff"
  ON public.carts FOR SELECT
  USING (public.get_user_role() IN ('admin', 'manager'));

CREATE POLICY "carts_all_staff"
  ON public.carts FOR ALL
  USING (public.get_user_role() IN ('admin', 'manager'));

-- ─── cart_items ─────────────────────────────────────────────

-- Users can manage items in their own cart (join through carts)
CREATE POLICY "cart_items_select_own"
  ON public.cart_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "cart_items_insert_own"
  ON public.cart_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "cart_items_update_own"
  ON public.cart_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "cart_items_delete_own"
  ON public.cart_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = auth.uid()
    )
  );

-- Staff full access
CREATE POLICY "cart_items_all_staff"
  ON public.cart_items FOR ALL
  USING (public.get_user_role() IN ('admin', 'manager'));

-- ─── orders ─────────────────────────────────────────────────

-- Users can read their own orders
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own orders
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Staff full access
CREATE POLICY "orders_select_staff"
  ON public.orders FOR SELECT
  USING (public.get_user_role() IN ('admin', 'manager'));

CREATE POLICY "orders_all_staff"
  ON public.orders FOR ALL
  USING (public.get_user_role() IN ('admin', 'manager'));

-- ─── order_items ────────────────────────────────────────────

-- Users can read items from their own orders
CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- Users can insert items into their own orders
CREATE POLICY "order_items_insert_own"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- Staff full access
CREATE POLICY "order_items_all_staff"
  ON public.order_items FOR ALL
  USING (public.get_user_role() IN ('admin', 'manager'));


-- ============================================================
-- 7. Auto-create profile on sign-up (trigger)
-- ============================================================
-- Automatically inserts a row into public.profiles when a new
-- user is created in auth.users so the profile always exists.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
