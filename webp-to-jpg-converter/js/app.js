// Base JavaScript Template
// Add your app-specific logic here

// Utility Functions
const utils = {
    // Format numbers with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Copy text to clipboard
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    },
    
    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    // Validate input
    validateInput(value, type = 'text') {
        if (!value || value.trim() === '') {
            return { valid: false, message: 'This field is required' };
        }
        
        if (type === 'number') {
            const num = parseFloat(value);
            if (isNaN(num)) {
                return { valid: false, message: 'Please enter a valid number' };
            }
            if (num < 0) {
                return { valid: false, message: 'Please enter a positive number' };
            }
        }
        
        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return { valid: false, message: 'Please enter a valid email' };
            }
        }
        
        return { valid: true };
    }
};

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    
    // Add your app initialization code here
    initApp();
});

// Main app initialization function
function initApp() {
    // This is where your specific app logic goes
    console.log('Ready to add app-specific functionality');

    // Generated app logic
    let originalImage = null;
    let convertedDataUrl = null;
    let originalWidth = 0;
    let originalHeight = 0;
    let isUpdatingDimensions = false;
    
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const qualityInput = document.getElementById('quality');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const maintainAspectRatioCheckbox = document.getElementById('maintainAspectRatio');
    const originalCanvas = document.getElementById('originalCanvas');
    const convertedCanvas = document.getElementById('convertedCanvas');
    const originalInfo = document.getElementById('originalInfo');
    const convertedInfo = document.getElementById('convertedInfo');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const status = document.getElementById('status');
    
    // File input handler
    fileInput.addEventListener('change', handleFileSelect);
    
    function handleFileSelect(e) {
      const file = e.target.files[0];
      
      if (!file) return;
      
      if (!file.type.includes('webp')) {
        showStatus('Please select a WebP file', 'error');
        return;
      }
      
      fileName.textContent = file.name;
      
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          originalImage = img;
          originalWidth = img.width;
          originalHeight = img.height;
          
          // Set default dimensions
          widthInput.placeholder = `Original: ${originalWidth}`;
          heightInput.placeholder = `Original: ${originalHeight}`;
          
          displayOriginalImage();
          convertBtn.disabled = false;
          showStatus('File loaded successfully', 'success');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
    
    // Display original image
    function displayOriginalImage() {
      const maxDisplaySize = 400;
      let displayWidth = originalWidth;
      let displayHeight = originalHeight;
      
      if (displayWidth > maxDisplaySize || displayHeight > maxDisplaySize) {
        const ratio = Math.min(maxDisplaySize / displayWidth, maxDisplaySize / displayHeight);
        displayWidth = displayWidth * ratio;
        displayHeight = displayHeight * ratio;
      }
      
      originalCanvas.width = displayWidth;
      originalCanvas.height = displayHeight;
      
      const ctx = originalCanvas.getContext('2d');
      ctx.drawImage(originalImage, 0, 0, displayWidth, displayHeight);
      
      originalInfo.textContent = `${originalWidth} × ${originalHeight} px`;
    }
    
    // Maintain aspect ratio logic
    widthInput.addEventListener('input', function() {
      if (isUpdatingDimensions) return;
      
      if (maintainAspectRatioCheckbox.checked && originalImage && this.value) {
        isUpdatingDimensions = true;
        const newWidth = parseInt(this.value);
        const aspectRatio = originalWidth / originalHeight;
        const newHeight = Math.round(newWidth / aspectRatio);
        heightInput.value = newHeight;
        isUpdatingDimensions = false;
      }
    });
    
    heightInput.addEventListener('input', function() {
      if (isUpdatingDimensions) return;
      
      if (maintainAspectRatioCheckbox.checked && originalImage && this.value) {
        isUpdatingDimensions = true;
        const newHeight = parseInt(this.value);
        const aspectRatio = originalWidth / originalHeight;
        const newWidth = Math.round(newHeight * aspectRatio);
        widthInput.value = newWidth;
        isUpdatingDimensions = false;
      }
    });
    
    // Convert button handler
    convertBtn.addEventListener('click', convertToJPG);
    
    function convertToJPG() {
      if (!originalImage) return;
      
      const quality = parseInt(qualityInput.value) / 100;
      let targetWidth = parseInt(widthInput.value) || originalWidth;
      let targetHeight = parseInt(heightInput.value) || originalHeight;
      
      // Validate quality
      if (quality < 0.01 || quality > 1) {
        showStatus('Quality must be between 1 and 100', 'error');
        return;
      }
      
      // Set canvas dimensions
      convertedCanvas.width = targetWidth;
      convertedCanvas.height = targetHeight;
      
      // Draw and convert
      const ctx = convertedCanvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF'; // White background for JPG
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(originalImage, 0, 0, targetWidth, targetHeight);
      
      // Convert to JPG
      convertedDataUrl = convertedCanvas.toDataURL('image/jpeg', quality);
      
      // Display converted image (scaled for preview if needed)
      const maxDisplaySize = 400;
      let displayWidth = targetWidth;
      let displayHeight = targetHeight;
      
      if (displayWidth > maxDisplaySize || displayHeight > maxDisplaySize) {
        const ratio = Math.min(maxDisplaySize / displayWidth, maxDisplaySize / displayHeight);
        displayWidth = displayWidth * ratio;
        displayHeight = displayHeight * ratio;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = displayWidth;
        tempCanvas.height = displayHeight;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(convertedCanvas, 0, 0, displayWidth, displayHeight);
        
        convertedCanvas.width = displayWidth;
        convertedCanvas.height = displayHeight;
        const displayCtx = convertedCanvas.getContext('2d');
        displayCtx.drawImage(tempCanvas, 0, 0);
      }
      
      convertedInfo.textContent = `${targetWidth} × ${targetHeight} px | Quality: ${qualityInput.value}%`;
      
      downloadBtn.disabled = false;
      showStatus('Conversion successful!', 'success');
    }
    
    // Download button handler
    downloadBtn.addEventListener('click', downloadJPG);
    
    function downloadJPG() {
      if (!convertedDataUrl) return;
      
      const link = document.createElement('a');
      const originalFileName = fileInput.files[0].name.replace('.webp', '');
      link.download = `${originalFileName}_converted.jpg`;
      link.href = convertedDataUrl;
      link.click();
      
      showStatus('Download started!', 'success');
    }
    
    // Status message helper
    function showStatus(message, type) {
      status.textContent = message;
      status.className = `status-message ${type}`;
      status.style.display = 'block';
      
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    }
    
    // Example: Add event listeners to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add button click handlers here
        });
    });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
