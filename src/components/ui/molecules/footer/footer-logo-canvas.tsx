'use client';

import { useEffect, useRef } from 'react';

/* -------------------------------------------------------------------------------------------------
 * Footer Logo Canvas - Precision dot-matrix "fernnn." footer wordmark
 * -----------------------------------------------------------------------------------------------*/

interface Dot {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
}

const DOT_RADIUS = 1.15;
const DOT_SPACING = 5.2;
const TARGET_WIDTH_RATIO = 0.75;
const HORIZONTAL_OFFSET_RATIO = -0.002;
const VERTICAL_OFFSET_RATIO = 0.062;
const ALPHA_THRESHOLD = 220;
const TEXT_COLOR = '#F5F5F5';
const OFFSCREEN_SCALE = 2.5;

// Keep interaction restrained so baseline composition remains precise.
const INTERACTION_RADIUS = 104;
const REPULSION_STRENGTH = 0.38;
const SPRING_STRENGTH = 0.06;
const DAMPING = 0.9;
const MAX_DISPLACEMENT = 14;
const TANGENTIAL_FACTOR = 0.22;
const FALLOFF_EXPONENT = 1.45;
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

    const renderWordmark = async () => {
      await document.fonts.ready;
      await document.fonts.load('800 200px "Albert Sans"');

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const offCanvas = document.createElement('canvas');
      offCanvas.width = Math.max(1, Math.round(rect.width * OFFSCREEN_SCALE));
      offCanvas.height = Math.max(1, Math.round(rect.height * OFFSCREEN_SCALE));

      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      const targetWidth = rect.width * TARGET_WIDTH_RATIO;
      let fontSize = 100;
      let minSize = 40;
      let maxSize = 1000;

      while (minSize <= maxSize) {
        const testSize = Math.floor((minSize + maxSize) / 2);
        offCtx.font = `800 ${testSize * OFFSCREEN_SCALE}px "Albert Sans"`;
        (
          offCtx as CanvasRenderingContext2D & { letterSpacing?: string }
        ).letterSpacing = `${testSize * OFFSCREEN_SCALE * -0.025}px`;
        const testWidth = offCtx.measureText(TEXT).width / OFFSCREEN_SCALE;

        if (testWidth < targetWidth) {
          fontSize = testSize;
          minSize = testSize + 1;
        } else {
          maxSize = testSize - 1;
        }
      }

      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      offCtx.font = `800 ${fontSize * OFFSCREEN_SCALE}px "Albert Sans"`;
      (
        offCtx as CanvasRenderingContext2D & { letterSpacing?: string }
      ).letterSpacing = `${fontSize * OFFSCREEN_SCALE * -0.025}px`;
      offCtx.fillStyle = '#ffffff';
      offCtx.textBaseline = 'alphabetic';
      offCtx.textAlign = 'left';

      const metrics = offCtx.measureText(TEXT);
      const normalizedWidth = metrics.width / OFFSCREEN_SCALE;
      const textX =
        ((rect.width - normalizedWidth) / 2 + rect.width * HORIZONTAL_OFFSET_RATIO) *
        OFFSCREEN_SCALE;
      const baselineY =
        ((rect.height +
          metrics.actualBoundingBoxAscent / OFFSCREEN_SCALE -
          metrics.actualBoundingBoxDescent / OFFSCREEN_SCALE) /
          2 +
          rect.height * VERTICAL_OFFSET_RATIO) *
        OFFSCREEN_SCALE;

      offCtx.fillText(TEXT, textX, baselineY);

      const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      const data = imageData.data;
      const dots: Dot[] = [];

      for (let y = 0; y < rect.height; y += DOT_SPACING) {
        for (let x = 0; x < rect.width; x += DOT_SPACING) {
          const sx = Math.min(offCanvas.width - 1, Math.floor(x * OFFSCREEN_SCALE));
          const sy = Math.min(offCanvas.height - 1, Math.floor(y * OFFSCREEN_SCALE));
          const pixelIndex = (sy * offCanvas.width + sx) * 4;
          const alpha = data[pixelIndex + 3];

          if (alpha && alpha >= ALPHA_THRESHOLD) {
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
      isActiveRef.current = true;
      startAnimationLoop();
    };

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

        dot.vx += (dot.originalX - dot.x) * SPRING_STRENGTH;
        dot.vy += (dot.originalY - dot.y) * SPRING_STRENGTH;

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
            const tangentX = -dirY * TANGENTIAL_FACTOR;
            const tangentY = dirX * TANGENTIAL_FACTOR;

            dot.vx += dirX * force + tangentX * falloff;
            dot.vy += dirY * force + tangentY * falloff;
          }
        }

        dot.vx *= DAMPING;
        dot.vy *= DAMPING;

        const newX = dot.x + dot.vx;
        const newY = dot.y + dot.vy;

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

        if (Math.abs(dot.vx) > 0.01 || Math.abs(dot.vy) > 0.01 || offsetDist > 0.1) {
          hasMovement = true;
        }
      }

      if (!hasMovement && !mouse.active) {
        isActiveRef.current = false;
      }
    };

    const renderDots = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = TEXT_COLOR;

      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        if (!dot) continue;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    };

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

    void renderWordmark();

    const handleResize = () => {
      stopAnimationLoop();
      void renderWordmark();
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
      style={{
        backgroundColor: '#000000',
        height: '520px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        className='block cursor-default'
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: '#000',
        }}
      />
    </section>
  );
};

FooterLogoCanvas.displayName = 'FooterLogoCanvas';

/* -----------------------------------------------------------------------------------------------*/

export { FooterLogoCanvas };
