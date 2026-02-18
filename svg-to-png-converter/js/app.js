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
    let svgContent = null;
    let originalWidth = 0;
    let originalHeight = 0;
    
    const svgFileInput = document.getElementById('svgFile');
    const fileNameDisplay = document.getElementById('fileName');
    const previewSection = document.getElementById('previewSection');
    const svgPreview = document.getElementById('svgPreview');
    const resolutionSection = document.getElementById('resolutionSection');
    const customWidthInput = document.getElementById('customWidth');
    const customHeightInput = document.getElementById('customHeight');
    const maintainAspectCheckbox = document.getElementById('maintainAspect');
    const originalDimensionsDisplay = document.getElementById('originalDimensions');
    const convertSection = document.getElementById('convertSection');
    const convertBtn = document.getElementById('convertBtn');
    const downloadSection = document.getElementById('downloadSection');
    const canvas = document.getElementById('canvas');
    const pngPreview = document.getElementById('pngPreview');
    const downloadBtn = document.getElementById('downloadBtn');
    
    svgFileInput.addEventListener('change', handleFileSelect);
    convertBtn.addEventListener('click', convertToPNG);
    downloadBtn.addEventListener('click', downloadPNG);
    
    customWidthInput.addEventListener('input', handleWidthChange);
    customHeightInput.addEventListener('input', handleHeightChange);
    maintainAspectCheckbox.addEventListener('change', handleAspectRatioToggle);
    
    function handleFileSelect(event) {
      const file = event.target.files[0];
      
      if (!file) {
        return;
      }
    
      if (!file.type.includes('svg')) {
        alert('Please select a valid SVG file');
        return;
      }
    
      fileNameDisplay.textContent = file.name;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        svgContent = e.target.result;
        displaySVGPreview(svgContent);
      };
      reader.readAsText(file);
    }
    
    function displaySVGPreview(svgText) {
      svgPreview.innerHTML = svgText;
      
      const svgElement = svgPreview.querySelector('svg');
      
      if (svgElement) {
        const viewBox = svgElement.getAttribute('viewBox');
        let width = svgElement.getAttribute('width');
        let height = svgElement.getAttribute('height');
        
        if (viewBox) {
          const viewBoxValues = viewBox.split(/\s+|,/);
          if (!width) width = viewBoxValues[2];
          if (!height) height = viewBoxValues[3];
        }
        
        originalWidth = parseFloat(width) || 300;
        originalHeight = parseFloat(height) || 300;
        
        svgElement.style.maxWidth = '100%';
        svgElement.style.height = 'auto';
        
        originalDimensionsDisplay.textContent = `Original: ${Math.round(originalWidth)} × ${Math.round(originalHeight)} px`;
        
        previewSection.style.display = 'block';
        resolutionSection.style.display = 'block';
        convertSection.style.display = 'block';
        downloadSection.style.display = 'none';
      }
    }
    
    function handleWidthChange() {
      if (maintainAspectCheckbox.checked && customWidthInput.value) {
        const width = parseFloat(customWidthInput.value);
        const aspectRatio = originalHeight / originalWidth;
        customHeightInput.value = Math.round(width * aspectRatio);
      }
    }
    
    function handleHeightChange() {
      if (maintainAspectCheckbox.checked && customHeightInput.value) {
        const height = parseFloat(customHeightInput.value);
        const aspectRatio = originalWidth / originalHeight;
        customWidthInput.value = Math.round(height * aspectRatio);
      }
    }
    
    function handleAspectRatioToggle() {
      if (maintainAspectCheckbox.checked && customWidthInput.value) {
        handleWidthChange();
      }
    }
    
    function convertToPNG() {
      if (!svgContent) {
        alert('Please select an SVG file first');
        return;
      }
    
      const outputWidth = customWidthInput.value ? parseFloat(customWidthInput.value) : originalWidth;
      const outputHeight = customHeightInput.value ? parseFloat(customHeightInput.value) : originalHeight;
    
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.onload = function() {
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, outputWidth, outputHeight);
        
        URL.revokeObjectURL(url);
        
        const pngDataUrl = canvas.toDataURL('image/png');
        pngPreview.innerHTML = `<img src="${pngDataUrl}" alt="PNG Preview" style="max-width: 100%; height: auto; border: 1px solid #ddd;" />`;
        
        downloadSection.style.display = 'block';
        downloadSection.scrollIntoView({ behavior: 'smooth' });
      };
      
      img.onerror = function() {
        alert('Error loading SVG. Please try another file.');
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    }
    
    function downloadPNG() {
      const link = document.createElement('a');
      const fileName = fileNameDisplay.textContent.replace('.svg', '') || 'converted';
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
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
