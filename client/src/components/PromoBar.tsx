import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Calculator,
  Package,
  Zap,
  HardHat,
  Wrench,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useFlashReveal } from "@/hooks/useFlashReveal";

type PromoVariant =
  | "estimator"
  | "parts"
  | "equipment"
  | "power-units"
  | "mechanic-hub";

interface PromoItem {
  icon: typeof ArrowRight;
  title: string;
  tagline: string;
  description: string;
  href: string;
  external?: boolean;
  buttonLabel: string;
  stat: string;
  statLabel: string;
  bgImage: string;
}

const PROMO_DATA: Record<PromoVariant, PromoItem> = {
  estimator: {
    icon: Calculator,
    title: "IRON Estimator",
    tagline: "AI-POWERED",
    description:
      "Get instant, institutional-grade cost projections for your next construction project — equipment, parts, logistics, and personnel analyzed in seconds.",
    href: "/services/estimator",
    buttonLabel: "Launch Estimator",
    stat: "14",
    statLabel: "Report Sections",
    bgImage: "/images/promo-estimator.png",
  },
  parts: {
    icon: Package,
    title: "Parts Catalog",
    tagline: "17,500+ ITEMS",
    description:
      "Aftermarket parts across 14 categories — filters, hydraulics, engine components, undercarriage, and more. All priced and ready to quote.",
    href: "/parts",
    buttonLabel: "Browse Parts",
    stat: "17.5K+",
    statLabel: "Parts Available",
    bgImage: "/images/promo-parts.png",
  },
  equipment: {
    icon: HardHat,
    title: "Equipment Inventory",
    tagline: "2,100+ UNITS",
    description:
      "Excavators, bulldozers, wheel loaders, motor graders, and more — all inspected and ready for deployment worldwide.",
    href: "/equipment",
    buttonLabel: "View Equipment",
    stat: "2,100+",
    statLabel: "Units In Stock",
    bgImage: "/images/promo-equipment.png",
  },
  "power-units": {
    icon: Zap,
    title: "Power Units & Generators",
    tagline: "138 UNITS",
    description:
      "Diesel and gas generators, marine engines, and industrial power units from 20kW to 2,000kW for any jobsite requirement.",
    href: "/power-units",
    buttonLabel: "View Power Units",
    stat: "138",
    statLabel: "Power Units",
    bgImage: "/images/promo-power-units.png",
  },
  "mechanic-hub": {
    icon: Wrench,
    title: "Mechanic Hub",
    tagline: "PARTNER PLATFORM",
    description:
      "Repair manuals, training videos, diagnostic tools, and an expert community for heavy equipment technicians worldwide.",
    href: "/mechanic-hub",
    buttonLabel: "Launch Mechanic Hub",
    stat: "FREE",
    statLabel: "Access Now",
    bgImage: "/images/promo-mechanic.png",
  },
};

function AnimatedBorderCard({ children, index }: { children: React.ReactNode; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 150);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
      }}
    >
      {children}
    </div>
  );
}

function PulsingDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
    </span>
  );
}

interface PromoBarProps {
  variants: PromoVariant[];
  className?: string;
}

export function PromoBar({ variants, className = "" }: PromoBarProps) {
  const ref = useFlashReveal();

  return (
    <section
      ref={ref}
      className={`py-16 relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.08)_0%,transparent_60%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-3 px-5 py-2 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-sm">
            <PulsingDot />
            <span className="text-accent text-xs font-black tracking-[0.2em] uppercase">
              Explore More from American Iron
            </span>
            <PulsingDot />
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Everything you need for your next project — all in one place
          </p>
        </div>

        <div
          className={`grid grid-cols-1 ${
            variants.length === 1
              ? "max-w-lg mx-auto"
              : variants.length === 2
                ? "md:grid-cols-2 max-w-4xl mx-auto"
                : "md:grid-cols-3"
          } gap-6`}
        >
          {variants.map((variant, i) => {
            const promo = PROMO_DATA[variant];
            const Icon = promo.icon;

            const inner = (
              <div
                className="group relative rounded-xl overflow-hidden cursor-pointer h-full flex flex-col transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(var(--accent)/0.4)]"
                data-testid={`promo-banner-${variant}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${promo.bgImage})` }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-0 rounded-xl border-2 border-accent/20 group-hover:border-accent/60 transition-colors duration-500" style={{ boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)" }} />

                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-6 flex flex-col h-full min-h-[280px]">
                  <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-black/50 backdrop-blur-md border border-accent/40 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_25px_hsl(var(--accent)/0.4)] transition-all duration-500">
                        <Icon className="w-7 h-7 text-accent drop-shadow-[0_0_8px_hsl(var(--accent)/0.5)]" />
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <PulsingDot />
                      </div>
                    </div>

                    <div className="text-right bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
                      <div className="text-2xl font-black text-accent leading-none tracking-tight drop-shadow-[0_0_10px_hsl(var(--accent)/0.4)]">
                        {promo.stat}
                      </div>
                      <div className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider mt-0.5">
                        {promo.statLabel}
                      </div>
                    </div>
                  </div>

                  <div className="mb-1">
                    <span className="text-[10px] font-black tracking-[0.15em] text-accent/80 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {promo.tagline}
                    </span>
                  </div>
                  <h3 className="font-black text-xl text-white mb-2 group-hover:text-accent transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-5 flex-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {promo.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent/20 backdrop-blur-sm border border-accent/30 text-sm font-black text-accent group-hover:bg-accent group-hover:text-black group-hover:border-accent transition-all duration-300 shadow-lg">
                      {promo.buttonLabel}
                      {promo.external ? (
                        <ExternalLink className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      )}
                    </span>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            );

            const wrappedInner = (
              <AnimatedBorderCard index={i}>
                {inner}
              </AnimatedBorderCard>
            );

            if (promo.external) {
              return (
                <a
                  key={variant}
                  href={promo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-promo-${variant}`}
                >
                  {wrappedInner}
                </a>
              );
            }

            return (
              <Link key={variant} href={promo.href} data-testid={`link-promo-${variant}`}>
                {wrappedInner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
