import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useFlashReveal } from "@/hooks/useFlashReveal";

import attachmentsImg from "@assets/attachments_1771718821209.jpg";
import drivetrainImg from "@assets/drivetrain_1771718821209.jpg";
import electricalImg from "@assets/electrical-and-electronics_1771718821209.jpg";
import engineImg from "@assets/engine_1771718821209.jpg";
import filtersImg from "@assets/filters-fluid_1771718821209.jpg";
import groundEngagingImg from "@assets/ground-engaging-tools_1771718821209.jpg";
import hosesImg from "@assets/hoses-and-tubes_1771718821209.jpg";
import hydraulicsImg from "@assets/hydraulics_1771718821209.jpg";
import undercarriageImg from "@assets/undercarriage_1771718821209.jpg";
import upgradesImg from "@assets/upgrades-repair-kits_1771718821209.jpg";

const VIDEOS = [
  "/images/parts-bg-1.mp4",
  "/images/parts-bg-2.mp4",
  "/images/parts-bg-3.mp4",
];

const categories = [
  {
    name: "Attachments",
    slug: "attachments",
    desc: "Buckets, couplers, forks, and more.",
    image: attachmentsImg,
  },
  {
    name: "Drivetrain",
    slug: "drivetrain",
    desc: "Transmission, torque, axles, and final drives.",
    image: drivetrainImg,
  },
  {
    name: "Electrical & Electronics",
    slug: "electrical-and-electronics",
    desc: "Harnesses, switches, controllers, sensors.",
    image: electricalImg,
  },
  {
    name: "Engine",
    slug: "engine",
    desc: "Gaskets, injectors, belts, sensors, and more.",
    image: engineImg,
  },
  {
    name: "Filters & Fluids",
    slug: "filters-and-fluids",
    desc: "Filters, service items, and fluid components.",
    image: filtersImg,
  },
  {
    name: "Ground Engaging Tools",
    slug: "ground-engaging-tools",
    desc: "Teeth, adapters, edges, and cutting bits.",
    image: groundEngagingImg,
  },
  {
    name: "Hoses & Tubes",
    slug: "hoses-and-tubes",
    desc: "Hoses, tubes, fittings, and clamps.",
    image: hosesImg,
  },
  {
    name: "Hydraulics",
    slug: "hydraulics",
    desc: "Pumps, valves, cylinders, and manifolds.",
    image: hydraulicsImg,
  },
  {
    name: "Undercarriage",
    slug: "undercarriage",
    desc: "Tracks, rollers, idlers, and wear parts.",
    image: undercarriageImg,
  },
  {
    name: "Upgrades & Repair Kits",
    slug: "upgrades-repair-kits",
    desc: "Popular kits and repair items across systems.",
    image: upgradesImg,
  },
];

function RotatingVideoBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextIndexRef = useRef(1);

  const handleVideoEnd = useCallback(() => {
    setFadingOut(true);
    setTimeout(() => {
      setActiveIndex(nextIndexRef.current);
      nextIndexRef.current = (nextIndexRef.current + 1) % VIDEOS.length;
      setFadingOut(false);
    }, 600);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [activeIndex]);

  return (
    <>
      <video
        ref={videoRef}
        key={activeIndex}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-600"
        style={{ opacity: fadingOut ? 0 : 1 }}
        muted
        playsInline
        onEnded={handleVideoEnd}
        data-testid="parts-hero-video"
      >
        <source src={VIDEOS[activeIndex]} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
    </>
  );
}

export default function PartsCatalog() {
  const { data: counts } = useQuery<Record<string, number>>({
    queryKey: ["/api/parts/categories/counts"],
  });

  const totalItems = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;

  const heroRef = useFlashReveal();
  const gridRef = useFlashReveal();

  return (
    <div className="flash-page-transition">
      <section className="relative py-24 overflow-hidden bg-black" ref={heroRef}>
        <RotatingVideoBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="flash-reveal text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight" data-testid="text-parts-title">
            Parts <span className="text-accent-3d">Catalog</span>
          </h1>
          <p className="flash-reveal text-white/70 text-lg max-w-2xl mb-6" style={{ "--flash-index": 1 } as any}>
            Browse parts by category across our inventory of {totalItems > 0 ? `${totalItems.toLocaleString()}+` : "12,200+"} items in stock.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/parts/all">
              <Button className="bg-accent text-accent-foreground gap-2" data-testid="button-view-all-parts">
                View All Parts
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/quote">
              <Button variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur gap-2" data-testid="button-request-quote">
                Request Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12" ref={gridRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="flash-reveal text-2xl font-bold tracking-tight">Browse by Category</h2>
              <p className="text-muted-foreground mt-1">
                {totalItems > 0 ? (
                  <>Inventory items: <span className="font-semibold text-foreground">{totalItems.toLocaleString()}</span></>
                ) : (
                  <>Inventory items: <span className="font-semibold text-foreground">12,200+</span></>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 flash-stagger">
            {categories.map((cat, i) => (
              <Link key={cat.slug} href={`/parts/${cat.slug}`}>
                <Card
                  className="flash-reveal-scale group overflow-visible hover-elevate cursor-pointer border-card-border h-full"
                  style={{ "--flash-index": i } as any}
                  data-testid={`card-parts-${cat.slug}`}
                >
                  <div className="aspect-[3/2] relative rounded-t-md overflow-hidden bg-white">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cat.desc}</p>
                    {counts && counts[cat.slug] && (
                      <p className="text-xs text-muted-foreground mt-2 font-medium">{counts[cat.slug].toLocaleString()} items</p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/parts/all">
              <Button size="lg" className="bg-accent text-accent-foreground gap-2 text-base px-8" data-testid="button-view-all-parts-bottom">
                View All Parts
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
