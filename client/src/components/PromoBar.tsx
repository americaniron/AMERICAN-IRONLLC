import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calculator,
  Package,
  Zap,
  HardHat,
  Wrench,
  Sparkles,
  ExternalLink,
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
  description: string;
  href: string;
  external?: boolean;
  buttonLabel: string;
}

const PROMO_DATA: Record<PromoVariant, PromoItem> = {
  estimator: {
    icon: Calculator,
    title: "IRON Estimator",
    description:
      "Get AI-powered cost projections for your next construction project. Analyze equipment needs, parts budgets, and logistics in seconds.",
    href: "/estimator",
    buttonLabel: "Try the Estimator",
  },
  parts: {
    icon: Package,
    title: "Parts Catalog",
    description:
      "Browse 17,500+ aftermarket parts across 14 categories. Find filters, hydraulics, engine components, and more.",
    href: "/parts",
    buttonLabel: "Browse Parts",
  },
  equipment: {
    icon: HardHat,
    title: "Equipment Inventory",
    description:
      "Explore 2,100+ pieces of heavy equipment across excavators, bulldozers, wheel loaders, and more.",
    href: "/equipment",
    buttonLabel: "View Equipment",
  },
  "power-units": {
    icon: Zap,
    title: "Power Units & Generators",
    description:
      "Diesel and gas generators, marine engines, and industrial power units from 20kW to 2,000kW.",
    href: "/power-units",
    buttonLabel: "View Power Units",
  },
  "mechanic-hub": {
    icon: Wrench,
    title: "Mechanic Hub",
    description:
      "Repair manuals, training videos, diagnostic tools, and an expert community for heavy equipment technicians.",
    href: "https://heavy-equipment-mechanic.replit.app",
    external: true,
    buttonLabel: "Launch Mechanic Hub",
  },
};

interface PromoBarProps {
  variants: PromoVariant[];
  className?: string;
}

export function PromoBar({ variants, className = "" }: PromoBarProps) {
  const ref = useFlashReveal();

  return (
    <section
      ref={ref}
      className={`py-12 relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-accent/[0.02]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="flash-reveal flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-accent text-xs font-bold tracking-widest uppercase">
            Explore More from American Iron
          </span>
          <div className="h-px flex-1 bg-accent/20" />
        </div>

        <div
          className={`grid grid-cols-1 ${
            variants.length === 1
              ? ""
              : variants.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-3"
          } gap-5 flash-stagger`}
        >
          {variants.map((variant, i) => {
            const promo = PROMO_DATA[variant];
            const Icon = promo.icon;

            const inner = (
              <div
                className="flash-reveal-scale group relative rounded-md border border-border bg-card p-5 hover-elevate cursor-pointer h-full flex flex-col"
                style={{ "--flash-index": i } as any}
                data-testid={`promo-banner-${variant}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base leading-tight">
                      {promo.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {promo.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:underline">
                    {promo.buttonLabel}
                    {promo.external ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                </div>
              </div>
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
                  {inner}
                </a>
              );
            }

            return (
              <Link key={variant} href={promo.href} data-testid={`link-promo-${variant}`}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
