import { useRef, useCallback } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleEnded = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleError = useCallback(() => {
    onComplete();
  }, [onComplete]);

  if (prefersReducedMotion) {
    onComplete();
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      data-testid="splash-screen"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        onError={handleError}
        className="w-full h-full object-contain"
      >
        <source src="/images/intro-flash.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
