import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import "./GradientBackground.css";

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

  constructor(
    x: number,
    y: number,
    color: { r: number; g: number; b: number }
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    // Sized for a ~900px viewport; scaled down so blobs stay distinct on phones.
    const scale = Math.min(1, Math.min(window.innerWidth, window.innerHeight) / 900);
    this.radius = (Math.random() * 300 + 200) * Math.max(scale, 0.4);
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -this.radius || this.x > width + this.radius) this.vx *= -1;
    if (this.y < -this.radius || this.y > height + this.radius) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );
    gradient.addColorStop(
      0,
      `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`
    );
    gradient.addColorStop(
      1,
      `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`
    );

    ctx.fillStyle = gradient;
    ctx.fillRect(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}

// The blobs are blurred 80px, so they're drawn at 1/8 of the viewport's
// resolution and blurred 10px in the canvas, which the browser upscales to
// the same look. Blurring a full-size canvas with CSS on every frame was the
// page's biggest rendering cost.
const SCALE = 1 / 8;
const BLUR = "blur(10px) contrast(1.2)";

export function GradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  // Browsers without canvas filters (Safari before 18) fall back to CSS.
  const [cssBlur, setCssBlur] = useState(false);
  // The canvas starts once the page has loaded and fades in over the static
  // CSS gradients, so it never competes with the first paint.
  const [canvasStarted, setCanvasStarted] = useState(false);

  // Trigger fade-in immediately on mount to prevent white flash
  useLayoutEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    // The blobs and their fading trails build up here; each frame it's
    // copied, blurred, onto the visible canvas.
    const buffer = document.createElement("canvas");
    const bufferCtx = buffer.getContext("2d");
    if (!ctx || !bufferCtx) return;

    const canFilter = "filter" in ctx;
    if (!canFilter) setCssBlur(true);

    const colors = [
      { r: 200, g: 160, b: 180 }, // Lighter muted mauve
      { r: 160, g: 180, b: 200 }, // Lighter muted blue-gray
      { r: 190, g: 190, b: 160 }, // Lighter muted beige
      { r: 170, g: 200, b: 185 }, // Lighter muted sage
      { r: 210, g: 180, b: 170 }, // Lighter muted terracotta
    ];

    const points: GradientPointClass[] = [];
    let frame = 0;
    let idle = 0;

    // Points move in CSS pixels; the transform maps them onto the small buffer.
    function size() {
      if (!canvas || !bufferCtx) return;
      const w = Math.ceil(window.innerWidth * SCALE);
      const h = Math.ceil(window.innerHeight * SCALE);
      // Mobile URL bar show/hide resizes height on scroll; resizing clears the
      // canvas, so skip small height-only changes.
      if (w === canvas.width && Math.abs(h - canvas.height) < 20) return;
      canvas.width = buffer.width = w;
      canvas.height = buffer.height = h;
      bufferCtx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    }

    function init() {
      size();

      // Create gradient points
      for (let i = 0; i < 5; i++) {
        points.push(
          new GradientPointClass(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight,
            colors[i % colors.length]
          )
        );
      }
    }

    function animate() {
      if (!ctx || !bufferCtx || !canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      bufferCtx.fillStyle = "rgba(245, 245, 245, 0.05)";
      bufferCtx.fillRect(0, 0, width, height);

      // Update and draw gradient points
      points.forEach((point) => {
        point.update(width, height);
        point.draw(bufferCtx);
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canFilter) ctx.filter = BLUR;
      ctx.drawImage(buffer, 0, 0);

      frame = requestAnimationFrame(animate);
    }

    function start() {
      window.addEventListener("resize", size);
      init();
      animate();
      setCanvasStarted(true);
    }

    // Wait for the load event, then for the main thread to go idle (hydration,
    // entrance animations), before starting.
    const requestIdle =
      window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    const cancelIdle = window.cancelIdleCallback ?? clearTimeout;
    function onLoad() {
      idle = requestIdle(start, { timeout: 1500 });
    }
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      window.removeEventListener("load", onLoad);
      cancelIdle(idle);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isVisible}
      timeout={800}
      classNames="gradient-fade"
      unmountOnExit={false}
    >
      <div ref={nodeRef} className="gradient-container">
        <canvas
          ref={canvasRef}
          className="gradient-canvas"
          data-started={canvasStarted || undefined}
          style={cssBlur ? { filter: "blur(80px) contrast(1.2)" } : undefined}
        />
        <div className="floating-orb orb-1" />
        <div className="floating-orb orb-2" />
        <div className="floating-orb orb-3" />
        <svg
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          className="grain-svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="noiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>

          <rect
            width="100%"
            height="100%"
            filter="url(#noiseFilter)"
            fill="#ffffff"
          />
        </svg>
      </div>
    </CSSTransition>
  );
}
