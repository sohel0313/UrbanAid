import { MapPin } from 'lucide-react';

interface MapPreviewProps {
  address: string;
  className?: string;
}

export function MapPreview({ address, className }: MapPreviewProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-muted ${className}`}>
      {/* Simplified map visualization */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-info/5">
        <svg
          className="w-full h-full opacity-30"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[...Array(10)].map((_, i) => (
            <g key={i}>
              <line
                x1={i * 10}
                y1="0"
                x2={i * 10}
                y2="100"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-muted-foreground"
              />
              <line
                x1="0"
                y1={i * 10}
                x2="100"
                y2={i * 10}
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-muted-foreground"
              />
            </g>
          ))}
          {/* Roads */}
          <path
            d="M0,30 L100,30"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground/50"
          />
          <path
            d="M50,0 L50,100"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground/50"
          />
          <path
            d="M0,70 L100,70"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground/40"
          />
          <path
            d="M25,0 L25,100"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground/30"
          />
          <path
            d="M75,0 L75,100"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground/30"
          />
        </svg>
      </div>

      {/* Center pin */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative animate-bounce">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-foreground/20 rounded-full blur-sm" />
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Address overlay */}
      <div className="absolute bottom-2 left-2 right-2 bg-card/90 backdrop-blur-sm rounded-md px-3 py-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>
      </div>
    </div>
  );
}
