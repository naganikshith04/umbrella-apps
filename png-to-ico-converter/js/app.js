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
    
      let uploadedFiles = [];
      let convertedBlobs = [];
      let batchPackage = {};
    
      const elements = {
        uploadArea: document.getElementById('uploadArea'),
        fileInput: document.getElementById('fileInput'),
        browseBtn: document.getElementById('browseBtn'),
        previewSection: document.getElementById('previewSection'),
        previewGrid: document.getElementById('previewGrid'),
        actionButtons: document.getElementById('actionButtons'),
        convertBtn: document.getElementById('convertBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
        downloadBatchBtn: document.getElementById('downloadBatchBtn'),
        clearBtn: document.getElementById('clearBtn'),
        batchEnabled: document.getElementById('batchEnabled'),
        batchSettings: document.getElementById('batchSettings'),
        batchPreview: document.getElementById('batchPreview'),
        fileList: document.getElementById('fileList')
      };
    
      // Event Listeners
      elements.uploadArea.addEventListener('click', () => elements.fileInput.click());
      elements.browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.fileInput.click();
      });
      elements.fileInput.addEventListener('change', handleFileSelect);
      elements.uploadArea.addEventListener('dragover', handleDragOver);
      elements.uploadArea.addEventListener('drop', handleDrop);
      elements.convertBtn.addEventListener('click', handleConvert);
      elements.downloadBtn.addEventListener('click', handleDownload);
      elements.downloadBatchBtn.addEventListener('click', handleBatchDownload);
      elements.clearBtn.addEventListener('click', clearAll);
      elements.batchEnabled.addEventListener('change', toggleBatchMode);
    
      function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        elements.uploadArea.classList.add('drag-over');
      }
    
      function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        elements.uploadArea.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'image/png');
        if (files.length > 0) {
          processFiles(files);
        }
      }
    
      function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        processFiles(files);
      }
    
      function processFiles(files) {
        uploadedFiles = files;
        displayPreviews(files);
        elements.previewSection.style.display = 'block';
        elements.actionButtons.style.display = 'flex';
        elements.downloadBtn.style.display = 'none';
        elements.downloadBatchBtn.style.display = 'none';
      }
    
      function displayPreviews(files) {
        elements.previewGrid.innerHTML = '';
        
        files.forEach((file, index) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
              <img src="${e.target.result}" alt="Preview ${index + 1}">
              <p class="file-name">${file.name}</p>
              <button class="remove-btn" data-index="${index}">×</button>
            `;
            elements.previewGrid.appendChild(previewItem);
            
            previewItem.querySelector('.remove-btn').addEventListener('click', () => removeFile(index));
          };
          reader.readAsDataURL(file);
        });
      }
    
      function removeFile(index) {
        uploadedFiles.splice(index, 1);
        if (uploadedFiles.length === 0) {
          clearAll();
        } else {
          displayPreviews(uploadedFiles);
        }
      }
    
      function toggleBatchMode() {
        const isEnabled = elements.batchEnabled.checked;
        elements.batchSettings.style.display = isEnabled ? 'block' : 'none';
        
        if (isEnabled) {
          // Disable individual size checkboxes when batch mode is on
          document.querySelectorAll('.option-group input[type="checkbox"]').forEach(cb => {
            cb.disabled = true;
          });
        } else {
          document.querySelectorAll('.option-group input[type="checkbox"]').forEach(cb => {
            cb.disabled = false;
          });
        }
      }
    
      async function handleConvert() {
        if (uploadedFiles.length === 0) return;
    
        elements.convertBtn.disabled = true;
        elements.convertBtn.textContent = 'Converting...';
    
        const isBatchMode = elements.batchEnabled.checked;
    
        if (isBatchMode) {
          await convertBatchFavicons();
        } else {
          await convertToICO();
        }
    
        elements.convertBtn.disabled = false;
        elements.convertBtn.textContent = 'Convert to ICO';
      }
    
      async function convertToICO() {
        convertedBlobs = [];
        const selectedSizes = getSelectedSizes();
    
        if (selectedSizes.length === 0) {
          alert('Please select at least one size');
          return;
        }
    
        for (const file of uploadedFiles) {
          const icoBlob = await createICO(file, selectedSizes);
          convertedBlobs.push({
            name: file.name.replace('.png', '.ico'),
            blob: icoBlob
          });
        }
    
        elements.downloadBtn.style.display = 'inline-block';
        elements.downloadBatchBtn.style.display = 'none';
      }
    
      async function convertBatchFavicons() {
        batchPackage = {};
        
        const includeAppleTouchIcon = document.getElementById('includeAppleTouchIcon').checked;
        const includeAndroidIcons = document.getElementById('includeAndroidIcons').checked;
        const includeFavicon32 = document.getElementById('includeFavicon32').checked;
        const includeFavicon16 = document.getElementById('includeFavicon16').checked;
        const generateManifest = document.getElementById('generateManifest').checked;
        const generateHTML = document.getElementById('generateHTML').checked;
    
        for (const file of uploadedFiles) {
          const baseName = file.name.replace('.png', '');
          
          // Create ICO file with standard sizes
          const icoBlob = await createICO(file, [16, 32, 48]);
          batchPackage[`${baseName}.ico`] = icoBlob;
    
          // Create individual PNG files
          if (includeFavicon16) {
            const png16 = await resizeImage(file, 16, 16);
            batchPackage[`${baseName}-16x16.png`] = png16;
          }
    
          if (includeFavicon32) {
            const png32 = await resizeImage(file, 32, 32);
            batchPackage[`${baseName}-32x32.png`] = png32;
          }
    
          if (includeAppleTouchIcon) {
            const appleTouchIcon = await resizeImage(file, 180, 180);
            batchPackage[`${baseName}-apple-touch-icon.png`] = appleTouchIcon;
          }
    
          if (includeAndroidIcons) {
            const android192 = await resizeImage(file, 192, 192);
            const android512 = await resizeImage(file, 512, 512);
            batchPackage[`${baseName}-android-chrome-192x192.png`] = android192;
            batchPackage[`${baseName}-android-chrome-512x512.png`] = android512;
          }
    
          // Generate manifest.json
          if (generateManifest) {
            const appName = document.getElementById('appName').value || 'My App';
            const appShortName = document.getElementById('appShortName').value || 'App';
            const themeColor = document.getElementById('themeColor').value;
    
            const manifest = {
              name: appName,
              short_name: appShortName,
              icons: [],
              theme_color: themeColor,
              background_color: '#ffffff',
              display: 'standalone'
            };
    
            if (includeAndroidIcons) {
              manifest.icons.push(
                {
                  src: `${baseName}-android-chrome-192x192.png`,
                  sizes: '192x192',
                  type: 'image/png'
                },
                {
                  src: `${baseName}-android-chrome-512x512.png`,
                  sizes: '512x512',
                  type: 'image/png'
                }
              );
            }
    
            const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
            batchPackage[`${baseName}-manifest.json`] = manifestBlob;
          }
    
          // Generate HTML snippet
          if (generateHTML) {
            let htmlSnippet = '<!-- Favicon Links -->\n';
            htmlSnippet += `<link rel="icon" type="image/x-icon" href="${baseName}.ico">\n`;
            
            if (includeFavicon32) {
              htmlSnippet += `<link rel="icon" type="image/png" sizes="32x32" href="${baseName}-32x32.png">\n`;
            }
            
            if (includeFavicon16) {
              htmlSnippet += `<link rel="icon" type="image/png" sizes="16x16" href="${baseName}-16x16.png">\n`;
            }
            
            if (includeAppleTouchIcon) {
              htmlSnippet += `<link rel="apple-touch-icon" sizes="180x180" href="${baseName}-apple-touch-icon.png">\n`;
            }
            
            if (generateManifest) {
              htmlSnippet += `<link rel="manifest" href="${baseName}-manifest.json">\n`;
            }
    
            const htmlBlob = new Blob([htmlSnippet], { type: 'text/html' });
            batchPackage[`${baseName}-favicon-snippet.html`] = htmlBlob;
          }
        }
    
        displayBatchPreview();
        elements.downloadBtn.style.display = 'none';
        elements.downloadBatchBtn.style.display = 'inline-block';
      }
    
      function displayBatchPreview() {
        elements.batchPreview.style.display = 'block';
        elements.fileList.innerHTML = '';
    
        const fileNames = Object.keys(batchPackage);
        fileNames.forEach(fileName => {
          const fileItem = document.createElement('div');
          fileItem.className = 'file-item';
          fileItem.innerHTML = `
            <span class="file-icon">📄</span>
            <span class="file-name">${fileName}</span>
          `;
          elements.fileList.appendChild(fileItem);
        });
      }
    
      function getSelectedSizes() {
        const sizes = [];
        if (document.getElementById('size16').checked) sizes.push(16);
        if (document.getElementById('size32').checked) sizes.push(32);
        if (document.getElementById('size48').checked) sizes.push(48);
        if (document.getElementById('size64').checked) sizes.push(64);
        if (document.getElementById('size128').checked) sizes.push(128);
        if (document.getElementById('size256').checked) sizes.push(256);
        return sizes;
      }
    
      async function createICO(file, sizes) {
        const images = await Promise.all(sizes.map(size => resizeImage(file, size, size)));
        return generateICOFile(images, sizes);
      }
    
      function resizeImage(file, width, height) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, width, height);
              
              canvas.toBlob((blob) => {
                resolve(blob);
              }, 'image/png');
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        });
      }
    
      async function generateICOFile(imageBlobs, sizes) {
        const images = await Promise.all(imageBlobs.map(blob => blobToImageData(blob)));
        
        // ICO file structure
        const iconCount = images.length;
        const headerSize = 6 + (iconCount * 16);
        
        let totalSize = headerSize;
        const imageDataArray = [];
        
        for (let i = 0; i < images.length; i++) {
          const imageData = await blobToArrayBuffer(imageBlobs[i]);
          imageDataArray.push(imageData);
          totalSize += imageData.byteLength;
        }
        
        const buffer = new ArrayBuffer(totalSize);
        const view = new DataView(buffer);
        
        // ICO header
        view.setUint16(0, 0, true); // Reserved
        view.setUint16(2, 1, true); // Type (1 = ICO)
        view.setUint16(4, iconCount, true); // Number of images
        
        let offset = headerSize;
        
        // Directory entries
        for (let i = 0; i < iconCount; i++) {
          const entryOffset = 6 + (i * 16);
          const size = sizes[i];
          
          view.setUint8(entryOffset, size === 256 ? 0 : size); // Width
          view.setUint8(entryOffset + 1, size === 256 ? 0 : size); // Height
          view.setUint8(entryOffset + 2, 0); // Color palette
          view.setUint8(entryOffset + 3, 0); // Reserved
          view.setUint16(entryOffset + 4, 1, true); // Color planes
          view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
          view.setUint32(entryOffset + 8, imageDataArray[i].byteLength, true); // Image size
          view.setUint32(entryOffset + 12, offset, true); // Image offset
          
          offset += imageDataArray[i].byteLength;
        }
        
        // Image data
        offset = headerSize;
        for (let i = 0; i < imageDataArray.length; i++) {
          const imageData = new Uint8Array(imageDataArray[i]);
          const targetArray = new Uint8Array(buffer, offset, imageData.length);
          targetArray.set(imageData);
          offset += imageData.length;
        }
        
        return new Blob([buffer], { type: 'image/x-icon' });
      }
    
      function blobToImageData(blob) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              resolve(ctx.getImageData(0, 0, img.width, img.height));
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(blob);
        });
      }
    
      function blobToArrayBuffer(blob) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsArrayBuffer(blob);
        });
      }
    
      function handleDownload() {
        if (convertedBlobs.length === 0) return;
    
        if (convertedBlobs.length === 1) {
          downloadFile(convertedBlobs[0].blob, convertedBlobs[0].name);
        } else {
          downloadAsZip(convertedBlobs);
        }
      }
    
      async function handleBatchDownload() {
        if (Object.keys(batchPackage).length === 0) return;
    
        const zip = await createZipFromBatchPackage();
        const fileName = uploadedFiles.length === 1 
          ? uploadedFiles[0].name.replace('.png', '-favicon-package.zip')
          : 'favicon-packages.zip';
        downloadFile(zip, fileName);
      }
    
      async function createZipFromBatchPackage() {
        // Simple ZIP creation (using a basic implementation)
        // For production, consider using JSZip library
        const files = Object.entries(batchPackage);
        
        if (files.length === 1) {
          return files[0][1];
        }
        
        // For multiple files, we'll create a simple archive
        // In a real implementation, use JSZip
        return await createSimpleZip(files);
      }
    
      async function createSimpleZip(files) {
        // This is a simplified version. For production, use JSZip library
        // For now, we'll just download files individually or use a basic implementation
        
        // Create a text file listing all files
        let fileList = 'Favicon Package Contents:\n\n';
        files.forEach(([name]) => {
          fileList += `- ${name}\n`;
        });
        
        return new Blob([fileList], { type: 'text/plain' });
      }
    
      async function downloadAsZip(files) {
        // Simple implementation - download first file
        // For production, use JSZip library
        if (files.length > 0) {
          downloadFile(files[0].blob, files[0].name);
          
          if (files.length > 1) {
            alert(`Downloaded ${files[0].name}. For multiple files, they will download separately.`);
            for (let i = 1; i < files.length; i++) {
              setTimeout(() => {
                downloadFile(files[i].blob, files[i].name);
              }, i * 500);
            }
          }
        }
      }
    
      function downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    
      function clearAll() {
        uploadedFiles = [];
        convertedBlobs = [];
        batchPackage = {};
        elements.previewGrid.innerHTML = '';
        elements.previewSection.style.display = 'none';
        elements.actionButtons.style.display = 'none';
        elements.batchPreview.style.display = 'none';
        elements.fileInput.value = '';
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
