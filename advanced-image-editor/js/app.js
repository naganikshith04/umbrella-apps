// Global variables
let canvas;
let originalImage = null;
let currentImage = null;
let cropMode = false;
let cropRect = null;
let filters = {
    brightness: 0,
    contrast: 0,
    saturation: 0
};
let zoomLevel = 1;
let originalImageData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    setupEventListeners();
    loadFromLocalStorage();
});

// Initialize Fabric.js canvas
function initializeCanvas() {
    canvas = new fabric.Canvas('imageCanvas', {
        backgroundColor: '#f0f0f0',
        preserveObjectStacking: true
    });
    
    // Set initial canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

// Resize canvas to fit container
function resizeCanvas() {
    const workspace = document.getElementById('editorWorkspace');
    const maxWidth = workspace.clientWidth - 40;
    const maxHeight = window.innerHeight - 300;
    
    canvas.setWidth(maxWidth);
    canvas.setHeight(maxHeight);
    canvas.renderAll();
}

// Setup event listeners
function setupEventListeners() {
    // Image upload
    document.getElementById('uploadZone').addEventListener('click', () => {
        document.getElementById('imageInput').click();
    });
    
    document.getElementById('imageInput').addEventListener('change', handleImageUpload);
    document.getElementById('newImage').addEventListener('click', () => {
        document.getElementById('imageInput').click();
    });
    
    // Drag and drop
    const uploadZone = document.getElementById('uploadZone');
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#007bff';
        uploadZone.style.backgroundColor = '#e7f3ff';
    });
    
    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#ccc';
        uploadZone.style.backgroundColor = 'transparent';
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#ccc';
        uploadZone.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    });
    
    // Filter controls
    document.getElementById('brightness').addEventListener('input', (e) => {
        filters.brightness = parseInt(e.target.value);
        document.getElementById('brightnessValue').textContent = e.target.value;
        applyFilters();
    });
    
    document.getElementById('contrast').addEventListener('input', (e) => {
        filters.contrast = parseInt(e.target.value);
        document.getElementById('contrastValue').textContent = e.target.value;
        applyFilters();
    });
    
    document.getElementById('saturation').addEventListener('input', (e) => {
        filters.saturation = parseInt(e.target.value);
        document.getElementById('saturationValue').textContent = e.target.value;
        applyFilters();
    });
    
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Crop controls
    document.getElementById('enableCrop').addEventListener('click', enableCropMode);
    document.getElementById('applyCrop').addEventListener('click', applyCrop);
    document.getElementById('cancelCrop').addEventListener('click', cancelCrop);
    document.getElementById('aspectRatio').addEventListener('change', updateCropAspectRatio);
    
    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => zoomImage(1.2));
    document.getElementById('zoomOut').addEventListener('click', () => zoomImage(0.8));
    document.getElementById('fitScreen').addEventListener('click', fitToScreen);
    
    // Export controls
    document.getElementById('exportImage').addEventListener('click', exportImage);
    document.getElementById('exportFormat').addEventListener('change', updateQualityControl);
    document.getElementById('quality').addEventListener('input', (e) => {
        document.getElementById('qualityValue').textContent = e.target.value + '%';
    });
    
    // Comparison
    document.getElementById('toggleComparison').addEventListener('click', toggleComparison);
    document.getElementById('comparisonSlider').addEventListener('input', updateComparison);
}

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
    }
}

// Handle image file
function handleImageFile(file) {
    if (!file.type.match('image.*')) {
        alert('Please select a valid image file.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        loadImage(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Load image to canvas
function loadImage(dataUrl) {
    fabric.Image.fromURL(dataUrl, (img) => {
        canvas.clear();
        
        // Store original image
        originalImage = img;
        originalImageData = dataUrl;
        
        // Scale image to fit canvas
        const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
        ) * 0.9;
        
        img.scale(scale);
        img.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            selectable: false
        });
        
        currentImage = img;
        canvas.add(img);
        canvas.renderAll();
        
        // Reset filters
        filters = { brightness: 0, contrast: 0, saturation: 0 };
        updateFilterUI();
        
        // Hide upload zone, show controls
        document.getElementById('uploadZone').style.display = 'none';
        document.querySelectorAll('.control-panel').forEach(panel => {
            panel.style.display = 'block';
        });
        
        // Reset zoom
        zoomLevel = 1;
        
        // Save to localStorage
        saveToLocalStorage();
    });
}

