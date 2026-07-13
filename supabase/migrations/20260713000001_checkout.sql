-- Add size column to cart_items and order_items
ALTER TABLE public.cart_items ADD COLUMN size TEXT;
ALTER TABLE public.order_items ADD COLUMN size TEXT;

-- Update unique constraint on cart_items to include size so users can have different sizes of the same product
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_cart_id_product_id_key;
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_cart_id_product_id_size_key UNIQUE NULLS NOT DISTINCT (cart_id, product_id, size);

-- Create RPC for checkout transaction
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
BEGIN
  -- Get user_id from auth.uid()
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify cart belongs to user
  IF NOT EXISTS (SELECT 1 FROM public.carts WHERE id = p_cart_id AND user_id = v_user_id) THEN
    RAISE EXCEPTION 'Cart not found or unauthorized';
  END IF;

  -- Calculate total amount and check stock
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

  -- Create order
  INSERT INTO public.orders (user_id, status, total_amount, shipping_address, payment_status)
  VALUES (v_user_id, 'pending', v_total_amount, p_shipping_address, 'unpaid')
  RETURNING id INTO v_order_id;

  -- Insert order items and deduct stock
  FOR v_item IN (
    SELECT ci.product_id, ci.quantity, p.price, ci.size
    FROM public.cart_items ci
    JOIN public.products p ON p.id = ci.product_id
    WHERE ci.cart_id = p_cart_id
  ) LOOP
    INSERT INTO public.order_items (order_id, product_id, quantity, price_at_purchase, size)
    VALUES (v_order_id, v_item.product_id, v_item.quantity, v_item.price, v_item.size);

    -- Deduct stock
    UPDATE public.products
    SET stock_quantity = stock_quantity - v_item.quantity
    WHERE id = v_item.product_id;
  END LOOP;

  -- Clear cart items
  DELETE FROM public.cart_items WHERE cart_id = p_cart_id;

  RETURN v_order_id;
END;
$$;
