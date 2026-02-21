import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Wrench,
  Droplets,
  Settings,
  Filter,
  Layers,
  Cable,
  Hammer,
  Cog,
  Zap,
  Package,
} from "lucide-react";

const categories = [
  {
    name: "Attachments",
    slug: "attachments",
    desc: "Buckets, couplers, forks, and more.",
    icon: Wrench,
    image: "/images/cat-wheel-loader.png",
  },
  {
    name: "Hydraulics",
    slug: "hydraulics",
    desc: "Pumps, valves, cylinders, and manifolds.",
    icon: Droplets,
    image: "/images/cat-excavator.png",
  },
  {
    name: "Engine",
    slug: "engine",
    desc: "Gaskets, injectors, belts, sensors, and more.",
    icon: Settings,
    image: "/images/cat-bulldozer.png",
  },
  {
    name: "Filters & Fluids",
    slug: "filters-and-fluids",
    desc: "Filters, service items, and fluid components.",
    icon: Filter,
    image: "/images/cat-wheel-loader.png",
  },
  {
    name: "Undercarriage",
    slug: "undercarriage",
    desc: "Tracks, rollers, idlers, and wear parts.",
    icon: Layers,
    image: "/images/cat-bulldozer.png",
  },
  {
    name: "Hoses & Tubes",
    slug: "hoses-and-tubes",
    desc: "Hoses, tubes, fittings, and clamps.",
    icon: Cable,
    image: "/images/cat-excavator.png",
  },
  {
    name: "Ground Engaging Tools",
    slug: "ground-engaging-tools",
    desc: "Teeth, adapters, edges, and cutting bits.",
    icon: Hammer,
    image: "/images/cat-bulldozer.png",
  },
  {
    name: "Drivetrain",
    slug: "drivetrain",
    desc: "Transmission, torque, axles, and final drives.",
    icon: Cog,
    image: "/images/cat-wheel-loader.png",
  },
  {
    name: "Electrical & Electronics",
    slug: "electrical-and-electronics",
    desc: "Harnesses, switches, controllers, sensors.",
    icon: Zap,
    image: "/images/cat-excavator.png",
  },
  {
    name: "Upgrades & Repair Kits",
    slug: "upgrades-repair-kits",
    desc: "Popular kits and repair items across systems.",
    icon: Package,
    image: "/images/cat-bulldozer.png",
  },
];

export default function PartsCatalog() {
  return (
    <div>
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-parts.png)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight" data-testid="text-parts-title">
            Parts Catalog
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mb-6">
            Browse parts by category or view all parts. Over 12,000 items in stock.
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

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
              <p className="text-muted-foreground mt-1">
                Inventory items: <span className="font-semibold text-foreground">12,236</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/parts/${cat.slug}`}>
                <Card
                  className="group overflow-visible hover-elevate cursor-pointer border-card-border h-full"
                  data-testid={`card-parts-${cat.slug}`}
                >
                  <div className="aspect-[3/2] relative rounded-t-md overflow-hidden bg-muted">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="w-8 h-8 rounded-md bg-accent/90 flex items-center justify-center">
                        <cat.icon className="w-4 h-4 text-accent-foreground" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cat.desc}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
