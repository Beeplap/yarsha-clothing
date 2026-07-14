import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import LenisProvider from "@/components/lenis-provider";
import GsapAnimations from "@/components/gsap-animations";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yarsha Clothing | Premium Apparel by Yarsha Byte",
  description:
    "Discover premium, modern clothing crafted with purpose. Yarsha Clothing is a sub-brand of Yarsha Byte — where tech meets textile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <LenisProvider>
          <CartProvider>
            <GsapAnimations />
            <div className="main-content">
              <Navbar />
              <main className="main-content__body">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
