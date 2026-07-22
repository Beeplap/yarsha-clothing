-- ==============================================
-- Seed Categories & Link Seeded Products
-- ==============================================

-- 1. Insert categories
INSERT INTO public.categories (name, slug)
VALUES
  ('Shoes', 'shoes'),
  ('Clothing', 'clothing'),
  ('Accessories', 'accessories'),
  ('Sports', 'sports'),
  ('Collections', 'collections')
ON CONFLICT (slug) DO NOTHING;

-- 2. Link products to categories based on name keywords
UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'shoes')
WHERE category_id IS NULL AND (
  name ILIKE '%shoes%' OR
  name ILIKE '%sneakers%' OR
  name ILIKE '%slides%' OR
  name ILIKE '%sandals%'
);

UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'accessories')
WHERE category_id IS NULL AND (
  name ILIKE '%watch%' OR
  name ILIKE '%bag%' OR
  name ILIKE '%hat%' OR
  name ILIKE '%backpack%' OR
  name ILIKE '%socks%'
);

UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'sports')
WHERE category_id IS NULL AND (
  name ILIKE '%soccer%' OR
  name ILIKE '%basketball%' OR
  name ILIKE '%running%' OR
  name ILIKE '%performance%' OR
  name ILIKE '%track pants%' OR
  name ILIKE '%joggers%'
);

UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'clothing')
WHERE category_id IS NULL AND (
  name ILIKE '%jacket%' OR
  name ILIKE '%coat%' OR
  name ILIKE '%hoodie%' OR
  name ILIKE '%sweatshirt%' OR
  name ILIKE '%tee%' OR
  name ILIKE '%t-shirt%' OR
  name ILIKE '%pants%' OR
  name ILIKE '%shorts%' OR
  name ILIKE '%shirt%' OR
  name ILIKE '%polo%' OR
  name ILIKE '%vest%' OR
  name ILIKE '%parka%' OR
  name ILIKE '%denim%' OR
  name ILIKE '%fleece%'
);

-- Default remaining products to collections
UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'collections')
WHERE category_id IS NULL;
