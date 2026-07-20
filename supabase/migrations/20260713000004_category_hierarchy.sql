-- Add parent-child relationship to categories for mega-menu
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('Men', 'Women', 'Kids', 'Unisex', 'None')) DEFAULT 'None',
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_gender ON public.categories(gender);
