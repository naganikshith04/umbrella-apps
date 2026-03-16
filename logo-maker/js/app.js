// Logo Maker JavaScript

const shapes = {
  circle: '<circle cx="50" cy="50" r="40"/>',
  square: '<rect x="10" y="10" width="80" height="80" rx="5"/>',
  triangle: '<polygon points="50,10 90,90 10,90"/>',
  hexagon: '<polygon points="50,5 90,25 90,75 50,95 10,75 10,25"/>',
  star: '<polygon points="50,5 61,35 92,35 67,55 78,85 50,65 22,85 33,55 8,35 39,35"/>',
  diamond: '<polygon points="50,10 90,50 50,90 10,50"/>',
  heart: '<path d="M50,85 C50,85 15,60 15,40 C15,25 25,15 35,15 C42,15 48,20 50,25 C52,20 58,15 65,15 C75,15 85,25 85,40 C85,60 50,85 50,85 Z"/>',
  bolt: '<polygon points="55,5 30,50 45,50 40,95 75,40 60,40 70,5"/>',
  rocket: '<path d="M50,10 L60,40 L70,40 L70,70 L60,80 L40,80 L30,70 L30,40 L40,40 Z M35,50 L30,55 L30,60 L35,60 Z M65,50 L70,55 L70,60 L65,60 Z"/>',
  cloud: '<path d="M75,50 C75,45 72,40 67,38 C67,30 60,23 50,23 C40,23 33,30 33,38 C28,40 25,45 25,50 C25,57 30,63 37,63 L63,63 C70,63 75,57 75,50 Z"/>'
};

let currentConfig = {
  shape: 'circle',
  iconColor: '#3b82f6',
  bgColor: '#ffffff',
  textColor: '#1f2937',
  companyName: 'Company',
  tagline: 'Your tagline here',
  showTagline: false,
  fontFamily: 'Arial',
  fontSize: 32
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  createShapeButtons();
  attachEventListeners();
  updateLogo();
  generateVariations();
});

// Create shape selection buttons
function createShapeButtons() {
  const container = document.querySelector('.shape-grid');
  if (!container) return;

  Object.keys(shapes).forEach(shape => {
    const button = document.createElement('button');
    button.className = 'shape-btn';
    button.dataset.shape = shape;
    button.innerHTML = `
      <svg viewBox="0 0 100 100" width="40" height="40">
        ${shapes[shape]}
      </svg>
      <span>${shape.charAt(0).toUpperCase() + shape.slice(1)}</span>
    `;
    button.addEventListener('click', () => selectShape(shape));
    container.appendChild(button);
  });

  // Set initial active state
  updateActiveShape();
}

// Select shape
function selectShape(shape) {
  currentConfig.shape = shape;
  updateActiveShape();
  updateLogo();
  generateVariations();
  saveToStorage();
}

// Update active shape button
function updateActiveShape() {
  document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.shape === currentConfig.shape);
  });
}

