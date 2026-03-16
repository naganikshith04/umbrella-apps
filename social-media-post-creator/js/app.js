// Social Media Post Creator JavaScript

// Platform templates with dimensions
const platformTemplates = {
  instagram: { width: 1080, height: 1080, name: 'Instagram Post (1:1)' },
  instagramStory: { width: 1080, height: 1920, name: 'Instagram Story' },
  facebook: { width: 1200, height: 630, name: 'Facebook Post' },
  twitter: { width: 1200, height: 675, name: 'Twitter Post' },
  linkedin: { width: 1200, height: 627, name: 'LinkedIn Post' },
  pinterest: { width: 1000, height: 1500, name: 'Pinterest Pin' }
};

// Filter presets
const filterPresets = {
  none: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, blur: 0 },
  vintage: { brightness: 110, contrast: 90, saturate: 80, grayscale: 0, sepia: 30, blur: 0 },
  blackwhite: { brightness: 100, contrast: 110, saturate: 0, grayscale: 100, sepia: 0, blur: 0 },
  bright: { brightness: 120, contrast: 105, saturate: 110, grayscale: 0, sepia: 0, blur: 0 },
  dramatic: { brightness: 90, contrast: 130, saturate: 120, grayscale: 0, sepia: 0, blur: 0 },
  soft: { brightness: 105, contrast: 95, saturate: 90, grayscale: 0, sepia: 0, blur: 1 }
};

// State management
const state = {
  currentPlatform: 'instagram',
  backgroundImage: null,
  elements: [],
  currentFilter: 'none',
  scale: 1,
  isDragging: false,
  dragElement: null,
  dragOffset: { x: 0, y: 0 },
  history: [],
  historyIndex: -1
};

// Initialize application
function init() {
  setupPlatformButtons();
  setupImageUpload();
  setupTextControls();
  setupFilterControls();
  setupShapeControls();
  setupStickerControls();
  setupCanvasInteraction();
  setupDownload();
  setupClearCanvas();
  setupDevicePreview();
  setupUndoRedo();
  
  // Set initial platform
  setPlatform('instagram');
  
  // Load saved state
  loadState();
}

// Setup platform selection buttons
function setupPlatformButtons() {
  const platformContainer = document.querySelector('.platform-buttons');
  if (!platformContainer) return;
  
  Object.keys(platformTemplates).forEach(platform => {
    const button = document.createElement('button');
    button.className = 'platform-btn';
    button.dataset.platform = platform;
    button.textContent = platformTemplates[platform].name;
    button.addEventListener('click', () => setPlatform(platform));
    platformContainer.appendChild(button);
  });
}

// Set platform template
function setPlatform(platform) {
  state.currentPlatform = platform;
  const template = platformTemplates[platform];
  
  const canvas = document.getElementById('designCanvas');
  const container = document.getElementById('canvasContainer');
  
  if (!canvas || !container) return;
  
  // Update canvas dimensions
  canvas.style.width = `${template.width}px`;
  canvas.style.height = `${template.height}px`;
  
  // Calculate scale to fit container
  const containerWidth = container.clientWidth - 40;
  const containerHeight = container.clientHeight - 40;
  const scaleX = containerWidth / template.width;
  const scaleY = containerHeight / template.height;
  state.scale = Math.min(scaleX, scaleY, 1);
  
  canvas.style.transform = `scale(${state.scale})`;
  
  // Update active button
  document.querySelectorAll('.platform-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.platform === platform);
  });
  
  saveState();
  renderCanvas();
}

// Setup image upload
function setupImageUpload() {
  const imageUpload = document.getElementById('imageUpload');
  if (!imageUpload) return;
  
  imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        state.backgroundImage = event.target.result;
        addToHistory();
        renderCanvas();
        saveState();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
  
  // Drag and drop support
  const canvas = document.getElementById('designCanvas');
  if (canvas) {
    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      canvas.classList.add('drag-over');
    });
    
    canvas.addEventListener('dragleave', () => {
      canvas.classList.remove('drag-over');
    });
    
    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      canvas.classList.remove('drag-over');
      
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            state.backgroundImage = event.target.result;
            addToHistory();
            renderCanvas();
            saveState();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Setup text controls
function setupTextControls() {
  const postText = document.getElementById('postText');
  const textColor = document.getElementById('textColor');
  const fontSize = document.getElementById('fontSize');
  const fontFamily = document.getElementById('fontFamily');
  const addTextBtn = document.querySelector('[data-action="add-text"]');
  
  if (addTextBtn) {
    addTextBtn.addEventListener('click', () => {
      const text = postText?.value.trim() || 'Sample Text';
      const color = textColor?.value || '#ffffff';
      const size = parseInt(fontSize?.value) || 32;
      const family = fontFamily?.value || 'Arial';
      
      addTextElement(text, color, size, family);
    });
  }
}

