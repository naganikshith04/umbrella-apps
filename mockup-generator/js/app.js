// State management
const state = {
    screenshot: null,
    screenshotDataUrl: null,
    scale: 1,
    positionX: 50,
    positionY: 50,
    background: '#f5f5f5',
    currentDevice: 'iphone'
};

// Device templates with screen dimensions
const deviceTemplates = {
    iphone: {
        width: 375,
        height: 812,
        frameWidth: 395,
        frameHeight: 852,
        cornerRadius: 40,
        notch: true
    },
    android: {
        width: 360,
        height: 800,
        frameWidth: 380,
        frameHeight: 840,
        cornerRadius: 30,
        notch: false
    },
    ipad: {
        width: 768,
        height: 1024,
        frameWidth: 800,
        frameHeight: 1080,
        cornerRadius: 20,
        notch: false
    },
    laptop: {
        width: 1440,
        height: 900,
        frameWidth: 1500,
        frameHeight: 980,
        cornerRadius: 10,
        notch: false
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    loadFromLocalStorage();
    setupEventListeners();
    updateMockup();
});

function initializeElements() {
    // Set initial values
    document.getElementById('scaleSlider').value = state.scale * 100;
    document.getElementById('scaleValue').textContent = `${state.scale * 100}%`;
    document.getElementById('positionX').value = state.positionX;
    document.getElementById('positionXValue').textContent = `${state.positionX}%`;
    document.getElementById('positionY').value = state.positionY;
    document.getElementById('positionYValue').textContent = `${state.positionY}%`;
    document.getElementById('customBg').value = state.background;
}

function setupEventListeners() {
    // Upload zone click
    const uploadZone = document.getElementById('uploadZone');
    const screenshotInput = document.getElementById('screenshotInput');
    
    uploadZone.addEventListener('click', () => {
        screenshotInput.click();
    });

    // Drag and drop
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
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });

    // File input change
    screenshotInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // Device template selection
    document.querySelectorAll('.device-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.device-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            state.currentDevice = option.dataset.device;
            updateMockup();
            saveToLocalStorage();
        });
    });

    // Scale slider
    const scaleSlider = document.getElementById('scaleSlider');
    scaleSlider.addEventListener('input', (e) => {
        state.scale = e.target.value / 100;
        document.getElementById('scaleValue').textContent = `${e.target.value}%`;
        updateMockup();
        saveToLocalStorage();
    });

    // Position X slider
    const positionX = document.getElementById('positionX');
    positionX.addEventListener('input', (e) => {
        state.positionX = parseFloat(e.target.value);
        document.getElementById('positionXValue').textContent = `${e.target.value}%`;
        updateMockup();
        saveToLocalStorage();
    });

    // Position Y slider
    const positionY = document.getElementById('positionY');
    positionY.addEventListener('input', (e) => {
        state.positionY = parseFloat(e.target.value);
        document.getElementById('positionYValue').textContent = `${e.target.value}%`;
        updateMockup();
        saveToLocalStorage();
    });

    // Background presets
    document.querySelectorAll('.bg-preset').forEach(preset => {
        preset.addEventListener('click', () => {
            const bg = preset.dataset.bg;
            state.background = bg;
            document.getElementById('customBg').value = bg;
            updateMockup();
            saveToLocalStorage();
        });
    });

    // Custom background color
    const customBg = document.getElementById('customBg');
    customBg.addEventListener('input', (e) => {
        state.background = e.target.value;
        updateMockup();
        saveToLocalStorage();
    });

    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', downloadMockup);
}

