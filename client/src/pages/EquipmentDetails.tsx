import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Gauge,
  Tag,
  Truck,
  FileText,
  ChevronRight,
} from "lucide-react";
import type { Equipment } from "@shared/schema";

export default function EquipmentDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: item, isLoading } = useQuery<Equipment>({
    queryKey: [`/api/equipment/${id}`],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Skeleton className="h-6 w-40 mb-8" />
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/3] rounded-md" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Equipment Not Found</h2>
        <p className="text-muted-foreground mb-6">The equipment listing you're looking for doesn't exist.</p>
        <Link href="/equipment/listings">
          <Button data-testid="button-back-to-inventory">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>
        </Link>
      </div>
    );
  }

  const specs = [
    { icon: Tag, label: "Make", value: item.make },
    { icon: Tag, label: "Model", value: item.model },
    { icon: Calendar, label: "Year", value: item.year?.toString() || "N/A" },
    { icon: Gauge, label: "Meter", value: item.meter ? `${item.meter.toLocaleString()} hrs` : "N/A" },
    { icon: MapPin, label: "Location", value: [item.city, item.state].filter(Boolean).join(", ") || "N/A" },
  ];

  return (
    <div>
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="breadcrumb">
            <Link href="/">
              <span className="cursor-pointer">Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/equipment">
              <span className="cursor-pointer">Categories</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">
              {item.make} {item.model}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="aspect-[4/3] rounded-md overflow-hidden bg-muted">
              <img
                src={item.imageUrl || "/images/cat-bulldozer.png"}
                alt={`${item.make} ${item.model}`}
                className="w-full h-full object-cover"
                data-testid="img-equipment"
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/10 text-primary no-default-active-elevate">
                  {item.category}
                </Badge>
                <span className="text-sm text-muted-foreground">ID: {item.equipmentId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" data-testid="text-equipment-title">
                {item.make} {item.model}
              </h1>
            </div>

            <div className="text-3xl font-bold text-accent" data-testid="text-equipment-price">
              {item.price && item.price !== "CALL" ? item.price : "Call for Price"}
            </div>

            <Card className="p-0 border-card-border divide-y">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <spec.icon className="w-4 h-4" />
                    {spec.label}
                  </div>
                  <span className="font-medium text-sm">{spec.value}</span>
                </div>
              ))}
            </Card>

            <div className="flex flex-col gap-3">
              <Link href="/contact">
                <Button className="w-full bg-accent text-accent-foreground gap-2" size="lg" data-testid="button-get-quote-detail">
                  <FileText className="w-4 h-4" />
                  Send me a Quote
                </Button>
              </Link>
              <Link href="/services/shipping">
                <Button className="w-full gap-2" variant="outline" size="lg" data-testid="button-shipping-detail">
                  <Truck className="w-4 h-4" />
                  Shipping & Forwarding
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Availability and pricing subject to change. Contact American Iron LLC for confirmation and formal quote.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/equipment/listings">
            <Button variant="outline" className="gap-2" data-testid="button-back-inventory">
              <ArrowLeft className="w-4 h-4" />
              Back to Inventory
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
