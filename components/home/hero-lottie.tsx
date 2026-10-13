"use client";

import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

export function HeroLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: !prefersReducedMotion,
      path: "/assets/images/m12/hero-animation.json",
    });
    animRef.current = anim;

    anim.setSpeed(0.8);

    if (prefersReducedMotion) {
      anim.goToAndStop(150, true);
    } else {
      anim.addEventListener("complete", () => {
        anim.pause();
      });
    }

    return () => {
      anim.destroy();
    };
  }, []);

  return (
    <div className="m12-hero-visual">
      <div id="hero-lottie" ref={containerRef} aria-hidden="true" className="w-full max-w-[40rem]" />
    </div>
  );
}
