import Link from "next/link";
import AboutClientAnimations from "@/components/about-client-animations";

export const metadata = {
  title: "About Us | Yarsha Clothing",
  description: "Learn more about Yarsha Clothing, a premium sub-brand of Yarsha Byte.",
};

export default function AboutPage() {
  return (
    <div className="about-page" style={{ background: '#0a0a0a', color: '#e5e5e5', overflow: 'hidden' }}>
      <AboutClientAnimations />

      {/* Hero Section */}
      <section className="about-hero noise-overlay hero-grid-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
        <div className="about-hero__gradient" style={{ position: 'absolute', top: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} aria-hidden="true" />
        
        <div className="about-hero__content" style={{ position: 'relative', zIndex: 10, padding: '0 2rem' }}>
          <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)', borderRadius: '30px', color: '#00d4ff', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem' }}>
            The Yarsha Vision
          </div>
          <h1 className="about-hero__title" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            We Build the
            <br />
            <span style={{ color: 'transparent', WebkitTextStroke: '2px #fff' }}>Future of</span>
            <br />
            <span style={{ backgroundImage: 'linear-gradient(90deg, #00d4ff, #0ea5e9)', WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.3))' }}>Fashion</span>
          </h1>
          <p className="about-hero__subtitle" style={{ fontSize: '1.25rem', color: '#a3a3a3', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Where technology meets textile. Where precision meets passion.
            <br />
            Yarsha Clothing is the wearable future, crafted today.
          </p>
        </div>
      </section>

      {/* Story Section (Pinning) */}
      <section className="about-story" style={{ padding: '8rem 2rem', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          
          <div className="about-story__visual-wrapper" style={{ flex: '1 1 400px', height: 'fit-content' }}>
            <div style={{ position: 'relative', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'conic-gradient(from 0deg, transparent, rgba(0, 212, 255, 0.1), transparent)', animation: 'spin 10s linear infinite' }} />
              <div style={{ position: 'absolute', inset: '1px', background: '#0a0a0a', borderRadius: '2rem', zIndex: 1 }} />
              
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <span style={{ fontSize: '4rem', fontWeight: 900, color: '#fff', opacity: 0.1, lineHeight: 1 }}>2024</span>
                <h3 style={{ fontSize: '2rem', fontWeight: 600, color: '#00d4ff' }}>Genesis</h3>
                <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>100+</div>
                    <div style={{ fontSize: '0.85rem', color: '#737373', textTransform: 'uppercase' }}>Prototypes</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>0</div>
                    <div style={{ fontSize: '0.85rem', color: '#737373', textTransform: 'uppercase' }}>Compromises</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="about-story__text" style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '3rem', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Our Story</h2>
            
            <p style={{ fontSize: '1.5rem', lineHeight: 1.8, color: '#d4d4d4' }}>
              Born from the creative ecosystem of <strong>Yarsha Byte</strong>,
              Yarsha Clothing was founded with a singular vision: to create
              apparel that reflects the precision, ambition, and minimalism of
              modern technology design.
            </p>
            
            <p style={{ fontSize: '1.25rem', lineHeight: 1.8, color: '#a3a3a3' }}>
              We believe that what you wear is an extension of your craft. Our
              collections are meticulously designed to offer unparalleled comfort
              and effortless style, whether you are engineering the future or
              navigating the urban landscape. 
            </p>

            <p style={{ fontSize: '1.25rem', lineHeight: 1.8, color: '#a3a3a3' }}>
              Traditional fashion is reactive. We are proactive. By analyzing 
              how modern professionals move, work, and interact with their 
              environments, we engineer garments that solve problems before 
              you even notice them.
            </p>
            
            <div style={{ height: '30vh' }} /> {/* Spacer for scrolling effect */}
          </div>
        </div>
      </section>

      {/* Values Section (Horizontal Scroll) */}
      <section className="about-values-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', padding: '6rem 0' }}>
        <div style={{ width: '100%', paddingLeft: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4rem', paddingRight: '4rem' }}>Core Protocols</h2>
          
          <div className="about-values__container" style={{ width: '100%' }}>
            <div className="about-values__scroll-wrapper" style={{ display: 'flex', gap: '3rem', width: 'max-content', paddingRight: '4rem' }}>
              
              {/* Value 1 */}
              <div style={{ width: '500px', height: '400px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2rem', padding: '3rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '12rem', fontWeight: 900, color: 'rgba(255,255,255,0.03)', lineHeight: 0.8, transform: 'translate(20%, -10%)' }}>01</div>
                <div style={{ width: '60px', height: '60px', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ff', marginBottom: 'auto' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>Uncompromising Quality</h3>
                <p style={{ color: '#a3a3a3', fontSize: '1.1rem', lineHeight: 1.6 }}>We obsess over every thread, seam, and fabric choice. If it isn't exceptional, it doesn't carry the Yarsha name.</p>
              </div>

              {/* Value 2 */}
              <div style={{ width: '500px', height: '400px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2rem', padding: '3rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '12rem', fontWeight: 900, color: 'rgba(255,255,255,0.03)', lineHeight: 0.8, transform: 'translate(20%, -10%)' }}>02</div>
                <div style={{ width: '60px', height: '60px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', marginBottom: 'auto' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>Minimalist Design</h3>
                <p style={{ color: '#a3a3a3', fontSize: '1.1rem', lineHeight: 1.6 }}>True elegance lies in simplicity. Our designs strip away the unnecessary to focus on form, function, and absolute fit.</p>
              </div>

              {/* Value 3 */}
              <div style={{ width: '500px', height: '400px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2rem', padding: '3rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '12rem', fontWeight: 900, color: 'rgba(255,255,255,0.03)', lineHeight: 0.8, transform: 'translate(20%, -10%)' }}>03</div>
                <div style={{ width: '60px', height: '60px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316', marginBottom: 'auto' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>Sustainable Innovation</h3>
                <p style={{ color: '#a3a3a3', fontSize: '1.1rem', lineHeight: 1.6 }}>We leverage the forward-thinking ethos of Yarsha Byte to pioneer sustainable manufacturing processes in fashion.</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="about-vision" style={{ padding: '12rem 2rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <blockquote style={{ margin: 0 }}>
            <p className="about-vision__quote-text" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.2, textTransform: 'uppercase', color: '#fff', marginBottom: '3rem' }}>
              Fashion is not just fabric — it's a language. We are writing the syntax for a generation that refuses to be defined by convention.
            </p>
            <footer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '40px', height: '2px', background: '#0ea5e9', display: 'block', marginBottom: '1rem' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e5e5e5', letterSpacing: '2px' }}>Yarsha Byte</span>
              <span style={{ fontSize: '0.9rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '4px' }}>Founding Team</span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta" style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', background: '#111' }}>
        <div className="glow-divider" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }}>
          <div className="glow-divider-line" style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)', boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }} />
        </div>
        
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Experience the Collection</h2>
          <p style={{ fontSize: '1.25rem', color: '#a3a3a3', marginBottom: '3rem' }}>
            Step into the future. Explore pieces designed for those who lead.
          </p>
          <Link href="/products" className="magnetic-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#fff', color: '#000', padding: '1.25rem 3rem', borderRadius: '3rem', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s' }}>
            Shop Now
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
