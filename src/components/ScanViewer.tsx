import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, Eye, Maximize2, Minimize2, Sliders, ShieldCheck } from 'lucide-react';

interface ScanViewerProps {
  imageUrl: string;
  title?: string;
  modality?: string;
  isProcessing?: boolean;
}

export type ViewPreset = 'standard' | 'bone' | 'inverted' | 'soft-tissue' | 'heatmap';

export const ScanViewer: React.FC<ScanViewerProps> = ({
  imageUrl,
  title = 'Uploaded Diagnostic Study',
  modality = 'Diagnostic Scan',
  isProcessing = false,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [preset, setPreset] = useState<ViewPreset>('standard');
  const [crosshairActive, setCrosshairActive] = useState<boolean>(false);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoom(1);
    setPreset('standard');
    setCrosshairPos(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!crosshairActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setCrosshairPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  // Preset CSS filter mapping
  const getFilterStyle = () => {
    switch (preset) {
      case 'bone':
        return 'contrast-175 brightness-95 grayscale';
      case 'inverted':
        return 'invert contrast-125 brightness-100';
      case 'soft-tissue':
        return 'contrast-130 brightness-110 grayscale';
      case 'heatmap':
        return 'sepia hue-rotate-180 saturate-200 contrast-150';
      case 'standard':
      default:
        return 'grayscale contrast-105';
    }
  };

  return (
    <div
      className={`relative flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'w-full'
      }`}
    >
      {/* Top Clinical Ribbon */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-slate-400">STUDY:</span>
          <span className="font-medium text-slate-100 truncate">{title}</span>
          <span className="text-slate-500 font-mono">·</span>
          <span className="text-teal-400 font-mono text-[11px] truncate">{modality}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {crosshairActive && crosshairPos && (
            <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-teal-400 bg-slate-800/80 px-2 py-0.5 rounded">
              <span>X:{crosshairPos.x}%</span>
              <span>Y:{crosshairPos.y}%</span>
            </div>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Scan Display Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCrosshairPos(null)}
        className={`relative w-full flex items-center justify-center bg-black overflow-hidden select-none ${
          isFullscreen ? 'flex-1 h-[calc(100vh-84px)]' : 'h-[360px] md:h-[440px]'
        } ${crosshairActive ? 'cursor-crosshair' : 'cursor-default'}`}
      >
        {/* Diagnostic Scan Image */}
        <div
          className="relative transition-transform duration-150 ease-out max-h-full max-w-full flex items-center justify-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            src={imageUrl}
            alt={title}
            className={`max-h-[340px] md:max-h-[420px] w-auto object-contain transition-all duration-200 ${getFilterStyle()}`}
            referrerPolicy="no-referrer"
          />

          {/* Crosshair Overlay */}
          {crosshairActive && crosshairPos && (
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-0 bottom-0 border-l border-teal-400/60"
                style={{ left: `${crosshairPos.x}%` }}
              />
              <div
                className="absolute left-0 right-0 border-t border-teal-400/60"
                style={{ top: `${crosshairPos.y}%` }}
              />
              <div
                className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 border border-teal-400 rounded-full"
                style={{ left: `${crosshairPos.x}%`, top: `${crosshairPos.y}%` }}
              />
            </div>
          )}
        </div>

        {/* Processing Scan Analysis Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 z-20">
            <div className="w-12 h-12 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin mb-4" />
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-1">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Analyzing Diagnostic Imagery</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Extracting anatomic landmarks, verifying clinical urgency, and querying specialized hospital facilities...
            </p>
          </div>
        )}

        {/* Floating Calibration HUD */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none text-[11px] font-mono text-slate-400 bg-slate-950/70 backdrop-blur-xs px-2.5 py-1.5 rounded border border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">FILTER:</span>
            <span className="text-teal-300 font-semibold uppercase">{preset}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">ZOOM:</span>
            <span className="text-slate-200">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>

      {/* PACS Radiologic Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-900 border-t border-slate-800 text-xs">
        {/* Preset Selector */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <span className="text-slate-400 text-[11px] font-mono mr-1 hidden sm:inline">VIEW:</span>
          {(
            [
              { id: 'standard', label: 'Standard' },
              { id: 'bone', label: 'Bone Window' },
              { id: 'inverted', label: 'Inverted' },
              { id: 'soft-tissue', label: 'Soft Tissue' },
              { id: 'heatmap', label: 'Density Heatmap' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setPreset(item.id)}
              className={`px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                preset === item.id
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Viewport Tools: Zoom & Crosshair */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setCrosshairActive(!crosshairActive)}
            className={`p-1.5 rounded transition-colors ${
              crosshairActive
                ? 'bg-teal-500/30 text-teal-300 border border-teal-500/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Anatomical Crosshair Probe"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.75}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-mono text-slate-300 w-9 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoom >= 2.5}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
