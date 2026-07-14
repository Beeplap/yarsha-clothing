import { redirect } from "next/navigation";

export default async function DummyWalletPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId as string;
  const amount = resolvedParams.amount as string;

  if (!orderId) {
    redirect("/");
  }

  return (
    <div className="admin-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '1rem', padding: '3rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Digital Wallet Payment</h1>
        <p style={{ color: '#a3a3a3', marginBottom: '2rem' }}>
          Simulating payment of <strong>Rs. {Number(amount).toLocaleString()}</strong> for Order #{orderId.split('-')[0].toUpperCase()}
        </p>

        <form action={`/api/dummy-wallet/process`} method="POST">
          <input type="hidden" name="orderId" value={orderId} />
          <button type="submit" className="auth-button" style={{ background: '#22c55e', color: '#000' }}>
            Confirm Payment
          </button>
        </form>
        
        <a href={`/checkout/success?order=${orderId}`} style={{ display: 'block', marginTop: '1rem', color: '#a3a3a3', fontSize: '0.9rem', textDecoration: 'underline' }}>
          Cancel and return to store
        </a>
      </div>
    </div>
  );
}
