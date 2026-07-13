-- Create storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read access to product images
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- Policy to allow admin and manager roles to upload product images
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
TO authenticated 
USING (
  bucket_id = 'product-images' AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
);

-- Policy to allow admin and manager roles to delete product images
CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'product-images' AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
);
