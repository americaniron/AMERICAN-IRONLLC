import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Truck, Route, Shield, CalendarClock, ArrowRight } from "lucide-react";

const services = [
  { icon: Truck, title: "Trucking Coordination", desc: "We arrange reliable carriers and coordinate all aspects of domestic heavy equipment transport." },
  { icon: Route, title: "Oversize/Load Planning", desc: "Expert planning for oversize and overweight loads, including route surveys and permit acquisition." },
  { icon: Shield, title: "Securement Guidance", desc: "Professional load securement guidance to ensure safe transport of all equipment types." },
  { icon: CalendarClock, title: "Delivery Scheduling", desc: "Precise scheduling and tracking to ensure your equipment arrives on time at your job site." },
];

export default function ServiceTransportation() {
  return (
    <div>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/service-transport.png)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight" data-testid="text-transport-title">
              Transportation Services
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Domestic pickup/delivery coordination and load planning for heavy industrial equipment across North America.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-8 tracking-tight">What We Provide</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((svc) => (
              <Card key={svc.title} className="p-6 border-card-border">
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

      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Arrange Transportation</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Contact our logistics team to coordinate equipment pickup and delivery.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-accent text-accent-foreground gap-2" size="lg" data-testid="button-contact-transport">
                Contact Us <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/quote">
              <Button variant="outline" size="lg">Request Quote</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
