import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DOMPurify from "dompurify";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronDown as SelectChevron } from "lucide-react";
import {
  Calculator,
  MapPin,
  Mountain,
  Clock,
  Ruler,
  FileText,
  Loader2,
  ChevronRight,
  Sparkles,
  HardHat,
  ArrowRight,
  Download,
  RotateCcw,
  Zap,
  Database,
  TrendingUp,
  Shield,
  Cpu,
  Target,
  BarChart3,
  Layers,
  Mail,
  Phone,
  Building2,
  Truck,
  Wrench,
  Users,
  DollarSign,
  Fuel,
  Leaf,
  CloudRain,
  Wifi,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { useFlashReveal } from "@/hooks/useFlashReveal";
import { useToast } from "@/hooks/use-toast";
import { PromoBar } from "@/components/PromoBar";

const ESTIMATOR_VIDEOS = [
  "/images/estimator-bg-1.mp4",
  "/images/estimator-bg-2.mp4",
];

const PROJECT_TYPES = [
  "Highway / Road Construction",
  "Bridge Construction",
  "Commercial Building",
  "Residential Development",
  "Mining / Quarry Operation",
  "Pipeline / Utility Installation",
  "Demolition Project",
  "Land Clearing / Grading",
  "Dam / Reservoir Construction",
  "Airport Construction",
  "Port / Marine Construction",
  "Rail Infrastructure",
  "Solar Farm / Wind Farm",
  "Landfill / Environmental",
  "Industrial Facility",
  "Tunnel Construction",
  "Waterway / Canal",
  "Stadium / Arena",
  "Data Center",
  "EV Charging Infrastructure",
  "Warehouse / Distribution Center",
  "Other",
];

const TERRAIN_TYPES = [
  "Flat / Open Plain",
  "Hilly / Rolling Terrain",
  "Mountainous",
  "Swamp / Wetland",
  "Sandy / Desert",
  "Rocky / Hard Ground",
  "Forest / Wooded",
  "Urban / Developed",
  "Coastal / Marine",
  "Permafrost / Frozen",
  "Volcanic",
  "Flood Plain",
  "Reclaimed Land",
  "Mixed Terrain",
];

const PROJECT_SIZES = [
  "Small (Under 5 acres)",
  "Medium (5–25 acres)",
  "Large (25–100 acres)",
  "Very Large (100–500 acres)",
  "Mega Project (500+ acres)",
];

const DURATIONS = [
  "1–3 Months",
  "3–6 Months",
  "6–12 Months",
  "12–24 Months",
  "24–36 Months",
  "36+ Months",
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
      nextIndexRef.current = (nextIndexRef.current + 1) % ESTIMATOR_VIDEOS.length;
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
        data-testid="estimator-hero-video"
      >
        <source src={ESTIMATOR_VIDEOS[activeIndex]} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
    </>
  );
}

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="inline-block transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      {value}{suffix}
    </span>
  );
}

function FieldCompletionRing({ filled, total }: { filled: number; total: number }) {
  const pct = (filled / total) * 100;
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
        <circle
          cx="20" cy="20" r="18" fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-accent">{filled}/{total}</span>
      </div>
    </div>
  );
}

const GENERATION_PHASES = [
  { label: "Analyzing project parameters", icon: Target, duration: 3000 },
  { label: "Cross-referencing equipment inventory", icon: Database, duration: 4000 },
  { label: "Computing cost projections", icon: Calculator, duration: 4000 },
  { label: "Evaluating logistics & transportation", icon: Truck, duration: 3000 },
  { label: "Generating detailed report", icon: FileText, duration: 3000 },
];

