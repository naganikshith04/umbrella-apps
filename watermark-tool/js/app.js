// State management
const state = {
    images: [],
    watermarkType: 'text',
    watermarkText: 'Watermark',
    watermarkImage: null,
    position: 'bottom-right',
    opacity: 0.5,
    fontSize: 36,
    textColor: '#ffffff',
    currentPreviewIndex: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupEventListeners();
    updateUI();
});

// Setup event listeners
function setupEventListeners() {
    const uploadZone = document.getElementById('uploadZone');
    const imageInput = document.getElementById('imageInput');
    const watermarkImageInput = document.getElementById('watermarkImageInput');
    const watermarkText = document.getElementById('watermarkText');
    const opacity = document.getElementById('opacity');
    const fontSize = document.getElementById('fontSize');
    const textColor = document.getElementById('textColor');
    const applyWatermark = document.getElementById('applyWatermark');
    const downloadAll = document.getElementById('downloadAll');
    const downloadSingle = document.getElementById('downloadSingle');

    // Upload zone drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    uploadZone.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    watermarkImageInput.addEventListener('change', (e) => {
        handleWatermarkImage(e.target.files[0]);
    });

    watermarkText.addEventListener('input', (e) => {
        state.watermarkText = e.target.value;
        saveToLocalStorage();
        updatePreviews();
    });

    opacity.addEventListener('input', (e) => {
        state.opacity = parseFloat(e.target.value);
        document.getElementById('opacityValue').textContent = Math.round(state.opacity * 100) + '%';
        saveToLocalStorage();
        updatePreviews();
    });

    fontSize.addEventListener('input', (e) => {
        state.fontSize = parseInt(e.target.value);
        document.getElementById('fontSizeValue').textContent = state.fontSize + 'px';
        saveToLocalStorage();
        updatePreviews();
    });

    textColor.addEventListener('input', (e) => {
        state.textColor = e.target.value;
        saveToLocalStorage();
        updatePreviews();
    });

    // Watermark type radio buttons
    document.querySelectorAll('input[name="watermarkType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.watermarkType = e.target.value;
            saveToLocalStorage();
            updateUI();
            updatePreviews();
        });
    });

    // Position radio buttons
    document.querySelectorAll('input[name="position"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.position = e.target.value;
            saveToLocalStorage();
            updatePreviews();
        });
    });

    applyWatermark.addEventListener('click', applyWatermarkToAll);
    downloadAll.addEventListener('click', downloadAllImages);
    downloadSingle.addEventListener('click', downloadSingleImage);
}

// Handle uploaded files
function handleFiles(files) {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));

    if (validFiles.length === 0) {
        showNotification('Please upload valid image files', 'error');
        return;
    }

    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                state.images.push({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    original: e.target.result,
                    watermarked: null,
                    width: img.width,
                    height: img.height
                });
                saveToLocalStorage();
                renderPreviews();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Handle watermark image
