import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kwkiroksmsjcpdenhpub.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a2lyb2tzbXNqY3BkZW5ocHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzczNTEsImV4cCI6MjA5OTUxMzM1MX0.xKowIWqOcLuYUcbpo7iYEjEdjUKPP3oICDVC7ewJYdc";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCarts() {
  const { data: carts, error } = await supabase.from('carts').select('*, cart_items(*)');
  console.log("Carts:", JSON.stringify(carts, null, 2));
}

checkCarts();
