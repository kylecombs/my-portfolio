import { Asterisk } from "./Asterisk";
import { useMouseMomentum } from "../hooks/useMouseMomentum";
import { Sparkles } from "./Sparkles";

interface HeroProps {
  className?: string;
}

export function Hero({ className = "" }: HeroProps) {
  const rotation = useMouseMomentum({
    friction: 0.99,
    sensitivity: 0.3,
    maxVelocity: 5
  });

  return (
    <section className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Page Border */}
      <div className="pointer-events-none absolute inset-4 z-20 border border-dark-green/20"/>

      {/* Asterisk Background Element */}
      <Asterisk 
        className="absolute bottom-16 left-20 h-80 w-80 fill-white/10 z-0" 
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center'
        }}
              />
        
        {/* Sparkle Effect */}
        <Sparkles />

      {/* Hero Content */}
      <div className="relative z-10 h-screen p-12">
        <div className="absolute top-10 left-12">
          <h1 className="mb-2 font-neue-haas text-4xl font-normal italic outlined-text tracking-wide text-dark-green sm:text-5xl lg:text-7xl whitespace-nowrap opacity-0 translate-x-4 animate-[fadeInSlideLeft_0.8s_ease-out_0.1s_forwards]">
            Kyle Combs
          </h1>
          <p className="mb-8 font-neue-haas text-xl font-normal tracking-wider text-dark-green opacity-0 translate-x-4 animate-[fadeInSlideLeft_0.8s_ease-out_0.3s_forwards]">
            Software Engineer
          </p>

          {/* Navigation */}
          <nav className="space-y-2">
            <div className="flex items-center opacity-0 translate-x-4 animate-[fadeInSlideLeft_0.8s_ease-out_0.5s_forwards] group">
              <div className="mr-4 relative w-6 h-6 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-gray-800 group-hover:opacity-0 transition-opacity duration-200"></div>
                <span className="absolute text-[1.5rem] drop-shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-200">☺</span>
              </div>
              <a
                href="/projects"
                className="font-neue-haas text-lg font-normal text-gray-800 transition-all duration-200 hover:text-gray-600 group-hover:translate-x-1"
              >
                Projects
              </a>
            </div>
            <div className="flex items-center opacity-0 translate-x-4 animate-[fadeInSlideLeft_0.8s_ease-out_0.7s_forwards] group">
              <div className="mr-4 relative w-6 h-6 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-gray-800 group-hover:opacity-0 transition-opacity duration-200"></div>
                <span className="absolute text-[1.5rem] drop-shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-200">☺</span>
              </div>
              <a
                href="#about"
                className="font-neue-haas text-lg font-normal text-gray-800 transition-all duration-200 hover:text-gray-600 group-hover:translate-x-1"
              >
                Info
              </a>
            </div>
            <div className="flex items-center opacity-0 translate-x-4 animate-[fadeInSlideLeft_0.8s_ease-out_0.9s_forwards] group">
              <div className="mr-4 relative w-6 h-6 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-gray-800 group-hover:opacity-0 transition-opacity duration-200"></div>
                <span className="absolute text-[1.5rem] drop-shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-200">☺</span>
              </div>
              <a
                href="#contact"
                className="font-neue-haas text-lg font-normal text-gray-800 transition-all duration-200 hover:text-gray-600 group-hover:translate-x-1"
              >
                Contact
              </a>
            </div>
          </nav>
        </div>

        <div className="flex mb-20 justify-center items-center h-full">
          <div className="flex flex-col translate-x-8 animate-[fadeInLeft_0.8s_ease-out_0.5s_forwards] font-normal text-gray-700 opacity-0 space-y-2">
            <div className="flex items-baseline space-x-1 justify-end mb-2">
              <p className="outlined-text text-[3.75rem] font-bold italic">Good</p><strong className="text-[3.75rem] font-bold italic">software</strong> <p className="outlined-text text-[3.75rem] font-bold italic">should</p>
            </div>
            <p className="font-script font-light leading-[13rem] text-[15rem] drop-shadow-glow">
              Feel good<span className="text-[1.5rem] ml-2 drop-shadow-glow">☺</span>
            </p>
            <p className="text-pretty font-neue-haas text-xl font-normal leading-relaxed text-right max-w-[32rem] float-right self-end">
              As a software engineer, I work to make the web a little more
              welcoming. My approach is simple: write solid code, respect the
              user, and remember that behind every screen is a real person. I
              bring both engineering skills and design thinking to create
              experiences that just work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