// Add text element to canvas
function addTextElement(text, color, size, family) {
  const template = platformTemplates[state.currentPlatform];
  
  const element = {
    type: 'text',
    id: Date.now(),
    text: text,
    color: color,
    fontSize: size,
    fontFamily: family,
    x: template.width / 2,
    y: template.height / 2,
    rotation: 0,
    textAlign: 'center'
  };
  
  state.elements.push(element);
  addToHistory();
  renderCanvas();
  saveState();
}

// Setup filter controls
function setupFilterControls() {
  const filterContainer = document.querySelector('.filter-buttons');
  if (!filterContainer) return;
  
  Object.keys(filterPresets).forEach(filter => {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    button.dataset.filter = filter;
    button.textContent = filter.charAt(0).toUpperCase() + filter.slice(1);
    button.addEventListener('click', () => applyFilter(filter));
    filterContainer.appendChild(button);
  });
  
  // Custom filter sliders
  const sliders = ['brightness', 'contrast', 'saturate', 'grayscale', 'sepia', 'blur'];
  sliders.forEach(slider => {
    const input = document.getElementById(slider);
    if (input) {
      input.addEventListener('input', () => {
        state.currentFilter = 'custom';
        renderCanvas();
      });
    }
  });
}

// Apply filter preset
function applyFilter(filterName) {
  state.currentFilter = filterName;
  const preset = filterPresets[filterName];
  
  if (preset) {
    Object.keys(preset).forEach(key => {
      const input = document.getElementById(key);
      if (input) {
        input.value = preset[key];
      }
    });
  }
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filterName);
  });
  
  addToHistory();
  renderCanvas();
  saveState();
}

