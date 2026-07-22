export const metadata = {
  title: "Privacy Policy | Yarsha Wears",
  description: "Privacy policy, data collection, cookies, and protection terms for Yarsha Wears.",
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 5vw 5rem 5vw", fontFamily: "var(--body-font)", color: "var(--foreground)", lineHeight: 1.7 }}>
      
      <div style={{ marginBottom: "3rem", borderBottom: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)", paddingBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "var(--accent)" }}>
          LEGAL &amp; TRUST
        </span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: "0.5rem 0 0 0" }}>
          Privacy Policy
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", fontSize: "0.95rem", color: "color-mix(in srgb, var(--foreground) 85%, transparent)" }}>
        <p>
          At <strong>Yarsha Wears</strong> (a sub-brand of Yarsha Byte), we are committed to protecting your personal information and your right to privacy. This policy outlines how we collect, use, and safeguard your data when you visit our website or make a purchase.
        </p>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.5rem" }}>1. Information We Collect</h2>
          <p style={{ margin: 0 }}>
            We collect personal details that you provide when registering a YarshaClub account, placing an order, or contacting customer support. This includes your name, shipping address, email address, phone number, and transaction history.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.5rem" }}>2. How We Use Your Information</h2>
          <p style={{ margin: 0 }}>
            Your information is used strictly to process orders, deliver products, track YarshaClub reward points, send order status notifications, and improve our services. We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.5rem" }}>3. Data Security</h2>
          <p style={{ margin: 0 }}>
            All payment credentials, passwords, and sessions are encrypted using industry-standard SSL protocols and processed via secure channels.
          </p>
        </section>
      </div>

    </div>
  );
}