// Attach event listeners
function attachEventListeners() {
  const iconColor = document.getElementById('iconColor');
  const bgColor = document.getElementById('bgColor');
  const textColor = document.getElementById('textColor');
  const companyName = document.getElementById('companyName');
  const taglineText = document.getElementById('taglineText');
  const showTagline = document.getElementById('showTagline');
  const fontFamily = document.getElementById('fontFamily');
  const fontSize = document.getElementById('fontSize');
  const fontSizeValue = document.getElementById('fontSizeValue');
  const downloadPNG = document.getElementById('downloadPNG');
  const downloadSVG = document.getElementById('downloadSVG');

  if (iconColor) {
    iconColor.value = currentConfig.iconColor;
    iconColor.addEventListener('input', (e) => {
      currentConfig.iconColor = e.target.value;
      updateLogo();
      generateVariations();
      saveToStorage();
    });
  }

  if (bgColor) {
    bgColor.value = currentConfig.bgColor;
    bgColor.addEventListener('input', (e) => {
      currentConfig.bgColor = e.target.value;
      updateLogo();
      generateVariations();
      saveToStorage();
    });
  }

  if (textColor) {
    textColor.value = currentConfig.textColor;
    textColor.addEventListener('input', (e) => {
      currentConfig.textColor = e.target.value;
      updateLogo();
      generateVariations();
      saveToStorage();
    });
  }

  if (companyName) {
    companyName.value = currentConfig.companyName;
    companyName.addEventListener('input', (e) => {
      currentConfig.companyName = e.target.value || 'Company';
      updateLogo();
      generateVariations();
      saveToStorage();
    });
  }

  if (taglineText) {
    taglineText.value = currentConfig.tagline;
    taglineText.addEventListener('input', (e) => {
      currentConfig.tagline = e.target.value || 'Your tagline here';
      updateLogo();
      generateVariations();
      saveToStorage();
    });
  }

  if (showTagline) {
    showTagline.checked = currentConfig.showTagline;
    showTagline.addEventListener('change', (e) => {
      currentConfig.showTagline = e.target.checked;
      updateLogo();
      generateVariations();
      saveToStorage();
    });
  }

  if (fontFamily) {
    fontFamily.value = currentConfig.fontFamily;
    fontFamily.addEventListener('change', (e) => {
      currentConfig.fontFamily = e.target.value;
      updateLogo();
      generateVariations();
      saveToStorage();
    });
  }

  if (fontSize) {
    fontSize.value = currentConfig.fontSize;
    fontSize.addEventListener('input', (e) => {
      currentConfig.fontSize = parseInt(e.target.value);
      if (fontSizeValue) fontSizeValue.textContent = e.target.value;
      updateLogo();
      generateVariations();
      saveToStorage();
    });
  }

  if (downloadPNG) {
    downloadPNG.addEventListener('click', () => downloadAsPNG());
  }

  if (downloadSVG) {
    downloadSVG.addEventListener('click', () => downloadAsSVG());
  }
}

// Update logo preview
function updateLogo() {
  const logoPreview = document.getElementById('logoPreview');
  const logoIcon = document.getElementById('logoIcon');
  const logoCompanyName = document.getElementById('logoCompanyName');
  const logoTagline = document.getElementById('logoTagline');

  if (!logoPreview) return;

  // Update background
  logoPreview.style.backgroundColor = currentConfig.bgColor;

  // Update icon
  if (logoIcon) {
    logoIcon.innerHTML = `
      <svg viewBox="0 0 100 100" width="80" height="80">
        <g fill="${currentConfig.iconColor}">
          ${shapes[currentConfig.shape]}
        </g>
      </svg>
    `;
  }

  // Update company name
  if (logoCompanyName) {
    logoCompanyName.textContent = currentConfig.companyName;
    logoCompanyName.style.color = currentConfig.textColor;
    logoCompanyName.style.fontFamily = currentConfig.fontFamily;
    logoCompanyName.style.fontSize = currentConfig.fontSize + 'px';
  }

  // Update tagline
  if (logoTagline) {
    logoTagline.textContent = currentConfig.tagline;
    logoTagline.style.color = currentConfig.textColor;
    logoTagline.style.fontFamily = currentConfig.fontFamily;
    logoTagline.style.display = currentConfig.showTagline ? 'block' : 'none';
  }
}

// Generate variations
function generateVariations() {
  const variationsGrid = document.getElementById('variationsGrid');
  if (!variationsGrid) return;

  variationsGrid.innerHTML = '';

  const colorSchemes = [
    { icon: '#3b82f6', bg: '#ffffff', text: '#1f2937', name: 'Classic Blue' },
    { icon: '#ef4444', bg: '#ffffff', text: '#1f2937', name: 'Bold Red' },
    { icon: '#10b981', bg: '#ffffff', text: '#1f2937', name: 'Fresh Green' },
    { icon: '#f59e0b', bg: '#1f2937', text: '#ffffff', name: 'Dark Mode' },
    { icon: '#8b5cf6', bg: '#faf5ff', text: '#581c87', name: 'Purple Dream' },
    { icon: '#ec4899', bg: '#fdf2f8', text: '#831843', name: 'Pink Elegance' }
  ];

  colorSchemes.forEach(scheme => {
    const variation = document.createElement('div');
    variation.className = 'variation-card';
    variation.innerHTML = `
      <div class="variation-preview" style="background-color: ${scheme.bg}">
        <svg viewBox="0 0 100 100" width="50" height="50">
          <g fill="${scheme.icon}">
            ${shapes[currentConfig.shape]}
          </g>
        </svg>
        <div style="color: ${scheme.text}; font-family: ${currentConfig.fontFamily}; font-size: 18px; font-weight: bold; margin-top: 8px;">
          ${currentConfig.companyName}
        </div>
      </div>
      <div class="variation-name">${scheme.name}</div>
    `;
    
    variation.addEventListener('click', () => {
      currentConfig.iconColor = scheme.icon;
      currentConfig.bgColor = scheme.bg;
      currentConfig.textColor = scheme.text;
      
      document.getElementById('iconColor').value = scheme.icon;
      document.getElementById('bgColor').value = scheme.bg;
      document.getElementById('textColor').value = scheme.text;
      
      updateLogo();
      saveToStorage();
    });
    
    variationsGrid.appendChild(variation);
  });
}

