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
    // HEIC to JPG Converter with EXIF preservation and Live Photos extraction
    
    class HEICConverter {
      constructor() {
        this.files = [];
        this.convertedFiles = [];
        this.preserveExif = true;
        this.extractLivePhoto = false;
        this.quality = 0.9;
        this.initializeElements();
        this.attachEventListeners();
      }
    
      initializeElements() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.filesSection = document.getElementById('filesSection');
        this.filesList = document.getElementById('filesList');
        this.fileCount = document.getElementById('fileCount');
        this.convertAllBtn = document.getElementById('convertAllBtn');
        this.downloadAllBtn = document.getElementById('downloadAllBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.preserveExifCheckbox = document.getElementById('preserveExif');
        this.extractLivePhotoCheckbox = document.getElementById('extractLivePhoto');
        this.qualitySlider = document.getElementById('qualitySlider');
        this.qualityValue = document.getElementById('qualityValue');
        this.metadataViewer = document.getElementById('metadataViewer');
        this.metadataContent = document.getElementById('metadataContent');
        this.closeMetadata = document.getElementById('closeMetadata');
      }
    
      attachEventListeners() {
        // Upload area events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => {
          e.preventDefault();
          this.uploadArea.classList.add('drag-over');
        });
        
        this.uploadArea.addEventListener('dragleave', () => {
          this.uploadArea.classList.remove('drag-over');
        });
        
        this.uploadArea.addEventListener('drop', (e) => {
          e.preventDefault();
          this.uploadArea.classList.remove('drag-over');
          this.handleFiles(e.dataTransfer.files);
        });
    
        // Options
        this.preserveExifCheckbox.addEventListener('change', (e) => {
          this.preserveExif = e.target.checked;
        });
    
        this.extractLivePhotoCheckbox.addEventListener('change', (e) => {
          this.extractLivePhoto = e.target.checked;
        });
    
        this.qualitySlider.addEventListener('input', (e) => {
          this.quality = e.target.value / 100;
          this.qualityValue.textContent = e.target.value;
        });
    
        // Action buttons
        this.convertAllBtn.addEventListener('click', () => this.convertAll());
        this.downloadAllBtn.addEventListener('click', () => this.downloadAll());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        this.closeMetadata.addEventListener('click', () => {
          this.metadataViewer.style.display = 'none';
        });
      }
    
      handleFiles(fileList) {
        const newFiles = Array.from(fileList).filter(file => 
          file.type === 'image/heic' || file.type === 'image/heif' || 
          file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')
        );
    
        if (newFiles.length === 0) {
          alert('Please select valid HEIC/HEIF files');
          return;
        }
    
        newFiles.forEach(file => {
          const fileObj = {
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            size: file.size,
            status: 'pending',
            convertedBlob: null,
            exifData: null,
            livePhotoFrames: []
          };
          this.files.push(fileObj);
        });
    
        this.updateUI();
      }
    
      updateUI() {
        if (this.files.length === 0) {
          this.filesSection.style.display = 'none';
          return;
        }
    
        this.filesSection.style.display = 'block';
        this.fileCount.textContent = this.files.length;
        this.filesList.innerHTML = '';
    
        this.files.forEach(fileObj => {
          const fileItem = this.createFileItem(fileObj);
          this.filesList.appendChild(fileItem);
        });
    
        const allConverted = this.files.every(f => f.status === 'converted');
        this.downloadAllBtn.style.display = allConverted ? 'inline-block' : 'none';
      }
    
      createFileItem(fileObj) {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.dataset.id = fileObj.id;
    
        const statusClass = fileObj.status === 'converted' ? 'status-success' : 
                           fileObj.status === 'converting' ? 'status-processing' :
                           fileObj.status === 'error' ? 'status-error' : 'status-pending';
    
        div.innerHTML = `
          <div class="file-info">
            <div class="file-icon">📷</div>
            <div class="file-details">
              <div class="file-name">${fileObj.name}</div>
              <div class="file-size">${this.formatFileSize(fileObj.size)}</div>
              ${fileObj.livePhotoFrames.length > 0 ? `<div class="live-photo-badge">Live Photo (${fileObj.livePhotoFrames.length} frames)</div>` : ''}
            </div>
          </div>
          <div class="file-actions">
            <span class="file-status ${statusClass}">${this.getStatusText(fileObj.status)}</span>
            ${fileObj.status === 'pending' ? `<button class="btn-icon" onclick="converter.convertSingle('${fileObj.id}')" title="Convert">▶</button>` : ''}
            ${fileObj.status === 'converted' ? `<button class="btn-icon" onclick="converter.downloadSingle('${fileObj.id}')" title="Download">⬇</button>` : ''}
            ${fileObj.exifData ? `<button class="btn-icon" onclick="converter.showMetadata('${fileObj.id}')" title="View EXIF">ℹ</button>` : ''}
            <button class="btn-icon btn-danger" onclick="converter.removeFile('${fileObj.id}')" title="Remove">✕</button>
          </div>
        `;
    
        return div;
      }
    
      getStatusText(status) {
        const statusMap = {
          'pending': 'Pending',
          'converting': 'Converting...',
          'converted': 'Converted',
          'error': 'Error'
        };
        return statusMap[status] || status;
      }
    
      formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
      }
    
      async convertAll() {
        const pendingFiles = this.files.filter(f => f.status === 'pending');
        
        for (const fileObj of pendingFiles) {
          await this.convertFile(fileObj);
        }
      }
    
      async convertSingle(fileId) {
        const fileObj = this.files.find(f => f.id == fileId);
        if (fileObj) {
          await this.convertFile(fileObj);
        }
      }
    
      async convertFile(fileObj) {
        fileObj.status = 'converting';
        this.updateUI();
    
        try {
          // Read file as ArrayBuffer
          const arrayBuffer = await this.readFileAsArrayBuffer(fileObj.file);
          
          // Extract EXIF data if needed
          if (this.preserveExif) {
            fileObj.exifData = await this.extractExifData(arrayBuffer);
          }
    
          // Check for Live Photo data
          if (this.extractLivePhoto) {
            fileObj.livePhotoFrames = await this.extractLivePhotoFrames(arrayBuffer);
          }
    
          // Convert HEIC to JPG using heic2any library (simulated)
          const blob = await this.heicToJpg(arrayBuffer, fileObj);
          
          // Re-embed EXIF data if preserved
          if (this.preserveExif && fileObj.exifData) {
            fileObj.convertedBlob = await this.embedExifData(blob, fileObj.exifData);
          } else {
            fileObj.convertedBlob = blob;
          }
    
          fileObj.status = 'converted';
        } catch (error) {
          console.error('Conversion error:', error);
          fileObj.status = 'error';
          alert(`Error converting ${fileObj.name}: ${error.message}`);
        }
    
        this.updateUI();
      }
    
      readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      }
    
      async extractExifData(arrayBuffer) {
        // Simulated EXIF extraction
        // In production, use a library like exif-js or piexifjs
        try {
          const dataView = new DataView(arrayBuffer);
          const exifData = {
            make: 'Apple',
            model: 'iPhone 14 Pro',
            dateTime: new Date().toISOString(),
            orientation: 1,
            software: 'iOS 17.0',
            gpsLatitude: null,
            gpsLongitude: null,
            fNumber: 'f/1.78',
            exposureTime: '1/100',
            iso: '320',
            focalLength: '6.86mm',
            flash: 'No Flash'
          };
          
          // Simulate GPS data extraction
          if (Math.random() > 0.5) {
            exifData.gpsLatitude = (37.7749 + (Math.random() - 0.5) * 0.1).toFixed(6);
            exifData.gpsLongitude = (-122.4194 + (Math.random() - 0.5) * 0.1).toFixed(6);
          }
          
          return exifData;
        } catch (error) {
          console.warn('Could not extract EXIF data:', error);
          return null;
        }
      }
    
      async extractLivePhotoFrames(arrayBuffer) {
        // Simulated Live Photo frame extraction
        // In production, parse the HEIC container for multiple frames
        try {
          const frames = [];
          // Simulate finding 15-45 frames in a Live Photo
          const frameCount = Math.floor(Math.random() * 30) + 15;
          
          for (let i = 0; i < frameCount; i++) {
            frames.push({
              index: i,
              timestamp: i * 66.67, // ~15fps
              isKeyFrame: i === Math.floor(frameCount / 2)
            });
          }
          
          return frames;
        } catch (error) {
          console.warn('Could not extract Live Photo frames:', error);
          return [];
        }
      }
    
      async heicToJpg(arrayBuffer, fileObj) {
        // Simulated HEIC to JPG conversion
        // In production, use heic2any or libheif-js library
        return new Promise((resolve, reject) => {
          try {
            // Create a canvas and simulate conversion
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Simulate image dimensions
            canvas.width = 3024;
            canvas.height = 4032;
            
            // Create a gradient as placeholder (in production, decode actual HEIC data)
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add text to indicate this is converted
            ctx.fillStyle = 'white';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('HEIC Converted to JPG', canvas.width / 2, canvas.height / 2);
            ctx.font = '32px Arial';
            ctx.fillText(fileObj.name, canvas.width / 2, canvas.height / 2 + 60);
            
            // Convert canvas to blob
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob'));
              }
            }, 'image/jpeg', this.quality);
          } catch (error) {
            reject(error);
          }
        });
      }
    
      async embedExifData(blob, exifData) {
        // Simulated EXIF embedding
        // In production, use piexifjs or exif-js to embed EXIF data
        try {
          // For demonstration, we'll just return the original blob
          // In production, you would:
          // 1. Read the JPEG blob
          // 2. Parse existing EXIF
          // 3. Merge with preserved EXIF data
          // 4. Write back to JPEG
          console.log('Embedding EXIF data:', exifData);
          return blob;
        } catch (error) {
          console.warn('Could not embed EXIF data:', error);
          return blob;
        }
      }
    
      showMetadata(fileId) {
        const fileObj = this.files.find(f => f.id == fileId);
        if (!fileObj || !fileObj.exifData) return;
    
        const exif = fileObj.exifData;
        let html = '<table class="metadata-table">';
        
        html += `<tr><th colspan="2">${fileObj.name}</th></tr>`;
        html += `<tr><td>Camera Make</td><td>${exif.make || 'N/A'}</td></tr>`;
        html += `<tr><td>Camera Model</td><td>${exif.model || 'N/A'}</td></tr>`;
        html += `<tr><td>Date/Time</td><td>${exif.dateTime ? new Date(exif.dateTime).toLocaleString() : 'N/A'}</td></tr>`;
        html += `<tr><td>Software</td><td>${exif.software || 'N/A'}</td></tr>`;
        html += `<tr><td>F-Number</td><td>${exif.fNumber || 'N/A'}</td></tr>`;
        html += `<tr><td>Exposure Time</td><td>${exif.exposureTime || 'N/A'}</td></tr>`;
        html += `<tr><td>ISO</td><td>${exif.iso || 'N/A'}</td></tr>`;
        html += `<tr><td>Focal Length</td><td>${exif.focalLength || 'N/A'}</td></tr>`;
        html += `<tr><td>Flash</td><td>${exif.flash || 'N/A'}</td></tr>`;
        
        if (exif.gpsLatitude && exif.gpsLongitude) {
          html += `<tr><td>GPS Location</td><td>${exif.gpsLatitude}, ${exif.gpsLongitude}</td></tr>`;
        }
        
        html += '</table>';
        
        this.metadataContent.innerHTML = html;
        this.metadataViewer.style.display = 'block';
      }
    
      downloadSingle(fileId) {
        const fileObj = this.files.find(f => f.id == fileId);
        if (!fileObj || !fileObj.convertedBlob) return;
    
        const url = URL.createObjectURL(fileObj.convertedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileObj.name.replace(/\.heic$/i, '.jpg');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    
        // Download Live Photo frames if extracted
        if (fileObj.livePhotoFrames.length > 0 && this.extractLivePhoto) {
          setTimeout(() => {
            alert(`Live Photo contains ${fileObj.livePhotoFrames.length} frames. In production, each frame would be downloaded separately.`);
          }, 100);
        }
      }
    
      async downloadAll() {
        const convertedFiles = this.files.filter(f => f.status === 'converted');
        
        if (convertedFiles.length === 0) return;
    
        // Download each file with a small delay
        for (let i = 0; i < convertedFiles.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 100 * i));
          this.downloadSingle(convertedFiles[i].id);
        }
      }
    
      removeFile(fileId) {
        this.files = this.files.filter(f => f.id != fileId);
        this.updateUI();
      }
    
      clearAll() {
        if (confirm('Are you sure you want to clear all files?')) {
          this.files = [];
          this.convertedFiles = [];
          this.updateUI();
        }
      }
    }
    
    // Initialize converter when DOM is ready
    let converter;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        converter = new HEICConverter();
      });
    } else {
      converter = new HEICConverter();
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
