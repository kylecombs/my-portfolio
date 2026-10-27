import { useEffect, useState, useRef } from 'react';

interface UseMouseMomentumOptions {
  friction?: number;
  sensitivity?: number;
  maxVelocity?: number;
  scrollSensitivity?: number;
  scrollMaxVelocity?: number;
}

/**
 * Custom hook that creates flywheel-like momentum based on mouse movement
 * 
 * @param options Configuration options for the momentum behavior
 * @returns Current rotation value in degrees
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const rotation = useMouseMomentum();
 * return <div style={{ transform: `rotate(${rotation}deg)` }}>Content</div>
 * 
 * // With custom settings
 * const rotation = useMouseMomentum({
 *   friction: 0.95,     // Slower decay
 *   sensitivity: 1.2,   // More responsive
 *   maxVelocity: 50     // Faster max speed
 * });
 * ```
 */
export function useMouseMomentum(options: UseMouseMomentumOptions = {}) {
  const {
    friction = 0.98,      // How quickly the rotation slows down (0-1)
    sensitivity = 0.5,    // How sensitive to mouse movement
    maxVelocity = 50,     // Maximum rotation velocity
    scrollSensitivity = 0, // Spin added per px scrolled on touch screens (0 = off)
    scrollMaxVelocity = maxVelocity // Lower cap keeps scroll-driven spin calm
  } = options;

  const [rotation, setRotation] = useState(0);
  const velocityRef = useRef(0);
  const lastMouseRef = useRef({ x: 0, y: 0, time: Date.now() });
  const animationRef = useRef<number>();
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      const deltaTime = now - lastMouseRef.current.time;
      
      if (deltaTime > 10) { // Throttle to avoid too frequent updates
        // Calculate mouse velocity (distance moved / time)
        const deltaX = event.clientX - lastMouseRef.current.x;
        const deltaY = event.clientY - lastMouseRef.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const mouseVelocity = distance / deltaTime * 10; // Scale up for better effect
        
        // Convert mouse velocity to angular velocity
        const angularVelocity = mouseVelocity * sensitivity;
        
        // Add to current velocity (accumulate momentum)
        velocityRef.current += angularVelocity;
        
        // Clamp to max velocity
        velocityRef.current = Math.min(velocityRef.current, maxVelocity);
        
        // Start animation if not already running
        if (!isAnimatingRef.current) {
          startAnimation();
        }
      }
      
      lastMouseRef.current = {
        x: event.clientX,
        y: event.clientY,
        time: now
      };
    };

    const animate = () => {
      // Apply friction to velocity
      velocityRef.current *= friction;
      
      // Only continue animating if there's meaningful velocity
      if (Math.abs(velocityRef.current) > 0.1) {
        setRotation(prev => prev + velocityRef.current);
        if (typeof window !== 'undefined') {
          animationRef.current = requestAnimationFrame(animate);
        }
      } else {
        isAnimatingRef.current = false;
      }
    };

    // Start animation loop
    const startAnimation = () => {
      if (typeof window === 'undefined') return;
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      isAnimatingRef.current = true;
      animationRef.current = requestAnimationFrame(animate);
    };

    // Touch screens have no mouse movement, so scrolling feeds the momentum instead
    // Media queries are read on every event, not once at mount, so switching device
    // emulation or motion settings takes effect without a reload
    const touchOnly = window.matchMedia('(hover: none)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      if (!touchOnly.matches || reducedMotion.matches) return;
      velocityRef.current = Math.min(velocityRef.current + delta * scrollSensitivity, scrollMaxVelocity);
      if (!isAnimatingRef.current) {
        startAnimation();
      }
    };
    if (scrollSensitivity > 0) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Add mouse move listener
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (typeof window === 'undefined') return;
      
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Otherwise a re-run (new options, hot reload) mid-spin leaves the flag stuck
      // true and no input ever restarts the loop
      isAnimatingRef.current = false;
    };
  }, [friction, sensitivity, maxVelocity, scrollSensitivity, scrollMaxVelocity]);

  return rotation;
} 