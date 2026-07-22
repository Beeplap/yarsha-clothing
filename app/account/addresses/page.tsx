"use client";

import { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Primary Address",
      phone: "+977 9801234567",
      street: "Durbar Marg, Ward No. 1",
      city: "Kathmandu",
      isDefault: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Kathmandu");

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      id: Date.now().toString(),
      name: name || "Saved Address",
      phone,
      street,
      city,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, newAddr]);
    setShowModal(false);
    setName("");
    setPhone("");
    setStreet("");
    toast.success("New shipping address added!");
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success("Address deleted");
  };

  return (
    <div style={{ fontFamily: "var(--body-font)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, textTransform: "uppercase" }}>Address Book</h1>
          <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)" }}>
            Manage your saved shipping addresses for faster checkout.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "0.75rem 1.25rem",
            borderRadius: "24px",
            backgroundColor: "var(--accent)",
            color: "#ffffff",
            border: "none",
            fontWeight: 800,
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div style={{ padding: "3rem 1rem", textAlign: "center", border: "1px dashed color-mix(in srgb, var(--foreground) 20%, transparent)", borderRadius: "16px" }}>
          <MapPin size={36} style={{ color: "color-mix(in srgb, var(--foreground) 40%, transparent)", margin: "0 auto 1rem auto" }} />
          <p style={{ fontWeight: 700, margin: "0 0 0.5rem 0" }}>No saved addresses yet</p>
          <button onClick={() => setShowModal(true)} style={{ color: "var(--accent)", fontWeight: 800, border: "none", background: "none", cursor: "pointer" }}>
            + Add your first address
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)",
                borderRadius: "16px",
                padding: "1.5rem",
                backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "1rem"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontWeight: 800, fontSize: "1rem" }}>{addr.name}</span>
                  {addr.isDefault && (
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)", padding: "2px 8px", borderRadius: "10px" }}>
                      DEFAULT
                    </span>
                  )}
                </div>

                <p style={{ fontSize: "0.9rem", color: "color-mix(in srgb, var(--foreground) 80%, transparent)", margin: "0 0 0.25rem 0", lineHeight: 1.4 }}>
                  {addr.street}
                </p>
                <p style={{ fontSize: "0.9rem", color: "color-mix(in srgb, var(--foreground) 80%, transparent)", margin: "0 0 0.5rem 0" }}>
                  {addr.city}, Nepal
                </p>
                <p style={{ fontSize: "0.85rem", color: "color-mix(in srgb, var(--foreground) 60%, transparent)", margin: 0 }}>
                  Phone: {addr.phone}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid color-mix(in srgb, var(--foreground) 8%, transparent)", paddingTop: "0.75rem" }}>
                <button onClick={() => deleteAddress(addr.id)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ backgroundColor: "var(--background)", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: "450px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 1.25rem 0" }}>Add New Address</h3>
            <form onSubmit={handleAddAddress} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>LABEL NAME</label>
                <input type="text" placeholder="e.g. Home, Office" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>STREET ADDRESS</label>
                <input type="text" required placeholder="House/Flat No., Tole, Ward" value={street} onChange={(e) => setStreet(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>CITY</label>
                <select value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", outline: "none" }}>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Chitwan">Chitwan</option>
                  <option value="Dharan">Dharan</option>
                  <option value="Butwal">Butwal</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>PHONE NUMBER</label>
                <input type="text" required placeholder="+977 98XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)", outline: "none" }} />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "0.75rem", borderRadius: "20px", border: "1px solid color-mix(in srgb, var(--foreground) 20%, transparent)", background: "none", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: "0.75rem", borderRadius: "20px", backgroundColor: "var(--accent)", color: "#ffffff", border: "none", fontWeight: 800, cursor: "pointer" }}>Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
