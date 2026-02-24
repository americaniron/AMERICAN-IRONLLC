import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronRight, Search, Wrench, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFlashReveal } from "@/hooks/useFlashReveal";
import type { Equipment } from "@shared/schema";

const BRAND_DISPLAY_NAMES: Record<string, string> = {
  "INTERNATIONAL": "International",
  "BOBCAT": "Bobcat",
  "JOHN DEERE": "John Deere",
  "ALLMAND": "Allmand",
  "GENIE": "Genie",
  "FREIGHTLINER": "Freightliner",
  "JCB": "JCB",
  "MULTIQUIP": "Multiquip",
  "KENWORTH": "Kenworth",
  "PETERBILT": "Peterbilt",
  "LEDWELL": "Ledwell",
  "BOSCH": "Bosch",
  "EPIROC": "Epiroc",
  "EDCO": "EDCO",
  "STANLEY": "Stanley",
  "VERMEER": "Vermeer",
  "FELLING": "Felling",
  "CASE": "Case",
  "KOMATSU": "Komatsu",
  "WACKER": "Wacker",
  "VOLVO": "Volvo",
  "ROCKLAND": "Rockland",
  "MAGNI": "Magni",
  "LINK BELT CRANE": "Link-Belt Crane",
  "MANITOWOC": "Manitowoc",
  "TERAN": "Teran",
  "DOOSAN": "Doosan",
  "KUBOTA": "Kubota",
  "SULLAIR": "Sullair",
  "WIRTGEN": "Wirtgen",
  "HYUNDAI": "Hyundai",
  "KOBELCO": "Kobelco",
  "TEREX": "Terex",
  "SANY": "Sany",
  "DITCH WITCH": "Ditch Witch",
};

const BRAND_COLORS: Record<string, string> = {
  "BOBCAT": "#E31937",
  "JOHN DEERE": "#367C2B",
  "KOMATSU": "#004B87",
  "CASE": "#B5121B",
  "VOLVO": "#003057",
  "JCB": "#F9C300",
  "GENIE": "#005DAB",
  "VERMEER": "#FFD200",
  "INTERNATIONAL": "#C8102E",
  "FREIGHTLINER": "#004B87",
  "KENWORTH": "#C8102E",
  "PETERBILT": "#CC0000",
  "EPIROC": "#004F9F",
  "BOSCH": "#E20015",
  "KUBOTA": "#F06E00",
  "DOOSAN": "#002D5E",
  "HYUNDAI": "#002C5F",
  "KOBELCO": "#004094",
  "TEREX": "#003DA5",
  "SANY": "#CC0000",
  "MANITOWOC": "#B81C2C",
};

const BRAND_LOGOS: Record<string, string> = {
  "BOBCAT": "https://logo.clearbit.com/bobcat.com",
  "JOHN DEERE": "https://logo.clearbit.com/deere.com",
  "KOMATSU": "https://logo.clearbit.com/komatsu.com",
  "CASE": "https://logo.clearbit.com/casece.com",
  "VOLVO": "https://logo.clearbit.com/volvoce.com",
  "JCB": "https://logo.clearbit.com/jcb.com",
  "GENIE": "https://logo.clearbit.com/genielift.com",
  "VERMEER": "https://logo.clearbit.com/vermeer.com",
  "INTERNATIONAL": "https://logo.clearbit.com/internationaltrucks.com",
  "FREIGHTLINER": "https://logo.clearbit.com/freightliner.com",
  "KENWORTH": "https://logo.clearbit.com/kenworth.com",
  "PETERBILT": "https://logo.clearbit.com/peterbilt.com",
  "EPIROC": "https://logo.clearbit.com/epiroc.com",
  "BOSCH": "https://logo.clearbit.com/bosch.com",
  "KUBOTA": "https://logo.clearbit.com/kubota.com",
  "DOOSAN": "https://logo.clearbit.com/doosan.com",
  "HYUNDAI": "https://logo.clearbit.com/hyundai-ce.com",
  "KOBELCO": "https://logo.clearbit.com/kobelco-usa.com",
  "TEREX": "https://logo.clearbit.com/terex.com",
  "SANY": "https://logo.clearbit.com/sanyamerica.com",
  "MANITOWOC": "https://logo.clearbit.com/manitowoc.com",
  "STANLEY": "https://logo.clearbit.com/stanleyinfrastructure.com",
  "MULTIQUIP": "https://logo.clearbit.com/multiquip.com",
  "WACKER": "https://logo.clearbit.com/wackerneuson.com",
  "DITCH WITCH": "https://logo.clearbit.com/ditchwitch.com",
  "SULLAIR": "https://logo.clearbit.com/sullair.com",
  "WIRTGEN": "https://logo.clearbit.com/wirtgen.com",
  "ALLMAND": "https://logo.clearbit.com/allmand.com",
  "MAGNI": "https://logo.clearbit.com/magnith.com",
  "LINK BELT CRANE": "https://logo.clearbit.com/linkbelt.com",
  "LEDWELL": "https://logo.clearbit.com/ledwell.com",
  "FELLING": "https://logo.clearbit.com/felling.com",
  "ROCKLAND": "https://logo.clearbit.com/rocklandmfg.com",
  "TERAN": "https://logo.clearbit.com/teranbuckets.com",
  "EDCO": "https://logo.clearbit.com/edcoinc.com",
};

