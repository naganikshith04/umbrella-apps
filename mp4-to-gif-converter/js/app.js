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
    // MP4 to GIF Converter - Main Application Logic
    
    let selectedFile = null;
    let convertedGifBlob = null;
    
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeBtn = document.getElementById('removeBtn');
    const optionsSection = document.getElementById('optionsSection');
    const convertBtn = document.getElementById('convertBtn');
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const resultSection = document.getElementById('resultSection');
    const gifPreview = document.getElementById('gifPreview');
    const downloadBtn = document.getElementById('downloadBtn');
    const newConversionBtn = document.getElementById('newConversionBtn');
    const fpsInput = document.getElementById('fps');
    const fpsValue = document.getElementById('fpsValue');
    const qualitySelect = document.getElementById('quality');
    const widthInput = document.getElementById('width');
    const loopCheckbox = document.getElementById('loop');
    
    // Event Listeners
    uploadArea.addEventListener('click', () => fileInput.click());
    browseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type === 'video/mp4') {
        handleFileSelect(files[0]);
      } else {
        alert('Please select a valid MP4 file');
      }
    });
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });
    
    removeBtn.addEventListener('click', () => {
      selectedFile = null;
      fileInput.value = '';
      fileInfo.style.display = 'none';
      uploadArea.style.display = 'flex';
      optionsSection.style.display = 'none';
      resultSection.style.display = 'none';
    });
    
    fpsInput.addEventListener('input', (e) => {
      fpsValue.textContent = e.target.value;
    });
    
    convertBtn.addEventListener('click', startConversion);
    downloadBtn.addEventListener('click', downloadGif);
    newConversionBtn.addEventListener('click', resetConverter);
    
    // Functions
    function handleFileSelect(file) {
      if (file.type !== 'video/mp4') {
        alert('Please select a valid MP4 file');
        return;
      }
    
      selectedFile = file;
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
      
      uploadArea.style.display = 'none';
      fileInfo.style.display = 'flex';
      optionsSection.style.display = 'block';
      resultSection.style.display = 'none';
    }
    
    function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    async function startConversion() {
      if (!selectedFile) return;
    
      // Show progress section
      optionsSection.style.display = 'none';
      progressSection.style.display = 'block';
      resultSection.style.display = 'none';
    
      try {
        // Get conversion options
        const options = {
          fps: parseInt(fpsInput.value),
          quality: qualitySelect.value,
          width: parseInt(widthInput.value),
          loop: loopCheckbox.checked
        };
    
        // Simulate conversion process (in real implementation, use FFmpeg.js or similar)
        await simulateConversion(options);
    
        // Show result
        progressSection.style.display = 'none';
        resultSection.style.display = 'block';
    
      } catch (error) {
        console.error('Conversion error:', error);
        alert('An error occurred during conversion. Please try again.');
        progressSection.style.display = 'none';
        optionsSection.style.display = 'block';
      }
    }
    
    async function simulateConversion(options) {
      // This is a simulation. In a real implementation, you would use FFmpeg.js or a backend service
      
      return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Create a placeholder GIF (in real implementation, this would be the actual converted GIF)
            createPlaceholderGif();
            
            progressFill.style.width = '100%';
            progressText.textContent = 'Converting... 100%';
            
            setTimeout(resolve, 500);
          } else {
            progressFill.style.width = progress + '%';
            progressText.textContent = `Converting... ${Math.round(progress)}%`;
          }
        }, 200);
      });
    }
    
    function createPlaceholderGif() {
      // Create a canvas to generate a placeholder GIF preview
      const canvas = document.createElement('canvas');
      canvas.width = parseInt(widthInput.value);
      canvas.height = Math.round(canvas.width * 9 / 16); // 16:9 aspect ratio
      
      const ctx = canvas.getContext('2d');
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GIF Preview', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '16px Arial';
      ctx.fillText('(Demo Mode)', canvas.width / 2, canvas.height / 2 + 20);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        convertedGifBlob = blob;
        gifPreview.src = URL.createObjectURL(blob);
      }, 'image/png');
    }
    
    function downloadGif() {
      if (!convertedGifBlob) return;
    
      const url = URL.createObjectURL(convertedGifBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name.replace('.mp4', '.gif');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    function resetConverter() {
      selectedFile = null;
      convertedGifBlob = null;
      fileInput.value = '';
      
      fileInfo.style.display = 'none';
      uploadArea.style.display = 'flex';
      optionsSection.style.display = 'none';
      progressSection.style.display = 'none';
      resultSection.style.display = 'none';
      
      // Reset options to defaults
      fpsInput.value = 15;
      fpsValue.textContent = '15';
      qualitySelect.value = 'medium';
      widthInput.value = 480;
      loopCheckbox.checked = true;
      
      progressFill.style.width = '0%';
      progressText.textContent = 'Converting... 0%';
    }
    
    // Initialize
    console.log('MP4 to GIF Converter initialized');
    
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
