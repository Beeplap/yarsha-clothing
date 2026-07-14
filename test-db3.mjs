import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kwkiroksmsjcpdenhpub.supabase.co";
// Need service role key to test everything securely or we can just log in as a test user
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a2lyb2tzbXNqY3BkZW5ocHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzczNTEsImV4cCI6MjA5OTUxMzM1MX0.xKowIWqOcLuYUcbpo7iYEjEdjUKPP3oICDVC7ewJYdc";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testCheckout() {
  // 1. Create a test user
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: 'test_checkout_' + Date.now() + '@example.com',
    password: 'password123'
  });
  
  if (authErr) {
    console.error("Auth err:", authErr);
    return;
  }
  
  const user = authData.user;
  
  // 2. Fetch a product
  const { data: products } = await supabase.from('products').select('*').limit(1);
  const product = products[0];
  
  // 3. Create a cart
  const { data: cart, error: cartErr } = await supabase.from('carts').insert({ user_id: user.id }).select().single();
  
  // 4. Add item to cart
  const { error: itemErr } = await supabase.from('cart_items').insert({
    cart_id: cart.id,
    product_id: product.id,
    quantity: 1,
    size: 'M'
  });
  
  // 5. Checkout
  const { data: orderId, error: checkoutErr } = await supabase.rpc('checkout_cart', {
    p_cart_id: cart.id,
    p_shipping_address: { via: "whatsapp" }
  });
  
  console.log("Checkout result:", { orderId, checkoutErr });
}

testCheckout();
