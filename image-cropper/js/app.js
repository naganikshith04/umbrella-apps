// Smart Image Cropper JavaScript

let cropper = null;
let originalImage = null;
let currentFileName = 'cropped-image.jpg';

// DOM Elements
const imageInput = document.getElementById('imageInput');
const uploadZone = document.getElementById('uploadZone');
const editorSection = document.getElementById('editorSection');
const cropImage = document.getElementById('cropImage');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const applyDimensions = document.getElementById('applyDimensions');
const cropDimensions = document.getElementById('cropDimensions');
const qualityInput = document.getElementById('qualityInput');
const qualityValue = document.getElementById('qualityValue');
const rotateLeft = document.getElementById('rotateLeft');
const rotateRight = document.getElementById('rotateRight');
const flipHorizontal = document.getElementById('flipHorizontal');
const flipVertical = document.getElementById('flipVertical');
const resetCrop = document.getElementById('resetCrop');
const downloadBtn = document.getElementById('downloadBtn');
const newImageBtn = document.getElementById('newImageBtn');

// Aspect ratio buttons
const aspectRatioButtons = document.querySelectorAll('.aspect-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadSettings();
});

function setupEventListeners() {
    // Upload handlers
    imageInput.addEventListener('change', handleImageUpload);
    uploadZone.addEventListener('click', () => imageInput.click());
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('drop', handleDrop);
    uploadZone.addEventListener('dragleave', handleDragLeave);

    // Crop controls
    aspectRatioButtons.forEach(btn => {
        btn.addEventListener('click', () => handleAspectRatio(btn));
    });

    applyDimensions.addEventListener('click', applyCustomDimensions);
    
    // Transform controls
    rotateLeft.addEventListener('click', () => cropper && cropper.rotate(-90));
    rotateRight.addEventListener('click', () => cropper && cropper.rotate(90));
    flipHorizontal.addEventListener('click', () => {
        if (cropper) {
            const scaleX = cropper.getData().scaleX || 1;
            cropper.scaleX(-scaleX);
        }
    });
    flipVertical.addEventListener('click', () => {
        if (cropper) {
            const scaleY = cropper.getData().scaleY || 1;
            cropper.scaleY(-scaleY);
        }
    });

    resetCrop.addEventListener('click', () => cropper && cropper.reset());

    // Quality slider
    qualityInput.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        saveSettings();
    });

    // Download and new image
    downloadBtn.addEventListener('click', downloadCroppedImage);
    newImageBtn.addEventListener('click', loadNewImage);

    // Dimension inputs
    widthInput.addEventListener('input', validateDimensions);
    heightInput.addEventListener('input', validateDimensions);

    // Cropper events
    if (cropImage) {
        cropImage.addEventListener('ready', updateCropDimensions);
        cropImage.addEventListener('cropend', updateCropDimensions);
        cropImage.addEventListener('zoom', updateCropDimensions);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    currentFileName = file.name.replace(/\.[^/.]+$/, '') + '-cropped.jpg';
    
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage = e.target.result;
        initializeCropper(e.target.result);
        showEditor();
    };
    reader.onerror = () => {
        alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
}

function initializeCropper(imageSrc) {
    if (cropper) {
        cropper.destroy();
    }

    cropImage.src = imageSrc;
    
    cropper = new Cropper(cropImage, {
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: NaN,
        autoCropArea: 1,
        restore: false,
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        responsive: true,
        checkOrientation: true,
        crop: updateCropDimensions
    });
}

function showEditor() {
    uploadZone.style.display = 'none';
    editorSection.style.display = 'block';
    editorSection.classList.add('fade-in');
}

function handleAspectRatio(btn) {
    aspectRatioButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const ratio = btn.dataset.ratio;
    
    if (ratio === 'free') {
        cropper.setAspectRatio(NaN);
    } else {
        const [width, height] = ratio.split(':').map(Number);
        cropper.setAspectRatio(width / height);
    }
}

function applyCustomDimensions() {
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);
    
    if (!width || !height || width <= 0 || height <= 0) {
        alert('Please enter valid dimensions');
        return;
    }

    if (width > 10000 || height > 10000) {
        alert('Dimensions must be less than 10000px');
        return;
    }

    const aspectRatio = width / height;
    
    // Deactivate preset buttons
    aspectRatioButtons.forEach(b => b.classList.remove('active'));
    
    cropper.setAspectRatio(aspectRatio);
}

function validateDimensions() {
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);
    
    if (width && height && width > 0 && height > 0) {
        applyDimensions.disabled = false;
    } else {
        applyDimensions.disabled = true;
    }
}

function updateCropDimensions() {
    if (!cropper) return;
    
    const data = cropper.getData(true);
    if (cropDimensions) {
        cropDimensions.textContent = `${Math.round(data.width)} × ${Math.round(data.height)} px`;
    }
}

function downloadCroppedImage() {
    if (!cropper) return;

    try {
        const quality = qualityInput.value / 100;
        
        const canvas = cropper.getCroppedCanvas({
            maxWidth: 4096,
            maxHeight: 4096,
            fillColor: '#fff',
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
        });

        if (!canvas) {
            alert('Error generating cropped image');
            return;
        }

        canvas.toBlob((blob) => {
            if (!blob) {
                alert('Error creating image blob');
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = currentFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showNotification('Image downloaded successfully!');
        }, 'image/jpeg', quality);
    } catch (error) {
        console.error('Download error:', error);
        alert('Error downloading image. Please try again.');
    }
}

function loadNewImage() {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    
    cropImage.src = '';
    originalImage = null;
    imageInput.value = '';
    widthInput.value = '';
    heightInput.value = '';
    
    editorSection.style.display = 'none';
    uploadZone.style.display = 'flex';
    
    aspectRatioButtons.forEach(b => b.classList.remove('active'));
    aspectRatioButtons[0].classList.add('active');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function saveSettings() {
    try {
        const settings = {
            quality: qualityInput.value
        };
        localStorage.setItem('cropperSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('cropperSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            if (settings.quality) {
                qualityInput.value = settings.quality;
                qualityValue.textContent = `${settings.quality}%`;
            }
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!cropper) return;
    
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 's':
                e.preventDefault();
                downloadCroppedImage();
                break;
            case 'z':
                e.preventDefault();
                cropper.reset();
                break;
        }
    }
    
    switch(e.key) {
        case 'ArrowLeft':
            if (e.shiftKey) cropper.rotate(-90);
            break;
        case 'ArrowRight':
            if (e.shiftKey) cropper.rotate(90);
            break;
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .fade-in {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .dragover {
        border-color: #4CAF50 !important;
        background: rgba(76, 175, 80, 0.05) !important;
    }
`;
document.head.appendChild(style);