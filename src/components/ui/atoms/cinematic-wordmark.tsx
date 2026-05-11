'use client';

import { useEffect, useRef } from 'react';

/* -------------------------------------------------------------------------------------------------
 * Cinematic Wordmark - Giant dot-matrix "fernnn."
 * Luxury editorial-tech aesthetic
 * -----------------------------------------------------------------------------------------------*/

interface Dot {
  x: number;
  y: number;
}

interface CinematicWordmarkProps {
  className?: string;
  style?: React.CSSProperties;
}

const DOT_RADIUS = 1.5;
const DOT_SPACING = 4;
const TARGET_WIDTH_RATIO = 0.98; // 98% canvas width
const EDITORIAL_OFFSET_RATIO = 0.008; // 0.8% tiny editorial offset
const VERTICAL_SHIFT_RATIO = 0.05; // 5% downward
const ALPHA_THRESHOLD = 200; // Clean edge detection

/* -----------------------------------------------------------------------------------------------*/

const CinematicWordmark = ({ className, style }: CinematicWordmarkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const TEXT = 'fernnn.';

    const renderWordmark = async () => {
      // Ensure Albert Sans font is loaded
      await document.fonts.ready;

      // Try to load Albert Sans specifically if available
      try {
        const albertSansFont = new FontFace(
          'Albert Sans',
          'local("Albert Sans")',
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

      // Create offscreen canvas for text rendering
      const offCanvas = document.createElement('canvas');
      offCanvas.width = rect.width;
      offCanvas.height = rect.height;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      // Calculate optimal font size for 98% canvas width
      const targetWidth = rect.width * TARGET_WIDTH_RATIO;
      let fontSize = 100;
      let textWidth = 0;

      // Binary search for perfect font size
      let minSize = 50;
      let maxSize = 1000;

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

      // Set final font configuration
      offCtx.font = `900 ${fontSize}px "Albert Sans", "Inter", system-ui, sans-serif`;
      offCtx.fillStyle = 'white';
      offCtx.textBaseline = 'alphabetic';
      offCtx.textAlign = 'left';

      // Get precise text metrics for perfect centering
      const metrics = offCtx.measureText(TEXT);

      // Horizontal centering with tiny editorial offset
      let textX = (rect.width - textWidth) / 2;
      textX -= rect.width * EDITORIAL_OFFSET_RATIO;

      // Vertical centering with slight downward shift for visual balance
      let textY =
        (rect.height +
          metrics.actualBoundingBoxAscent -
          metrics.actualBoundingBoxDescent) /
        2;
      textY += rect.height * VERTICAL_SHIFT_RATIO;

      // Clear and render text to offscreen canvas
      offCtx.clearRect(0, 0, rect.width, rect.height);
      offCtx.fillText(TEXT, textX, textY);

      // Sample pixels and convert to dot matrix
      const imageData = offCtx.getImageData(0, 0, rect.width, rect.height);
      const data = imageData.data;
      const dots: Dot[] = [];

      // Create dots from text pixels on perfect grid
      for (let y = 0; y < rect.height; y += DOT_SPACING) {
        for (let x = 0; x < rect.width; x += DOT_SPACING) {
          const pixelIndex = (Math.floor(y) * rect.width + Math.floor(x)) * 4;
          const alpha = data[pixelIndex + 3];

          // Only create dots from solid text pixels
          if (alpha && alpha > ALPHA_THRESHOLD) {
            dots.push({ x, y });
          }
        }
      }

      dotsRef.current = dots;

      // Debug information
      // eslint-disable-next-line no-console
      console.log('[CinematicWordmark]', {
        canvasWidth: rect.width,
        canvasHeight: rect.height,
        dotCount: dots.length,
        fontSize,
        textWidth: Math.round(textWidth),
        targetWidth: Math.round(targetWidth),
        textX: Math.round(textX),
        textY: Math.round(textY),
      });

      // Render the final dot matrix
      renderDots();
    };

    const renderDots = () => {
      const rect = canvas.getBoundingClientRect();

      // Clear canvas with pure black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Render all dots with refined white
      ctx.fillStyle = '#F5F5F5';

      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        if (!dot) continue;

        // Draw perfect circular dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Initial render with delay for font loading
    setTimeout(renderWordmark, 150);

    // Handle window resize
    const handleResize = () => {
      setTimeout(renderWordmark, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#000000',
        overflow: 'hidden',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};

CinematicWordmark.displayName = 'CinematicWordmark';

/* -----------------------------------------------------------------------------------------------*/

export { CinematicWordmark };
