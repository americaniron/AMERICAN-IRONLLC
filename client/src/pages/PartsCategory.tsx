import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useSearch } from "wouter";
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
  ChevronLeft,
  ShoppingCart,
  Plus,
  Check,
  X,
  Package,
  Filter,
} from "lucide-react";
import type { Part } from "@shared/schema";
import { useFlashReveal } from "@/hooks/useFlashReveal";
import { useQuoteCart } from "@/hooks/useQuoteCart";

interface PartsResponse {
  items: Part[];
  total: number;
}

export default function PartsCategory() {
  const { category: rawCategory } = useParams<{ category: string }>();
  const category = rawCategory ? decodeURIComponent(rawCategory) : "all";
  const searchParams = useSearch();
  const initialSearch = new URLSearchParams(searchParams).get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const limit = 50;

  const { items: cartItems, addItem, removeItem, isInCart } = useQuoteCart();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
    setSelectedSubcategory(null);
  }, [category]);

  const queryUrl = useMemo(() => {
    const p = new URLSearchParams();
    if (category && category !== "all") p.set("category", category);
    if (selectedSubcategory) p.set("subcategory", selectedSubcategory);
    if (debouncedSearch) p.set("search", debouncedSearch);
    p.set("page", String(page));
    p.set("limit", String(limit));
    return `/api/parts?${p.toString()}`;
  }, [category, selectedSubcategory, debouncedSearch, page, limit]);

  const { data, isLoading } = useQuery<PartsResponse>({
    queryKey: ["/api/parts", category, selectedSubcategory, debouncedSearch, page],
    queryFn: async () => {
      const res = await fetch(queryUrl);
      if (!res.ok) throw new Error("Failed to fetch parts");
      return res.json();
    },
  });

  const { data: subcategoryCounts } = useQuery<Record<string, number>>({
    queryKey: ["/api/parts/subcategories/counts", category],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (category && category !== "all") p.set("category", category);
      const res = await fetch(`/api/parts/subcategories/counts?${p.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch subcategory counts");
      return res.json();
    },
  });

  const sortedSubcategories = useMemo(() => {
    if (!subcategoryCounts) return [];
    return Object.entries(subcategoryCounts)
      .sort((a, b) => b[1] - a[1])
      .filter(([name]) => name !== "Other" && name.length > 1);
  }, [subcategoryCounts]);

  const parts = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const label = category === "all" ? "All Parts" : category;

  const heroRef = useFlashReveal();
  const tableRef = useFlashReveal();

  return (
    <div className="flash-page-transition">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="breadcrumb-parts">
            <Link href="/">
              <span className="cursor-pointer hover:text-foreground transition-colors">Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/parts">
              <span className="cursor-pointer hover:text-foreground transition-colors">Parts</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">{label}</span>
          </nav>
        </div>
      </div>

      <section className="py-8 border-b bg-gradient-to-b from-card to-background" ref={heroRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Link href="/parts">
                  <Button variant="ghost" size="sm" className="gap-1 -ml-2 text-muted-foreground hover:text-foreground" data-testid="button-back-to-catalog">
                    <ArrowLeft className="w-4 h-4" />
                    Catalog
                  </Button>
                </Link>
              </div>
              <h1 className="flash-reveal text-2xl sm:text-3xl font-bold tracking-tight" data-testid="text-parts-category-title">
                {label}
              </h1>
              <p className="flash-reveal text-sm text-muted-foreground mt-1" style={{ "--flash-index": 1 } as any}>
                <span className="font-semibold text-foreground" data-testid="text-parts-count">{total.toLocaleString()}</span> parts found
                {selectedSubcategory && (
                  <span> in <Badge variant="secondary" className="text-xs ml-1 no-default-active-elevate">{selectedSubcategory}</Badge></span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <Link href="/quote">
                  <Button className="bg-accent text-accent-foreground gap-2" data-testid="button-view-quote">
                    <ShoppingCart className="w-4 h-4" />
                    Quote ({cartItems.length})
                  </Button>
                </Link>
              )}
              <Link href="/quote">
                <Button variant="outline" className="gap-2" data-testid="button-quote-from-parts">
                  Request Quote
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by part number, description, or equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-parts"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden gap-2"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              data-testid="button-toggle-filters"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      <section className="py-6" ref={tableRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-6">
            {sortedSubcategories.length > 0 && (
              <aside className={`${showMobileSidebar ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : "hidden"} lg:block lg:static lg:w-64 lg:shrink-0`}>
                {showMobileSidebar && (
                  <div className="flex items-center justify-between mb-4 lg:hidden">
                    <h3 className="font-semibold text-lg">Subcategories</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowMobileSidebar(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                )}
                <div className="hidden lg:block">
                  <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Subcategories</h3>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => { setSelectedSubcategory(null); setPage(1); setShowMobileSidebar(false); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      !selectedSubcategory ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    data-testid="button-subcategory-all"
                  >
                    All
                  </button>
                  {sortedSubcategories.map(([name, count]) => (
                    <button
                      key={name}
                      onClick={() => { setSelectedSubcategory(name); setPage(1); setShowMobileSidebar(false); }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                        selectedSubcategory === name ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      data-testid={`button-subcategory-${name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <span className="truncate mr-2">{name}</span>
                      <span className="text-xs opacity-60 shrink-0">{count}</span>
                    </button>
                  ))}
                </div>
              </aside>
            )}

            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-md" />
                  ))}
                </div>
              ) : parts.length > 0 ? (
                <>
                  <div className="flash-reveal-scale overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm" data-testid="table-parts">
                      <thead>
                        <tr className="border-b bg-muted/50 text-left">
                          <th className="py-3 px-4 font-semibold text-muted-foreground w-10"></th>
                          <th className="py-3 px-4 font-semibold text-muted-foreground">Part No.</th>
                          <th className="py-3 px-4 font-semibold text-muted-foreground">Description</th>
                          {category === "all" && (
                            <th className="py-3 px-4 font-semibold text-muted-foreground hidden md:table-cell">Category</th>
                          )}
                          <th className="py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">Subcategory</th>
                          <th className="py-3 px-4 font-semibold text-muted-foreground hidden lg:table-cell">Equipment</th>
                          <th className="py-3 px-4 font-semibold text-muted-foreground">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parts.map((part) => {
                          const inCart = isInCart(part.partNumber);
                          return (
                            <tr
                              key={part.id}
                              className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                              data-testid={`row-part-${part.id}`}
                            >
                              <td className="py-2.5 px-4">
                                <button
                                  onClick={() => inCart ? removeItem(part.partNumber) : addItem(part)}
                                  className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                                    inCart
                                      ? "bg-accent text-black hover:bg-red-500 hover:text-white"
                                      : "border border-border hover:border-accent hover:text-accent"
                                  }`}
                                  title={inCart ? "Remove from quote" : "Add to quote"}
                                  data-testid={`button-quote-${part.partNumber}`}
                                >
                                  {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                </button>
                              </td>
                              <td className="py-2.5 px-4 font-mono font-medium text-accent whitespace-nowrap">{part.partNumber}</td>
                              <td className="py-2.5 px-4 max-w-xs truncate">{part.description}</td>
                              {category === "all" && (
                                <td className="py-2.5 px-4 hidden md:table-cell">
                                  <Badge variant="secondary" className="text-xs no-default-active-elevate whitespace-nowrap">
                                    {part.category}
                                  </Badge>
                                </td>
                              )}
                              <td className="py-2.5 px-4 hidden sm:table-cell text-muted-foreground text-xs">
                                {part.subcategory || "\u2014"}
                              </td>
                              <td className="py-2.5 px-4 hidden lg:table-cell text-muted-foreground text-xs max-w-[200px] truncate">
                                {part.equipment || "\u2014"}
                              </td>
                              <td className="py-2.5 px-4 font-medium text-accent whitespace-nowrap">
                                {part.price || "Call"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 gap-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page <= 1}
                          data-testid="button-prev-page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Prev
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 7) {
                              pageNum = i + 1;
                            } else if (page <= 4) {
                              pageNum = i + 1;
                            } else if (page >= totalPages - 3) {
                              pageNum = totalPages - 6 + i;
                            } else {
                              pageNum = page - 3 + i;
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={pageNum === page ? "default" : "ghost"}
                                size="sm"
                                className={`w-8 h-8 p-0 ${pageNum === page ? "bg-accent text-accent-foreground" : ""}`}
                                onClick={() => setPage(pageNum)}
                                data-testid={`button-page-${pageNum}`}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page >= totalPages}
                          data-testid="button-next-page"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No parts found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
                  <div className="flex gap-3 justify-center">
                    {selectedSubcategory && (
                      <Button variant="outline" className="gap-2" onClick={() => setSelectedSubcategory(null)} data-testid="button-clear-subcategory">
                        Clear Subcategory
                      </Button>
                    )}
                    <Link href="/parts">
                      <Button variant="outline" className="gap-2" data-testid="button-back-to-catalog">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Catalog
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {cartItems.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40">
          <Link href="/quote">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground gap-2 shadow-lg rounded-full px-6"
              data-testid="button-floating-quote"
            >
              <ShoppingCart className="w-5 h-5" />
              Quote ({cartItems.length} items)
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