// Apply filters
function applyFilters() {
    if (!currentImage) return;
    
    const filters = [];
    
    // Brightness
    if (this.filters.brightness !== 0) {
        filters.push(new fabric.Image.filters.Brightness({
            brightness: this.filters.brightness / 100
        }));
    }
    
    // Contrast
    if (this.filters.contrast !== 0) {
        filters.push(new fabric.Image.filters.Contrast({
            contrast: this.filters.contrast / 100
        }));
    }
    
    // Saturation
    if (this.filters.saturation !== 0) {
        filters.push(new fabric.Image.filters.Saturation({
            saturation: this.filters.saturation / 100
        }));
    }
    
    currentImage.filters = filters;
    currentImage.applyFilters();
    canvas.renderAll();
    
    saveToLocalStorage();
}

// Reset filters
function resetFilters() {
    filters = { brightness: 0, contrast: 0, saturation: 0 };
    updateFilterUI();
    
    if (currentImage) {
        currentImage.filters = [];
        currentImage.applyFilters();
        canvas.renderAll();
    }
    
    saveToLocalStorage();
}

// Update filter UI
function updateFilterUI() {
    document.getElementById('brightness').value = filters.brightness;
    document.getElementById('brightnessValue').textContent = filters.brightness;
    document.getElementById('contrast').value = filters.contrast;
    document.getElementById('contrastValue').textContent = filters.contrast;
    document.getElementById('saturation').value = filters.saturation;
    document.getElementById('saturationValue').textContent = filters.saturation;
}

// Enable crop mode
function enableCropMode() {
    if (!currentImage) return;
    
    cropMode = true;
    currentImage.selectable = false;
    
    // Get aspect ratio
    const aspectRatio = document.getElementById('aspectRatio').value;
    let width = currentImage.width * currentImage.scaleX * 0.8;
    let height = currentImage.height * currentImage.scaleY * 0.8;
    
    if (aspectRatio !== 'free') {
        const [w, h] = aspectRatio.split(':').map(Number);
        const ratio = w / h;
        if (width / height > ratio) {
            width = height * ratio;
        } else {
            height = width / ratio;
        }
    }
    
    // Create crop rectangle
    cropRect = new fabric.Rect({
        left: canvas.width / 2 - width / 2,
        top: canvas.height / 2 - height / 2,
        width: width,
        height: height,
        fill: 'rgba(0, 0, 0, 0.3)',
        stroke: '#fff',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: true,
        lockRotation: true
    });
    
    canvas.add(cropRect);
    canvas.setActiveObject(cropRect);
    canvas.renderAll();
    
    // Show crop buttons
    document.getElementById('applyCrop').style.display = 'inline-block';
    document.getElementById('cancelCrop').style.display = 'inline-block';
    document.getElementById('enableCrop').style.display = 'none';
}

// Update crop aspect ratio
function updateCropAspectRatio() {
    if (cropRect) {
        cancelCrop();
        enableCropMode();
    }
}

// Apply crop
function applyCrop() {
    if (!cropRect || !currentImage) return;
    
    const cropX = cropRect.left - currentImage.left + currentImage.width * currentImage.scaleX / 2;
    const cropY = cropRect.top - currentImage.top + currentImage.height * currentImage.scaleY / 2;
    const cropWidth = cropRect.width * cropRect.scaleX;
    const cropHeight = cropRect.height * cropRect.scaleY;
    
    // Create temporary canvas for cropping
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = cropWidth / currentImage.scaleX;
    tempCanvas.height = cropHeight / currentImage.scaleY;
    
    // Get image element
    const imgElement = currentImage.getElement();
    
    tempCtx.drawImage(
        imgElement,
        cropX / currentImage.scaleX,
        cropY / currentImage.scaleY,
        tempCanvas.width,
        tempCanvas.height,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
    );
    
    // Load cropped image
    const croppedDataUrl = tempCanvas.toDataURL();
    loadImage(croppedDataUrl);
    
    cancelCrop();
}

// Cancel crop
function cancelCrop() {
    cropMode = false;
    
    if (cropRect) {
        canvas.remove(cropRect);
        cropRect = null;
    }
    
    if (currentImage) {
        currentImage.selectable = false;
    }
    
    canvas.renderAll();
    
    document.getElementById('applyCrop').style.display = 'none';
    document.getElementById('cancelCrop').style.display = 'none';
    document.getElementById('enableCrop').style.display = 'inline-block';
}