function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.screenshot = img;
            state.screenshotDataUrl = e.target.result;
            
            // Hide placeholder, show preview
            document.getElementById('placeholderMsg').style.display = 'none';
            document.getElementById('screenshotPreview').style.display = 'block';
            
            updateMockup();
            saveToLocalStorage();
        };
        img.onerror = () => {
            alert('Failed to load image. Please try another file.');
        };
        img.src = e.target.result;
    };
    reader.onerror = () => {
        alert('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
}

function updateMockup() {
    if (!state.screenshot) {
        return;
    }

    const canvas = document.getElementById('mockupCanvas');
    const ctx = canvas.getContext('2d');
    const deviceFrame = document.getElementById('deviceFrame');
    const device = deviceTemplates[state.currentDevice];

    // Set canvas size based on device
    const padding = 100;
    canvas.width = device.frameWidth + padding * 2;
    canvas.height = device.frameHeight + padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = state.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate device frame position (centered)
    const frameX = padding;
    const frameY = padding;

    // Draw device frame
    drawDeviceFrame(ctx, frameX, frameY, device);

    // Calculate screenshot position and size
    const screenX = frameX + (device.frameWidth - device.width) / 2;
    const screenY = frameY + (device.frameHeight - device.height) / 2;

    // Save context
    ctx.save();

    // Clip to screen area with rounded corners
    ctx.beginPath();
    roundRect(ctx, screenX, screenY, device.width, device.height, device.cornerRadius - 5);
    ctx.clip();

    // Calculate scaled dimensions
    const scaledWidth = state.screenshot.width * state.scale;
    const scaledHeight = state.screenshot.height * state.scale;

    // Calculate position based on percentage
    const offsetX = (device.width - scaledWidth) * (state.positionX / 100);
    const offsetY = (device.height - scaledHeight) * (state.positionY / 100);

    // Draw screenshot
    ctx.drawImage(
        state.screenshot,
        screenX + offsetX,
        screenY + offsetY,
        scaledWidth,
        scaledHeight
    );

    // Restore context
    ctx.restore();

    // Update device frame display
    deviceFrame.style.display = 'block';
}

function drawDeviceFrame(ctx, x, y, device) {
    // Draw frame shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    // Draw frame background
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    roundRect(ctx, x, y, device.frameWidth, device.frameHeight, device.cornerRadius);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw screen area (black background)
    const screenX = x + (device.frameWidth - device.width) / 2;
    const screenY = y + (device.frameHeight - device.height) / 2;
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    roundRect(ctx, screenX, screenY, device.width, device.height, device.cornerRadius - 5);
    ctx.fill();

    // Draw notch for iPhone
    if (device.notch && state.currentDevice === 'iphone') {
        const notchWidth = 150;
        const notchHeight = 30;
        const notchX = screenX + (device.width - notchWidth) / 2;
        const notchY = screenY;
        
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        roundRect(ctx, notchX, notchY, notchWidth, notchHeight, 15);
        ctx.fill();
    }

    // Draw home indicator for iPhone
    if (state.currentDevice === 'iphone') {
        const indicatorWidth = 120;
        const indicatorHeight = 5;
        const indicatorX = screenX + (device.width - indicatorWidth) / 2;
        const indicatorY = screenY + device.height - 15;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        roundRect(ctx, indicatorX, indicatorY, indicatorWidth, indicatorHeight, 2.5);
        ctx.fill();
    }

    // Draw laptop keyboard for laptop template
    if (state.currentDevice === 'laptop') {
        const keyboardHeight = 50;
        const keyboardY = y + device.frameHeight + 10;
        
        ctx.fillStyle = '#2a2a2a';
        ctx.beginPath();
        roundRect(ctx, x, keyboardY, device.frameWidth, keyboardHeight, 5);
        ctx.fill();
    }
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

async function downloadMockup() {
    if (!state.screenshot) {
        alert('Please upload a screenshot first.');
        return;
    }

    const downloadBtn = document.getElementById('downloadBtn');
    const originalText = downloadBtn.textContent;
    
    try {
        downloadBtn.textContent = 'Generating...';
        downloadBtn.disabled = true;

        const canvas = document.getElementById('mockupCanvas');
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
            if (blob) {
                const timestamp = new Date().getTime();
                const filename = `mockup-${state.currentDevice}-${timestamp}.png`;
                saveAs(blob, filename);
                
                downloadBtn.textContent = 'Downloaded!';
                setTimeout(() => {
                    downloadBtn.textContent = originalText;
                    downloadBtn.disabled = false;
                }, 2000);
            } else {
                throw new Error('Failed to generate image');
            }
        }, 'image/png', 1.0);
        
    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download mockup. Please try again.');
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
    }
}

function saveToLocalStorage() {
    try {
        const saveData = {
            screenshotDataUrl: state.screenshotDataUrl,
            scale: state.scale,
            positionX: state.positionX,
            positionY: state.positionY,
            background: state.background,
            currentDevice: state.currentDevice
        };
        localStorage.setItem('mockupGeneratorState', JSON.stringify(saveData));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('mockupGeneratorState');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            state.scale = data.scale || 1;
            state.positionX = data.positionX || 50;
            state.positionY = data.positionY || 50;
            state.background = data.background || '#f5f5f5';
            state.currentDevice = data.currentDevice || 'iphone';

            // Update UI
            document.getElementById('scaleSlider').value = state.scale * 100;
            document.getElementById('scaleValue').textContent = `${state.scale * 100}%`;
            document.getElementById('positionX').value = state.positionX;
            document.getElementById('positionXValue').textContent = `${state.positionX}%`;
            document.getElementById('positionY').value = state.positionY;
            document.getElementById('positionYValue').textContent = `${state.positionY}%`;
            document.getElementById('customBg').value = state.background;

            // Set active device
            document.querySelectorAll('.device-option').forEach(opt => {
                if (opt.dataset.device === state.currentDevice) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });

            // Load screenshot if exists
            if (data.screenshotDataUrl) {
                const img = new Image();
                img.onload = () => {
                    state.screenshot = img;
                    state.screenshotDataUrl = data.screenshotDataUrl;
                    document.getElementById('placeholderMsg').style.display = 'none';
                    document.getElementById('screenshotPreview').style.display = 'block';
                    updateMockup();
                };
                img.src = data.screenshotDataUrl;
            }
        }
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
    }
}

// Utility function for image validation
function validateImage(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.');
    }

    if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 10MB.');
    }

    return true;
}