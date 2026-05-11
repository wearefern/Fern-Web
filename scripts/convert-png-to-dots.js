const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Read the SVG file
const svgPath = path.join(__dirname, '../fernnnn_exact_image.svg');
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Extract base64 PNG data
const base64Match = svgContent.match(/href="data:image\/png;base64,([^"]+)"/);
if (!base64Match) {
  console.error('No base64 PNG found in SVG');
  process.exit(1);
}

const base64Data = base64Match[1];
const imageBuffer = Buffer.from(base64Data, 'base64');

// Save PNG temporarily for processing and inspection
const tempPngPath = path.join(__dirname, 'temp_logo.png');
const rawPngPath = path.join(__dirname, 'raw_logo.png');
fs.writeFileSync(tempPngPath, imageBuffer);
fs.writeFileSync(rawPngPath, imageBuffer);
console.log('Raw PNG saved to: raw_logo.png (for visual inspection)');

async function processImage() {
  try {
    // Get image metadata
    const metadata = await sharp(tempPngPath).metadata();
    console.log('Image dimensions:', metadata.width, 'x', metadata.height);
    console.log('Channels:', metadata.channels, 'Has alpha:', metadata.hasAlpha);

    // Get raw pixel data (keep all channels to check alpha)
    const { data, info } = await sharp(tempPngPath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    console.log('Processing pixels with foreground detection...');

    const width = info.width;
    const height = info.height;
    const channels = info.channels;

    // Analyze pixel distribution first
    let minBrightness = 255, maxBrightness = 0, totalBrightness = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;
        minBrightness = Math.min(minBrightness, brightness);
        maxBrightness = Math.max(maxBrightness, brightness);
        totalBrightness += brightness;
      }
    }
    const avgBrightness = totalBrightness / (width * height);
    console.log(`Brightness range: ${minBrightness} - ${maxBrightness}, avg: ${avgBrightness.toFixed(2)}`);

    // Find where bright pixels are located
    console.log('Finding bright pixel locations...');
    let brightPixelLocations = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;
        
        if (brightness > 200) {
          brightPixelLocations.push({ x, y, brightness });
          if (brightPixelLocations.length >= 10) {
            break;
          }
        }
      }
      if (brightPixelLocations.length >= 10) break;
    }
    
    if (brightPixelLocations.length > 0) {
      console.log('Sample bright pixel locations:');
      for (const loc of brightPixelLocations.slice(0, 5)) {
        console.log(`  (${loc.x}, ${loc.y}): brightness=${loc.brightness.toFixed(2)}`);
      }
    } else {
      console.log('No bright pixels found above 200');
    }

    // Threshold parameters for foreground detection
    // Image is white text on black background - detect BRIGHT pixels
    const brightnessThreshold = 200; // Threshold based on actual bright pixel values (213-229)
    const alphaThreshold = 20; // Alpha threshold
    const gridStep = 6; // Grid step size (5-7px)
    const minCoverage = 0.30; // Minimum 30% of cell must be foreground
    const dotRadius = 1.6; // Dot radius

    console.log(`Using brightness threshold: ${brightnessThreshold} (detecting BRIGHT pixels)`);

    // Create foreground mask
    const foregroundMask = new Uint8Array(width * height);
    let foregroundPixelCount = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        
        if (metadata.hasAlpha && channels >= 4) {
          // Has alpha channel
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          const brightness = (r + g + b) / 3;
          
          const isForeground = a > alphaThreshold && brightness > 60;
          foregroundMask[y * width + x] = isForeground ? 1 : 0;
          if (isForeground) foregroundPixelCount++;
        } else {
          // No alpha channel - detect bright pixels (white logo dots on black background)
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const brightness = (r + g + b) / 3;
          
          const isForeground = brightness > brightnessThreshold;
          foregroundMask[y * width + x] = isForeground ? 1 : 0;
          if (isForeground) foregroundPixelCount++;
        }
      }
    }

    console.log(`Foreground pixels detected: ${foregroundPixelCount}`);

    // Generate mask preview for debugging
    const maskBuffer = Buffer.alloc(width * height * 3);
    for (let i = 0; i < width * height; i++) {
      const val = foregroundMask[i] === 1 ? 255 : 0;
      maskBuffer[i * 3] = val;
      maskBuffer[i * 3 + 1] = val;
      maskBuffer[i * 3 + 2] = val;
    }
    
    await sharp(maskBuffer, {
      raw: { width, height, channels: 3 }
    })
    .png()
    .toFile(path.join(__dirname, 'mask_preview.png'));
    console.log('Mask preview saved to: mask_preview.png');

    // Sample dots using grid with coverage check
    const dots = [];

    for (let y = 0; y < height; y += gridStep) {
      for (let x = 0; x < width; x += gridStep) {
        // Count foreground pixels in this grid cell
        let foregroundCount = 0;
        let totalPixels = 0;
        let sumX = 0, sumY = 0;

        for (let dy = 0; dy < gridStep && y + dy < height; dy++) {
          for (let dx = 0; dx < gridStep && x + dx < width; dx++) {
            const checkX = x + dx;
            const checkY = y + dy;
            const maskIdx = checkY * width + checkX;
            
            totalPixels++;
            if (foregroundMask[maskIdx] === 1) {
              foregroundCount++;
              sumX += checkX;
              sumY += checkY;
            }
          }
        }

        // Only place dot if sufficient coverage
        const coverage = foregroundCount / totalPixels;
        if (coverage >= minCoverage) {
          const centerX = sumX / foregroundCount;
          const centerY = sumY / foregroundCount;
          dots.push({ cx: centerX, cy: centerY, r: dotRadius });
        }
      }
    }

    console.log(`Detected ${dots.length} dots from ${foregroundPixelCount} foreground pixels`);

    // Generate SVG
    const svgWidth = metadata.width;
    const svgHeight = metadata.height;
    
    let svgOutput = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">\n`;
    
    for (const dot of dots) {
      svgOutput += `  <circle class="logo-dot" cx="${dot.cx.toFixed(2)}" cy="${dot.cy.toFixed(2)}" r="${dot.r.toFixed(2)}" fill="#ffffff" />\n`;
    }
    
    svgOutput += '</svg>';

    // Save output
    const outputPath = path.join(__dirname, '../fernnnn_dots_vector.svg');
    fs.writeFileSync(outputPath, svgOutput);
    console.log('SVG saved to:', outputPath);

    // Clean up temp file
    fs.unlinkSync(tempPngPath);

  } catch (error) {
    console.error('Error processing image:', error);
    fs.unlinkSync(tempPngPath).catch(() => {});
    process.exit(1);
  }
}

processImage();