// Zoom image
function zoomImage(factor) {
    if (!currentImage) return;
    
    zoomLevel *= factor;
    zoomLevel = Math.max(0.1, Math.min(zoomLevel, 5));
    
    const newScale = currentImage.scaleX * factor;
    currentImage.scale(newScale);
    canvas.renderAll();
}

// Fit to screen
function fitToScreen() {
    if (!currentImage) return;
    
    const scale = Math.min(
        canvas.width / currentImage.width,
        canvas.height / currentImage.height
    ) * 0.9;
    
    currentImage.scale(scale);
    currentImage.set({
        left: canvas.width / 2,
        top: canvas.height / 2
    });
    
    zoomLevel = 1;
    canvas.renderAll();
}

// Toggle comparison
function toggleComparison() {
    const overlay = document.getElementById('comparisonOverlay');
    
    if (overlay.style.display === 'none' || !overlay.style.display) {
        if (!originalImageData) {
            alert('No original image to compare.');
            return;
        }
        
        // Show comparison
        overlay.style.display = 'flex';
        
        // Setup original canvas
        const originalCanvas = document.getElementById('originalCanvas');
        const ctx = originalCanvas.getContext('2d');
        
        const img = new Image();
        img.onload = () => {
            originalCanvas.width = img.width;
            originalCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = originalImageData;
        
        // Reset slider
        document.getElementById('comparisonSlider').value = 50;
        updateComparison();
    } else {
        overlay.style.display = 'none';
    }
}

// Update comparison
function updateComparison() {
    const slider = document.getElementById('comparisonSlider');
    const value = slider.value;
    
    const originalCanvas = document.getElementById('originalCanvas');
    const editedCanvas = document.getElementById('imageCanvas');
    
    originalCanvas.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    editedCanvas.style.clipPath = `inset(0 0 0 ${value}%)`;
}

// Update quality control visibility
function updateQualityControl() {
    const format = document.getElementById('exportFormat').value;
    const qualityControl = document.getElementById('qualityControl');
    
    if (format === 'jpeg' || format === 'webp') {
        qualityControl.style.display = 'block';
    } else {
        qualityControl.style.display = 'none';
    }
}

// Export image
function exportImage() {
    if (!canvas) return;
    
    const format = document.getElementById('exportFormat').value;
    const quality = parseInt(document.getElementById('quality').value) / 100;
    
    let mimeType;
    let extension;
    
    switch (format) {
        case 'png':
            mimeType = 'image/png';
            extension = 'png';
            break;
        case 'jpeg':
            mimeType = 'image/jpeg';
            extension = 'jpg';
            break;
        case 'webp':
            mimeType = 'image/webp';
            extension = 'webp';
            break;
        default:
            mimeType = 'image/png';
            extension = 'png';
    }
    
    // Create temporary canvas with only the image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (currentImage) {
        const imgWidth = currentImage.width * currentImage.scaleX;
        const imgHeight = currentImage.height * currentImage.scaleY;
        
        tempCanvas.width = imgWidth;
        tempCanvas.height = imgHeight;
        
        // Draw white background for JPEG
        if (format === 'jpeg') {
            tempCtx.fillStyle = '#ffffff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        }
        
        // Draw image
        const imgElement = currentImage.getElement();
        tempCtx.drawImage(imgElement, 0, 0, tempCanvas.width, tempCanvas.height);
    } else {
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas.getElement(), 0, 0);
    }
    
    // Convert to blob and download
    tempCanvas.toBlob((blob) => {
        saveAs(blob, `edited-image.${extension}`);
    }, mimeType, quality);
}

// Save to localStorage
function saveToLocalStorage() {
    try {
        const data = {
            image: originalImageData,
            filters: filters,
            timestamp: Date.now()
        };
        localStorage.setItem('imageEditorState', JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

// Load from localStorage
function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem('imageEditorState');
        if (data) {
            const parsed = JSON.parse(data);
            
            // Check if data is not too old (24 hours)
            if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
                if (parsed.image) {
                    loadImage(parsed.image);
                    filters = parsed.filters || { brightness: 0, contrast: 0, saturation: 0 };
                    updateFilterUI();
                    applyFilters();
                }
            }
        }
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
    }
}

// Close comparison overlay when clicking outside
document.getElementById('comparisonOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'comparisonOverlay') {
        toggleComparison();
    }
});

// Initialize quality control visibility
updateQualityControl();