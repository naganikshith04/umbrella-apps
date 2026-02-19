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
    (function() {
      'use strict';
    
      // DOM Elements
      const uploadArea = document.getElementById('uploadArea');
      const fileInput = document.getElementById('fileInput');
      const browseBtn = document.getElementById('browseBtn');
      const fileInfo = document.getElementById('fileInfo');
      const fileName = document.getElementById('fileName');
      const fileSize = document.getElementById('fileSize');
      const removeBtn = document.getElementById('removeBtn');
      const conversionSection = document.getElementById('conversionSection');
      const convertBtn = document.getElementById('convertBtn');
      const progressSection = document.getElementById('progressSection');
      const progressFill = document.getElementById('progressFill');
      const progressText = document.getElementById('progressText');
      const resultSection = document.getElementById('resultSection');
      const downloadBtn = document.getElementById('downloadBtn');
      const newConversionBtn = document.getElementById('newConversionBtn');
    
      // State
      let selectedFile = null;
      let convertedBlob = null;
    
      // Event Listeners
      uploadArea.addEventListener('click', () => fileInput.click());
      browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
      fileInput.addEventListener('change', handleFileSelect);
      removeBtn.addEventListener('click', removeFile);
      convertBtn.addEventListener('click', startConversion);
      downloadBtn.addEventListener('click', downloadFile);
      newConversionBtn.addEventListener('click', resetConverter);
    
      // Drag and Drop
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
        if (files.length > 0) {
          handleFile(files[0]);
        }
      });
    
      // Functions
      function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
          handleFile(file);
        }
      }
    
      function handleFile(file) {
        if (!file.type.startsWith('video/')) {
          alert('Please select a valid video file');
          return;
        }
    
        selectedFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        
        uploadArea.style.display = 'none';
        fileInfo.style.display = 'block';
        conversionSection.style.display = 'block';
      }
    
      function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
      }
    
      function removeFile() {
        selectedFile = null;
        fileInput.value = '';
        uploadArea.style.display = 'flex';
        fileInfo.style.display = 'none';
        conversionSection.style.display = 'none';
      }
    
      function startConversion() {
        if (!selectedFile) return;
    
        conversionSection.style.display = 'none';
        progressSection.style.display = 'block';
    
        // Simulate conversion progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(completeConversion, 500);
          }
          updateProgress(progress);
        }, 300);
      }
    
      function updateProgress(progress) {
        const roundedProgress = Math.min(Math.round(progress), 100);
        progressFill.style.width = roundedProgress + '%';
        progressText.textContent = roundedProgress + '%';
      }
    
      function completeConversion() {
        // In a real application, this would be the actual converted file
        // For demo purposes, we'll use the original file
        convertedBlob = selectedFile;
    
        progressSection.style.display = 'none';
        resultSection.style.display = 'block';
      }
    
      function downloadFile() {
        if (!convertedBlob) return;
    
        const url = URL.createObjectURL(convertedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedFile.name.replace(/\.[^/.]+$/, '') + '_converted.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    
      function resetConverter() {
        selectedFile = null;
        convertedBlob = null;
        fileInput.value = '';
        
        uploadArea.style.display = 'flex';
        fileInfo.style.display = 'none';
        conversionSection.style.display = 'none';
        progressSection.style.display = 'none';
        resultSection.style.display = 'none';
        
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
      }
    })();
    
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
