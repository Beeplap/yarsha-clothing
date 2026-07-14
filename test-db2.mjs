import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kwkiroksmsjcpdenhpub.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a2lyb2tzbXNqY3BkZW5ocHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzczNTEsImV4cCI6MjA5OTUxMzM1MX0.xKowIWqOcLuYUcbpo7iYEjEdjUKPP3oICDVC7ewJYdc";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const { data, error } = await supabase.from('cart_items').select('size').limit(1);
  if (error) console.error(error.message);
  else console.log("Size column exists!", data);
}

checkColumns();
