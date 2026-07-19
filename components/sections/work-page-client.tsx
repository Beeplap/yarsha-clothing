"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Grip, X } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";

import { projects } from "@/data/projects";
import dynamic from "next/dynamic";
import { suppressThreeClockWarning } from "@/lib/suppress-three-clock-warning";

const InteractiveBlob = dynamic(
  () => import("@/components/three/InteractiveBlob").then((mod) => mod.InteractiveBlob),
  { ssr: false, loading: () => null }
);

const ease = [0.22, 1, 0.36, 1] as const;

const parentVariants = {
  enter: { opacity: 1 },
  center: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { opacity: 1, transition: { staggerChildren: 0.04 } }
};

const childVariants: Variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    rotateX: direction > 0 ? -45 : 45,
  }),
  center: {
    y: "0%",
    opacity: 1,
    rotateX: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 }
  },
  exit: (direction: number) => ({
    y: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    rotateX: direction > 0 ? 45 : -45,
    transition: { type: "spring", damping: 25, stiffness: 200 }
  })
};

const variants = {
  enter: (direction: number) => {
    return {
      y: direction > 0 ? 100 : -100,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      y: direction < 0 ? 100 : -100,
      opacity: 0
    };
  }
};

export function WorkPageClient() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [direction, setDirection] = useState(1);

  const count = projects.length;
  const activeProject = projects[activeIndex] ?? projects[0];
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    suppressThreeClockWarning();
  }, []);

  const move = useCallback((dir: 1 | -1) => {
    setDirection(dir);
    setActiveIndex((current) => (current + dir + count) % count);
    window.dispatchEvent(new CustomEvent("yarsha:blob-pulse", { 
      detail: { clockwise: dir > 0 } 
    }));
  }, [count]);

  useEffect(() => {
    if (isGridOpen) return;

    let isAnimating = false;
    let timeoutId: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating) return;
      if (Math.abs(e.deltaY) < 25) return; // Threshold to prevent tiny accidental scrolls

      isAnimating = true;
      if (e.deltaY > 0) {
        move(1);
      } else {
        move(-1);
      }

      // Wait 1 second before allowing another scroll, to match transition duration
      timeoutId = setTimeout(() => {
        isAnimating = false;
      }, 1000);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(timeoutId);
    };
  }, [isGridOpen, move]);

  const displayIndex = isGridOpen && hoveredIndex !== null ? hoveredIndex : activeIndex;
  const displayProject = projects[displayIndex];

  const blobImageUrl =
    typeof displayProject.thumbnail === "string"
      ? displayProject.thumbnail
      : (displayProject.thumbnail as any)?.src || "";

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || isGridOpen) return;
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchStart.x - touchEnd.x;
    const dy = touchStart.y - touchEnd.y;
    
    const threshold = 40;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > threshold) move(1);
      else if (dx < -threshold) move(-1);
    } else {
      if (dy > threshold) move(1);
      else if (dy < -threshold) move(-1);
    }
    setTouchStart(null);
  };

  return (
    <main 
      className={`relative bg-background ${!isGridOpen ? "fixed inset-0 overflow-hidden touch-none z-50" : "fixed inset-0 overflow-hidden touch-none z-50"}`}
      data-lenis-prevent="true"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider stays permanently mounted so the 3D Canvas never reloads! */}
      <motion.div
        className="fixed inset-0 z-10 flex h-dvh w-full flex-col justify-between px-6 py-8 md:px-12 md:py-12 overflow-hidden"
      >
        {/* 3D BLOB CANVAS - Positioned between image (z-10) and text (z-30) */}
        <div className="pointer-events-none fixed inset-0 z-20">
          <Canvas
            className="h-full w-full"
            camera={{ position: [0, 0, 15], fov: 30 }}
            gl={{
              alpha: true,
              antialias: false,
              powerPreference: "high-performance",
            }}
            dpr={[1, 1.15]}
            frameloop="always"
          >
            <InteractiveBlob 
              textureUrl={blobImageUrl} 
              reflectionColor={(displayProject as any).color || "#edece2"}
              targetXDesktop={0}
              targetYDesktop={isGridOpen ? 0.20 : 0}
              targetYMobile={isGridOpen ? 0.24 : 0.18}
              startVisible={true}
            />
          </Canvas>
        </div>

        {/* Fading Content Wrapper */}
        <motion.div 
          className="flex flex-col flex-1"
          animate={{ opacity: isGridOpen ? 0 : 1 }}
          transition={{ duration: 0.5, ease }}
          style={{ pointerEvents: isGridOpen ? "none" : "auto" }}
        >

            {/* Mobile Top Navigation */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 flex md:hidden flex-col items-center gap-2 z-30 pointer-events-none">
              <div className="flex items-center gap-4 text-[10px] font-mono font-black uppercase tracking-[0.2em] text-foreground/50">
                <span className="text-foreground">{String(activeIndex + 1).padStart(3, "0")}</span>
                <span>/</span>
                <span>{String(count).padStart(3, "0")}</span>
              </div>
              <div className="text-[8px] font-mono font-bold tracking-[0.15em] uppercase text-foreground/30">Swipe to change</div>
            </div>

            {/* Main Slider Content */}
            <div className="flex flex-1 items-center justify-center pt-10 pb-20">
              <div className="grid w-full max-w-[90rem] grid-cols-1 items-center gap-10 md:grid-cols-12 relative">
                
                {/* Left Side: Image */}
                <div className="hidden md:block relative z-10 w-full md:col-span-5 lg:col-span-5 md:col-start-1 lg:col-start-2">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
                    <AnimatePresence initial={false} custom={direction}>
                      <motion.div
                        key={activeIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          y: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={activeProject.thumbnail}
                          alt={activeProject.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right Side: Info Side */}
                <div className="relative z-30 flex w-full flex-col self-stretch py-2 md:py-4 md:col-span-5 lg:col-span-4 md:col-start-8 lg:col-start-9 mt-[35vh] md:mt-0 items-center md:items-start text-center md:text-left">
                  <AnimatePresence mode="popLayout" custom={direction}>
                    <motion.div
                      key={activeIndex}
                      custom={direction}
                      variants={parentVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="flex flex-col w-full h-full items-center md:items-start"
                    >
                      {/* Title & Arrow */}
                      <div className="flex-1 flex flex-col justify-center items-center md:items-start">
                        <div className="flex flex-col md:flex-row w-fit items-center gap-4 sm:gap-6">
                          <h2 className="font-display text-[clamp(2.5rem,8vw,4.5rem)] font-black uppercase leading-[0.9] text-foreground tracking-tight flex flex-wrap justify-center md:justify-start gap-x-[0.25em] w-fit shrink">
                            {activeProject.title.split(" ").map((word, i) => (
                              <span key={i} className="overflow-hidden inline-block pb-2 -mb-2">
                                <motion.span 
                                  variants={childVariants} 
                                  custom={direction} 
                                  className="inline-block origin-bottom"
                                >
                                  {word}
                                </motion.span>
                              </span>
                            ))}
                          </h2>
                          <span className="overflow-hidden inline-flex items-center shrink-0 p-2 -m-2">
                            <motion.span variants={childVariants} custom={direction} className="inline-block origin-bottom">
                              <Link 
                                href={activeProject.href || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex size-10 sm:size-12 shrink-0 place-items-center justify-center rounded-full border border-foreground/10 bg-background/50 backdrop-blur-md text-foreground transition hover:scale-110 hover:bg-foreground hover:text-background shadow-lg"
                              >
                                <ArrowUpRight className="size-4 sm:size-5" />
                              </Link>
                            </motion.span>
                          </span>
                        </div>
                      </div>

                      {/* Tags block */}
                      <div className="flex-none flex flex-col items-center md:items-start gap-2 mt-8 md:mt-0 text-[10px] sm:text-xs font-mono sm:font-bold uppercase tracking-[0.15em] text-foreground/50">
                        {activeProject.tags.slice(0, 4).map((tag, i) => (
                          <div key={i} className="overflow-hidden pb-1 -mb-1">
                            <motion.span 
                              variants={childVariants} 
                              custom={direction} 
                              className="inline-block origin-bottom"
                            >
                              {tag}
                            </motion.span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="mt-10 hidden md:flex items-center justify-between md:mt-0 relative z-30">
              <div className="flex items-center gap-4 text-xs font-mono font-black uppercase tracking-widest text-foreground/50">
                <span className="text-foreground">
                  {String(activeIndex + 1).padStart(3, "0")}
                </span>
                <span>/</span>
                <span>{String(count).padStart(3, "0")}</span>
              </div>

              {/* Persistent button handles the toggle now */}
              
              {/* Spacer for flex-between alignment */}
              <div className="w-20" />
            </div>
          </motion.div>
        </motion.div>

      {/* Grid overlays on top! */}
      <AnimatePresence>
        {isGridOpen && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.85, y: "5%" }}
            animate={{ opacity: 1, scale: 1, y: "0%" }}
            exit={{ opacity: 0, scale: 0.85, y: "5%" }}
            transition={{ duration: 0.5, ease }}
            style={{ transformOrigin: "bottom center" }}
            className="fixed inset-0 z-30 flex flex-col items-center justify-end pb-24"
          >
            {/* Carousel Row */}
            <div className="flex w-full max-w-[90rem] overflow-x-auto px-12 py-4 gap-4 sm:gap-6 items-center justify-start sm:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {projects.map((project, index) => {
                const isActive = hoveredIndex === index || (hoveredIndex === null && activeIndex === index);
                return (
                <div
                  key={project.title}
                  className={`group relative aspect-[4/3] w-28 sm:w-36 md:w-40 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-foreground/5 transition-all duration-400 ease-out ${
                    isActive
                      ? "ring-2 ring-foreground/20 scale-110 shadow-xl z-20"
                      : "opacity-60 hover:opacity-100 hover:scale-100 scale-95 z-10"
                  }`}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsGridOpen(false);
                    setHoveredIndex(null);
                    window.dispatchEvent(new CustomEvent("yarsha:blob-pulse", { 
                      detail: { clockwise: true } 
                    }));
                  }}
                  onMouseEnter={() => {
                    if (hoveredIndex !== index) {
                      setHoveredIndex(index);
                      window.dispatchEvent(new CustomEvent("yarsha:blob-jiggle"));
                    }
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 160px, 320px"
                  />
                </div>
              );
              })}
            </div>

            {/* Project Title Display */}
            <div className="mt-8 px-6 text-center">
              <motion.h2
                key={displayProject.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
                className="text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tighter text-foreground"
              >
                {displayProject.title}
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Toggle Button */}
      <div className="fixed bottom-6 md:bottom-8 left-1/2 z-[60] -translate-x-1/2">
        <button
          type="button"
          onClick={() => setIsGridOpen(!isGridOpen)}
          className="relative inline-flex h-12 items-center justify-center rounded-full border border-foreground/10 px-6 text-xs font-mono font-bold uppercase tracking-[0.15em] transition-colors hover:border-foreground hover:text-background hover:bg-foreground bg-background/80 backdrop-blur-md text-foreground shadow-lg overflow-hidden w-40"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isGridOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center gap-2"
              >
                <X className="size-4" />
                Close
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center gap-2"
              >
                <Grip className="size-4" />
                Projects
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </main>
  );
}
