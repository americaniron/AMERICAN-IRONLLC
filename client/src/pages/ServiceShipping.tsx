import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ship, FileText, Package, CalendarClock, ArrowRight, Globe } from "lucide-react";
import { useFlashReveal } from "@/hooks/useFlashReveal";

const services = [
  { icon: Ship, title: "Ocean & Air Freight Coordination", desc: "Full-service international freight management for ocean and air cargo shipments." },
  { icon: FileText, title: "Export Documentation Support", desc: "Comprehensive customs documentation preparation and compliance management." },
  { icon: Package, title: "Packaging / Crating Planning", desc: "Professional packaging and crating solutions for safe international transit." },
  { icon: CalendarClock, title: "Pickup & Delivery Scheduling", desc: "Door-to-port and port-to-door scheduling for seamless logistics chain." },
];

export default function ServiceShipping() {
  const heroRef = useFlashReveal();
  const cardsRef = useFlashReveal();
  const globalRef = useFlashReveal();

  return (
    <div className="flash-page-transition">
      <section className="relative py-24 overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/service-shipping.png)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="flash-reveal text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight" data-testid="text-shipping-title">
              Shipping & Forwarding
            </h1>
            <p className="flash-reveal text-white/70 text-lg leading-relaxed" style={{ "--flash-index": 1 } as any}>
              Expert freight forwarding and customs documentation. Secure, compliant global delivery from our Florida-based hub to any international port.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16" ref={cardsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="flash-reveal text-2xl font-bold mb-8 tracking-tight">Freight Support</h2>
          <div className="grid sm:grid-cols-2 gap-4 flash-stagger">
            {services.map((svc, i) => (
              <Card key={svc.title} className="flash-reveal-scale p-6 border-card-border" style={{ "--flash-index": i } as any}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                    <svc.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{svc.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card" ref={globalRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flash-reveal flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Global Shipping Network</h2>
              </div>
              <p className="flash-reveal text-muted-foreground leading-relaxed mb-6" style={{ "--flash-index": 1 } as any}>
                From our strategic headquarters in Tampa, Florida, we facilitate secure, compliant global delivery to any international port. Our team handles all customs documentation, freight coordination, and logistics planning.
              </p>
              <div className="flash-reveal flex flex-wrap gap-4" style={{ "--flash-index": 2 } as any}>
                <Link href="/contact">
                  <Button className="bg-accent text-accent-foreground gap-2" data-testid="button-contact-shipping">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/quote">
                  <Button variant="outline">Request Quote</Button>
                </Link>
              </div>
            </div>
            <div className="flash-reveal-scale aspect-[4/3] rounded-md overflow-hidden" style={{ "--flash-index": 1 } as any}>
              <img src="/images/service-shipping.png" alt="International shipping" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
