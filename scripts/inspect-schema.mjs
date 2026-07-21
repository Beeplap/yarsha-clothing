import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kwkiroksmsjcpdenhpub.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a2lyb2tzbXNqY3BkZW5ocHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzczNTEsImV4cCI6MjA5OTUxMzM1MX0.xKowIWqOcLuYUcbpo7iYEjEdjUKPP3oICDVC7ewJYdc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspect() {
  const { data, error } = await supabase.from("products").select("*").limit(1);
  if (error) {
    console.error("Fetch error:", error);
  } else {
    console.log("Sample product row:", data[0]);
  }
}

inspect();