// Download as PNG
async function downloadAsPNG() {
  const logoPreview = document.getElementById('logoPreview');
  if (!logoPreview) return;

  try {
    const canvas = await html2canvas(logoPreview, {
      backgroundColor: currentConfig.bgColor,
      scale: 3,
      width: 400,
      height: 400
    });

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${sanitizeFilename(currentConfig.companyName)}-logo.png`);
      }
    });
  } catch (error) {
    console.error('Error generating PNG:', error);
    alert('Failed to generate PNG. Please try again.');
  }
}

// Download as SVG
function downloadAsSVG() {
  const svg = createSVGLogo();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  saveAs(blob, `${sanitizeFilename(currentConfig.companyName)}-logo.svg`);
}

// Create SVG logo
function createSVGLogo() {
  const width = 400;
  const height = 400;
  const iconSize = 100;
  const iconY = currentConfig.showTagline ? 120 : 140;
  const nameY = iconY + iconSize + 30;
  const taglineY = nameY + 30;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${currentConfig.bgColor}"/>
  <g transform="translate(${width/2 - 50}, ${iconY})">
    <g fill="${currentConfig.iconColor}">
      ${shapes[currentConfig.shape]}
    </g>
  </g>
  <text x="${width/2}" y="${nameY}" font-family="${currentConfig.fontFamily}" font-size="${currentConfig.fontSize}" fill="${currentConfig.textColor}" text-anchor="middle" font-weight="bold">
    ${escapeXml(currentConfig.companyName)}
  </text>`;

  if (currentConfig.showTagline) {
    svg += `
  <text x="${width/2}" y="${taglineY}" font-family="${currentConfig.fontFamily}" font-size="${Math.floor(currentConfig.fontSize * 0.5)}" fill="${currentConfig.textColor}" text-anchor="middle" opacity="0.7">
    ${escapeXml(currentConfig.tagline)}
  </text>`;
  }

  svg += `
</svg>`;

  return svg;
}

// Sanitize filename
function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

// Escape XML characters
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Save to localStorage
function saveToStorage() {
  try {
    localStorage.setItem('logoMakerConfig', JSON.stringify(currentConfig));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Load from localStorage
function loadFromStorage() {
  try {
    const saved = localStorage.getItem('logoMakerConfig');
    if (saved) {
      const parsed = JSON.parse(saved);
      currentConfig = { ...currentConfig, ...parsed };
      
      // Update form inputs
      const iconColor = document.getElementById('iconColor');
      const bgColor = document.getElementById('bgColor');
      const textColor = document.getElementById('textColor');
      const companyName = document.getElementById('companyName');
      const taglineText = document.getElementById('taglineText');
      const showTagline = document.getElementById('showTagline');
      const fontFamily = document.getElementById('fontFamily');
      const fontSize = document.getElementById('fontSize');
      const fontSizeValue = document.getElementById('fontSizeValue');
      
      if (iconColor) iconColor.value = currentConfig.iconColor;
      if (bgColor) bgColor.value = currentConfig.bgColor;
      if (textColor) textColor.value = currentConfig.textColor;
      if (companyName) companyName.value = currentConfig.companyName;
      if (taglineText) taglineText.value = currentConfig.tagline;
      if (showTagline) showTagline.checked = currentConfig.showTagline;
      if (fontFamily) fontFamily.value = currentConfig.fontFamily;
      if (fontSize) fontSize.value = currentConfig.fontSize;
      if (fontSizeValue) fontSizeValue.textContent = currentConfig.fontSize;
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
}