function GenerationProgress() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    GENERATION_PHASES.forEach((p, idx) => {
      if (idx === 0) return;
      elapsed += GENERATION_PHASES[idx - 1].duration;
      timers.push(setTimeout(() => setPhase(idx), elapsed));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const currentPhase = GENERATION_PHASES[phase];
  const PhaseIcon = currentPhase.icon;

  return (
    <div className="flex flex-col items-center gap-6 py-16" data-testid="generation-progress">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 iron-ring" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(var(--accent) / 0.15)" strokeWidth="2" />
          <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(var(--accent))" strokeWidth="2.5" strokeDasharray="25 15" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <PhaseIcon className="w-7 h-7 text-accent animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="font-black text-foreground text-base">{currentPhase.label}</p>
        <p className="text-sm text-muted-foreground">This may take a moment...</p>
      </div>
      <div className="flex items-center gap-2 w-64">
        {GENERATION_PHASES.map((phaseItem, idx) => {
          const PhaseItemIcon = phaseItem.icon;
          return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
            <div className={`w-full h-1.5 rounded-full transition-all duration-700 ${
              idx <= phase ? "bg-accent" : "bg-muted"
            }`} />
            <PhaseItemIcon className={`w-3 h-3 transition-colors duration-500 ${
              idx <= phase ? "text-accent" : "text-muted-foreground/40"
            }`} />
          </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProjectEstimator() {
  const heroRef = useFlashReveal();
  const formRef = useFlashReveal();
  const resultRef = useFlashReveal();

  const { toast } = useToast();

  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [location, setLocation] = useState("");
  const [terrain, setTerrain] = useState("");
  const [projectSize, setProjectSize] = useState("");
  const [duration, setDuration] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [estimateResult, setEstimateResult] = useState("");
  const [showResult, setShowResult] = useState(false);

  const resultContainerRef = useRef<HTMLDivElement>(null);

  const filledFields = [projectName, projectType, location, terrain, projectSize, duration, email, phone, businessName].filter(Boolean).length;

  useEffect(() => {
    if (showResult && resultContainerRef.current) {
      resultContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName || !projectType || !location || !terrain || !projectSize || !duration || !email || !phone || !businessName) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields before generating an estimate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setEstimateResult("");
    setShowResult(true);

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          projectType,
          location,
          terrain,
          projectSize,
          duration,
          email,
          phone,
          businessName,
          additionalDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate estimate");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.content) {
              setEstimateResult((prev) => prev + event.content);
            }
            if (event.done) {
              setIsGenerating(false);
            }
            if (event.error) {
              throw new Error(event.error);
            }
          } catch (e) {
            if (!(e instanceof SyntaxError)) throw e;
          }
        }
      }
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Failed to generate estimate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setProjectName("");
    setProjectType("");
    setLocation("");
    setTerrain("");
    setProjectSize("");
    setDuration("");
    setEmail("");
    setPhone("");
    setBusinessName("");
    setAdditionalDetails("");
    setEstimateResult("");
    setShowResult(false);
  };

  const getSectionIcon = (title: string): LucideIcon => {
    const lower = title.toLowerCase();
    if (lower.includes("equipment") && (lower.includes("primary") || lower.includes("fleet"))) return HardHat;
    if (lower.includes("support") || lower.includes("auxiliary")) return Wrench;
    if (lower.includes("transport") || lower.includes("logistics") || lower.includes("mobilization")) return Truck;
    if (lower.includes("maintenance") || lower.includes("parts") || lower.includes("replacement")) return Wrench;
    if (lower.includes("personnel") || lower.includes("labor") || lower.includes("crew") || lower.includes("staff")) return Users;
    if (lower.includes("cost") || lower.includes("budget") || lower.includes("pricing") || lower.includes("financial") || lower.includes("summary")) return DollarSign;
    if (lower.includes("fuel") || lower.includes("energy")) return Fuel;
    if (lower.includes("environment") || lower.includes("compliance") || lower.includes("permit")) return Leaf;
    if (lower.includes("safety") || lower.includes("ppe")) return Shield;
    if (lower.includes("weather") || lower.includes("seasonal") || lower.includes("climate")) return CloudRain;
    if (lower.includes("technology") || lower.includes("automation") || lower.includes("gps") || lower.includes("telematics")) return Wifi;
    if (lower.includes("timeline") || lower.includes("phase") || lower.includes("schedule")) return Calendar;
    if (lower.includes("risk") || lower.includes("contingenc")) return AlertTriangle;
    if (lower.includes("roi") || lower.includes("rental") || lower.includes("purchase")) return TrendingUp;
    if (lower.includes("recommendation") || lower.includes("conclusion")) return CheckCircle2;
    if (lower.includes("overview") || lower.includes("project")) return Target;
    return BarChart3;
  };

  const isCostSummarySection = (title: string): boolean => {
    const lower = title.toLowerCase();
    return (lower.includes("cost") || lower.includes("budget") || lower.includes("pricing")) && (lower.includes("summary") || lower.includes("total") || lower.includes("breakdown") || lower.includes("overview"));
  };

  const renderCostSummaryCards = (lines: string[], startIdx: number): { elements: JSX.Element[]; endIdx: number } => {
    const cards: { label: string; value: string }[] = [];
    let idx = startIdx;
    while (idx < lines.length) {
      const line = lines[idx];
      if (line.startsWith("# ") || line.startsWith("## ")) break;
      if (line.startsWith("|") && !line.includes("---")) {
        const cells = line.split("|").filter(Boolean).map((c) => c.trim());
        if (cells.length >= 2 && /\$/.test(cells[cells.length - 1])) {
          cards.push({ label: cells[0], value: cells[cells.length - 1] });
        }
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const match = line.match(/^[-*]\s+\*?\*?(.+?)\*?\*?\s*[:–-]\s*(.+)/);
        if (match && /\$/.test(match[2])) {
          cards.push({ label: match[1].replace(/\*/g, ""), value: match[2].replace(/\*/g, "") });
        }
      }
      idx++;
    }

    if (cards.length === 0) return { elements: [], endIdx: startIdx };

    const totalCard = cards.find(c => c.label.toLowerCase().includes("total") || c.label.toLowerCase().includes("grand"));
    const otherCards = cards.filter(c => c !== totalCard);

    const elements: JSX.Element[] = [];
    elements.push(
      <div key={`cost-cards-${startIdx}`} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          {otherCards.map((card, ci) => (
            <div
              key={ci}
              className="rounded-lg border border-border/50 bg-muted/30 p-4 flex flex-col gap-1"
              data-testid={`card-cost-item-${ci}`}
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.label}</span>
              <span className="text-lg font-black text-foreground">{card.value}</span>
            </div>
          ))}
        </div>
        {totalCard && (
          <div className="rounded-lg border-2 border-accent/40 bg-accent/5 p-5 flex items-center justify-between gap-4 my-3" data-testid="card-cost-total">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <span className="text-base font-black uppercase">{totalCard.label}</span>
            </div>
            <span className="text-2xl font-black text-accent">{totalCard.value}</span>
          </div>
        )}
      </div>
    );

    return { elements, endIdx: idx };
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let sectionIndex = 0;
    let tableRows: { cells: string[]; isHeader: boolean }[] = [];
    let tableStartKey = 0;

    const flushTable = () => {
      if (tableRows.length === 0) return;
      const rows = [...tableRows];
      const key = tableStartKey;
      const colCount = rows[0]?.cells.length || 1;
      elements.push(
        <div key={`table-${key}`} className="my-4 rounded-lg border border-border/50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500" data-testid={`table-section-${key}`}>
          {rows.map((row, ri) => (
            <div
              key={ri}
              className={`grid gap-0 ${
                row.isHeader
                  ? "bg-accent/15 font-semibold text-foreground"
                  : ri % 2 === 0
                  ? "bg-muted/20"
                  : "bg-transparent"
              } ${!row.isHeader && ri < rows.length - 1 ? "border-b border-border/20" : ""}`}
              style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
            >
              {row.cells.map((cell, ci) => (
                <div
                  key={ci}
                  className={`px-3 py-2 text-sm ${row.isHeader ? "py-2.5" : ""} ${ci > 0 ? "border-l border-border/20" : ""}`}
                  dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }}
                />
              ))}
            </div>
          ))}
        </div>
      );
      tableRows = [];
    };

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith("# ")) {
        flushTable();
        sectionIndex++;
        const title = line.slice(2);
        const Icon = getSectionIcon(title);
        elements.push(
          <div key={i} className="animate-in fade-in slide-in-from-bottom-3 duration-500" style={{ animationDelay: `${sectionIndex * 50}ms` }}>
            <div className="flex items-center gap-3 mt-8 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">{title}</h1>
            </div>
            <div className="h-0.5 bg-gradient-to-r from-accent/60 via-accent/20 to-transparent rounded-full mb-3" />
          </div>
        );
        i++;
        continue;
      }

      if (line.startsWith("## ")) {
        flushTable();
        sectionIndex++;
        const title = line.slice(3);
        const Icon = getSectionIcon(title);

        if (isCostSummarySection(title)) {
          elements.push(
            <div key={i} className="animate-in fade-in slide-in-from-bottom-3 duration-500" style={{ animationDelay: `${sectionIndex * 50}ms` }}>
              <div className="flex items-center gap-3 mt-6 mb-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-accent" />
                </div>
                <h2 className="text-xl font-black text-foreground">{title}</h2>
              </div>
              <div className="h-px bg-gradient-to-r from-accent/40 via-accent/15 to-transparent mb-2" />
            </div>
          );
          i++;
          const { elements: costElements, endIdx } = renderCostSummaryCards(lines, i);
          if (costElements.length > 0) {
            elements.push(...costElements);
            i = endIdx;
          }
          continue;
        }

        elements.push(
          <div key={i} className="animate-in fade-in slide-in-from-bottom-3 duration-500" style={{ animationDelay: `${sectionIndex * 50}ms` }}>
            <div className="flex items-center gap-3 mt-6 mb-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-accent" />
              </div>
              <h2 className="text-xl font-black text-foreground">{title}</h2>
            </div>
            <div className="h-px bg-gradient-to-r from-accent/40 via-accent/15 to-transparent mb-2" />
          </div>
        );
        i++;
        continue;
      }

      if (line.startsWith("### ")) {
        flushTable();
        elements.push(
          <h3 key={i} className="text-lg font-semibold mt-4 mb-1 text-accent animate-in fade-in duration-300">
            {line.slice(4)}
          </h3>
        );
        i++;
        continue;
      }

      if (line.startsWith("---")) {
        flushTable();
        elements.push(
          <div key={i} className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <Sparkles className="w-3.5 h-3.5 text-accent/40" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          </div>
        );
        i++;
        continue;
      }

      if (line.startsWith("- ") || line.startsWith("* ")) {
        flushTable();
        const content = line.slice(2);
        elements.push(
          <div key={i} className="flex gap-2 ml-4 my-0.5 animate-in fade-in duration-300">
            <span className="text-accent mt-1.5 shrink-0">•</span>
            <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
          </div>
        );
        i++;
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        flushTable();
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          elements.push(
            <div key={i} className="flex gap-2 ml-4 my-0.5 animate-in fade-in duration-300">
              <span className="text-accent font-semibold shrink-0">{match[1]}.</span>
              <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(match[2]) }} />
            </div>
          );
        }
        i++;
        continue;
      }

      if (line.startsWith("|")) {
        if (line.includes("---")) {
          i++;
          continue;
        }
        if (tableRows.length === 0) tableStartKey = i;
        const cells = line.split("|").filter(Boolean).map((c) => c.trim());
        const isHeader = i + 1 < lines.length && lines[i + 1]?.includes("---");
        tableRows.push({ cells, isHeader });
        i++;
        continue;
      }

      flushTable();

      if (line.trim() === "") {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p key={i} className="text-muted-foreground leading-relaxed animate-in fade-in duration-300" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        );
      }
      i++;
    }

    flushTable();
    return elements;
  };

  const sanitize = (html: string) => DOMPurify.sanitize(html, { ALLOWED_TAGS: ["strong", "em", "code"], ALLOWED_ATTR: ["class"] });

  const formatInlineMarkdown = (text: string) => {
    const formatted = text
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="text-foreground italic">$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-accent/10 px-1 rounded text-accent text-sm">$1</code>');
    return sanitize(formatted);
  };

  return (
    <div className="flash-page-transition">
      {/* Hero with Video Background */}
      <section className="relative py-28 lg:py-36 overflow-hidden bg-black" ref={heroRef}>
        <RotatingVideoBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="flash-reveal inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase" data-testid="text-estimator-badge">AMERICAN IRON AI POWERED TOOL</span>
            </div>
            <h1 className="flash-reveal text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 tracking-tight leading-tight" style={{ "--flash-index": 1 } as any} data-testid="text-estimator-title">
              IRON <span className="text-accent-3d">Estimator</span>
            </h1>
            <p className="flash-reveal text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl" style={{ "--flash-index": 2 } as any} data-testid="text-estimator-description">
              Get an institutional-grade equipment estimate for your construction project. Our AI analyzes your project requirements against our inventory of 2,100+ equipment items and 12,200+ parts to deliver comprehensive cost projections.
            </p>

            {/* Hero Stats Row */}
            <div className="flash-reveal grid grid-cols-3 gap-3 sm:gap-4 max-w-lg" style={{ "--flash-index": 3 } as any}>
              <div className="text-center p-2 sm:p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-accent">
                  <AnimatedCounter value="2,100" suffix="+" />
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 uppercase tracking-wider">Equipment</div>
              </div>
              <div className="text-center p-2 sm:p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-accent">
                  <AnimatedCounter value="12,200" suffix="+" />
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 uppercase tracking-wider">Parts</div>
              </div>
              <div className="text-center p-2 sm:p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-accent">
                  <AnimatedCounter value="AI" />
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 uppercase tracking-wider">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Control Panel Section */}
      <section className="py-16 bg-background" ref={formRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* System Status Bar */}
          <div className="flash-reveal mb-8 iron-panel rounded-xl p-4">
            <div className="iron-scan" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-50" />
                </div>
                <span className="text-sm font-semibold text-foreground">IRON ESTIMATOR — SYSTEM ONLINE</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-accent" />
                  <span>Inventory Synced</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-accent" />
                  <span>AI Model Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  <span>Enterprise Grade</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Control Panel */}
            <div className="lg:col-span-2">
              <div className="iron-panel iron-panel-glow rounded-2xl p-4 sm:p-8" data-testid="form-estimator">
                <div className="iron-scan" />

                {/* Panel Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center">
                        <Target className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                        <Zap className="w-2.5 h-2.5 text-black" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight">CONTROL PANEL</h2>
                      <p className="text-sm text-muted-foreground">Configure project parameters for AI analysis</p>
                    </div>
                  </div>
                  <FieldCompletionRing filled={filledFields} total={9} />
                </div>

                {/* Readiness Gauge */}
                <div className="mb-8 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estimation Readiness</span>
                    <span className="text-xs font-bold text-accent">{Math.round((filledFields / 9) * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent/70 to-accent transition-all duration-700 ease-out"
                      style={{ width: `${(filledFields / 9) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    {["Name", "Type", "Location", "Terrain", "Size", "Duration", "Email", "Phone", "Business"].map((label, idx) => (
                      <div key={label} className="flex flex-col items-center gap-1">
                        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          [projectName, projectType, location, terrain, projectSize, duration, email, phone, businessName][idx]
                            ? "bg-accent"
                            : "bg-muted-foreground/30"
                        }`} />
                        <span className="text-[10px] text-muted-foreground hidden sm:block">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Name */}
                    <div className="iron-input-group space-y-2">
                      <Label htmlFor="projectName" className="flex items-center gap-2 text-sm font-semibold">
                        <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                          <FileText className="w-3.5 h-3.5 text-accent" />
                        </div>
                        Project Name *
                      </Label>
                      <Input
                        id="projectName"
                        placeholder="e.g. I-75 Highway Expansion Phase 2"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="bg-muted/30"
                        data-testid="input-project-name"
                      />
                      <div className="iron-input-indicator" />
                    </div>

                    {/* Project Type */}
                    <div className="iron-input-group space-y-2">
                      <Label htmlFor="projectType" className="flex items-center gap-2 text-sm font-semibold">
                        <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                          <HardHat className="w-3.5 h-3.5 text-accent" />
                        </div>
                        Project Type *
                      </Label>
                      <div className="relative">
                        <select
                          id="projectType"
                          value={projectType}
                          onChange={(e) => setProjectType(e.target.value)}
                          className="flex h-9 w-full appearance-none items-center rounded-md border border-input bg-muted/30 px-3 py-2 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                          data-testid="select-project-type"
                        >
                          <option value="" disabled>Select project type</option>
                          {PROJECT_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <SelectChevron className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                      </div>
                      <div className="iron-input-indicator" />
                    </div>

                    {/* Location */}
                    <div className="iron-input-group space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2 text-sm font-semibold">
                        <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                          <MapPin className="w-3.5 h-3.5 text-accent" />
                        </div>
                        Project Location *
                      </Label>
                      <Input
                        id="location"
                        placeholder="e.g. Tampa, FL or Houston, TX"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-muted/30"
                        data-testid="input-location"
                      />
                      <div className="iron-input-indicator" />
                    </div>

                    {/* Terrain */}
                    <div className="iron-input-group space-y-2">
                      <Label htmlFor="terrain" className="flex items-center gap-2 text-sm font-semibold">
                        <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                          <Mountain className="w-3.5 h-3.5 text-accent" />
                        </div>
                        Terrain Type *
                      </Label>
                      <div className="relative">
                        <select
                          id="terrain"
                          value={terrain}
                          onChange={(e) => setTerrain(e.target.value)}
                          className="flex h-9 w-full appearance-none items-center rounded-md border border-input bg-muted/30 px-3 py-2 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                          data-testid="select-terrain"
                        >
                          <option value="" disabled>Select terrain type</option>
                          {TERRAIN_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <SelectChevron className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                      </div>
                      <div className="iron-input-indicator" />
                    </div>

                    {/* Project Size */}
                    <div className="iron-input-group space-y-2">
                      <Label htmlFor="projectSize" className="flex items-center gap-2 text-sm font-semibold">
                        <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                          <Ruler className="w-3.5 h-3.5 text-accent" />
                        </div>
                        Project Size *
                      </Label>
                      <div className="relative">
                        <select
                          id="projectSize"
                          value={projectSize}
                          onChange={(e) => setProjectSize(e.target.value)}
                          className="flex h-9 w-full appearance-none items-center rounded-md border border-input bg-muted/30 px-3 py-2 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                          data-testid="select-project-size"
                        >
                          <option value="" disabled>Select project size</option>
                          {PROJECT_SIZES.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                        <SelectChevron className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                      </div>
                      <div className="iron-input-indicator" />
                    </div>

                    {/* Duration */}
                    <div className="iron-input-group space-y-2">
                      <Label htmlFor="duration" className="flex items-center gap-2 text-sm font-semibold">
                        <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                        </div>
                        Estimated Duration *
                      </Label>
                      <div className="relative">
                        <select
                          id="duration"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="flex h-9 w-full appearance-none items-center rounded-md border border-input bg-muted/30 px-3 py-2 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                          data-testid="select-duration"
                        >
                          <option value="" disabled>Select duration</option>
                          {DURATIONS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <SelectChevron className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                      </div>
                      <div className="iron-input-indicator" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Email */}
                    <div className="iron-input-group space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold">
                        <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                          <Mail className="w-3.5 h-3.5 text-accent" />
                        </div>
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g. john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-muted/30"
                        data-testid="input-email"
                      />
                      <div className="iron-input-indicator" />
                    </div>

                    {/* Phone */}
                    <div className="iron-input-group space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold">
                        <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                          <Phone className="w-3.5 h-3.5 text-accent" />
                        </div>
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g. (850) 777-3797"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-muted/30"
                        data-testid="input-phone"
                      />
                      <div className="iron-input-indicator" />
                    </div>

                    {/* Business Name */}
                    <div className="iron-input-group space-y-2">
                      <Label htmlFor="businessName" className="flex items-center gap-2 text-sm font-semibold">
                        <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5 text-accent" />
                        </div>
                        Business Name *
                      </Label>
                      <Input
                        id="businessName"
                        placeholder="e.g. ABC Construction Inc."
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="bg-muted/30"
                        data-testid="input-business-name"
                      />
                      <div className="iron-input-indicator" />
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="iron-input-group space-y-2">
                    <Label htmlFor="additionalDetails" className="flex items-center gap-2 text-sm font-semibold">
                      <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                        <Layers className="w-3.5 h-3.5 text-accent" />
                      </div>
                      Additional Project Details (Optional)
                    </Label>
                    <Textarea
                      id="additionalDetails"
                      placeholder="Describe any special requirements, environmental considerations, specific equipment preferences, access constraints, or other relevant project information..."
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      rows={4}
                      className="bg-muted/30 resize-none"
                      data-testid="textarea-additional-details"
                    />
                    <div className="iron-input-indicator" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={isGenerating}
                      size="lg"
                      className="bg-accent text-accent-foreground font-black px-10 gap-2 shadow-lg shadow-accent/20"
                      data-testid="button-generate-estimate"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          GENERATING ESTIMATE...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          GENERATE ESTIMATE
                        </>
                      )}
                    </Button>
                    {showResult && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        size="lg"
                        className="px-6 font-semibold"
                        data-testid="button-reset-estimate"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        New Estimate
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Engine Card */}
              <div className="iron-panel rounded-xl p-6" style={{ "--flash-index": 1 } as any}>
                <div className="iron-scan" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-10 h-10">
                    <svg className="w-10 h-10 iron-ring" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="17" fill="none" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1.5" />
                      <circle cx="20" cy="20" r="17" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeDasharray="12 8" />
                    </svg>
                    <Cpu className="absolute inset-0 m-auto w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm">AI ENGINE</h3>
                    <p className="text-[11px] text-accent">GPT-5.2 Active</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-[10px] font-black text-accent">1</div>
                    <p>Enter your project parameters including type, location, terrain, and scale</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-[10px] font-black text-accent">2</div>
                    <p>AI cross-references your needs against 2,100+ equipment items</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-[10px] font-black text-accent">3</div>
                    <p>Receive comprehensive estimate with equipment, parts, logistics, and costs</p>
                  </div>
                </div>
              </div>

              {/* Capabilities Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="iron-stat-card text-center">
                  <BarChart3 className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-xs font-bold">Cost Analysis</div>
                  <div className="text-[10px] text-muted-foreground">Low/Mid/High</div>
                </div>
                <div className="iron-stat-card text-center">
                  <TrendingUp className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-xs font-bold">ROI Projections</div>
                  <div className="text-[10px] text-muted-foreground">Buy vs Rent</div>
                </div>
                <div className="iron-stat-card text-center">
                  <Layers className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-xs font-bold">Fleet Planning</div>
                  <div className="text-[10px] text-muted-foreground">Full Breakdown</div>
                </div>
                <div className="iron-stat-card text-center">
                  <Calculator className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-xs font-bold">Parts Budget</div>
                  <div className="text-[10px] text-muted-foreground">Maintenance</div>
                </div>
              </div>

              {/* Estimate Includes */}
              <div className="iron-panel rounded-xl p-6" style={{ "--flash-index": 2 } as any}>
                <h3 className="font-black text-sm mb-3 uppercase tracking-wider">Estimate Includes</h3>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "Primary equipment with models & quantities",
                    "Supporting equipment & power generation",
                    "Transportation & logistics costs",
                    "Maintenance & replacement parts budget",
                    "Personnel requirements",
                    "Environmental & compliance analysis",
                    "Safety equipment & PPE requirements",
                    "Fuel & energy consumption projections",
                    "Weather & seasonal risk assessment",
                    "Rental vs. purchase ROI analysis",
                    "Technology & automation recommendations",
                    "Project phasing & mobilization timeline",
                    "Complete cost summary (low/mid/high)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Card */}
              <div className="iron-panel rounded-xl p-6 border-accent/30 bg-accent/5" style={{ "--flash-index": 3 } as any}>
                <h3 className="font-black text-sm mb-2 text-accent uppercase">Need a Formal Quote?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This AI estimate provides budget guidance. For exact pricing and availability, request a formal quote from our team.
                </p>
                <Link href="/quote">
                  <Button variant="outline" size="sm" className="border-accent/30 hover:bg-accent/10 font-semibold" data-testid="link-request-quote">
                    Request Quote <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Result Section */}
      {showResult && (
        <section className="py-16 bg-muted/30 border-t border-border" ref={resultRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6" ref={resultContainerRef}>
            <Card className="iron-panel rounded-2xl p-4 sm:p-8" data-testid="card-estimate-result">
              <div className="iron-scan" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-black truncate">IRON ESTIMATE REPORT</h2>
                    <p className="text-sm text-muted-foreground truncate">{projectName} — {projectType}</p>
                  </div>
                </div>
                {!isGenerating && estimateResult && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([estimateResult], { type: "text/markdown" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${projectName.replace(/\s+/g, "_")}_IRON_Estimate.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="font-semibold shrink-0"
                    data-testid="button-download-estimate"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Download
                  </Button>
                )}
              </div>

              <div className="prose prose-sm max-w-none">
                {isGenerating && !estimateResult && (
                  <GenerationProgress />
                )}

                {estimateResult && (
                  <div className="space-y-1" data-testid="text-estimate-content">
                    {renderMarkdown(estimateResult)}
                  </div>
                )}

                {isGenerating && estimateResult && (
                  <div className="flex items-center gap-2 mt-4 text-accent text-sm font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </div>
                )}
              </div>

              {!isGenerating && estimateResult && (
                <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-4">
                  <Link href="/quote">
                    <Button size="lg" className="bg-accent text-accent-foreground font-black px-8 shadow-lg shadow-accent/20" data-testid="button-request-formal-quote">
                      Request Formal Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/equipment">
                    <Button variant="outline" size="lg" className="font-semibold" data-testid="button-browse-equipment">
                      Browse Equipment <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/parts">
                    <Button variant="outline" size="lg" className="font-semibold" data-testid="button-browse-parts">
                      Browse Parts Catalog <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {!isGenerating && estimateResult && (
            <PromoBar variants={["equipment", "parts", "mechanic-hub"]} className="mt-8" />
          )}
        </section>
      )}
    </div>
  );
}
