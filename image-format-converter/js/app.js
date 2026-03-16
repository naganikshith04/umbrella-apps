// Image Format Converter
const state = {
    images: [],
    convertedImages: []
};

// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadZone = document.getElementById('uploadZone');
const imageGrid = document.getElementById('imageGrid');
const imageCardTemplate = document.getElementById('imageCardTemplate');
const outputFormat = document.getElementById('outputFormat');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const convertButton = document.getElementById('convertButton');
const clearButton = document.getElementById('clearButton');
const downloadButton = document.getElementById('downloadButton');
const imageCount = document.getElementById('imageCount');
const previewSection = document.getElementById('previewSection');

// Initialize
function init() {
    setupEventListeners();
    updateUI();
}

// Event Listeners
function setupEventListeners() {
    uploadButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);
    
    qualitySlider.addEventListener('input', handleQualityChange);
    convertButton.addEventListener('click', handleConvert);
    clearButton.addEventListener('click', handleClear);
    downloadButton.addEventListener('click', handleDownload);
}

// File Upload Handlers
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

// Process Files
function processFiles(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        showError('Please select valid image files');
        return;
    }
    
    imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const imageData = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    originalFormat: file.type.split('/')[1],
                    size: file.size,
                    dataUrl: e.target.result,
                    width: img.width,
                    height: img.height,
                    converted: null
                };
                state.images.push(imageData);
                updateUI();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Quality Slider Handler
function handleQualityChange(e) {
    qualityValue.textContent = `${e.target.value}%`;
}

// Convert Images
async function handleConvert() {
    if (state.images.length === 0) {
        showError('Please upload images first');
        return;
    }
    
    const format = outputFormat.value;
    const quality = parseInt(qualitySlider.value) / 100;
    
    convertButton.disabled = true;
    convertButton.textContent = 'Converting...';
    
    state.convertedImages = [];
    
    for (let i = 0; i < state.images.length; i++) {
        const imageData = state.images[i];
        
        try {
            const converted = await convertImage(imageData, format, quality);
            state.images[i].converted = converted;
            state.convertedImages.push(converted);
        } catch (error) {
            console.error('Conversion error:', error);
            showError(`Failed to convert ${imageData.name}`);
        }
        
        updateUI();
    }
    
    convertButton.disabled = false;
    convertButton.textContent = 'Convert Images';
    
    if (state.convertedImages.length > 0) {
        showSuccess(`Successfully converted ${state.convertedImages.length} image(s)`);
    }
}

// Convert Single Image
function convertImage(imageData, format, quality) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            let mimeType;
            switch (format) {
                case 'jpg':
                case 'jpeg':
                    mimeType = 'image/jpeg';
                    break;
                case 'png':
                    mimeType = 'image/png';
                    break;
                case 'webp':
                    mimeType = 'image/webp';
                    break;
                case 'gif':
                    mimeType = 'image/gif';
                    break;
                default:
                    mimeType = 'image/png';
            }
            
            const dataUrl = canvas.toBlob((blob) => {
                if (blob) {
                    const newName = imageData.name.replace(/\.[^/.]+$/, `.${format}`);
                    resolve({
                        name: newName,
                        format: format,
                        dataUrl: URL.createObjectURL(blob),
                        blob: blob,
                        size: blob.size
                    });
                } else {
                    reject(new Error('Failed to convert image'));
                }
            }, mimeType, quality);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageData.dataUrl;
    });
}

// Clear All
function handleClear() {
    if (confirm('Are you sure you want to clear all images?')) {
        state.images = [];
        state.convertedImages = [];
        fileInput.value = '';
        updateUI();
    }
}

// Download as ZIP
async function handleDownload() {
    if (state.convertedImages.length === 0) {
        showError('Please convert images first');
        return;
    }
    
    downloadButton.disabled = true;
    downloadButton.textContent = 'Creating ZIP...';
    
    try {
        const zip = new JSZip();
        
        for (const converted of state.convertedImages) {
            zip.file(converted.name, converted.blob);
        }
        
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `converted-images-${Date.now()}.zip`);
        
        showSuccess('ZIP file downloaded successfully');
    } catch (error) {
        console.error('ZIP creation error:', error);
        showError('Failed to create ZIP file');
    }
    
    downloadButton.disabled = false;
    downloadButton.textContent = 'Download as ZIP';
}

// Update UI
function updateUI() {
    // Update image count
    imageCount.textContent = `${state.images.length} image(s)`;
    
    // Show/hide preview section
    if (state.images.length > 0) {
        previewSection.style.display = 'block';
    } else {
        previewSection.style.display = 'none';
    }
    
    // Clear grid
    imageGrid.innerHTML = '';
    
    // Render image cards
    state.images.forEach((imageData, index) => {
        const card = createImageCard(imageData, index);
        imageGrid.appendChild(card);
    });
    
    // Update button states
    convertButton.disabled = state.images.length === 0;
    clearButton.disabled = state.images.length === 0;
    downloadButton.disabled = state.convertedImages.length === 0;
}

// Create Image Card
function createImageCard(imageData, index) {
    const card = document.createElement('div');
    card.className = 'image-card';
    
    const originalPreview = document.createElement('div');
    originalPreview.className = 'image-preview';
    
    const originalImg = document.createElement('img');
    originalImg.src = imageData.dataUrl;
    originalImg.alt = imageData.name;
    
    const originalLabel = document.createElement('div');
    originalLabel.className = 'image-label';
    originalLabel.textContent = 'Original';
    
    originalPreview.appendChild(originalImg);
    originalPreview.appendChild(originalLabel);
    
    const info = document.createElement('div');
    info.className = 'image-info';
    info.innerHTML = `
        <div class="image-name">${imageData.name}</div>
        <div class="image-details">
            ${imageData.width} × ${imageData.height} • ${formatFileSize(imageData.size)}
        </div>
    `;
    
    card.appendChild(originalPreview);
    card.appendChild(info);
    
    if (imageData.converted) {
        const convertedPreview = document.createElement('div');
        convertedPreview.className = 'image-preview converted';
        
        const convertedImg = document.createElement('img');
        convertedImg.src = imageData.converted.dataUrl;
        convertedImg.alt = imageData.converted.name;
        
        const convertedLabel = document.createElement('div');
        convertedLabel.className = 'image-label';
        convertedLabel.textContent = 'Converted';
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-single-btn';
        downloadBtn.innerHTML = '⬇ Download';
        downloadBtn.onclick = () => downloadSingle(imageData.converted);
        
        convertedPreview.appendChild(convertedImg);
        convertedPreview.appendChild(convertedLabel);
        convertedPreview.appendChild(downloadBtn);
        
        const convertedInfo = document.createElement('div');
        convertedInfo.className = 'image-info converted-info';
        convertedInfo.innerHTML = `
            <div class="image-name">${imageData.converted.name}</div>
            <div class="image-details">
                ${imageData.converted.format.toUpperCase()} • ${formatFileSize(imageData.converted.size)}
            </div>
        `;
        
        card.appendChild(convertedPreview);
        card.appendChild(convertedInfo);
    }
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '×';
    removeBtn.title = 'Remove image';
    removeBtn.onclick = () => removeImage(imageData.id);
    
    card.appendChild(removeBtn);
    
    return card;
}

// Download Single Image
function downloadSingle(converted) {
    saveAs(converted.blob, converted.name);
}

// Remove Image
function removeImage(id) {
    state.images = state.images.filter(img => img.id !== id);
    state.convertedImages = state.images
        .filter(img => img.converted)
        .map(img => img.converted);
    updateUI();
}

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}