import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MECHANIC_HUB_URL = "https://heavy-equipment-mechanic.replit.app";

export default function MechanicHub() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
      <div className="bg-black border-b border-accent/20 px-4 py-2.5 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-gray-300 hover:text-white hover:bg-white/10"
              data-testid="button-back-from-mechanic"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to American Iron
            </Button>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-400 font-medium">Mechanic Hub</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            data-testid="button-toggle-fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <a
            href={MECHANIC_HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            data-testid="link-mechanic-external"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      <iframe
        src={MECHANIC_HUB_URL}
        className="w-full flex-1 border-0"
        style={{ minHeight: isFullscreen ? "calc(100vh - 48px)" : "calc(100vh - 112px)" }}
        title="Heavy Equipment Mechanic Hub"
        allow="clipboard-write; clipboard-read"
        data-testid="iframe-mechanic-hub"
      />
    </div>
  );
}
