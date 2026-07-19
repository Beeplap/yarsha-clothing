export type Testimonial = {
  author: string;
  title: string;
  message: string;
  /** WebP filename inside `public/profile/` */
  image: string;
};

export const testimonials: Testimonial[] = [
   {
    author: "Rajendra Kandel",
    title: "Managing Director / Avenue Butwal",
    message:
      "When we needed a rapid, high-quality overhaul of our consultancy website, Yarsha Byte stepped up and crushed the one week deadline. Their speed didn't come at the cost of precision they are absolute pros at what they do. Highly recommended!",
    image: "rajendra.webp",
  },
  {
    author: "Pratik Poudel",
    title: "Counselor / Avenue Butwal Education Consultancy",
    message:
      "They are friendly, engaging, and excellent at what they do. Great ideas and a clear interpretation of our needs.",
    image: "pratik.webp",
  },
  {
    author: "Dinesh Lamichhane",
    title: "Owner / Greenstar Suppliers",
    message:
      "Among the agencies we spoke with, Yarsha Byte stood out quickly. Their relivant experience, clear understanding of our needs, and competitive pricing made them the obvious choice. They delivered a fantastic website that exceeded our expectations.",
    image: "dinesh.webp",
  },
  {
    author: "Manish G.C",
    title: "Marketing Lead / Avenue Butwal",
    message:
      "Really appreciate the work Yarsha Byte has done for us. We wanted our revised consultancy website within a week and they delivered it within the deadline. Truly a team of professionals.",
    image: "manish.webp",
  },
  
];
