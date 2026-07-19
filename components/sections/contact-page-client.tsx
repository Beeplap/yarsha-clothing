"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

import { budgetRanges, referralSources } from "@/data/contact-options";
import { services } from "@/data/services";
import { Container } from "@/components/ui/container";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

function AnimatedTitle({ text, className, showDot = false, as: Tag = "h1", waitForLenis = false }: { text: string; className?: string; showDot?: boolean, as?: any, waitForLenis?: boolean }) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const charSpans = gsap.utils.toArray<HTMLElement>("[data-page-char]", containerRef.current);
    if (charSpans.length === 0) return;

    // Immediately hide the text before the browser paints to prevent FOUC
    gsap.set(charSpans, { y: "100%" });

    const siteFrame = document.querySelector<HTMLElement>(".site-frame");
    let initialized = false;

    let failsafeTimer: number | null = null;
    let blobDelayTimer: number | null = null;
    let isAnimating = false;
    const playAnimation = () => {
      if (failsafeTimer) {
        window.clearTimeout(failsafeTimer);
        failsafeTimer = null;
      }
      if (blobDelayTimer) {
        window.clearTimeout(blobDelayTimer);
        blobDelayTimer = null;
      }
      if (isAnimating) return;
      isAnimating = true;
      gsap.fromTo(charSpans, 
        { y: "100%" },
        {
          y: "0%",
          duration: 1,
          stagger: 0.05,
          ease: "expo.out",
          onComplete: () => {
            isAnimating = false;
          }
        }
      );
    };

    const handleBlobEnter = () => {
      blobDelayTimer = window.setTimeout(playAnimation, 400); 
    };

    const initTitleAnimation = () => {
      if (initialized) return;
      initialized = true;

      const globalLoader = document.querySelector('div[aria-label="Loading Yarsha Byte"]');
      const isGlobalLoaderActive = globalLoader && globalLoader.getAttribute("aria-hidden") !== "true";

      const waveLoader = document.querySelector('.z-\\[950\\]') as HTMLElement | null;
      const isWaveLoaderActive = waveLoader && window.getComputedStyle(waveLoader).opacity !== "0";

      const siteMenu = document.getElementById("site-menu");
      const isMenuClosing = siteMenu && window.getComputedStyle(siteMenu).visibility !== "hidden";

      if (isGlobalLoaderActive || isWaveLoaderActive) {
        window.addEventListener("yarsha:blob-enter", handleBlobEnter, { once: true });

        // Failsafe in case the event was missed
        failsafeTimer = window.setTimeout(playAnimation, 2000);
      } else if (isMenuClosing) {
        // The global yarsha:menu-closed listener will trigger it. Adding a failsafe:
        failsafeTimer = window.setTimeout(playAnimation, 2000);
      } else {
        playAnimation();
      }
    };

    if (waitForLenis) {
      const waitsForLenis = window.matchMedia("(min-width: 1024px)").matches && window.matchMedia("(pointer: fine)").matches;
      if (!waitsForLenis || siteFrame?.dataset.lenisReady === "true") {
        initTitleAnimation();
      } else if (siteFrame) {
        window.addEventListener("lenis:ready", initTitleAnimation, { once: true });
      } else {
        initTitleAnimation();
      }
    } else {
      initTitleAnimation();
    }

    // Replay animation if already on this page and the menu closes!
    window.addEventListener("yarsha:menu-closed", playAnimation);

    return () => {
      window.removeEventListener("yarsha:menu-closed", playAnimation);
      window.removeEventListener("yarsha:blob-enter", handleBlobEnter);
      window.removeEventListener("lenis:ready", initTitleAnimation);
      if (failsafeTimer) window.clearTimeout(failsafeTimer);
      if (blobDelayTimer) window.clearTimeout(blobDelayTimer);
    };
  }, { scope: containerRef, dependencies: [text] });

  const words = text.split(" ");
  return (
    <Tag ref={containerRef} className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block">
          <span className="inline-block overflow-hidden align-bottom leading-[0.88] pb-[0.05em] -mb-[0.05em]">
            {word.split("").map((char, ci) => (
              <span key={`${wi}-${ci}`} data-page-char className="inline-block will-change-transform">
                {char}
              </span>
            ))}
          </span>
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
      {showDot && (
        <span className="inline-block overflow-hidden align-bottom leading-[0.88] pb-[0.05em] -mb-[0.05em]">
          <span data-page-char className="relative inline-block h-[0.88em] w-[0.24em] will-change-transform">
            <span 
              className="absolute bottom-0 left-0 ml-[0.08em] inline-block size-[0.16em] min-h-4 min-w-4 translate-y-[-0.04em] bg-accent [clip-path:polygon(25%_6%,75%_6%,100%_50%,75%_94%,25%_94%,0_50%)]"
            />
          </span>
        </span>
      )}
    </Tag>
  );
}

function OptionButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    gsap.to(buttonRef.current, {
      scale: 1.03,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)"
    });
  };

  return (
    <button 
      ref={buttonRef}
      type="button"
      onClick={onClick} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex min-h-14 items-center justify-center rounded-full px-10 text-xs font-bold uppercase tracking-[0.14em] transition-colors will-change-transform ${
        active 
          ? "bg-accent/10 text-accent" 
          : "bg-foreground/[0.04] text-foreground hover:text-accent"
      }`}
    >
      {active && (
        <span className="absolute left-4 flex size-4 items-center justify-center rounded-full">
          <span className="size-1.5 rounded-full bg-accent" />
        </span>
      )}
      {children}
    </button>
  );
}

type FormState = {
  intent: string;
  projectType: string;
  budget: string;
  source: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  deadline: string;
  message: string;
};

type ContactPageClientProps = {
  prefilledServiceSlug?: string;
};

export function ContactPageClient({}: ContactPageClientProps) {
  const mainRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const projectTypes = useMemo(
    () => services
      .map((service) => service.title.replace("Website Design & Development", "Full Website").replace("Poster & Graphic Design", "Poster Design").replace("Branding & Digital Identity", "Brand Identity"))
      .filter((title) => title !== "Digital Setup"),
    [],
  );

  const [form, setForm] = useState<FormState>({
    intent: "",
    projectType: "",
    budget: "",
    source: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    deadline: "",
    message: "",
  });

  const handleOptionSelect = (field: keyof FormState, value: string) => {
    if (value === "Drop us an email") {
      window.location.href = "mailto:yarshabyte@gmail.com";
      return;
    }
    
    setForm((current) => ({ ...current, [field]: value }));
    setTimeout(() => {
      if (step < 4) {
        setStep((current) => current + 1);
      }
    }, 350);
  };

  const submitEmail = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSent(true);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  const steps = [
    {
      title: "How can we help?",
      field: "intent" as keyof FormState,
      options: ["Start a project", "Drop us an email"],
    },
    {
      title: "What are we making?",
      field: "projectType" as keyof FormState,
      options: projectTypes,
    },
    {
      title: "Budget Range",
      field: "budget" as keyof FormState,
      options: budgetRanges,
    },
    {
      title: "How did you hear about us?",
      field: "source" as keyof FormState,
      options: referralSources,
    },
    {
      title: "Ready to create magic?",
      field: "details" as keyof FormState,
      options: [],
    }
  ];

  const currentStepData = steps[step];

  return (
    <main ref={mainRef} className="page-hero-spacing relative h-[calc(100dvh-4rem)] md:h-[calc(100dvh-7rem)] overflow-hidden">
      <div className="service-grid-surface absolute inset-0 opacity-20" aria-hidden="true" />

      <Container className="relative z-10 flex flex-col h-full pb-4">
        <AnimatePresence initial={false}>
          {step === 0 && (
            <motion.section 
              initial={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
              exit={{ height: 0, opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 w-full hidden sm:block overflow-hidden"
            >
              <AnimatedTitle
                text="LET'S TALK"
                showDot={true}
                waitForLenis={true}
                className="font-display text-[clamp(6rem,15vw,30rem)] font-black uppercase leading-[0.75] tracking-[-0.02em] text-foreground break-words"
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Multi-step Contact Section */}
        <section className="flex flex-1 w-full flex-col items-center justify-center relative pb-24 sm:pb-32 pt-4 lg:pt-8">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                className="flex w-full max-w-2xl flex-col items-center text-center"
              >
                <div className="grid size-16 place-items-center rounded-full bg-accent/10 text-accent">
                  <Check className="size-8" />
                </div>
                <h2 className="mt-8 font-display text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-none tracking-tight text-foreground text-center">
                  Message Sent!
                </h2>
                <p className="mt-5 text-base font-semibold leading-8 text-foreground/70 max-w-lg text-center">
                  Thanks for reaching out! We've received your brief and will get back to you with next steps shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setStep(0);
                  }}
                  className="mt-8 group relative flex min-h-14 items-center justify-center gap-3 rounded-full border border-foreground/10 px-8 text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:border-accent/60 hover:text-accent"
                >
                  Start again
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex w-full flex-col items-center"
              >
                {step < 4 ? (
                  <>
                    <div className="relative flex w-full max-w-4xl items-center justify-center">
                      <h2 className="font-display text-center text-[clamp(2rem,5vw,4.5rem)] uppercase leading-none tracking-tight text-foreground">
                        {currentStepData.title}
                      </h2>
                    </div>
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-5 sm:gap-8">
                      {currentStepData.options.map((option) => (
                        <OptionButton 
                          key={option}
                          active={form[currentStepData.field] === option}
                          onClick={() => handleOptionSelect(currentStepData.field, option)}
                        >
                          {option}
                        </OptionButton>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-full max-w-[1200px] flex flex-col items-center gap-6 lg:gap-10 mt-0 sm:-mt-8 lg:-mt-16">
                    {/* Selected Options Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                      {form.projectType && <span className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 sm:px-6 sm:py-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70">{form.projectType}</span>}
                      {form.budget && <span className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 sm:px-6 sm:py-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70">{form.budget}</span>}
                      {form.source && <span className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 sm:px-6 sm:py-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70">{form.source}</span>}
                    </div>

                    <div className="w-full grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-16 items-start">
                      <div className="relative flex w-full flex-col lg:items-start items-center lg:pt-4">
                        <h2 className="font-display text-center lg:text-left text-[clamp(2.5rem,5vw,5rem)] uppercase leading-[0.9] tracking-tight text-foreground lg:max-w-md">
                          {currentStepData.title}
                        </h2>
                      </div>
                      
                      <form 
                        onSubmit={submitEmail}
                        className="w-full grid gap-3 sm:gap-6"
                      >
                        <div className="grid gap-3 sm:gap-6 grid-cols-2">
                          <input 
                            type="text" 
                            value={form.firstName} 
                            onChange={e => setForm(c => ({...c, firstName: e.target.value}))} 
                            placeholder="First Name *" 
                            required
                            className="min-h-12 sm:min-h-14 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-4 sm:px-6 text-xs sm:text-sm text-foreground outline-none transition focus:border-accent placeholder:text-foreground/30" 
                          />
                          <input 
                            type="text" 
                            value={form.lastName} 
                            onChange={e => setForm(c => ({...c, lastName: e.target.value}))} 
                            placeholder="Last Name *" 
                            required
                            className="min-h-12 sm:min-h-14 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-4 sm:px-6 text-xs sm:text-sm text-foreground outline-none transition focus:border-accent placeholder:text-foreground/30" 
                          />
                          <input 
                            type="tel" 
                            value={form.phone} 
                            onChange={e => setForm(c => ({...c, phone: e.target.value}))} 
                            placeholder="Phone [optional]" 
                            className="min-h-12 sm:min-h-14 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-4 sm:px-6 text-xs sm:text-sm text-foreground outline-none transition focus:border-accent placeholder:text-foreground/30" 
                          />
                          <input 
                            type="email" 
                            value={form.email} 
                            onChange={e => setForm(c => ({...c, email: e.target.value}))} 
                            placeholder="Email *" 
                            required
                            className="min-h-12 sm:min-h-14 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-4 sm:px-6 text-xs sm:text-sm text-foreground outline-none transition focus:border-accent placeholder:text-foreground/30" 
                          />
                          <input 
                            type="text" 
                            value={form.company} 
                            onChange={e => setForm(c => ({...c, company: e.target.value}))} 
                            placeholder="Company *" 
                            required
                            className="min-h-12 sm:min-h-14 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-4 sm:px-6 text-xs sm:text-sm text-foreground outline-none transition focus:border-accent placeholder:text-foreground/30" 
                          />
                          <input 
                            type="text" 
                            value={form.deadline} 
                            onChange={e => setForm(c => ({...c, deadline: e.target.value}))} 
                            placeholder="Deadline in weeks *" 
                            required
                            className="min-h-12 sm:min-h-14 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-4 sm:px-6 text-xs sm:text-sm text-foreground outline-none transition focus:border-accent placeholder:text-foreground/30" 
                          />
                        </div>
                        
                        <div className="grid gap-3 sm:gap-6 md:grid-cols-[1fr_auto] items-end">
                          <textarea 
                            value={form.message} 
                            onChange={e => setForm(c => ({...c, message: e.target.value}))} 
                            placeholder="Your message here..." 
                            required
                            className="min-h-[100px] sm:min-h-40 w-full rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4 sm:p-6 text-xs sm:text-sm text-foreground outline-none transition focus:border-accent resize-none placeholder:text-foreground/30" 
                          />
                          <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="group flex h-12 w-[160px] sm:h-40 sm:w-40 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-black uppercase tracking-[0.14em] text-background transition hover:scale-105 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? "Sending..." : "Submit"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Footer Controls (Back Button & Progress Bar) */}
          {!sent && (
            <div className="absolute bottom-0 sm:bottom-2 left-0 w-full flex items-center justify-between px-4 sm:px-6">
              {/* Left: Back Button container to ensure spacing */}
              <div className="w-14 sm:w-16 shrink-0">
                {step > 0 && (
                  <button 
                    onClick={() => setStep(s => s - 1)}
                    className="flex size-14 sm:size-16 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-colors hover:border-accent hover:text-accent"
                    aria-label="Go back"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M8 8L3 12L8 16Z" strokeLinejoin="round" />
                      <path d="M8 12H16" />
                      <path d="M16 12L17.5 9.5H20.5L22 12L20.5 14.5H17.5Z" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Center: Progress Bar */}
              <div className="flex w-full max-w-[160px] sm:max-w-[240px] items-center justify-center gap-3 sm:gap-4 text-[10px] font-mono sm:font-bold uppercase tracking-[0.15em] text-foreground/50">
                <span>{String(step + 1).padStart(2, '0')}</span>
                <div 
                  className="relative h-[2px] flex-1 bg-foreground/10 rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const ratio = x / rect.width;
                    const targetStep = Math.floor(ratio * 5);
                    if (targetStep < step) setStep(targetStep);
                  }}
                >
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 bg-accent rounded-full"
                    animate={{ width: `${((step + 1) / 5) * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full border-[1.5px] border-foreground bg-background" />
                  </motion.div>
                </div>
                <span>05</span>
              </div>

              {/* Right: Invisible spacer to perfectly center the progress bar */}
              <div className="w-14 sm:w-16 shrink-0" aria-hidden="true" />
            </div>
          )}
      </Container>
    </main>
  );
}
