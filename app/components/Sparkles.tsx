import { Diamond } from "./Diamond";

interface SparklesProps {
  className?: string;
}

export function Sparkles({ className = "" }: SparklesProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Main sparkle area - right side */}
      <Diamond className="absolute top-16 right-20 h-12 w-12 fill-white/90 z-0 animate-sparkle" />
      <Diamond className="absolute top-32 right-32 h-6 w-6 fill-white/70 z-0 animate-sparkleDelayed" />
      <Diamond className="absolute top-48 right-16 h-8 w-8 fill-white/80 z-0 animate-sparkleShort" />
      <Diamond className="absolute top-20 right-48 h-4 w-4 fill-white/60 z-0 animate-sparkleFast" />
      <Diamond className="absolute top-64 right-40 h-10 w-10 fill-white/90 z-0 animate-sparkleSlow" />
      <Diamond className="absolute top-40 right-64 h-5 w-5 fill-white/50 z-0 animate-sparkleQuick" />
      
      {/* Additional sparkles in other areas */}
      <Diamond className="absolute top-80 left-32 h-7 w-7 fill-white/60 z-0 animate-sparkle" />
      <Diamond className="absolute top-96 left-48 h-4 w-4 fill-white/40 z-0 animate-sparkleDelayed" />
      <Diamond className="absolute bottom-32 right-32 h-9 w-9 fill-white/70 z-0 animate-sparkleShort" />
      <Diamond className="absolute bottom-48 right-16 h-5 w-5 fill-white/50 z-0 animate-sparkleFast" />
      <Diamond className="absolute bottom-64 left-16 h-6 w-6 fill-white/60 z-0 animate-sparkleSlow" />
      <Diamond className="absolute bottom-40 left-40 h-3 w-3 fill-white/40 z-0 animate-sparkleQuick" />
    </div>
  );
} 