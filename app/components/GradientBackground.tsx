import { useEffect, useRef } from 'react';
import './GradientBackground.css';

interface GradientPoint {
  x: number;
  y: number;
  color: { r: number; g: number; b: number };
  vx: number;
  vy: number;
  radius: number;
}

class GradientPointClass implements GradientPoint {
  x: number;
  y: number;
  color: { r: number; g: number; b: number };
  vx: number;
  vy: number;
  radius: number;

  constructor(x: number, y: number, color: { r: number; g: number; b: number }) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 300 + 200;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -this.radius || this.x > width + this.radius) this.vx *= -1;
    if (this.y < -this.radius || this.y > height + this.radius) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`);
    gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  }
}

export function GradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = [
      { r: 200, g: 160, b: 180 },  // Lighter muted mauve
      { r: 160, g: 180, b: 200 },  // Lighter muted blue-gray
      { r: 190, g: 190, b: 160 },  // Lighter muted beige
      { r: 170, g: 200, b: 185 },  // Lighter muted sage
      { r: 210, g: 180, b: 170 }   // Lighter muted terracotta
    ];

    const points: GradientPointClass[] = [];

    function init() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Create gradient points
      for (let i = 0; i < 5; i++) {
        points.push(new GradientPointClass(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          colors[i % colors.length]
        ));
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(245, 245, 245, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw gradient points
      points.forEach(point => {
        point.update(canvas.width, canvas.height);
        point.draw(ctx);
      });
      
      requestAnimationFrame(animate);
    }

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="gradient-container">
      <canvas ref={canvasRef} className="gradient-canvas" />
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />
      
      {/* SVG filter for grain texture */}
      <svg width="0" height="0" style={{ position: 'absolute', visibility: 'hidden' }}>
        <defs>
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.9" 
              numOctaves="1" 
              seed="5"/>
            <feColorMatrix type="matrix" values="0"/>
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 .5 .5 .5 0 0 0 0 0 .5 .5 .5 .5 .5 0 0 0 0 0 .5"/>
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="0.5"/>
          </filter>
        </defs>
      </svg>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="grain-svg" preserveAspectRatio="xMidYMid slice">
        <rect width="100%" height="100%" filter="url(#noiseFilter)" fill="white"/>
      </svg>
    </div>
  );
}