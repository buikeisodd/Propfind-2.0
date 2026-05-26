import React, { useState, useRef, useEffect } from 'react';
import { Property } from '../types';
import { MapPin, ZoomIn, ZoomOut, Compass, MousePointerClick, RefreshCw, PenTool, LayoutGrid } from 'lucide-react';

interface InteractiveMapProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onSelectProperty: (propertyId: string) => void;
  onFilterByPolygon: (propertyIds: string[] | null) => void;
}

export default function InteractiveMap({
  properties,
  selectedPropertyId,
  onSelectProperty,
  onFilterByPolygon
}: InteractiveMapProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isLassoDrawing, setIsLassoDrawing] = useState<boolean>(false);
  const [lassoPoints, setLassoPoints] = useState<{ x: number; y: number }[]>([]);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const mapRef = useRef<SVGSVGElement | null>(null);
  const isDraggingMap = useRef<boolean>(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Reset lasso drawn area
  const clearLasso = () => {
    setLassoPoints([]);
    setIsLassoDrawing(false);
    onFilterByPolygon(null);
  };

  // Convert property (lat, lng) to SVG space (0 - 500)
  const getCoords = (lat: number, lng: number) => {
    // Map lat (0 to 500) and lng (0 to 500)
    return {
      x: Math.min(Math.max(lng, 20), 480),
      y: Math.min(Math.max(lat, 20), 380)
    };
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isLassoDrawing) {
      setLassoPoints([{ x, y }]);
    } else {
      isDraggingMap.current = true;
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isLassoDrawing && e.buttons === 1 && lassoPoints.length > 0) {
      // Add point if moved significantly
      const lastPoint = lassoPoints[lassoPoints.length - 1];
      const dist = Math.hypot(x - lastPoint.x, y - lastPoint.y);
      if (dist > 5) {
        setLassoPoints([...lassoPoints, { x, y }]);
      }
    } else if (isDraggingMap.current) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handleMouseUp = () => {
    if (isLassoDrawing && lassoPoints.length > 3) {
      // Complete drawing & Filter properties
      // Simple polygon bounds check for simulated coordinates
      const selectedIds = properties
        .filter((prop) => {
          const pt = getCoords(prop.lat, prop.lng);
          return isPointInPolygon(pt, lassoPoints);
        })
        .map((p) => p.id);

      onFilterByPolygon(selectedIds.length > 0 ? selectedIds : []);
      setIsLassoDrawing(false);
    }
    isDraggingMap.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!mapRef.current || e.touches.length === 0) return;
    const rect = mapRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (isLassoDrawing) {
      setLassoPoints([{ x, y }]);
    } else {
      isDraggingMap.current = true;
      dragStart.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!mapRef.current || e.touches.length === 0) return;
    const rect = mapRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (isLassoDrawing && lassoPoints.length > 0) {
      const lastPoint = lassoPoints[lassoPoints.length - 1];
      const dist = Math.hypot(x - lastPoint.x, y - lastPoint.y);
      if (dist > 5) {
        setLassoPoints([...lassoPoints, { x, y }]);
      }
    } else if (isDraggingMap.current) {
      setPan({
        x: touch.clientX - dragStart.current.x,
        y: touch.clientY - dragStart.current.y
      });
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // Ray-casting algorithm to detect if property sits inside the custom drawn path
  const isPointInPolygon = (point: { x: number; y: number }, vs: { x: number; y: number }[]) => {
    const x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i].x, yi = vs[i].y;
      const xj = vs[j].x, yj = vs[j].y;
      const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col h-[320px] sm:h-[480px]" id="interactive-map-root">
      {/* Map Control Header */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none" id="map-controls">
        <div className="flex gap-2 pointer-events-auto bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs shadow-lg items-center">
          <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
          <span className="font-medium tracking-tight">PropFind Live Map Engine</span>
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
          {/* Lasso Draw Button */}
          <button
            onClick={() => {
              setIsLassoDrawing(!isLassoDrawing);
              if (!isLassoDrawing) setLassoPoints([]);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs shadow-lg font-medium transition-all ${
              isLassoDrawing 
                ? 'bg-amber-500 text-amber-950 border-amber-400 scale-105' 
                : 'bg-slate-950/90 hover:bg-slate-800/90 border-slate-800 text-slate-300'
            }`}
            title="Click and drag to draw a custom search parameter"
            id="map-draw-btn"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{isLassoDrawing ? 'Drawing Lasso...' : 'Draw Search Area'}</span>
          </button>

          {lassoPoints.length > 0 && (
            <button
              onClick={clearLasso}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-950/90 hover:bg-red-900/90 border border-red-800/80 text-red-300 text-xs shadow-lg font-medium transition-all"
              id="map-clear-lasso"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Area</span>
            </button>
          )}

          <div className="flex items-center bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-full shadow-lg p-0.5">
            <button
              onClick={() => setZoom(Math.min(zoom + 0.25, 2.5))}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-full transition-colors"
              title="Zoom In"
              id="map-zoom-in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(Math.max(zoom - 0.25, 0.75));
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-full transition-colors"
              title="Zoom Out"
              id="map-zoom-out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map SVG Display */}
      <div className="w-full flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden">
        <svg
          ref={mapRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full select-none"
          id="map-viewport-svg"
          viewBox="0 0 500 400"
        >
          {/* Animated Matrix Background */}
          <rect width="500" height="400" fill="#0f172a" />
          
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} className="origin-center transition-transform duration-300 ease-out">
            {/* Grid Mesh */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="500" height="400" fill="url(#grid)" />

            {/* Area 1: Canyon View Quarter */}
            <path d="M0,0 L250,0 L200,180 L0,150 Z" fill="#9a3412" fillOpacity="0.1" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="50" y="30" fill="#9a3412" className="text-[10px] font-mono tracking-widest font-bold">CANYON CREST VALLEY</text>

            {/* Area 2: Pine Crest Woodlands */}
            <path d="M250,0 L500,0 L500,220 L280,180 Z" fill="#166534" fillOpacity="0.15" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="350" y="30" fill="#166534" className="text-[10px] font-mono tracking-widest font-bold">PINE WOODS RIDGE</text>

            {/* Area 3: Downtown Core Skyscraper Cluster */}
            <path d="M100,180 L280,180 L350,300 L90,300 Z" fill="#374151" fillOpacity="0.25" stroke="#4b5563" strokeWidth="2" />
            {/* Downtown architectural wireframe drawings */}
            <rect x="120" y="200" width="15" height="50" fill="#475569" fillOpacity="0.3" stroke="#64748b" strokeWidth="0.5" />
            <rect x="145" y="190" width="20" height="70" fill="#475569" fillOpacity="0.3" stroke="#64748b" strokeWidth="0.5" />
            <rect x="175" y="210" width="22" height="45" fill="#475569" fillOpacity="0.3" stroke="#64748b" strokeWidth="0.5" />
            <rect x="210" y="195" width="25" height="75" fill="#475569" fillOpacity="0.3" stroke="#64748b" strokeWidth="0.5" />
            <text x="160" y="280" fill="#94a3b8" className="text-[10px] font-mono tracking-widest text-center font-bold">DOWNTOWN METRO</text>

            {/* Area 4: Marina Heights & Bay Coastline */}
            <path d="M0,150 L200,180 L300,320 M0,150 L100,280 L0,380 Z" fill="#0369a1" fillOpacity="0.15" />
            <path d="M0,280 Q80,240 180,300 T300,400" fill="none" stroke="#38bdf8" strokeWidth="3" strokeOpacity="0.6" />
            <path d="M120,320 L150,310 L140,330 Z" fill="#0284c7" />
            <text x="40" y="360" fill="#38bdf8" className="text-[10px] font-mono tracking-widest font-bold">MARINA HARBOR COVE</text>

            {/* Area 5: Industrial Logistics East */}
            <path d="M300,300 L500,220 L500,400 L300,400 Z" fill="#581c87" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="360" y="340" fill="#6b21a8" className="text-[10px] font-mono tracking-widest font-bold">INDUSTRIAL SECTOR EAST</text>

            {/* Draw Property Pins */}
            {properties.map((prop) => {
              const { x, y } = getCoords(prop.lat, prop.lng);
              const isSelected = selectedPropertyId === prop.id;
              const isHovered = hoveredProperty?.id === prop.id;
              
              // Soft pulsing ring for featured items
              const showPulse = prop.isFeatured;

              return (
                <g
                  key={prop.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProperty(prop.id);
                  }}
                  onMouseEnter={() => setHoveredProperty(prop)}
                  onMouseLeave={() => setHoveredProperty(null)}
                >
                  {showPulse && (
                    <circle
                      r="14"
                      className="fill-blue-500/20 stroke-blue-400/30 animate-ping absolute"
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />
                  )}
                  
                  {/* Pin Circle Marker */}
                  <circle
                    r={isSelected ? "11" : isHovered ? "9" : "7"}
                    className={`transition-all duration-200 shadow-xl ${
                      isSelected
                        ? 'fill-blue-500 stroke-white stroke-2'
                        : prop.isPromoted
                        ? 'fill-amber-500 stroke-amber-200 stroke-1'
                        : 'fill-slate-800 stroke-slate-400 hover:fill-blue-400 hover:stroke-white'
                    }`}
                  />

                  {/* Tiny Icon or pricing indicator inside */}
                  <MapPin className={`w-3.5 h-3.5 absolute -translate-x-1.75 -translate-y-1.75 pointer-events-none ${
                    isSelected ? 'text-white' : prop.isPromoted ? 'text-amber-950 font-bold' : 'text-slate-200 group-hover:text-white'
                  }`} />

                  {/* Mini Overlay Tooltip on Hover */}
                  {(isHovered || isSelected) && (
                    <foreignObject
                      x="-70"
                      y="-55"
                      width="140"
                      height="50"
                      className="pointer-events-none z-50 overflow-visible"
                    >
                      <div className="bg-slate-950/95 border border-slate-700/80 p-1.5 rounded-lg shadow-2xl text-[9px] text-center backdrop-blur-sm">
                        <p className="font-semibold text-white truncate px-1">{prop.title}</p>
                        <p className="text-blue-400 font-bold tracking-tight mt-0.5">
                          {prop.listingType === 'rent'
                            ? `$${prop.price.toLocaleString()}/mo`
                            : prop.listingType === 'lease'
                            ? `$${prop.price.toLocaleString()}/lease`
                            : `$${prop.price.toLocaleString()}`}
                        </p>
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}

            {/* Vector Lasso line */}
            {lassoPoints.length > 0 && (
              <polyline
                points={lassoPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            )}
            {lassoPoints.length > 3 && !isLassoDrawing && (
              <polygon
                points={lassoPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="rgba(245, 158, 11, 0.12)"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
            )}
          </g>
        </svg>

        {/* Lasso Visual Helper Tips */}
        {isLassoDrawing && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none" id="lasso-guide">
            <div className="bg-amber-500/90 text-amber-980 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm animate-pulse">
              <MousePointerClick className="w-3 h-3 text-amber-900" />
              <span>Right-Click/Drag on map coordinates to draw and encircle desirable properties</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="bg-slate-950/50 border-t border-slate-800 p-2.5 px-4 text-[10px] text-slate-400 flex items-center justify-between" id="map-legend">
        <div className="flex gap-4 items-center">
          <span className="font-semibold text-slate-300">Map Legend:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white" /> Selected
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-200" /> Promoted
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-400" /> Standard
          </span>
        </div>
        <div className="text-slate-500 font-mono">
          Interactive coordinate projection: GPS v2.4 (Simulated)
        </div>
      </div>
    </div>
  );
}
