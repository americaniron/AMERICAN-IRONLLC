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

    const observed = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("flash-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    function observeNew() {
      const targets = el!.querySelectorAll(FLASH_SELECTORS);
      targets.forEach((t) => {
        if (!observed.has(t) && !t.classList.contains("flash-visible")) {
          observed.add(t);
          io.observe(t);
        }
      });
    }

    observeNew();

    const mo = new MutationObserver(() => observeNew());
    mo.observe(el, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [threshold]);

  return ref;
}
