import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFlashReveal } from "@/hooks/useFlashReveal";

import marineEnginesImg from "@/assets/images/marine-engines.png";
import generatorSetsImg from "@/assets/images/generator-sets.png";
import powerUnitsImg from "@/assets/images/power-units-cat.png";
import industrialGeneratorsImg from "@/assets/images/industrial-generators.png";

const POWER_CATEGORIES = [
  { name: "Generator Sets", label: "Generator Sets", image: generatorSetsImg, description: "20kW to 2,000kW diesel and natural gas generator sets" },
  { name: "Marine Engines", label: "Marine Engines", image: marineEnginesImg, description: "High-performance marine propulsion and auxiliary engines" },
  { name: "Power Units", label: "Power Units", image: powerUnitsImg, description: "Standalone diesel and gas power units for industrial applications" },
  { name: "Industrial Generators", label: "Industrial Generators", image: industrialGeneratorsImg, description: "Heavy-duty industrial and standby generator systems" },
];

export default function PowerUnits() {
  const { data: counts } = useQuery<Record<string, number>>({
    queryKey: ["/api/power-units/categories/counts"],
  });

  const totalItems = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;

  const heroRef = useFlashReveal();
  const gridRef = useFlashReveal();

  return (
    <div className="flash-page-transition">
      <section className="relative py-24 overflow-hidden bg-black" ref={heroRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/40 via-black to-black/90" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-accent flash-reveal" />
            <span className="flash-reveal text-accent font-semibold uppercase tracking-wider text-sm" style={{ "--flash-index": 0 } as any}>Power & Generation</span>
          </div>
          <h1 className="flash-reveal text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight" style={{ "--flash-index": 1 } as any} data-testid="text-page-title">
            Power Units & Generators
          </h1>
          <p className="flash-reveal text-white/70 text-lg max-w-2xl" style={{ "--flash-index": 2 } as any}>
            {totalItems > 0 ? `${totalItems}+` : ""} engines, generators, and power units — from marine propulsion to industrial standby power.
          </p>
        </div>
      </section>

      <section className="py-12" ref={gridRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flash-stagger">
            {POWER_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                href={`/power-units/listings?category=${encodeURIComponent(cat.name)}`}
              >
                <Card
                  className="flash-reveal-scale group overflow-visible hover-elevate cursor-pointer border-card-border h-full"
                  style={{ "--flash-index": i } as any}
                  data-testid={`card-category-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="aspect-[16/9] relative rounded-t-md overflow-hidden bg-muted">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{cat.label}</h3>
                      <ArrowRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{cat.description}</p>
                    {counts && counts[cat.name] && (
                      <span className="text-sm font-semibold text-accent">{counts[cat.name]} units available</span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/power-units/listings">
              <Button size="lg" className="bg-accent text-accent-foreground gap-2 text-base px-8" data-testid="button-view-all-power-units">
                View All Power Units & Generators
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
