import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kwkiroksmsjcpdenhpub.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a2lyb2tzbXNqY3BkZW5ocHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzczNTEsImV4cCI6MjA5OTUxMzM1MX0.xKowIWqOcLuYUcbpo7iYEjEdjUKPP3oICDVC7ewJYdc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const WEARABLES_IMAGES = [
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
];

const ADJECTIVES = [
  "Heavyweight", "Oversized", "Vintage Washed", "Minimalist", "Tactical",
  "Collegiate", "Signature", "Heritage", "Urban", "Tech Fleece",
  "Essential", "Classic", "Premium", "Performance", "Relaxed Fit",
  "Reflective", "Sherpa Lined", "Distressed", "Monogram", "Cozy",
];

const NOUNS = [
  "Puffer Jacket", "Denim Jacket", "Bomber Coat", "Biker Leather Jacket", "Parka Coat",
  "Pullover Hoodie", "Heavyweight Sweatshirt", "Zip Hoodie", "Graphic Tee", "Crewneck T-Shirt",
  "Boxy Fit Tee", "Tactical Cargo Pants", "Slim Fit Denim", "Relaxed Joggers", "Track Pants",
  "Retro Running Sneakers", "High Top Sneakers", "Chunky Dad Shoes", "Chronograph Leather Watch",
  "Minimalist Steel Watch", "Crossbody Streetwear Bag", "Utility Vest", "Polo Shirt", "Bucket Hat"
];

async function seed() {
  console.log("🔑 Authenticating Seeder Admin...");

  const email = "seederadmin2026@gmail.com";
  const password = "YarshaAdmin2026!";

  let user = null;
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.log("Signing up user...");
    const { data: signUpData } = await supabase.auth.signUp({ email, password });
    user = signUpData?.user;
  } else {
    user = signInData?.user;
  }

  if (user) {
    console.log("Setting user role to admin...");
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, role: "admin", full_name: "Yarsha System Admin" });
    if (profileError) console.error("Profile set error:", profileError.message);
  }

  console.log("🚀 Starting insertion of 200 Wearable products into Supabase...");

  const { data: categories } = await supabase.from("categories").select("id, name, slug");
  const categoryIds = (categories || []).map((c) => c.id);

  const now = Date.now();
  const productsToInsert = [];

  for (let i = 1; i <= 200; i++) {
    const adj = ADJECTIVES[(i - 1) % ADJECTIVES.length];
    const noun = NOUNS[(i - 1) % NOUNS.length];

    const name = `Yarsha ${adj} ${noun} Vol. ${i}`;
    const slug = `yarsha-${adj.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${noun.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${now}-${i}`;

    const basePrice = Math.floor(12 + ((i * 7) % 165)) * 100 + 99; // Rs. 1,299 - Rs. 17,699
    const isDiscounted = i % 3 === 0;
    const compareAtPrice = isDiscounted ? Math.floor(basePrice * 1.3) : null;

    const img1 = WEARABLES_IMAGES[(i - 1) % WEARABLES_IMAGES.length];
    const img2 = WEARABLES_IMAGES[(i + 4) % WEARABLES_IMAGES.length];

    const category_id = categoryIds.length > 0 ? categoryIds[i % categoryIds.length] : null;

    productsToInsert.push({
      name,
      slug,
      description: `Official Yarsha Wears collection. The ${name} features high-density fabric, ergonomic fit, and durable craftsmanship designed for daily wear in Nepal.`,
      price: basePrice,
      compare_at_price: compareAtPrice,
      stock_quantity: 20 + (i % 65),
      category_id,
      images: [img1, img2],
      is_featured: i <= 12 || i % 10 === 0,
    });
  }

  console.log(`📦 Prepared 200 items. Executing batch inserts...`);

  const BATCH_SIZE = 50;
  let totalInserted = 0;

  for (let b = 0; b < productsToInsert.length; b += BATCH_SIZE) {
    const chunk = productsToInsert.slice(b, b + BATCH_SIZE);
    const { data, error: insertErr } = await supabase.from("products").insert(chunk).select("id");

    if (insertErr) {
      console.error(`❌ Batch ${b / BATCH_SIZE + 1} failed:`, insertErr.message);
    } else {
      totalInserted += data.length;
      console.log(`✨ Batch ${b / BATCH_SIZE + 1} (${data.length} products) inserted successfully!`);
    }
  }

  console.log(`🎉 Complete! Successfully inserted ${totalInserted} wearable products into Supabase.`);
}

seed();
