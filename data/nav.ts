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
    href: "/products?gender=men",
    megaMenu: [
      {
        title: "SHOES",
        links: [
          { label: "Sneakers", href: "/products/men/shoes/sneakers" },
          { label: "Running Shoes", href: "/products/men/shoes/running" },
          { label: "Walking Shoes", href: "/products/men/shoes/walking" },
          { label: "Slides & Sandals", href: "/products/men/shoes/sandals" },
        ],
      },
      {
        title: "CLOTHING",
        links: [
          { label: "Shorts", href: "/products/men/clothing/shorts" },
          { label: "Pants", href: "/products/men/clothing/pants" },
          { label: "Shirts & Tops", href: "/products/men/clothing/shirts" },
          { label: "Hoodies & Sweatshirts", href: "/products/men/clothing/hoodies" },
        ],
      },
      {
        title: "ACCESSORIES",
        links: [
          { label: "Socks", href: "/products/men/accessories/socks" },
          { label: "Hats & Beanies", href: "/products/men/accessories/hats" },
          { label: "Bags & Backpacks", href: "/products/men/accessories/bags" },
        ],
      },
      {
        title: "SPORTS",
        links: [
          { label: "Soccer", href: "/products/men/sports/soccer" },
          { label: "Running", href: "/products/men/sports/running" },
          { label: "Basketball", href: "/products/men/sports/basketball" },
        ],
      },
    ],
  },
  {
    label: "WOMEN",
    href: "/products?gender=women",
    megaMenu: [
      {
        title: "SHOES",
        links: [
          { label: "Sneakers", href: "/products/women/shoes/sneakers" },
          { label: "Running Shoes", href: "/products/women/shoes/running" },
          { label: "Walking Shoes", href: "/products/women/shoes/walking" },
        ],
      },
      {
        title: "CLOTHING",
        links: [
          { label: "Shorts", href: "/products/women/clothing/shorts" },
          { label: "Pants", href: "/products/women/clothing/pants" },
          { label: "Shirts & Tops", href: "/products/women/clothing/shirts" },
          { label: "Hoodies & Sweatshirts", href: "/products/women/clothing/hoodies" },
        ],
      },
      {
        title: "ACCESSORIES",
        links: [
          { label: "Socks", href: "/products/women/accessories/socks" },
          { label: "Hats & Beanies", href: "/products/women/accessories/hats" },
          { label: "Bags & Backpacks", href: "/products/women/accessories/bags" },
        ],
      },
    ],
  },
  {
    label: "KIDS",
    href: "/products?gender=kids",
    megaMenu: [
      {
        title: "SHOES",
        links: [
          { label: "Sneakers", href: "/products/kids/shoes/sneakers" },
          { label: "Running Shoes", href: "/products/kids/shoes/running" },
        ],
      },
      {
        title: "CLOTHING",
        links: [
          { label: "Shorts", href: "/products/kids/clothing/shorts" },
          { label: "Shirts & Tops", href: "/products/kids/clothing/shirts" },
        ],
      },
    ]
  },
  { label: "SALE", href: "/sale" },
  { label: "SPORTS", href: "/sports" },
];
