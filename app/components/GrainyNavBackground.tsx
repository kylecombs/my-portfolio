import "./GrainyNavBackground.css";

export function GrainyNavBackground() {
  return (
    <div className="grainy-nav-background">
      {/* SVG noise overlay for navigation */}
      {/* <svg 
        viewBox="0 0 150 150" 
        xmlns="http://www.w3.org/2000/svg" 
        className="grainy-nav-noise"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="navNoiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" filter="url(#navNoiseFilter)" fill="#ffffff"/>
      </svg> */}
    </div>
  );
}
