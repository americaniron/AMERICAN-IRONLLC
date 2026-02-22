import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DOMPurify from "dompurify";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { useFlashReveal } from "@/hooks/useFlashReveal";
import { useToast } from "@/hooks/use-toast";

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
  const [additionalDetails, setAdditionalDetails] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [estimateResult, setEstimateResult] = useState("");
  const [showResult, setShowResult] = useState(false);

  const resultContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showResult && resultContainerRef.current) {
      resultContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName || !projectType || !location || !terrain || !projectSize || !duration) {
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
    setAdditionalDetails("");
    setEstimateResult("");
    setShowResult(false);
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];

    lines.forEach((line, i) => {
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="text-2xl font-bold text-accent mt-6 mb-3">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-xl font-bold mt-5 mb-2 text-foreground border-b border-accent/30 pb-1">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-lg font-semibold mt-4 mb-1 text-accent">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("---")) {
        elements.push(<hr key={i} className="border-border my-4" />);
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        const content = line.slice(2);
        elements.push(
          <div key={i} className="flex gap-2 ml-4 my-0.5">
            <span className="text-accent mt-1.5 shrink-0">•</span>
            <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
          </div>
        );
      } else if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          elements.push(
            <div key={i} className="flex gap-2 ml-4 my-0.5">
              <span className="text-accent font-semibold shrink-0">{match[1]}.</span>
              <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(match[2]) }} />
            </div>
          );
        }
      } else if (line.startsWith("|")) {
        if (!line.includes("---")) {
          const cells = line.split("|").filter(Boolean).map((c) => c.trim());
          const isHeader = i + 1 < lines.length && lines[i + 1]?.includes("---");
          elements.push(
            <div key={i} className={`grid gap-2 py-1 px-2 ${isHeader ? "font-semibold bg-accent/10 rounded" : "border-b border-border/30"}`} style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
              {cells.map((cell, j) => (
                <span key={j} className="text-sm" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }} />
              ))}
            </div>
          );
        }
      } else if (line.trim() === "") {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p key={i} className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        );
      }
    });

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
      <section className="relative py-24 overflow-hidden bg-black" ref={heroRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="flash-reveal inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">AI-Powered Tool</span>
            </div>
            <h1 className="flash-reveal text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight" style={{ "--flash-index": 1 } as any} data-testid="text-estimator-title">
              Project <span className="text-accent-3d">Estimator</span>
            </h1>
            <p className="flash-reveal text-lg text-gray-300 mb-6 leading-relaxed max-w-2xl" style={{ "--flash-index": 2 } as any} data-testid="text-estimator-description">
              Get an institutional-grade equipment estimate for your construction project. Our AI analyzes your project requirements against our inventory of 2,100+ equipment items and 12,200+ parts to deliver comprehensive cost projections.
            </p>
            <div className="flash-reveal flex flex-wrap gap-4" style={{ "--flash-index": 3 } as any}>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <HardHat className="w-4 h-4 text-accent" />
                <span>2,100+ Equipment Items</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calculator className="w-4 h-4 text-accent" />
                <span>Real Inventory Pricing</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileText className="w-4 h-4 text-accent" />
                <span>Comprehensive Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background" ref={formRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="flash-reveal p-8 border-card-border bg-background" data-testid="form-estimator">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Project Details</h2>
                    <p className="text-sm text-muted-foreground">Fill in your project parameters for a tailored estimate</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="projectName" className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-accent" />
                        Project Name *
                      </Label>
                      <Input
                        id="projectName"
                        placeholder="e.g. I-75 Highway Expansion Phase 2"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        data-testid="input-project-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectType" className="flex items-center gap-1.5">
                        <HardHat className="w-3.5 h-3.5 text-accent" />
                        Project Type *
                      </Label>
                      <Select value={projectType} onValueChange={setProjectType}>
                        <SelectTrigger data-testid="select-project-type">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_TYPES.map((type) => (
                            <SelectItem key={type} value={type} data-testid={`option-type-${type.toLowerCase().replace(/\s/g, "-")}`}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        Project Location *
                      </Label>
                      <Input
                        id="location"
                        placeholder="e.g. Tampa, FL or Houston, TX"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        data-testid="input-location"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="terrain" className="flex items-center gap-1.5">
                        <Mountain className="w-3.5 h-3.5 text-accent" />
                        Terrain Type *
                      </Label>
                      <Select value={terrain} onValueChange={setTerrain}>
                        <SelectTrigger data-testid="select-terrain">
                          <SelectValue placeholder="Select terrain type" />
                        </SelectTrigger>
                        <SelectContent>
                          {TERRAIN_TYPES.map((type) => (
                            <SelectItem key={type} value={type} data-testid={`option-terrain-${type.toLowerCase().replace(/\s/g, "-")}`}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectSize" className="flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-accent" />
                        Project Size *
                      </Label>
                      <Select value={projectSize} onValueChange={setProjectSize}>
                        <SelectTrigger data-testid="select-project-size">
                          <SelectValue placeholder="Select project size" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_SIZES.map((size) => (
                            <SelectItem key={size} value={size} data-testid={`option-size-${size.toLowerCase().replace(/\s/g, "-")}`}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        Estimated Duration *
                      </Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger data-testid="select-duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATIONS.map((d) => (
                            <SelectItem key={d} value={d} data-testid={`option-duration-${d.toLowerCase().replace(/\s/g, "-")}`}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalDetails" className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      Additional Project Details (Optional)
                    </Label>
                    <Textarea
                      id="additionalDetails"
                      placeholder="Describe any special requirements, environmental considerations, specific equipment preferences, access constraints, or other relevant project information..."
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      rows={4}
                      data-testid="textarea-additional-details"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isGenerating}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8"
                      data-testid="button-generate-estimate"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Estimate...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Estimate
                        </>
                      )}
                    </Button>
                    {showResult && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        data-testid="button-reset-estimate"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        New Estimate
                      </Button>
                    )}
                  </div>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="flash-reveal p-6 border-card-border bg-background" style={{ "--flash-index": 1 } as any}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  How It Works
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-xs font-bold text-accent">1</div>
                    <p>Enter your project parameters including type, location, terrain, and scale</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-xs font-bold text-accent">2</div>
                    <p>Our AI cross-references your needs against 2,100+ equipment items in our inventory</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-xs font-bold text-accent">3</div>
                    <p>Receive a comprehensive estimate with equipment, parts, logistics, and cost breakdowns</p>
                  </div>
                </div>
              </Card>

              <Card className="flash-reveal p-6 border-card-border bg-background" style={{ "--flash-index": 2 } as any}>
                <h3 className="font-semibold mb-3">Estimate Includes</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    Primary equipment with models & quantities
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    Supporting equipment & power generation
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    Transportation & logistics costs
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    Maintenance & replacement parts budget
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    Personnel requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    Complete cost summary (low/mid/high)
                  </li>
                </ul>
              </Card>

              <Card className="flash-reveal p-6 border-accent/30 bg-accent/5" style={{ "--flash-index": 3 } as any}>
                <h3 className="font-semibold mb-2 text-accent">Need a Formal Quote?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This AI estimate provides budget guidance. For exact pricing and availability, request a formal quote from our team.
                </p>
                <Link href="/quote">
                  <Button variant="outline" size="sm" className="border-accent/30 hover:bg-accent/10" data-testid="link-request-quote">
                    Request Quote <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {showResult && (
        <section className="py-16 bg-muted/30 border-t border-border" ref={resultRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6" ref={resultContainerRef}>
            <Card className="p-8 border-card-border bg-background" data-testid="card-estimate-result">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Equipment Estimate Report</h2>
                    <p className="text-sm text-muted-foreground">{projectName} — {projectType}</p>
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
                      a.download = `${projectName.replace(/\s+/g, "_")}_Estimate.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    data-testid="button-download-estimate"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Download
                  </Button>
                )}
              </div>

              <div className="prose prose-sm max-w-none">
                {isGenerating && !estimateResult && (
                  <div className="flex items-center gap-3 py-12 justify-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                    <span>Analyzing project requirements and inventory data...</span>
                  </div>
                )}

                {estimateResult && (
                  <div className="space-y-1" data-testid="text-estimate-content">
                    {renderMarkdown(estimateResult)}
                  </div>
                )}

                {isGenerating && estimateResult && (
                  <div className="flex items-center gap-2 mt-4 text-accent text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </div>
                )}
              </div>

              {!isGenerating && estimateResult && (
                <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-4">
                  <Link href="/quote">
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" data-testid="button-request-formal-quote">
                      Request Formal Quote <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/equipment">
                    <Button variant="outline" data-testid="button-browse-equipment">
                      Browse Equipment <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/parts">
                    <Button variant="outline" data-testid="button-browse-parts">
                      Browse Parts Catalog <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
