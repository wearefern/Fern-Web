'use client';

import { useEffect, useRef } from 'react';

/* -------------------------------------------------------------------------------------------------
 * Footer Logo Canvas - Cinematic dot-matrix "fernnn." with premium magnetic warp
 * Ultra minimal luxury-tech aesthetic
 * Dekonstrukt-style magnetic dot interaction
 * Spring physics, smooth repulsion, elegant motion
 * Balanced wordmark with breathing room, subtle bottom crop only
 * "f" fully visible, centered composition
 * -----------------------------------------------------------------------------------------------*/

interface Dot {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
}

const DOT_RADIUS = 1.3; // Slightly smaller for refined elegance
const DOT_SPACING = 5; // Slightly more breathing room
const TARGET_WIDTH_RATIO = 0.84;
const LEFT_OFFSET_RATIO = 0.01;
const VERTICAL_OFFSET_RATIO = -0.015;
const ALPHA_THRESHOLD = 220; // Tighter threshold for cleaner edges

// Magnetic interaction physics
const INTERACTION_RADIUS = 350; // Balanced cinematic field
const REPULSION_STRENGTH = 0.58;
const SPRING_STRENGTH = 0.055;
const DAMPING = 0.88;
const MAX_DISPLACEMENT = 108; // Balanced visible displacement
const TANGENTIAL_FACTOR = 0.40; // Moderate sideways drift
const FALLOFF_EXPONENT = 1.3; // Smooth falloff
const MOUSE_THROTTLE_MS = 16;

/* -----------------------------------------------------------------------------------------------*/

const FooterLogoCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const rafRef = useRef<number | null>(null);
  const lastMouseTimeRef = useRef(0);
  const isActiveRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const TEXT = 'fernnn.';

    const renderMassiveWordmark = async () => {
      // Ensure Albert Sans font is fully loaded
      await document.fonts.ready;

      // Explicitly load Albert Sans Black/Heavy weight
      try {
        const albertSansFont = new FontFace(
          'Albert Sans',
          'url("https://fonts.googleapis.com/css2?family=Albert+Sans:wght@900&display=swap")',
          { weight: '900' }
        );
        await albertSansFont.load();
        document.fonts.add(albertSansFont);
      } catch {
        // Font may already be loaded via CSS
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Set canvas dimensions with device pixel ratio
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Reset transform and apply device pixel ratio scaling
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Create offscreen canvas for precise text rendering
      const offCanvas = document.createElement('canvas');
      offCanvas.width = rect.width;
      offCanvas.height = rect.height;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      // Calculate optimal font size for 95% viewport width
      const targetWidth = rect.width * TARGET_WIDTH_RATIO;
      let fontSize = 100;
      let textWidth = 0;

      // Binary search for perfect font size
      let minSize = 50;
      let maxSize = 1200;

      while (minSize <= maxSize) {
        const testSize = Math.floor((minSize + maxSize) / 2);
        offCtx.font = `900 ${testSize}px "Albert Sans", "Inter", system-ui, sans-serif`;
        const testWidth = offCtx.measureText(TEXT).width;

        if (testWidth < targetWidth) {
          fontSize = testSize;
          textWidth = testWidth;
          minSize = testSize + 1;
        } else {
          maxSize = testSize - 1;
        }
      }

      // Set final font configuration for EXACT Albert Sans Black/Heavy
      offCtx.font = `900 ${fontSize}px "Albert Sans", "Inter", system-ui, sans-serif`;
      offCtx.fillStyle = 'white';
      offCtx.textBaseline = 'alphabetic';
      offCtx.textAlign = 'left';

      // Get precise text metrics for perfect centering
      const metrics = offCtx.measureText(TEXT);

      // Center horizontally with tiny left offset for visual balance
      let textX = (rect.width - textWidth) / 2;
      textX -= rect.width * LEFT_OFFSET_RATIO; // Tiny left offset

      // Center vertically with metrics, then subtle downward shift for bottom crop
      let textY =
        (rect.height +
          metrics.actualBoundingBoxAscent -
          metrics.actualBoundingBoxDescent) /
        2;
      textY += rect.height * VERTICAL_OFFSET_RATIO; // Subtle upward adjustment

      // Clear offscreen canvas
      offCtx.clearRect(0, 0, rect.width, rect.height);

      // Draw text for sampling - EXACT Albert Sans geometry
      offCtx.fillText(TEXT, textX, textY);

      // Get pixel data for dot matrix conversion
      const imageData = offCtx.getImageData(0, 0, rect.width, rect.height);
      const data = imageData.data;

      // Generate dots from text pixels on perfect engineering grid
      const dots: Dot[] = [];

      for (let y = 0; y < rect.height; y += DOT_SPACING) {
        for (let x = 0; x < rect.width; x += DOT_SPACING) {
          const pixelIndex = (Math.floor(y) * rect.width + Math.floor(x)) * 4;
          const alpha = data[pixelIndex + 3];

          // Only create dots from solid text pixels
          if (alpha && alpha > ALPHA_THRESHOLD) {
            dots.push({
              x,
              y,
              originalX: x,
              originalY: y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }

      dotsRef.current = dots;

      // Debug information
      // eslint-disable-next-line no-console
      console.log('[FooterLogoCanvas]', {
        canvasWidth: rect.width,
        canvasHeight: rect.height,
        dotCount: dots.length,
        fontSize,
        textWidth: Math.round(textWidth),
        targetWidth: Math.round(targetWidth),
        textX: Math.round(textX),
        textY: Math.round(textY),
        leftOffset: Math.round(rect.width * LEFT_OFFSET_RATIO),
        verticalOffset: Math.round(rect.height * VERTICAL_OFFSET_RATIO),
      });

      // Start animation loop
      isActiveRef.current = true;
      startAnimationLoop();
    };

    // Physics animation loop
    const startAnimationLoop = () => {
      if (rafRef.current) return;

      const loop = () => {
        if (!isActiveRef.current) {
          rafRef.current = null;
          return;
        }

        updatePhysics();
        renderDots();
        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    };

    const stopAnimationLoop = () => {
      isActiveRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const updatePhysics = () => {
      const mouse = mouseRef.current;
      const dots = dotsRef.current;

      let hasMovement = false;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        if (!dot) continue;

        // Spring force: pull back to original position
        const springX = (dot.originalX - dot.x) * SPRING_STRENGTH;
        const springY = (dot.originalY - dot.y) * SPRING_STRENGTH;

        dot.vx += springX;
        dot.vy += springY;

        // Mouse repulsion
        if (mouse.active) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < INTERACTION_RADIUS * INTERACTION_RADIUS && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const normalizedDist = dist / INTERACTION_RADIUS;
            const falloff = Math.pow(1 - normalizedDist, FALLOFF_EXPONENT);
            const force = falloff * REPULSION_STRENGTH;

            const dirX = dx / dist;
            const dirY = dy / dist;

            // Tangential drift for organic cinematic motion
            const tangentX = -dirY * TANGENTIAL_FACTOR;
            const tangentY = dirX * TANGENTIAL_FACTOR;

            // Softer spread: outer dots still drift subtly
            const spreadMultiplier = 0.6 + falloff * 0.4;

            dot.vx += (dirX * force + tangentX * falloff) * spreadMultiplier;
            dot.vy += (dirY * force + tangentY * falloff) * spreadMultiplier;
          }
        }

        // Apply damping
        dot.vx *= DAMPING;
        dot.vy *= DAMPING;

        // Update position
        const newX = dot.x + dot.vx;
        const newY = dot.y + dot.vy;

        // Cap maximum displacement from original
        const offsetX = newX - dot.originalX;
        const offsetY = newY - dot.originalY;
        const offsetDist = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

        if (offsetDist > MAX_DISPLACEMENT) {
          const scale = MAX_DISPLACEMENT / offsetDist;
          dot.x = dot.originalX + offsetX * scale;
          dot.y = dot.originalY + offsetY * scale;
          dot.vx *= 0.5;
          dot.vy *= 0.5;
        } else {
          dot.x = newX;
          dot.y = newY;
        }

        // Check if dot is still moving
        if (Math.abs(dot.vx) > 0.01 || Math.abs(dot.vy) > 0.01 || offsetDist > 0.1) {
          hasMovement = true;
        }
      }

      // Pause if no movement and mouse inactive
      if (!hasMovement && !mouse.active) {
        isActiveRef.current = false;
      }
    };

    const renderDots = () => {
      const rect = canvas.getBoundingClientRect();

      // Clear with pure black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw all dots with refined white
      ctx.fillStyle = '#F5F5F5';

      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        if (!dot) continue;

        // Draw perfectly uniform circular dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Mouse tracking with throttling
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseTimeRef.current < MOUSE_THROTTLE_MS) return;
      lastMouseTimeRef.current = now;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;

      if (!isActiveRef.current) {
        isActiveRef.current = true;
        startAnimationLoop();
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Initial render with delay for font loading
    setTimeout(renderMassiveWordmark, 200);

    // Handle window resize
    const handleResize = () => {
      stopAnimationLoop();
      setTimeout(renderMassiveWordmark, 100);
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      stopAnimationLoop();
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section
      className='relative w-full overflow-hidden'
      style={{ backgroundColor: '#000000' }}
    >
      <div
        className='relative w-full'
        style={{
          height: 'clamp(420px, 46vh, 580px)',
        }}
      >
        <canvas
          ref={canvasRef}
          className='block h-full w-full cursor-default'
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>
    </section>
  );
};

FooterLogoCanvas.displayName = 'FooterLogoCanvas';

/* -----------------------------------------------------------------------------------------------*/

export { FooterLogoCanvas };
