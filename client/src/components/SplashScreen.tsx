import { useRef, useCallback, useState, useEffect } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"zoom-in" | "playing" | "exit">("zoom-in");
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
      return;
    }
    const zoomDone = setTimeout(() => setPhase("playing"), 400);
    const cutoff = setTimeout(() => setPhase("exit"), 3000);
    const done = setTimeout(() => onComplete(), 3500);
    return () => { clearTimeout(zoomDone); clearTimeout(cutoff); clearTimeout(done); };
  }, [onComplete, prefersReducedMotion]);

  useEffect(() => {
    if (phase === "playing" && videoRef.current) {
      videoRef.current.playbackRate = 1.5;
    }
  }, [phase]);

  const handleEnded = useCallback(() => {
    setPhase("exit");
    setTimeout(() => onComplete(), 500);
  }, [onComplete]);

  const handleError = useCallback(() => {
    onComplete();
  }, [onComplete]);

  if (prefersReducedMotion) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
      style={{
        animation: phase === "exit" ? "splash-fade-out 0.5s ease-in forwards" : undefined,
      }}
      data-testid="splash-screen"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 120px 40px rgba(0,0,0,0.8)",
          zIndex: 2,
        }}
      />

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        onError={handleError}
        className="w-full h-full object-cover"
        style={{
          transform: phase === "zoom-in" ? "scale(1.3)" : "scale(1)",
          opacity: phase === "zoom-in" ? 0 : 1,
          transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
          filter: "brightness(1.1) contrast(1.05)",
        }}
      >
        <source src="/images/intro-flash.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{
          opacity: phase === "zoom-in" ? 0 : 1,
          transform: phase === "zoom-in" ? "translateY(20px)" : "translateY(0)",
          transition: "opacity 0.4s 0.3s ease, transform 0.4s 0.3s ease",
        }}
      >
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: "hsl(49 100% 54%)",
              animation: phase !== "zoom-in" ? "splash-progress 2.6s linear forwards" : "none",
              transformOrigin: "left",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes splash-fade-out {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.05); }
        }
        @keyframes splash-progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
