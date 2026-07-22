export interface SubMenuColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface NavCategory {
  label: string;
  href: string;
  megaMenu?: SubMenuColumn[];
}

export const menuLinks: NavCategory[] = [
  {
    label: "MEN",
    href: "/products?category=shoes",
    megaMenu: [
      {
        title: "SHOES",
        links: [
          { label: "Sneakers", href: "/products?category=shoes" },
          { label: "Running Shoes", href: "/products?category=shoes" },
          { label: "Walking Shoes", href: "/products?category=shoes" },
          { label: "Slides & Sandals", href: "/products?category=shoes" },
        ],
      },
      {
        title: "CLOTHING",
        links: [
          { label: "Shorts", href: "/products?category=clothing" },
          { label: "Pants", href: "/products?category=clothing" },
          { label: "Shirts & Tops", href: "/products?category=clothing" },
          { label: "Hoodies & Sweatshirts", href: "/products?category=clothing" },
        ],
      },
      {
        title: "ACCESSORIES",
        links: [
          { label: "Socks", href: "/products?category=accessories" },
          { label: "Hats & Beanies", href: "/products?category=accessories" },
          { label: "Bags & Backpacks", href: "/products?category=accessories" },
        ],
      },
      {
        title: "SPORTS",
        links: [
          { label: "Soccer", href: "/products?category=sports" },
          { label: "Running", href: "/products?category=sports" },
          { label: "Basketball", href: "/products?category=sports" },
        ],
      },
    ],
  },
  {
    label: "WOMEN",
    href: "/products?category=clothing",
    megaMenu: [
      {
        title: "SHOES",
        links: [
          { label: "Sneakers", href: "/products?category=shoes" },
          { label: "Running Shoes", href: "/products?category=shoes" },
          { label: "Walking Shoes", href: "/products?category=shoes" },
        ],
      },
      {
        title: "CLOTHING",
        links: [
          { label: "Shorts", href: "/products?category=clothing" },
          { label: "Pants", href: "/products?category=clothing" },
          { label: "Shirts & Tops", href: "/products?category=clothing" },
          { label: "Hoodies & Sweatshirts", href: "/products?category=clothing" },
        ],
      },
      {
        title: "ACCESSORIES",
        links: [
          { label: "Socks", href: "/products?category=accessories" },
          { label: "Hats & Beanies", href: "/products?category=accessories" },
          { label: "Bags & Backpacks", href: "/products?category=accessories" },
        ],
      },
    ],
  },
  {
    label: "KIDS",
    href: "/products?category=collections",
    megaMenu: [
      {
        title: "SHOES",
        links: [
          { label: "Sneakers", href: "/products?category=shoes" },
          { label: "Running Shoes", href: "/products?category=shoes" },
        ],
      },
      {
        title: "CLOTHING",
        links: [
          { label: "Shorts", href: "/products?category=clothing" },
          { label: "Shirts & Tops", href: "/products?category=clothing" },
        ],
      },
    ],
  },
  { label: "SALE", href: "/sale" },
  { label: "SPORTS", href: "/sports" },
];
