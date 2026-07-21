-- ============================================================
-- Yarsha Wears — YarshaClub Loyalty Points & User History Migration
-- ============================================================

-- 1. Extend profiles table with loyalty points and login tracking
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS points INTEGER NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS is_yarshaclub_member BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_login_date DATE DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS login_streak INTEGER DEFAULT 1;

-- 2. Create points_log table for points transaction history
CREATE TABLE IF NOT EXISTS public.points_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create recently_viewed table for user browsing history
CREATE TABLE IF NOT EXISTS public.recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.points_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

-- RLS Policies for points_log
CREATE POLICY "points_log_select_own"
  ON public.points_log FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "points_log_insert_own"
  ON public.points_log FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for recently_viewed
CREATE POLICY "recently_viewed_select_own"
  ON public.recently_viewed FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "recently_viewed_insert_own"
  ON public.recently_viewed FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "recently_viewed_update_own"
  ON public.recently_viewed FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "recently_viewed_delete_own"
  ON public.recently_viewed FOR DELETE
  USING (user_id = auth.uid());

-- 4. RPC to record recently viewed items
CREATE OR REPLACE FUNCTION public.record_recently_viewed(p_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.recently_viewed (user_id, product_id, viewed_at)
  VALUES (v_user_id, p_product_id, now())
  ON CONFLICT (user_id, product_id)
  DO UPDATE SET viewed_at = EXCLUDED.viewed_at;
END;
$$;

-- 5. RPC to claim daily login bonus points
CREATE OR REPLACE FUNCTION public.claim_daily_login_bonus()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_last_date DATE;
  v_streak INT := 1;
  v_bonus_points INT := 10;
  v_new_points INT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  SELECT last_login_date, login_streak, points
  INTO v_last_date, v_streak, v_new_points
  FROM public.profiles
  WHERE id = v_user_id;

  IF v_last_date = CURRENT_DATE THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Daily bonus already claimed today',
      'points', v_new_points
    );
  END IF;

  IF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    v_streak := COALESCE(v_streak, 0) + 1;
  ELSE
    v_streak := 1;
  END IF;

  -- Calculate streak bonus (e.g. 10 points base + bonus for streaks)
  v_bonus_points := 10 + LEAST(v_streak * 2, 20);

  UPDATE public.profiles
  SET 
    points = COALESCE(points, 0) + v_bonus_points,
    last_login_date = CURRENT_DATE,
    login_streak = v_streak
  WHERE id = v_user_id
  RETURNING points INTO v_new_points;

  INSERT INTO public.points_log (user_id, points, reason)
  VALUES (v_user_id, v_bonus_points, 'Daily Login Bonus (Streak: ' || v_streak || ' days)');

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Claimed ' || v_bonus_points || ' bonus points!',
    'points_added', v_bonus_points,
    'total_points', v_new_points,
    'streak', v_streak
  );
END;
$$;

-- 6. Trigger to handle new user setup with 100 signup points & customer role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, points, is_yarshaclub_member, last_login_date)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Customer'),
    'customer',
    100,
    true,
    CURRENT_DATE
  )
  ON CONFLICT (id) DO UPDATE SET
    points = COALESCE(public.profiles.points, 100),
    is_yarshaclub_member = true;

  -- Record initial signup bonus
  INSERT INTO public.points_log (user_id, points, reason)
  VALUES (NEW.id, 100, 'YarshaClub Signup Welcome Bonus');

  RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Update checkout_cart RPC function to calculate points per order (1 pt per 100 Rs)
CREATE OR REPLACE FUNCTION public.checkout_cart(
  p_cart_id UUID,
  p_shipping_address JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_order_id UUID;
  v_total_amount NUMERIC(10, 2) := 0;
  v_item RECORD;
  v_points_earned INT := 0;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.carts WHERE id = p_cart_id AND user_id = v_user_id) THEN
    RAISE EXCEPTION 'Cart not found or unauthorized';
  END IF;

  FOR v_item IN (
    SELECT ci.product_id, ci.quantity, p.price, p.stock_quantity, ci.size
    FROM public.cart_items ci
    JOIN public.products p ON p.id = ci.product_id
    WHERE ci.cart_id = p_cart_id
  ) LOOP
    IF v_item.stock_quantity < v_item.quantity THEN
      RAISE EXCEPTION 'Not enough stock for product %', v_item.product_id;
    END IF;
    v_total_amount := v_total_amount + (v_item.price * v_item.quantity);
  END LOOP;

  INSERT INTO public.orders (user_id, status, total_amount, shipping_address, payment_status)
  VALUES (v_user_id, 'pending', v_total_amount, p_shipping_address, 'unpaid')
  RETURNING id INTO v_order_id;

  FOR v_item IN (
    SELECT ci.product_id, ci.quantity, p.price, ci.size
    FROM public.cart_items ci
    JOIN public.products p ON p.id = ci.product_id
    WHERE ci.cart_id = p_cart_id
  ) LOOP
    INSERT INTO public.order_items (order_id, product_id, quantity, price_at_purchase, size)
    VALUES (v_order_id, v_item.product_id, v_item.quantity, v_item.price, v_item.size);

    UPDATE public.products
    SET stock_quantity = stock_quantity - v_item.quantity
    WHERE id = v_item.product_id;
  END LOOP;

  DELETE FROM public.cart_items WHERE cart_id = p_cart_id;

  -- Calculate loyalty points: 1 point per 100 Rs spent
  v_points_earned := FLOOR(v_total_amount / 100);
  IF v_points_earned > 0 THEN
    UPDATE public.profiles
    SET points = COALESCE(points, 0) + v_points_earned
    WHERE id = v_user_id;

    INSERT INTO public.points_log (user_id, points, reason)
    VALUES (v_user_id, v_points_earned, 'Earned from Order #' || SUBSTRING(v_order_id::text, 1, 8));
  END IF;

  RETURN v_order_id;
END;
$$;
