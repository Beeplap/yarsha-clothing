import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account/orders");
  }

  return (
    <div className="account-layout" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', gap: '2rem', minHeight: '80vh' }}>
      <aside className="account-sidebar" style={{ width: '250px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>My Account</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/account/orders" style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', color: '#00d4ff', fontWeight: 500 }}>
            Order History
          </Link>
          <form action="/auth/logout" method="post">
            <button type="submit" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.75rem 1rem', width: '100%', textAlign: 'left', fontWeight: 500 }}>
              Sign Out
            </button>
          </form>
        </nav>
      </aside>
      <main className="account-content" style={{ flexGrow: 1 }}>
        {children}
      </main>
    </div>
  );
}