// Get current filter values
function getCurrentFilter() {
  const brightness = document.getElementById('brightness')?.value || 100;
  const contrast = document.getElementById('contrast')?.value || 100;
  const saturate = document.getElementById('saturate')?.value || 100;
  const grayscale = document.getElementById('grayscale')?.value || 0;
  const sepia = document.getElementById('sepia')?.value || 0;
  const blur = document.getElementById('blur')?.value || 0;
  
  return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px)`;
}

// Setup shape controls
function setupShapeControls() {
  const shapeColor = document.getElementById('shapeColor');
  const shapeButtons = document.querySelectorAll('[data-shape]');
  
  shapeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const shape = btn.dataset.shape;
      const color = shapeColor?.value || '#ff0000';
      addShapeElement(shape, color);
    });
  });
}

// Add shape element to canvas
function addShapeElement(shape, color) {
  const template = platformTemplates[state.currentPlatform];
  
  const element = {
    type: 'shape',
    id: Date.now(),
    shape: shape,
    color: color,
    x: template.width / 2,
    y: template.height / 2,
    width: 100,
    height: 100,
    rotation: 0
  };
  
  state.elements.push(element);
  addToHistory();
  renderCanvas();
  saveState();
}

// Setup sticker controls
function setupStickerControls() {
  const stickers = ['😀', '❤️', '⭐', '🎉', '🔥', '👍', '✨', '🎨', '📸', '💡'];
  const stickerContainer = document.querySelector('.sticker-buttons');
  
  if (stickerContainer) {
    stickers.forEach(sticker => {
      const button = document.createElement('button');
      button.className = 'sticker-btn';
      button.textContent = sticker;
      button.addEventListener('click', () => addStickerElement(sticker));
      stickerContainer.appendChild(button);
    });
  }
}

// Add sticker element to canvas
function addStickerElement(emoji) {
  const template = platformTemplates[state.currentPlatform];
  
  const element = {
    type: 'sticker',
    id: Date.now(),
    emoji: emoji,
    x: template.width / 2,
    y: template.height / 2,
    size: 64,
    rotation: 0
  };
  
  state.elements.push(element);
  addToHistory();
  renderCanvas();
  saveState();
}

// Setup canvas interaction
function setupCanvasInteraction() {
  const canvas = document.getElementById('designCanvas');
  if (!canvas) return;
  
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mouseleave', handleMouseUp);
  
  // Touch support
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchmove', handleTouchMove);
  canvas.addEventListener('touchend', handleMouseUp);
}

function handleMouseDown(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / state.scale;
  const y = (e.clientY - rect.top) / state.scale;
  
  // Check if clicking on an element (reverse order to get top element)
  for (let i = state.elements.length - 1; i >= 0; i--) {
    const element = state.elements[i];
    if (isPointInElement(x, y, element)) {
      state.isDragging = true;
      state.dragElement = element;
      state.dragOffset = { x: x - element.x, y: y - element.y };
      
      // Move to top
      state.elements.splice(i, 1);
      state.elements.push(element);
      renderCanvas();
      return;
    }
  }
}

function handleMouseMove(e) {
  if (!state.isDragging || !state.dragElement) return;
  
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / state.scale;
  const y = (e.clientY - rect.top) / state.scale;
  
  state.dragElement.x = x - state.dragOffset.x;
  state.dragElement.y = y - state.dragOffset.y;
  
  renderCanvas();
}

function handleMouseUp() {
  if (state.isDragging) {
    state.isDragging = false;
    state.dragElement = null;
    addToHistory();
    saveState();
  }
}

function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  handleMouseDown({ 
    currentTarget: e.currentTarget, 
    clientX: touch.clientX, 
    clientY: touch.clientY 
  });
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  handleMouseMove({ 
    currentTarget: e.currentTarget, 
    clientX: touch.clientX, 
    clientY: touch.clientY 
  });
}

// Check if point is inside element
function isPointInElement(x, y, element) {
  if (element.type === 'text') {
    const textWidth = element.text.length * element.fontSize * 0.6;
    const textHeight = element.fontSize;
    return x >= element.x - textWidth / 2 && 
           x <= element.x + textWidth / 2 &&
           y >= element.y - textHeight / 2 && 
           y <= element.y + textHeight / 2;
  } else if (element.type === 'shape' || element.type === 'sticker') {
    const size = element.type === 'shape' ? element.width : element.size;
    return x >= element.x - size / 2 && 
           x <= element.x + size / 2 &&
           y >= element.y - size / 2 && 
           y <= element.y + size / 2;
  }
  return false;
}

// Render canvas
function renderCanvas() {
  const canvas = document.getElementById('designCanvas');
  const background = document.getElementById('canvasBackground');
  const elementsContainer = document.getElementById('canvasElements');
  
  if (!canvas || !background || !elementsContainer) return;
  
  // Apply background
  if (state.backgroundImage) {
    background.style.backgroundImage = `url(${state.backgroundImage})`;
    background.style.backgroundSize = 'cover';
    background.style.backgroundPosition = 'center';
    background.style.filter = getCurrentFilter();
  } else {
    background.style.backgroundImage = 'none';
    background.style.backgroundColor = '#f0f0f0';
    background.style.filter = 'none';
  }
  
  // Clear elements
  elementsContainer.innerHTML = '';
  
  // Render elements
  state.elements.forEach(element => {
    const el = document.createElement('div');
    el.className = 'canvas-element';
    el.dataset.id = element.id;
    el.style.position = 'absolute';
    el.style.left = `${element.x}px`;
    el.style.top = `${element.y}px`;
    el.style.transform = `translate(-50%, -50%) rotate(${element.rotation}deg)`;
    el.style.cursor = 'move';
    
    if (element.type === 'text') {
      el.style.color = element.color;
      el.style.fontSize = `${element.fontSize}px`;
      el.style.fontFamily = element.fontFamily;
      el.style.textAlign = element.textAlign;
      el.style.whiteSpace = 'nowrap';
      el.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
      el.textContent = element.text;
    } else if (element.type === 'shape') {
      el.style.width = `${element.width}px`;
      el.style.height = `${element.height}px`;
      el.style.backgroundColor = element.color;
      
      if (element.shape === 'circle') {
        el.style.borderRadius = '50%';
      } else if (element.shape === 'triangle') {
        el.style.width = '0';
        el.style.height = '0';
        el.style.backgroundColor = 'transparent';
        el.style.borderLeft = `${element.width / 2}px solid transparent`;
        el.style.borderRight = `${element.width / 2}px solid transparent`;
        el.style.borderBottom = `${element.height}px solid ${element.color}`;
      }
    } else if (element.type === 'sticker') {
      el.style.fontSize = `${element.size}px`;
      el.textContent = element.emoji;
    }
    
    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-element-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.style.position = 'absolute';
    deleteBtn.style.top = '-10px';
    deleteBtn.style.right = '-10px';
    deleteBtn.style.width = '24px';
    deleteBtn.style.height = '24px';
    deleteBtn.style.borderRadius = '50%';
    deleteBtn.style.border = 'none';
    deleteBtn.style.background = '#ff4444';
    deleteBtn.style.color = 'white';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '18px';
    deleteBtn.style.lineHeight = '1';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteElement(element.id);
    };
    el.appendChild(deleteBtn);
    
    elementsContainer.appendChild(el);
  });
}

// Delete element
function deleteElement(id) {
  state.elements = state.elements.filter(el => el.id !== id);
  addToHistory();
  renderCanvas();
  saveState();
}

// Setup download
function setupDownload() {
  const downloadBtn = document.getElementById('downloadImage');
  if (!downloadBtn) return;
  
  downloadBtn.addEventListener('click', async () => {
    const canvas = document.getElementById('designCanvas');
    if (!canvas) return;
    
    try {
      downloadBtn.disabled = true;
      downloadBtn.textContent = 'Generating...';
      
      // Use html2canvas to capture the canvas
      const canvasElement = await html2canvas(canvas, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      // Convert to blob and download
      canvasElement.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `social-post-${state.currentPlatform}-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download Image';
      }, 'image/png');
    } catch (error) {
      console.error('Download error:', error);
      alert('Error generating image. Please try again.');
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Download Image';
    }
  });
}

