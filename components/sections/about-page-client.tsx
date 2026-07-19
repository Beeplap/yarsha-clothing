"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ContactSection } from "@/components/sections/contact-section";
import { teamMembers } from "@/data/team";
import { ArrowUpRight } from "lucide-react";

const capabilities = [
  "Web design",
  "Brand identity",
  "Motion graphics",
  "Video editing",
  "Digital marketing",
  "Creative strategy",
];

export function AboutPageClient() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Refs for animations
  const heroRef = useRef<HTMLElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroText1Ref = useRef<HTMLDivElement>(null);
  const heroText2Ref = useRef<HTMLDivElement>(null);
  const storyTextRef = useRef<HTMLParagraphElement>(null);
  const teamListRef = useRef<HTMLDivElement>(null);
  const floatingImageRef = useRef<HTMLDivElement>(null);
  
  // State for floating image hover
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // GSAP quickTo refs
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateTo = useRef<gsap.QuickToFunc | null>(null);

  // Mouse move handler for the floating team image
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let velocityX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (xTo.current && yTo.current) {
        // Offset by half width/height so cursor is centered
        xTo.current(e.clientX);
        yTo.current(e.clientY);
        
        // Calculate velocity for rotation
        velocityX = e.clientX - lastX;
        
        // Apply rotation based on speed, max 15 degrees
        const rotation = Math.max(-15, Math.min(15, velocityX * 0.15));
        if (rotateTo.current) rotateTo.current(rotation);
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    // Hide floating image if user scrolls it out from under the stationary cursor
    const handleScroll = () => {
      if (!teamListRef.current) return;
      const rect = teamListRef.current.getBoundingClientRect();
      
      // If cursor is outside the bounds of the team list, hide the image
      if (
        lastX < rect.left ||
        lastX > rect.right ||
        lastY < rect.top ||
        lastY > rect.bottom
      ) {
        setIsHovering(false);
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll, { capture: true } as EventListenerOptions);
    };
  }, []);

  // Handle scale and opacity animations when hover state changes
  useGSAP(() => {
    if (!floatingImageRef.current) return;
    
    if (isHovering) {
      gsap.to(floatingImageRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.5)"
      });
    } else {
      gsap.to(floatingImageRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.inOut"
      });
      // Reset rotation smoothly when hiding
      if (rotateTo.current) rotateTo.current(0);
    }
  }, [isHovering]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const siteFrame = document.querySelector<HTMLElement>(".site-frame");
    let initialized = false;

    const initAnimations = () => {
      if (initialized) return;
      initialized = true;

      // Initialize quickTo functions for the cursor image
      if (floatingImageRef.current) {
        gsap.set(floatingImageRef.current, { xPercent: -50, yPercent: -50 });
        xTo.current = gsap.quickTo(floatingImageRef.current, "x", { duration: 0.6, ease: "power3.out" });
        yTo.current = gsap.quickTo(floatingImageRef.current, "y", { duration: 0.6, ease: "power3.out" });
        rotateTo.current = gsap.quickTo(floatingImageRef.current, "rotation", { duration: 0.5, ease: "power2.out" });
      }

      const isLenisActive = siteFrame?.dataset.lenisReady === "true";
      const scroller = isLenisActive ? siteFrame! : window;

      // 1. Initial Hero Entry Animation
      // Use gsap.set for initial hidden state to prevent FOUC without risking stuck CSS opacity
      gsap.set(".hero-sub", { y: 30, opacity: 0 });
      gsap.set(heroText1Ref.current, { x: "100vw", opacity: 0 });
      gsap.set(heroText2Ref.current, { x: "-100vw", opacity: 0 });

      const tl = gsap.timeline({ delay: 0.3 }); // Small delay for page load
      
      tl.to(".hero-sub", { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" })
        .to(heroText1Ref.current, { x: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "-=0.4")
        .to(heroText2Ref.current, { x: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "<");

      // 2. Hero Scroll Pin & Parallax (Unified for desktop and mobile)
      const tlHero = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          scroller,
          start: "top top",
          end: "+=120%", // Exact timing: just long enough for text to clear
          scrub: true,
          pin: true, // Pin the ENTIRE section to fix flexbox pinSpacer overlapping
          anticipatePin: 1,
        }
      });
      // Use xPercent instead of x to prevent conflicting with the entry animation's x values
      tlHero.to(heroText1Ref.current, { xPercent: -250, ease: "none" }, 0);
      tlHero.to(heroText2Ref.current, { xPercent: 250, ease: "none" }, 0);

      // 3. Story Text Scrubbing (Words highlight as you scroll)
      if (storyTextRef.current) {
        const words = storyTextRef.current.querySelectorAll(".story-word");
        gsap.fromTo(
          words,
          { color: "rgba(var(--foreground-rgb), 0.1)" },
          {
            color: "rgba(var(--foreground-rgb), 1)",
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: storyTextRef.current,
              scroller,
              start: "top 80%",
              end: "bottom 50%",
              scrub: true,
            }
          }
        );
      }

      // 4. Team List Entrance
      if (teamListRef.current) {
        const items = teamListRef.current.querySelectorAll(".team-list-item");
        gsap.fromTo(
          items,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: teamListRef.current,
              scroller,
              start: "top 85%",
            }
          }
        );
      }

      // 5. Infinite Marquee
      const marquee = document.querySelector(".marquee-track");
      if (marquee) {
        gsap.to(marquee, {
          xPercent: -50,
          ease: "none",
          duration: 20,
          repeat: -1,
        });
      }
    };

    const waitsForLenis = window.matchMedia("(min-width: 1024px)").matches && window.matchMedia("(pointer: fine)").matches;
    
    if (!waitsForLenis || siteFrame?.dataset.lenisReady === "true") {
      initAnimations();
    } else {
      window.addEventListener("lenis:ready", initAnimations, { once: true });
    }
  }, { scope: containerRef });

  // Removed wrapChars utility as we now animate entire lines

  const storyText = "We exist to make professional digital work practical. Instead of fragmenting disciplines, we operate as a single unit from concept to launch. The result? Zero handoff gaps, faster decisions, and an output that stays consistent across your website, identity, and campaigns.";

  return (
    <main ref={containerRef} className="bg-background text-foreground selection:bg-accent selection:text-accent-foreground overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative isolate z-10 min-h-[100svh] flex flex-col justify-center ">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay -z-10"></div>
        
        <div className="px-6 md:px-12 flex flex-col items-center justify-center text-center w-full">
          <p className="hero-sub text-sm md:text-base font-bold uppercase tracking-[0.3em] text-accent mb-12 md:mb-16">
            About Yarsha Byte
          </p>
          
          <h1 ref={heroTitleRef} className="font-display text-[clamp(5.5rem,23vw,18rem)] font-black uppercase leading-[1] md:leading-[0.95] tracking-tight flex flex-col items-center whitespace-nowrap w-full">
            <div ref={heroText1Ref} className="pb-2 md:pb-4 flex justify-center w-full">
              SIX MINDS.
            </div>
            <div ref={heroText2Ref} className="text-foreground/40 flex justify-center w-full">
              ONE DIRECTION.
            </div>
          </h1>
        </div>
      </section>

      {/* --- STORY SCRUB SECTION --- */}
      <section className="relative z-20 -mt-[70vh] pt-20 pb-20 md:pt-5 md:pb-20 px-6 md:px-12 max-w-7xl mx-auto transform-gpu">
        <p ref={storyTextRef} className="font-display text-3xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight uppercase">
          {storyText.split(" ").map((word, i) => (
            <span key={i} className="story-word inline-block mr-[0.25em]">
              {word}
            </span>
          ))}
        </p>
      </section>

      {/* --- FLOATING TEAM SECTION --- */}
      <section id="team" className="py-14 relative z-10 border-t border-foreground/10 cursor-default">
        
        {/* The floating image that follows cursor (Hidden on mobile) */}
        <div 
          ref={floatingImageRef}
          className="fixed top-0 left-0 w-72 h-[22rem] pointer-events-none z-50 overflow-hidden rounded-2xl shadow-2xl hidden md:block"
          style={{ 
             opacity: 0, 
             transformOrigin: "center center",
             willChange: "transform, opacity"
          }}
        >
          {teamMembers.map((member, i) => (
            <div 
              key={member.slug}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                activeIndex === i 
                  ? "opacity-100 scale-100 z-10" 
                  : "opacity-0 scale-110 z-0"
              }`}
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover grayscale"
                sizes="(max-width: 768px) 0vw, 300px"
              />
              <div className="absolute inset-0 bg-accent/10 mix-blend-overlay"></div>
            </div>
          ))}
        </div>

        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-[0.15em] text-accent">
              The Team
            </h2>
            <p className="block md:hidden text-m text-foreground/40 mt-2 font-display">
              Tap to reveal
            </p>
          </div>

          <div 
            ref={teamListRef} 
            className="flex flex-col"
            onMouseLeave={() => setIsHovering(false)}
          >
            {teamMembers.map((member, i) => (
              <Link 
                key={member.slug} 
                href={`/team/${member.slug}`}
                className="team-list-item group flex flex-col md:flex-row md:items-center justify-between py-6 md:py-8 border-b border-foreground/10 hover:border-foreground/40 transition-colors"
                onMouseEnter={() => {
                  setActiveIndex(i);
                  setIsHovering(true);
                }}
                onClick={(e) => {
                  // On mobile, first tap expands the accordion, second tap navigates
                  if (window.innerWidth < 768 && activeIndex !== i) {
                    e.preventDefault();
                    setActiveIndex(i);
                  }
                }}
              >
                <div className="flex flex-col md:pointer-events-none">
                  <h3 className="font-display text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tight transition-transform duration-500 md:group-hover:translate-x-4 bg-[linear-gradient(to_right,var(--accent)_50%,var(--foreground)_50%)] bg-[length:200%_100%] bg-right bg-clip-text text-transparent md:group-hover:transition-all md:group-hover:bg-left">
                    {member.name}
                  </h3>
                  <span className="text-foreground/50 text-xs sm:text-sm md:text-lg font-medium mt-1 md:mt-2 transition-transform duration-500 md:group-hover:translate-x-4">
                    {member.role}
                  </span>
                </div>
                
                {/* Mobile Inline Image Reveal (Accordion) */}
                <div 
                  className={`md:hidden w-full overflow-hidden transition-all duration-500 ease-out ${
                    activeIndex === i ? "max-h-96 mt-6 opacity-100" : "max-h-0 mt-0 opacity-0"
                  }`}
                >
                  <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-foreground/5">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">Tap again to view profile</span>
                    <ArrowUpRight className="size-4 text-accent" />
                  </div>
                </div>

                <div className="mt-4 md:mt-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-4 md:group-hover:translate-x-0 hidden md:flex items-center gap-2 pointer-events-none">
                  <span className="text-sm font-bold uppercase tracking-widest text-accent">View Profile</span>
                  <div className="size-10 rounded-full bg-accent flex items-center justify-center text-background">
                    <ArrowUpRight className="size-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- INFINITE MARQUEE SECTION --- */}
      <section className="py-24 overflow-hidden border-b border-foreground/10 relative z-10">
        <div className="relative flex whitespace-nowrap marquee-track w-max">
          {[...capabilities, ...capabilities, ...capabilities, ...capabilities].map((cap, i) => (
            <div key={i} className="flex items-center">
              <span 
                className="font-display text-6xl md:text-9xl font-black uppercase tracking-tighter mx-8 text-transparent"
                style={{ WebkitTextStroke: "2px var(--foreground)" }}
              >
                {cap}
              </span>
              <span className="text-accent text-5xl md:text-8xl">•</span>
            </div>
          ))}
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