const VIDEOS = [
  "/images/equip-bg-1.mp4",
  "/images/equip-bg-2.mp4",
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
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: fadingOut ? 0 : 1 }}
        muted
        playsInline
        onEnded={handleVideoEnd}
      >
        <source src={VIDEOS[activeIndex]} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
    </>
  );
}

function BrandLogo({ brand, size = 48 }: { brand: string; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = BRAND_LOGOS[brand];
  const displayName = BRAND_DISPLAY_NAMES[brand] || brand.charAt(0) + brand.slice(1).toLowerCase();
  const brandColor = BRAND_COLORS[brand] || "#FFCD11";

  if (!logoUrl || imgError) {
    return (
      <div
        className="font-black tracking-tight text-center leading-tight"
        style={{ color: brandColor, fontSize: size * 0.45 }}
      >
        {displayName}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${displayName} logo`}
      className="object-contain"
      style={{ width: size, height: size }}
      onError={() => setImgError(true)}
    />
  );
}

export default function OtherEquipmentBrands() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const heroRef = useFlashReveal();
  const gridRef = useFlashReveal();

  const { data: brandCounts, isLoading: brandsLoading } = useQuery<Record<string, number>>({
    queryKey: ["/api/equipment/brands/counts?category=OTHER EQUIPMENT"],
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedBrand]);

  if (selectedBrand) {
    return <BrandListings brand={selectedBrand} onBack={() => setSelectedBrand(null)} />;
  }

  const sortedBrands = brandCounts
    ? Object.entries(brandCounts)
        .filter(([brand]) => brand !== "ZZ" && brand.length > 1)
        .sort((a, b) => b[1] - a[1])
    : [];

  const totalItems = sortedBrands.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="flash-page-transition">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="breadcrumb">
            <Link href="/"><span className="cursor-pointer">Home</span></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/equipment"><span className="cursor-pointer">Equipment</span></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">Other Equipment</span>
          </nav>
        </div>
      </div>

      <section className="relative py-24 overflow-hidden bg-black" ref={heroRef}>
        <RotatingVideoBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="flash-reveal text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight" data-testid="text-page-title">
            Other Equipment — By Brand
          </h1>
          <p className="flash-reveal text-white/70 text-lg max-w-2xl" style={{ "--flash-index": 1 } as any}>
            Browse {totalItems > 0 ? `${totalItems.toLocaleString()} items across ` : ""}{sortedBrands.length} equipment brands including Bobcat, John Deere, Vermeer, JCB, and more.
          </p>
        </div>
      </section>

      <section className="py-12" ref={gridRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {brandsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="border-card-border">
                  <Skeleton className="aspect-[16/10] rounded-t-md" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flash-stagger">
              {sortedBrands.map(([brand, count], i) => {
                const displayName = BRAND_DISPLAY_NAMES[brand] || brand.charAt(0) + brand.slice(1).toLowerCase();
                const brandColor = BRAND_COLORS[brand] || "#FFCD11";
                return (
                  <div
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className="cursor-pointer"
                    data-testid={`card-brand-${brand.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Card
                      className="flash-reveal-scale group overflow-visible hover-elevate border-card-border h-full"
                      style={{ "--flash-index": i % 8 } as any}
                    >
                      <div className="aspect-[16/10] relative rounded-t-md overflow-hidden bg-white dark:bg-zinc-900">
                        <div className="w-full h-full flex items-center justify-center p-6">
                          <BrandLogo brand={brand} size={72} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: brandColor }} />
                      </div>
                      <div className="p-5 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{displayName}</h3>
                          <span className="text-sm text-muted-foreground">{count} {count === 1 ? "item" : "items"}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/equipment/listings?category=OTHER+EQUIPMENT">
              <Button size="lg" className="bg-accent text-accent-foreground gap-2 text-base px-8" data-testid="button-view-all-other">
                View All Other Equipment
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function BrandListings({ brand, onBack }: { brand: string; onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  const heroRef = useFlashReveal();
  const gridRef = useFlashReveal();

  useEffect(() => { setPage(1); }, [searchTerm]);

  const queryUrl = (() => {
    const p = new URLSearchParams();
    p.set("category", "OTHER EQUIPMENT");
    p.set("make", brand);
    if (searchTerm) p.set("search", searchTerm);
    p.set("page", String(page));
    p.set("limit", String(ITEMS_PER_PAGE));
    return `/api/equipment?${p.toString()}`;
  })();

  const { data, isLoading } = useQuery<{ items: Equipment[]; total: number }>({
    queryKey: ["/api/equipment", "other", brand, searchTerm, page],
    queryFn: async () => {
      const res = await fetch(queryUrl);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const equipment = data?.items;
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const displayName = BRAND_DISPLAY_NAMES[brand] || brand.charAt(0) + brand.slice(1).toLowerCase();
  const brandColor = BRAND_COLORS[brand] || "#FFCD11";

  return (
    <div className="flash-page-transition">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="breadcrumb">
            <Link href="/"><span className="cursor-pointer">Home</span></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/equipment"><span className="cursor-pointer">Equipment</span></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="cursor-pointer hover:text-foreground transition-colors" onClick={onBack}>Other Equipment</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">{displayName}</span>
          </nav>
        </div>
      </div>

      <section className="relative py-16 overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: brandColor }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center p-3 shadow-lg shrink-0">
              <BrandLogo brand={brand} size={56} />
            </div>
            <div>
              <h1 className="flash-reveal text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2 tracking-tight" data-testid="text-page-title">
                {displayName} Equipment
              </h1>
              <p className="flash-reveal text-primary-foreground/70 text-lg" style={{ "--flash-index": 1 } as any}>
                {total > 0 ? `${total} items available` : "Loading inventory..."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${displayName} equipment...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Button
              variant="outline"
              onClick={onBack}
              className="gap-2"
              data-testid="button-back-brands"
            >
              <ArrowLeft className="w-4 h-4" />
              All Brands
            </Button>
          </div>
          {data && (
            <div className="mt-4 text-sm text-muted-foreground" data-testid="text-result-count">
              Showing <span className="font-semibold text-foreground">{((page - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(page * ITEMS_PER_PAGE, total)}</span> of <span className="font-semibold text-foreground">{total.toLocaleString()}</span> results
            </div>
          )}
        </div>
      </section>

      <section className="py-8" ref={gridRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="border-card-border">
                  <Skeleton className="aspect-[4/3] rounded-t-md" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : equipment && equipment.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flash-stagger">
                {equipment.map((item, i) => (
                  <Link key={item.id} href={`/equipment/details/${item.equipmentId}`}>
                    <Card
                      className="flash-reveal-scale group overflow-visible hover-elevate cursor-pointer border-card-border h-full"
                      style={{ "--flash-index": i % 8 } as any}
                      data-testid={`card-equipment-${item.equipmentId}`}
                    >
                      <div className="aspect-[4/3] relative rounded-t-md overflow-hidden bg-muted">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={`${item.make} ${item.model}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-card">
                            <Wrench className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md text-white" style={{ backgroundColor: brandColor + "DD" }}>
                            {displayName}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-base mb-1">
                          {item.make} {item.model}
                        </h3>
                        <div className="text-xs text-muted-foreground mb-3">
                          ID: {item.equipmentId}
                        </div>
                        <div className="mt-3 pt-3 border-t flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 font-bold text-accent text-lg">
                            {item.price && item.price !== "CALL" ? (
                              <>{item.price}</>
                            ) : (
                              <span className="text-sm font-medium text-muted-foreground">Call for Price</span>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8" data-testid="pagination">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    data-testid="button-prev-page"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-3">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    data-testid="button-next-page"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No equipment found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
