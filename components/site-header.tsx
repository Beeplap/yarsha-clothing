"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const MEGA_MENU = [
  {
    name: "MEN",
    href: "/products?category=men",
    sections: [
      {
        title: "NEW & TRENDING",
        links: [
          { name: "New Arrivals", href: "/products?category=new" },
          { name: "Best Sellers", href: "/products?category=best-sellers" },
        ]
      },
      {
        title: "SHOES",
        links: [
          { name: "Sneakers", href: "/products?category=sneakers" },
          { name: "Running Shoes", href: "/products?category=running-shoes" },
        ]
      },
      {
        title: "CLOTHING",
        links: [
          { name: "Shirts", href: "/products?category=shirts" },
          { name: "Pants", href: "/products?category=pants" },
        ]
      }
    ]
  },
  {
    name: "WOMEN",
    href: "/products?category=women",
    sections: [
      {
        title: "NEW & TRENDING",
        links: [
          { name: "New Arrivals", href: "/products?category=new" },
          { name: "Best Sellers", href: "/products?category=best-sellers" },
        ]
      },
      {
        title: "SHOES",
        links: [
          { name: "Sneakers", href: "/products?category=sneakers" },
          { name: "Heels", href: "/products?category=heels" },
        ]
      },
      {
        title: "CLOTHING",
        links: [
          { name: "Dresses", href: "/products?category=dresses" },
          { name: "Tops", href: "/products?category=tops" },
        ]
      }
    ]
  },
  {
    name: "KIDS",
    href: "/products?category=kids",
    sections: []
  },
  {
    name: "SALE",
    href: "/products?category=sale",
    sections: []
  },
  {
    name: "SPORTS",
    href: "/products?category=sports",
    sections: []
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Hide entirely in admin panel
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const activeMenu = MEGA_MENU.find((m) => m.name === hoveredItem);

  return (
    <header className="fixed inset-x-0 top-4 z-[90] pointer-events-auto px-4 md:px-8">
      <div 
        className="mx-auto max-w-7xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm transition-all duration-300"
        style={{ borderRadius: "2rem" }}
      >
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="Yarsha Byte home">
            <h1 className="font-bold text-2xl tracking-tighter uppercase">Yarsha</h1>
          </Link>

          {/* Nav Links */}
          <nav 
            className="hidden md:flex h-full"
            onMouseLeave={() => setHoveredItem(null)}
          >
            {MEGA_MENU.map((item) => (
              <div 
                key={item.name} 
                className="h-full flex items-center px-4 cursor-pointer"
                onMouseEnter={() => setHoveredItem(item.name)}
              >
                <Link 
                  href={item.href} 
                  className="font-bold text-sm tracking-wide uppercase hover:text-accent transition-colors"
                >
                  {item.name}
                </Link>
              </div>
            ))}

            {/* Mega Menu Dropdown */}
            {hoveredItem && activeMenu && activeMenu.sections.length > 0 && (
              <div 
                className="absolute top-[100%] left-0 w-full bg-white border-t border-gray-100 shadow-xl overflow-hidden"
                style={{ borderBottomLeftRadius: "1.5rem", borderBottomRightRadius: "1.5rem" }}
              >
                <div className="max-w-7xl mx-auto px-6 py-8 flex gap-12">
                  {activeMenu.sections.map((section) => (
                    <div key={section.title} className="flex flex-col gap-4">
                      <h3 className="font-bold text-sm uppercase tracking-wider">{section.title}</h3>
                      <ul className="flex flex-col gap-2">
                        {section.links.map((link) => (
                          <li key={link.name}>
                            <Link 
                              href={link.href}
                              className="text-gray-600 hover:text-black hover:underline text-sm"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-sm font-bold uppercase hover:text-accent transition-colors">
              Cart
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
