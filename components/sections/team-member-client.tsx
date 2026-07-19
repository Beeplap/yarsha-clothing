"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, MapPin } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { TeamMember } from "@/data/team";

export function TeamMemberClient({ member }: { member: TeamMember }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // 1. Initial Load Animations
      const tl = gsap.timeline();
      
      tl.fromTo(
        ".stagger-item",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" }
      );

      tl.fromTo(
        imageRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" },
        "-=0.8"
      );

      // 2. Scroll Parallax for Image
      gsap.to(imageRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // 3. Project Cards Stagger Entrance
      const projectCards = gsap.utils.toArray(".project-card");
      if (projectCards.length > 0) {
        gsap.fromTo(
          projectCards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".projects-section",
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split name for styling
  const [firstName, ...restName] = member.name.split(" ");
  const lastName = restName.join(" ");

  return (
    <div ref={containerRef} className="bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <main className="overflow-hidden">
        
        {/* --- HERO SECTION --- */}
        <section className="relative min-h-[90vh] pt-32 pb-24 border-b border-foreground/10 flex flex-col justify-center">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay z-0"></div>
          
          <Container className="relative z-10">
            <Link
              href="/about#team"
              className="stagger-item group relative inline-flex size-24 items-center justify-center text-foreground transition-all duration-300 hover:text-accent mb-12 mt-4"
              aria-label="Back to the team"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current">
                {/* Circle */}
                <circle cx="50" cy="50" r="40" strokeWidth="1" className="opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                
                {/* Custom Arrow Group */}
                <g className="transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-x-2">
                  {/* Arrowhead */}
                  <polygon points="32,50 42,42 42,58" strokeWidth="2.5" strokeLinejoin="round" />
                  {/* Shaft */}
                  <line x1="42" y1="50" x2="58" y2="50" strokeWidth="2.5" />
                  {/* Hexagon tail */}
                  <polygon points="68,50 65.5,54.3 60.5,54.3 58,50 60.5,45.7 65.5,45.7" strokeWidth="2.5" strokeLinejoin="round" />
                </g>
              </svg>
            </Link>

            <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              
              {/* Text Content */}
              <div ref={textContentRef} className="order-2 lg:order-1">
                <p className="stagger-item text-xs font-black uppercase tracking-[0.3em] text-accent mb-6">
                  {member.role}
                </p>
                <h1 className="stagger-item font-display text-[clamp(4rem,10vw,9rem)] font-black uppercase leading-[0.95] tracking-tight">
                  <span className="block text-transparent" style={{ WebkitTextStroke: "2px var(--foreground)" }}>{firstName}</span>
                  <span className="block">{lastName}</span>
                </h1>
                
                <p className="stagger-item mt-10 max-w-xl text-xl leading-relaxed text-foreground/80 font-medium">
                  {member.intro}
                </p>
                
                <div className="stagger-item mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-foreground/60">
                  <span className="inline-flex items-center gap-2 uppercase tracking-widest font-bold">
                    <MapPin className="size-4 text-accent" aria-hidden="true" />
                    {member.location}
                  </span>
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 transition hover:text-accent uppercase tracking-widest font-bold"
                  >
                    <Mail className="size-4 text-accent" aria-hidden="true" />
                    {member.email}
                  </a>
                </div>
              </div>

              {/* Image */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-[4/5] overflow-hidden rounded-2xl">
                  <div ref={imageRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>
              </div>

            </div>
          </Container>
        </section>

        {/* --- BIO & SKILLS SECTION --- */}
        <section className="py-32 border-b border-foreground/10 relative">
          <Container>
            <div className="grid gap-16 lg:grid-cols-2">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-8">
                  Biography
                </p>
                <p className="font-display text-3xl md:text-5xl leading-tight font-bold tracking-tight">
                  {member.bio}
                </p>
              </div>
              
              <div className="lg:pl-16 lg:border-l border-foreground/10">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-8">
                  Expertise & Skills
                </p>
                <div className="flex flex-wrap gap-3">
                  {member.skills.map((skill) => (
                    <div
                      key={skill}
                      className="group relative flex items-center overflow-hidden border border-foreground/10 bg-transparent px-5 py-3.5 transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/[0.02] cursor-default"
                    >
                      {/* Animated accent bar */}
                      <div className="absolute left-0 top-0 h-full w-[3px] bg-accent origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-y-100"></div>
                      
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/60 transition-colors duration-300 group-hover:text-foreground">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* --- PROJECTS SECTION --- */}
        {member.projects && member.projects.length > 0 && (
          <section className="projects-section py-32 bg-foreground text-background">
            <Container>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-4">
                    Selected work
                  </p>
                  <h2 className="font-display text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[0.9] tracking-tighter">
                    Project highlights
                  </h2>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {member.projects.map((project, index) => (
                  <article
                    key={project.title}
                    className="project-card group relative min-h-[300px] border border-background/10 bg-background/5 p-8 transition-all duration-500 hover:bg-background hover:text-foreground overflow-hidden flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-4 relative z-10">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-accent group-hover:text-accent">
                        {project.type}
                      </p>
                      <span className="font-display text-5xl text-background/20 group-hover:text-foreground/20 transition-colors duration-500">
                        0{index + 1}
                      </span>
                    </div>
                    
                    <div className="relative z-10 mt-16">
                      <h3 className="text-3xl md:text-4xl font-black uppercase leading-tight tracking-tight mb-4 group-hover:-translate-y-2 transition-transform duration-500">
                        {project.title}
                      </h3>
                      <p className="text-sm font-bold tracking-widest text-background/50 group-hover:text-foreground/50 transition-colors duration-500">
                        {project.year}
                      </p>
                    </div>

                    {/* Decorative accent element on hover */}
                    <div className="absolute -bottom-10 -right-10 size-40 bg-accent rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
                  </article>
                ))}
              </div>

            </Container>
          </section>
        )}

        <section className="py-24 text-center">
          <Container>
            <Link
              href="/contact"
              className="group inline-flex h-16 items-center gap-4 rounded-full bg-accent px-8 text-sm font-black uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              Work with {firstName}
              <ArrowRight className="size-5 transition group-hover:translate-x-2" aria-hidden="true" />
            </Link>
          </Container>
        </section>

      </main>
    </div>
  );
}
