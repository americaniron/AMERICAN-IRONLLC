import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import type { Part } from "@shared/schema";

const categoryLabels: Record<string, string> = {
  all: "All Parts",
  attachments: "Attachments",
  hydraulics: "Hydraulics",
  engine: "Engine",
  "filters-and-fluids": "Filters & Fluids",
  undercarriage: "Undercarriage",
  "hoses-and-tubes": "Hoses & Tubes",
  "ground-engaging-tools": "Ground Engaging Tools",
  drivetrain: "Drivetrain",
  "electrical-and-electronics": "Electrical & Electronics",
  "upgrades-repair-kits": "Upgrades & Repair Kits",
};

export default function PartsCategory() {
  const { category } = useParams<{ category: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const label = categoryLabels[category || "all"] || "Parts";

  const queryUrl = (() => {
    const p = new URLSearchParams();
    if (category && category !== "all") p.set("category", category);
    if (searchTerm) p.set("search", searchTerm);
    const qs = p.toString();
    return qs ? `/api/parts?${qs}` : "/api/parts";
  })();

  const { data: parts, isLoading } = useQuery<Part[]>({
    queryKey: [queryUrl],
  });

  return (
    <div>
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="breadcrumb-parts">
            <Link href="/">
              <span className="cursor-pointer">Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/parts">
              <span className="cursor-pointer">Parts</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">{label}</span>
          </nav>
        </div>
      </div>

      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" data-testid="text-parts-category-title">
                {label}
              </h1>
              {parts && (
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-semibold text-foreground">{parts.length}</span> items found
                </p>
              )}
            </div>
            <Link href="/quote">
              <Button className="bg-accent text-accent-foreground gap-2" data-testid="button-quote-from-parts">
                <ShoppingCart className="w-4 h-4" />
                Request Quote
              </Button>
            </Link>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search parts by number or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-parts"
            />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          ) : parts && parts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-parts">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 px-4 font-semibold text-muted-foreground">Part No.</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground">Description</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground">Category</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground">Price</th>
                    <th className="py-3 px-4 font-semibold text-muted-foreground">Compatibility</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((part) => (
                    <tr
                      key={part.id}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      data-testid={`row-part-${part.id}`}
                    >
                      <td className="py-3 px-4 font-mono font-medium">{part.partNumber}</td>
                      <td className="py-3 px-4">{part.description}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-xs no-default-active-elevate">
                          {part.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-accent">
                        {part.price || "Call"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {part.compatibility || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No parts found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search.</p>
              <Link href="/parts">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Catalog
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
