import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import logoImg from "@assets/american-iron-logo_1771736779986.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const services = [
  { name: "Equipment Dismantling", href: "/services/dismantling" },
  { name: "Inspection & Auditing", href: "/services/inspection" },
  { name: "Transportation", href: "/services/transportation" },
  { name: "Shipping & Forwarding", href: "/services/shipping" },
  { name: "IRON Estimator", href: "/services/estimator" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      <div className="flash-navbar bg-primary text-primary-foreground text-sm hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-4">
          <span className="text-primary-foreground/80">
            Heavy Equipment & Asset Management Solutions
          </span>
          <div className="flex items-center gap-6">
            <a
              href="tel:+18507773797"
              className="flex items-center gap-1.5 text-primary-foreground/90 transition-colors hover:text-accent"
              data-testid="link-phone"
            >
              <Phone className="w-3.5 h-3.5" />
              +1 (850) 777-3797
            </a>
            <a
              href="mailto:info@americanironus.com"
              className="flex items-center gap-1.5 text-primary-foreground/90 transition-colors hover:text-accent"
              data-testid="link-email"
            >
              <Mail className="w-3.5 h-3.5" />
              info@americanironus.com
            </a>
          </div>
        </div>
      </div>

      <header className="flash-navbar sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b" style={{ animationDelay: "0.1s" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src={logoImg}
                  alt="American Iron LLC"
                  className="h-12 w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
                  data-testid="img-logo"
                />
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
              <NavLink href="/" active={location === "/"}>Home</NavLink>
              <NavLink href="/equipment" active={location.startsWith("/equipment")}>Equipment</NavLink>
              <NavLink href="/parts" active={location === "/parts"}>Parts</NavLink>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                      location.startsWith("/services")
                        ? "text-accent"
                        : "text-foreground/70"
                    }`}
                    data-testid="button-services-menu"
                  >
                    Services
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {services.map((s) => (
                    <DropdownMenuItem key={s.href} asChild>
                      <Link href={s.href} data-testid={`link-${s.href.split("/").pop()}`}>
                        {s.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <NavLink href="/contact" active={location === "/contact"}>Contact</NavLink>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/quote">
                <Button size="sm" className="hidden sm:flex bg-accent text-accent-foreground flash-glow-pulse" data-testid="button-get-quote">
                  Request Quote
                </Button>
              </Link>
              <button
                className="lg:hidden p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t bg-background">
            <div className="px-4 py-3 space-y-1">
              <MobileLink href="/" onClick={() => setMobileOpen(false)}>Home</MobileLink>
              <MobileLink href="/equipment" onClick={() => setMobileOpen(false)}>Equipment Inventory</MobileLink>
              <MobileLink href="/parts" onClick={() => setMobileOpen(false)}>Parts Catalog</MobileLink>
              <div className="py-1 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Services</div>
              {services.map((s) => (
                <MobileLink key={s.href} href={s.href} onClick={() => setMobileOpen(false)}>
                  {s.name}
                </MobileLink>
              ))}
              <MobileLink href="/quote" onClick={() => setMobileOpen(false)}>Request Quote</MobileLink>
              <MobileLink href="/contact" onClick={() => setMobileOpen(false)}>Contact Us</MobileLink>
              <div className="pt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="tel:+18507773797" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +1 (850) 777-3797
                </a>
                <a href="mailto:info@americanironus.com" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> info@americanironus.com
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <span
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer hover:text-accent ${
          active ? "text-accent" : "text-foreground/70"
        }`}
      >
        {children}
      </span>
    </Link>
  );
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick}>
      <span className="block px-3 py-2.5 text-sm font-medium rounded-md cursor-pointer transition-colors hover:bg-muted">
        {children}
      </span>
    </Link>
  );
}