// Setup clear canvas
function setupClearCanvas() {
  const clearBtn = document.getElementById('clearCanvas');
  if (!clearBtn) return;
  
  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      state.backgroundImage = null;
      state.elements = [];
      state.currentFilter = 'none';
      applyFilter('none');
      addToHistory();
      renderCanvas();
      saveState();
    }
  });
}

// Setup device preview
function setupDevicePreview() {
  const previewBtn = document.querySelector('[data-action="preview"]');
  if (!previewBtn) return;
  
  previewBtn.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.flexDirection = 'column';
    
    const deviceFrame = document.createElement('div');
    deviceFrame.style.width = '375px';
    deviceFrame.style.height = '667px';
    deviceFrame.style.border = '10px solid #333';
    deviceFrame.style.borderRadius = '30px';
    deviceFrame.style.overflow = 'hidden';
    deviceFrame.style.backgroundColor = 'white';
    
    const canvas = document.getElementById('designCanvas');
    const clone = canvas.cloneNode(true);
    clone.style.width = '100%';
    clone.style.height = '100%';
    clone.style.objectFit = 'contain';
    clone.style.transform = 'none';
    
    deviceFrame.appendChild(clone);
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close Preview';
    closeBtn.style.marginTop = '20px';
    closeBtn.style.padding = '10px 20px';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => modal.remove();
    
    modal.appendChild(deviceFrame);
    modal.appendChild(closeBtn);
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
  });
}

// History management
function addToHistory() {
  const snapshot = {
    backgroundImage: state.backgroundImage,
    elements: JSON.parse(JSON.stringify(state.elements)),
    currentFilter: state.currentFilter
  };
  
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(snapshot);
  state.historyIndex++;
  
  if (state.history.length > 50) {
    state.history.shift();
    state.historyIndex--;
  }
}

function setupUndoRedo() {
  const undoBtn = document.querySelector('[data-action="undo"]');
  const redoBtn = document.querySelector('[data-action="redo"]');
  
  if (undoBtn) {
    undoBtn.addEventListener('click', () => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        restoreFromHistory();
      }
    });
  }
  
  if (redoBtn) {
    redoBtn.addEventListener('click', () => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        restoreFromHistory();
      }
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undoBtn?.click();
      } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
        e.preventDefault();
        redoBtn?.click();
      }
    }
  });
}

function restoreFromHistory() {
  const snapshot = state.history[state.historyIndex];
  if (snapshot) {
    state.backgroundImage = snapshot.backgroundImage;
    state.elements = JSON.parse(JSON.stringify(snapshot.elements));
    state.currentFilter = snapshot.currentFilter;
    renderCanvas();
    saveState();
  }
}

// State persistence
function saveState() {
  try {
    const saveData = {
      currentPlatform: state.currentPlatform,
      backgroundImage: state.backgroundImage,
      elements: state.elements,
      currentFilter: state.currentFilter
    };
    localStorage.setItem('socialMediaPostState', JSON.stringify(saveData));
  } catch (error) {
    console.error('Error saving state:', error);
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem('socialMediaPostState');
    if (saved) {
      const data = JSON.parse(saved);
      state.currentPlatform = data.currentPlatform || 'instagram';
      state.backgroundImage = data.backgroundImage;
      state.elements = data.elements || [];
      state.currentFilter = data.currentFilter || 'none';
      
      setPlatform(state.currentPlatform);
      if (state.currentFilter !== 'none') {
        applyFilter(state.currentFilter);
      }
      renderCanvas();
    }
  } catch (error) {
    console.error('Error loading state:', error);
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}