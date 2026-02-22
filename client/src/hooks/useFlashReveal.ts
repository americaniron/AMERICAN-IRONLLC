import { useEffect, useRef } from "react";

const FLASH_SELECTORS = [
  ".flash-reveal",
  ".flash-reveal-scale",
  ".flash-reveal-left",
  ".flash-reveal-right",
  ".flash-reveal-down",
  ".flash-blur-in",
  ".flash-icon-pop",
  ".flash-badge-in",
  ".flash-line-grow",
].join(", ");

export function useFlashReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll(FLASH_SELECTORS);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("flash-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