function handleWatermarkImage(file) {
    if (!file || !file.type.startsWith('image/')) {
        showNotification('Please upload a valid image file', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.watermarkImage = {
                data: e.target.result,
                width: img.width,
                height: img.height
            };
            saveToLocalStorage();
            updatePreviews();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Render preview grid
function renderPreviews() {
    const previewGrid = document.getElementById('previewGrid');
    previewGrid.innerHTML = '';

    if (state.images.length === 0) {
        previewGrid.innerHTML = '<p class="no-images">No images uploaded yet</p>';
        return;
    }

    state.images.forEach((image, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${image.watermarked || image.original}" alt="${image.name}">
            <div class="preview-info">
                <span class="preview-name">${image.name}</span>
                <button class="btn-remove" data-index="${index}">×</button>
            </div>
        `;
        
        previewItem.querySelector('img').addEventListener('click', () => {
            state.currentPreviewIndex = index;
            updateUI();
        });

        previewItem.querySelector('.btn-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            removeImage(index);
        });

        previewGrid.appendChild(previewItem);
    });

    updateUI();
}

// Remove image
function removeImage(index) {
    state.images.splice(index, 1);
    if (state.currentPreviewIndex === index) {
        state.currentPreviewIndex = null;
    } else if (state.currentPreviewIndex > index) {
        state.currentPreviewIndex--;
    }
    saveToLocalStorage();
    renderPreviews();
}

// Apply watermark to single image
async function applyWatermarkToImage(image) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0);
            
            if (state.watermarkType === 'text' && state.watermarkText) {
                drawTextWatermark(ctx, canvas.width, canvas.height);
            } else if (state.watermarkType === 'image' && state.watermarkImage) {
                drawImageWatermark(ctx, canvas.width, canvas.height);
            }
            
            resolve(canvas.toDataURL('image/png'));
        };
        img.src = image.original;
    });
}

// Draw text watermark
function drawTextWatermark(ctx, width, height) {
    ctx.save();
    ctx.globalAlpha = state.opacity;
    ctx.font = `${state.fontSize}px Arial`;
    ctx.fillStyle = state.textColor;
    
    const metrics = ctx.measureText(state.watermarkText);
    const textWidth = metrics.width;
    const textHeight = state.fontSize;
    const padding = 20;
    
    let x, y;
    
    switch (state.position) {
        case 'top-left':
            x = padding;
            y = padding + textHeight;
            break;
        case 'top-center':
            x = (width - textWidth) / 2;
            y = padding + textHeight;
            break;
        case 'top-right':
            x = width - textWidth - padding;
            y = padding + textHeight;
            break;
        case 'center':
            x = (width - textWidth) / 2;
            y = (height + textHeight) / 2;
            break;
        case 'bottom-left':
            x = padding;
            y = height - padding;
            break;
        case 'bottom-center':
            x = (width - textWidth) / 2;
            y = height - padding;
            break;
        case 'bottom-right':
            x = width - textWidth - padding;
            y = height - padding;
            break;
    }
    
    ctx.fillText(state.watermarkText, x, y);
    ctx.restore();
}

// Draw image watermark
function drawImageWatermark(ctx, width, height) {
    const img = new Image();
    img.onload = () => {
        ctx.save();
        ctx.globalAlpha = state.opacity;
        
        const maxSize = Math.min(width, height) * 0.3;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        const wmWidth = img.width * scale;
        const wmHeight = img.height * scale;
        const padding = 20;
        
        let x, y;
        
        switch (state.position) {
            case 'top-left':
                x = padding;
                y = padding;
                break;
            case 'top-center':
                x = (width - wmWidth) / 2;
                y = padding;
                break;
            case 'top-right':
                x = width - wmWidth - padding;
                y = padding;
                break;
            case 'center':
                x = (width - wmWidth) / 2;
                y = (height - wmHeight) / 2;
                break;
            case 'bottom-left':
                x = padding;
                y = height - wmHeight - padding;
                break;
            case 'bottom-center':
                x = (width - wmWidth) / 2;
                y = height - wmHeight - padding;
                break;
            case 'bottom-right':
                x = width - wmWidth - padding;
                y = height - wmHeight - padding;
                break;
        }
        
        ctx.drawImage(img, x, y, wmWidth, wmHeight);
        ctx.restore();
    };
    img.src = state.watermarkImage.data;
}

// Apply watermark to all images
async function applyWatermarkToAll() {
    if (state.images.length === 0) {
        showNotification('No images to watermark', 'error');
        return;
    }

    if (state.watermarkType === 'text' && !state.watermarkText) {
        showNotification('Please enter watermark text', 'error');
        return;
    }

    if (state.watermarkType === 'image' && !state.watermarkImage) {
        showNotification('Please upload a watermark image', 'error');
        return;
    }

    const applyBtn = document.getElementById('applyWatermark');
    applyBtn.disabled = true;
    applyBtn.textContent = 'Processing...';

    try {
        for (let i = 0; i < state.images.length; i++) {
            state.images[i].watermarked = await applyWatermarkToImage(state.images[i]);
        }
        
        saveToLocalStorage();
        renderPreviews();
        showNotification('Watermarks applied successfully!', 'success');
    } catch (error) {
        showNotification('Error applying watermarks', 'error');
        console.error(error);
    } finally {
        applyBtn.disabled = false;
        applyBtn.textContent = 'Apply Watermark';
    }
}

// Update previews in real-time
async function updatePreviews() {
    if (state.images.length === 0) return;
    
    for (let i = 0; i < state.images.length; i++) {
        if (state.watermarkType === 'text' && state.watermarkText) {
            state.images[i].watermarked = await applyWatermarkToImage(state.images[i]);
        } else if (state.watermarkType === 'image' && state.watermarkImage) {
            state.images[i].watermarked = await applyWatermarkToImage(state.images[i]);
        }
    }
    
    renderPreviews();
}

// Download single image
function downloadSingleImage() {
    if (state.currentPreviewIndex === null) {
        showNotification('Please select an image to download', 'error');
        return;
    }

    const image = state.images[state.currentPreviewIndex];
    const dataUrl = image.watermarked || image.original;
    
    const link = document.createElement('a');
    link.download = `watermarked_${image.name}`;
    link.href = dataUrl;
    link.click();
    
    showNotification('Image downloaded successfully!', 'success');
}

// Download all images
async function downloadAllImages() {
    if (state.images.length === 0) {
        showNotification('No images to download', 'error');
        return;
    }

    const downloadBtn = document.getElementById('downloadAll');
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Preparing...';

    try {
        if (state.images.length === 1) {
            downloadSingleImage();
        } else {
            const zip = new JSZip();
            
            state.images.forEach((image, index) => {
                const dataUrl = image.watermarked || image.original;
                const base64Data = dataUrl.split(',')[1];
                zip.file(`watermarked_${image.name}`, base64Data, { base64: true });
            });
            
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'watermarked_images.zip');
            showNotification('Images downloaded successfully!', 'success');
        }
    } catch (error) {
        showNotification('Error downloading images', 'error');
        console.error(error);
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download All';
    }
}

// Update UI
function updateUI() {
    const textOptions = document.querySelector('.text-options');
    const imageOptions = document.querySelector('.image-options');
    
    if (textOptions) {
        textOptions.style.display = state.watermarkType === 'text' ? 'block' : 'none';
    }
    
    if (imageOptions) {
        imageOptions.style.display = state.watermarkType === 'image' ? 'block' : 'none';
    }

    const downloadSingle = document.getElementById('downloadSingle');
    if (downloadSingle) {
        downloadSingle.disabled = state.currentPreviewIndex === null;
    }

    const downloadAll = document.getElementById('downloadAll');
    if (downloadAll) {
        downloadAll.disabled = state.images.length === 0;
    }

    const applyWatermark = document.getElementById('applyWatermark');
    if (applyWatermark) {
        applyWatermark.disabled = state.images.length === 0;
    }

    // Update preview selection
    document.querySelectorAll('.preview-item').forEach((item, index) => {
        if (index === state.currentPreviewIndex) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// LocalStorage functions
function saveToLocalStorage() {
    try {
        const stateToSave = {
            watermarkType: state.watermarkType,
            watermarkText: state.watermarkText,
            watermarkImage: state.watermarkImage,
            position: state.position,
            opacity: state.opacity,
            fontSize: state.fontSize,
            textColor: state.textColor
        };
        localStorage.setItem('watermarkToolState', JSON.stringify(stateToSave));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('watermarkToolState');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(state, parsed);
            
            // Update form values
            const watermarkText = document.getElementById('watermarkText');
            if (watermarkText) watermarkText.value = state.watermarkText;
            
            const opacity = document.getElementById('opacity');
            if (opacity) {
                opacity.value = state.opacity;
                document.getElementById('opacityValue').textContent = Math.round(state.opacity * 100) + '%';
            }
            
            const fontSize = document.getElementById('fontSize');
            if (fontSize) {
                fontSize.value = state.fontSize;
                document.getElementById('fontSizeValue').textContent = state.fontSize + 'px';
            }
            
            const textColor = document.getElementById('textColor');
            if (textColor) textColor.value = state.textColor;
            
            const typeRadio = document.querySelector(`input[name="watermarkType"][value="${state.watermarkType}"]`);
            if (typeRadio) typeRadio.checked = true;
            
            const positionRadio = document.querySelector(`input[name="position"][value="${state.position}"]`);
            if (positionRadio) positionRadio.checked = true;
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .notification-success {
        background-color: #4caf50;
    }
    
    .notification-error {
        background-color: #f44336;
    }
    
    .notification-info {
        background-color: #2196f3;
    }
    
    .preview-item {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .preview-item.selected {
        border: 3px solid #2196f3;
        box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
    }
    
    .preview-item:hover {
        transform: scale(1.05);
    }
    
    .no-images {
        text-align: center;
        color: #999;
        padding: 40px;
        grid-column: 1 / -1;
    }
    
    .dragover {
        background-color: #e3f2fd !important;
        border-color: #2196f3 !important;
    }
    
    .btn-remove {
        background: #f44336;
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .btn-remove:hover {
        background: #d32f2f;
    }
    
    .preview-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        background: rgba(0,0,0,0.7);
        color: white;
    }
    
    .preview-name {
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
    }
`;
document.head.appendChild(style);