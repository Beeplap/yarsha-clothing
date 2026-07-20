-- Add sizes and colors to products table to support variations
ALTER TABLE public.products
ADD COLUMN sizes TEXT[] DEFAULT '{}',
ADD COLUMN colors TEXT[] DEFAULT '{}';
