import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About Us | Yarsha Clothing",
  description: "Learn more about Yarsha Clothing, a premium sub-brand of Yarsha Byte.",
};

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero__content">
          <h1 className="about-hero__title">
            Crafting Premium <br />
            Apparel for the Modern Era.
          </h1>
          <p className="about-hero__subtitle">
            Yarsha Clothing is a proudly crafted sub-brand of Yarsha Byte, bridging the gap between innovative technology and timeless fashion.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="about-story__container">
          <div className="about-story__image-wrapper">
            <div className="about-story__image-placeholder" style={{
              backgroundColor: "var(--color-neutral-100)",
              width: "100%",
              aspectRatio: "3/4",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-neutral-400)"
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          </div>
          
          <div className="about-story__text">
            <h2 className="about-story__heading">Our Story</h2>
            <p>
              Born from the creative ecosystem of <strong>Yarsha Byte</strong>, Yarsha Clothing was founded with a singular vision: to create apparel that reflects the precision, ambition, and minimalism of modern design.
            </p>
            <p>
              We believe that what you wear is an extension of your craft. Our collections are meticulously designed to offer unparalleled comfort and effortless style, whether you are engineering the future or navigating the urban landscape.
            </p>
            <p>
              Every garment is crafted using sustainably sourced, premium materials, ensuring that our footprint is as refined as our aesthetics.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="about-values__container">
          <h2 className="about-values__heading">Our Core Values</h2>
          
          <div className="about-values__grid">
            <div className="value-card">
              <h3 className="value-card__title">Uncompromising Quality</h3>
              <p className="value-card__desc">
                We obsess over every thread, seam, and fabric choice. If it isn't exceptional, it doesn't carry the Yarsha name.
              </p>
            </div>
            
            <div className="value-card">
              <h3 className="value-card__title">Minimalist Design</h3>
              <p className="value-card__desc">
                True elegance lies in simplicity. Our designs strip away the unnecessary to focus on form, function, and fit.
              </p>
            </div>
            
            <div className="value-card">
              <h3 className="value-card__title">Sustainable Innovation</h3>
              <p className="value-card__desc">
                We leverage the forward-thinking ethos of Yarsha Byte to pioneer sustainable manufacturing processes in fashion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-cta__content">
          <h2 className="about-cta__title">Experience the Collection</h2>
          <Link href="/products" className="auth-button" style={{ display: "inline-flex", width: "auto", padding: "1rem 3rem" }}>
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
