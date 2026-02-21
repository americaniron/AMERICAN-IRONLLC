import { Link } from "wouter";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center">
                <span className="text-accent-foreground font-black text-lg">AI</span>
              </div>
              <div>
                <div className="font-bold text-base tracking-tight leading-none text-primary-foreground">AMERICAN IRON</div>
                <div className="text-xs text-primary-foreground/60 tracking-widest">LLC</div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Empowering global infrastructure through comprehensive parts inventory and unparalleled equipment procurement.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-accent">Equipment & Parts</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/equipment">Equipment Inventory</FooterLink>
              <FooterLink href="/parts">Parts Catalog</FooterLink>
              <FooterLink href="/quote">Request a Quote</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-accent">Services</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/services/dismantling">Equipment Dismantling</FooterLink>
              <FooterLink href="/services/inspection">Inspection & Auditing</FooterLink>
              <FooterLink href="/services/transportation">Transportation</FooterLink>
              <FooterLink href="/services/shipping">Shipping & Forwarding</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-accent">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <span>13930 N Dale Mabry Hwy, Suite 5<br />Tampa, FL 33618, USA</span>
              </li>
              <li>
                <a href="tel:+18507773797" className="flex items-center gap-2.5" data-testid="footer-phone">
                  <Phone className="w-4 h-4 shrink-0 text-accent" />
                  +1 (850) 777-3797
                </a>
              </li>
              <li>
                <a href="mailto:info@americanironus.com" className="flex items-center gap-2.5" data-testid="footer-email">
                  <Mail className="w-4 h-4 shrink-0 text-accent" />
                  info@americanironus.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/18132006088" className="flex items-center gap-2.5" data-testid="footer-whatsapp">
                  <MessageCircle className="w-4 h-4 shrink-0 text-accent" />
                  WhatsApp: +1 813 200 6088
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
          <span>&copy; {new Date().getFullYear()} American Iron LLC. All rights reserved.</span>
          <span>Tampa, Florida | Heavy Equipment & Asset Management Solutions</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href}>
        <span className="text-sm text-primary-foreground/70 cursor-pointer transition-colors">
          {children}
        </span>
      </Link>
    </li>
  );
}
