const fs = require('fs');
const path = require('path');

// Read the SVG file
const svgPath = path.join(__dirname, '../fernnnn_dots_vector.svg');
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Extract circle elements (handle both with and without spaces)
const circleRegex = /<circle\s+class="logo-dot"\s+cx="([^"]+)"\s+cy="([^"]+)"\s+r="([^"]+)"\s+fill="#ffffff"\s*\/>/g;
const dots = [];
let match;

while ((match = circleRegex.exec(svgContent)) !== null) {
  dots.push({
    cx: parseFloat(match[1]),
    cy: parseFloat(match[2]),
    r: parseFloat(match[3])
  });
}

console.log(`Extracted ${dots.length} dots`);

// Save as JSON
const jsonPath = path.join(__dirname, '../fernnnn_dots.json');
fs.writeFileSync(jsonPath, JSON.stringify(dots, null, 2));
console.log('Dot positions saved to:', jsonPath);
