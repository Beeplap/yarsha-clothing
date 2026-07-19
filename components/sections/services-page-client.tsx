"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

import { ContactSection } from "@/components/sections/contact-section";
import {
  heroAdjectives,
  resultCases,
  serviceListItems,
  workflowSteps,
} from "@/data/services-page";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="services-section-label">
      <span className="dot-ring" aria-hidden="true" />
      {children}
    </p>
  );
}

function MiniMark() {
  return (
    <span
      className="ml-[0.08em] inline-block size-[0.18em] translate-y-[-0.12em] bg-accent [clip-path:polygon(25%_6%,75%_6%,100%_50%,75%_94%,25%_94%,0_50%)]"
      aria-hidden="true"
    />
  );
}

export function ServicesPageClient() {
  const pageRef = useRef<HTMLElement>(null);
  const switchBtnRef = useRef<HTMLButtonElement>(null);
  const workflowCardRef = useRef<HTMLElement>(null);
  const workflowLockedRef = useRef(false);
  const workflowPointerRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    dragging: false,
  });
  const [activeWord, setActiveWord] = useState(0);
  const [activePane, setActivePane] = useState(0);
  const [workflowDirection, setWorkflowDirection] = useState<1 | -1>(1);
  const wordIndexRef = useRef(0);

  useGSAP(
    () => {
      const switchBtn = switchBtnRef.current;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

      let switchCleanup: (() => void) | undefined;

      if (switchBtn && !reduceMotion && hasFinePointer) {
        const circles = gsap.utils.toArray<HTMLElement>(
          ".services-button-switch i",
          switchBtn,
        );

        const onEnter = () => {
          switchBtn.classList.add("is-hovered");
          gsap.to(circles, {
            scale: 1.1,
            stagger: { amount: 0, from: "end" },
            duration: 0.35,
            ease: "back.out(1.7)",
          });
        };

        const onLeave = () => {
          gsap.to(switchBtn.querySelector("i:nth-child(1)"), {
            scale: 0.55,
            duration: 0.2,
            ease: "back.out(1.7)",
          });
          gsap.to(switchBtn.querySelector("i:nth-child(2)"), {
            scale: 0.7,
            duration: 0.2,
            ease: "back.out(1.7)",
          });
          gsap.to(switchBtn.querySelector("i:nth-child(3)"), {
            scale: 0.85,
            duration: 0.2,
            ease: "back.out(1.7)",
          });
          gsap.to(switchBtn.querySelector("i:nth-child(4)"), {
            scale: 1,
            duration: 0.2,
            ease: "back.out(1.7)",
            onComplete: () => switchBtn.classList.remove("is-hovered"),
          });
        };

        switchBtn.addEventListener("mouseenter", onEnter);
        switchBtn.addEventListener("mouseleave", onLeave);

        switchCleanup = () => {
          switchBtn.removeEventListener("mouseenter", onEnter);
          switchBtn.removeEventListener("mouseleave", onLeave);
        };
      }

      return () => {
        switchCleanup?.();
      };
    },
    { scope: pageRef },
  );

  useGSAP(
    () => {
      const card = workflowCardRef.current;

      if (!card) {
        workflowLockedRef.current = false;
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.killTweensOf(card);

      if (reduceMotion) {
        gsap.set(card, { clearProps: "opacity,transform" });
        workflowLockedRef.current = false;
        return;
      }

      gsap.fromTo(
        card,
        {
          autoAlpha: 0,
          xPercent: workflowDirection === 1 ? 12 : -12,
          scale: 0.985,
        },
        {
          autoAlpha: 1,
          xPercent: 0,
          scale: 1,
          duration: 0.52,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          onComplete: () => {
            workflowLockedRef.current = false;
          },
        },
      );
    },
    { scope: pageRef, dependencies: [activePane, workflowDirection] },
  );

  const cycleAdjective = () => {
    const next = (wordIndexRef.current + 1) % heroAdjectives.length;
    wordIndexRef.current = next;
    setActiveWord(next);

    const switchBtn = switchBtnRef.current;
    if (switchBtn) {
      gsap.to(switchBtn.querySelector("svg"), {
        rotation: "+=180",
        duration: 0.55,
        ease: "power2.out",
      });
    }
  };

  const scrollToServices = () => {
    document
      .getElementById("service-block")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const changeWorkflowStep = (direction: 1 | -1) => {
    if (workflowLockedRef.current) {
      return;
    }

    workflowLockedRef.current = true;
    setWorkflowDirection(direction);
    setActivePane(
      (current) =>
        (current + direction + workflowSteps.length) % workflowSteps.length,
    );
  };

  const onWorkflowPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    workflowPointerRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      dragging: true,
    };

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some browsers can reject capture for pointer streams already claimed by scrolling.
    }
  };

  const onWorkflowPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const pointer = workflowPointerRef.current;

    if (!pointer.dragging || pointer.pointerId !== event.pointerId) {
      return;
    }

    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
  };

  const onWorkflowPointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const pointer = workflowPointerRef.current;

    if (!pointer.dragging || pointer.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = pointer.lastX - pointer.startX;
    const deltaY = pointer.lastY - pointer.startY;
    const isHorizontalSwipe =
      Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15;

    workflowPointerRef.current.dragging = false;
    workflowPointerRef.current.pointerId = -1;

    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Capture may already be released by the browser before pointerup/pointercancel.
    }

    if (isHorizontalSwipe) {
      changeWorkflowStep(deltaX < 0 ? 1 : -1);
    }
  };

  const activeWorkflowStep = workflowSteps[activePane];

  return (
    <>
      <main ref={pageRef} className="services-page bg-background text-foreground">
        <div className="services-breadcrumb">
          <Link href="/" className="opacity-70 transition hover:opacity-100">
            Yarsha Byte
          </Link>
          <span className="opacity-45" aria-hidden="true">/</span>
          <span>Services</span>
        </div>

        <section className="services-hero">
          <div className="services-hero-grid">
            <h1 className="services-hero-line">
              <div className="services-title-switch">
                {heroAdjectives.map((word, index) => (
                  <span
                    key={word}
                    className={index === activeWord ? "is-current" : undefined}
                    style={{
                      transform:
                        index === activeWord
                          ? "translateY(0%)"
                          : index < activeWord
                            ? "translateY(-110%)"
                            : "translateY(110%)",
                      transition:
                        "transform 520ms cubic-bezier(0.19, 1, 0.22, 1)",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>

              <div className="services-hero-row shift-1">
                <button
                  ref={switchBtnRef}
                  type="button"
                  className="services-button-switch"
                  aria-label="Cycle service headline word"
                  onClick={cycleAdjective}
                >
                  <i aria-hidden="true" />
                  <i aria-hidden="true" />
                  <i aria-hidden="true" />
                  <i aria-hidden="true" />
                  <RefreshCw aria-hidden="true" />
                </button>
                Approach
              </div>

              <div className="services-hero-row right shift-2 offset">
                that helps your
              </div>
              <div className="services-hero-row right shift-3">business</div>
            </h1>

            <p className="services-hero-intro">
              At Yarsha Byte, we build digital systems for Nepali businesses:
              websites, portfolios, branding, and launch setup that look
              credible and are easy to keep improving.
            </p>
          </div>

          <button
            type="button"
            className="services-scroll-to"
            onClick={scrollToServices}
          >
            (&nbsp;&nbsp;&nbsp;Scroll&nbsp;&nbsp;&nbsp;)
          </button>
        </section>

        <section id="service-block" className="services-block scroll-mt-24">
          <div className="services-block-grid">
            <div>
              <SectionLabel>What we do</SectionLabel>
              <p className="services-block-description mt-6 max-w-md text-base leading-7 text-foreground/68 sm:text-lg">
                At Yarsha Byte, we build digital systems for Nepali businesses
                websites, portfolios, branding, and launch setup that look
                credible and are easy to keep improving.
              </p>
            </div>

            <ul className="services-list">
              {serviceListItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="services-block services-lifecycle">
          <div className="services-block-grid !grid-cols-1 lg:!grid-cols-[0.42fr_0.58fr]">
            <SectionLabel>Workflow</SectionLabel>
            <h2 className="services-headline lg:col-start-2">
              Our pathway to success
              <MiniMark />
            </h2>
          </div>

          <div className="services-flying-stage mx-auto mt-8 max-w-[98rem] lg:mt-10">
            <div className="services-flying-panes">
              {workflowSteps.map((step, index) => (
                <article
                  key={step.number}
                  className={cn(
                    "services-fp-item",
                    index === activePane && "is-active",
                  )}
                  tabIndex={0}
                  onMouseEnter={() => setActivePane(index)}
                  onFocus={() => setActivePane(index)}
                  onClick={() => setActivePane(index)}
                >
                  <div className="services-fp-inner">
                    <p className="services-section-label services-fp-number">
                      <span className="dot-ring" aria-hidden="true" />
                      {step.number}
                    </p>

                    <div className="services-fp-bottom">
                      <h3 className="services-fp-title">
                        {step.title[0]}
                        <br />
                        {step.title[1]}
                      </h3>
                      <div className="services-fp-body-track">
                        <p className="services-fp-body">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div
              className="services-workflow-carousel"
              onPointerDown={onWorkflowPointerDown}
              onPointerMove={onWorkflowPointerMove}
              onPointerUp={onWorkflowPointerUp}
              onPointerCancel={onWorkflowPointerUp}
            >
              <article
                ref={workflowCardRef}
                key={`${activeWorkflowStep.number}-${workflowDirection}`}
                className="services-workflow-card"
                aria-live="polite"
              >
                <p className="services-section-label services-fp-number">
                  <span className="dot-ring" aria-hidden="true" />
                  {activeWorkflowStep.number}
                </p>
                <h3 className="services-workflow-card-title">
                  {activeWorkflowStep.title[0]}
                  <br />
                  {activeWorkflowStep.title[1]}
                </h3>
                <p className="services-workflow-card-body">
                  {activeWorkflowStep.description}
                </p>
              </article>

              <div className="services-workflow-controls">
                <button
                  type="button"
                  className="services-workflow-arrow"
                  aria-label="Show previous workflow step"
                  onClick={() => changeWorkflowStep(-1)}
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <span className="services-workflow-progress" aria-hidden="true">
                  {String(activePane + 1).padStart(2, "0")}
                  <i />
                  {String(workflowSteps.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  className="services-workflow-arrow"
                  aria-label="Show next workflow step"
                  onClick={() => changeWorkflowStep(1)}
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="services-block services-results">
          <div className="mx-auto max-w-[98rem] text-center">
            <SectionLabel>Results driven</SectionLabel>
            <h2 className="services-headline mt-6">
              Driving success, delivering results
              <MiniMark />
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-foreground/62">
              We understand how much your business matters. These are not just
              promises we focus on work that helps people trust you faster and
              take action sooner.
            </p>
          </div>

          <div className="services-goal-boxes mx-auto mt-10 max-w-[98rem]">
            {resultCases.map((item) => (
              <article key={item.name} className="services-goal-card">
                <div className="inner">
                  <div className="thumb">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 767px) 42vw, (max-width: 1279px) 28vw, 24vw"
                    />
                  </div>
                  <div className="services-goal-content">
                    <h3 className="services-goal-title">{item.name}</h3>
                    <div className="services-goal-stat">
                      {item.prefix ? (
                        <span className="text-xs font-semibold">
                          {item.prefix}
                        </span>
                      ) : null}
                      <span className="value">{item.stat}</span>
                      <span className="text-xs font-semibold">
                        {item.suffix}
                      </span>
                    </div>
                    <span className="services-goal-metric">{item.metric}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <ContactSection />
    </>
  );
}
