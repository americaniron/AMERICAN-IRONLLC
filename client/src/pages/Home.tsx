import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Wrench,
  Search,
  Truck,
  Ship,
  Shield,
  Globe,
  Zap,
  Users,
  ChevronRight,
  Package,
  Settings,
} from "lucide-react";

const categories = [
  "Wheel Loaders", "Excavators", "Bulldozers", "Telehandlers",
  "Motor Graders", "Articulated Trucks", "Scrapers", "Compactors",
];

const services = [
  {
    icon: Wrench,
    title: "Industrial Dismantling",
    desc: "Professional salvage and dismantling operations with maximum component recovery.",
    href: "/services/dismantling",
    image: "/images/service-dismantling.png",
  },
  {
    icon: Search,
    title: "Technical Inspection",
    desc: "Rigorous field inspections and data-driven reporting for asset integrity.",
    href: "/services/inspection",
    image: "/images/service-inspection.png",
  },
  {
    icon: Truck,
    title: "Transportation",
    desc: "Seamless domestic haulage and heavy-haul coordination across North America.",
    href: "/services/transportation",
    image: "/images/service-transport.png",
  },
  {
    icon: Ship,
    title: "Shipping & Forwarding",
    desc: "Expert freight forwarding and customs documentation for global delivery.",
    href: "/services/shipping",
    image: "/images/service-shipping.png",
  },
];

const stats = [
  { value: "1,700+", label: "Equipment Listed" },
  { value: "12,200+", label: "Parts in Catalog" },
  { value: "10+", label: "Equipment Categories" },
  { value: "Global", label: "Shipping Network" },
];

const valueProps = [
  {
    icon: Shield,
    title: "Market-Leading Expertise",
    desc: "Our veteran team leverages decades of industry data to source high-performance equipment and rare components nationwide.",
  },
  {
    icon: Zap,
    title: "Operational Efficiency",
    desc: "A streamlined procurement platform designed for rapid response, ensuring your projects remain on schedule and within budget.",
  },
  {
    icon: Globe,
    title: "Global Scalability",
    desc: "From our strategic headquarters in Florida, we offer comprehensive logistical support to deploy assets to job sites across the globe.",
  },
  {
    icon: Users,
    title: "Integrity-Driven Partnership",
    desc: "We prioritize long-term professional relationships built on transparency, technical excellence, and consistent delivery.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-equipment.png)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent text-sm font-medium">
                Tampa, FL | Global Operations
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Heavy Equipment &{" "}
              <span className="text-accent">Asset Management</span>{" "}
              Solutions
            </h1>

            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed">
              Empowering global infrastructure through comprehensive parts
              inventory, and unparalleled equipment procurement.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/equipment">
                <Button size="lg" className="bg-accent text-accent-foreground gap-2 text-base px-8" data-testid="button-explore-equipment">
                  Explore Equipment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/parts">
                <Button size="lg" variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur gap-2 text-base px-8" data-testid="button-explore-parts">
                  Industrial Parts
                  <Package className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-4 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="p-6 text-center border-card-border"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Core Capabilities
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From acquisition to end-of-life recovery, end-to-end support for your heavy machinery investments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/equipment">
              <Card className="group relative overflow-visible p-6 hover-elevate cursor-pointer border-card-border" data-testid="card-asset-inventory">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                    <Settings className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                      Asset Inventory Management
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Optimize your fleet with our meticulously vetted inventory. Filter by manufacturer, specification, and operational history.
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/parts">
              <Card className="group relative overflow-visible p-6 hover-elevate cursor-pointer border-card-border" data-testid="card-parts-distribution">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                      Global Parts Distribution
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Minimize downtime with immediate access to our extensive component database for mission-critical machinery.
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/quote">
              <Card className="group relative overflow-visible p-6 hover-elevate cursor-pointer border-card-border" data-testid="card-consultations">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                    <Search className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                      Strategic Consultations & Quotes
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Receive comprehensive, transparent quotes for equipment procurement or specialized component sourcing.
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/contact">
              <Card className="group relative overflow-visible p-6 hover-elevate cursor-pointer border-card-border" data-testid="card-contact">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                      Global Reach
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      From our Florida hub, we deploy assets and parts to job sites worldwide with expert logistics coordination.
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Integrated Lifecycle Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comprehensive support from acquisition to end-of-life recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => (
              <Link key={svc.href} href={svc.href}>
                <Card
                  className="group overflow-visible hover-elevate cursor-pointer border-card-border h-full"
                  data-testid={`card-service-${svc.href.split("/").pop()}`}
                >
                  <div className="aspect-[4/3] relative rounded-t-md overflow-hidden">
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="w-9 h-9 rounded-md bg-accent/90 flex items-center justify-center">
                        <svc.icon className="w-4.5 h-4.5 text-accent-foreground" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold mb-2 flex items-center gap-1.5">
                      {svc.title}
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                Browse Equipment Categories
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We maintain a comprehensive inventory of over 1,700 pieces of heavy equipment across all major categories.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <Link key={cat} href={`/equipment/listings?category=${encodeURIComponent(cat.toUpperCase())}`}>
                    <span className="inline-flex items-center px-4 py-2 rounded-md bg-card border border-card-border text-sm font-medium cursor-pointer hover-elevate" data-testid={`badge-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}>
                      {cat}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/equipment">
                <Button className="bg-accent text-accent-foreground gap-2" data-testid="button-view-all-equipment">
                  View All Equipment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-md overflow-hidden">
                <img
                  src="/images/hero-about.png"
                  alt="Heavy equipment fleet"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground p-4 rounded-md">
                <div className="text-2xl font-bold">1,704</div>
                <div className="text-sm font-medium">Active Listings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Value Proposition
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
              Why industry leaders trust American Iron LLC as their primary equipment partner.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {valueProps.map((vp) => (
              <div key={vp.title} className="flex items-start gap-4" data-testid={`value-${vp.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="w-12 h-12 rounded-md bg-accent/20 flex items-center justify-center shrink-0">
                  <vp.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{vp.title}</h3>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">
                    {vp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Contact our asset specialists for equipment acquisition, parts procurement, and specialized industrial services.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-accent text-accent-foreground gap-2 text-base px-8" data-testid="button-cta-quote">
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8" data-testid="button-cta-contact">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
