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
    // State management
    let selectedFile = null;
    let convertedPdfBlob = null;
    
    // DOM elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeBtn = document.getElementById('removeBtn');
    const convertBtn = document.getElementById('convertBtn');
    const btnText = document.getElementById('btnText');
    const spinner = document.getElementById('spinner');
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const resultSection = document.getElementById('resultSection');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Options
    const pageSize = document.getElementById('pageSize');
    const margin = document.getElementById('margin');
    const fontSize = document.getElementById('fontSize');
    const includeImages = document.getElementById('includeImages');
    
    // Upload area click
    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });
    
    // Drag and drop handlers
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
        handleFileSelect(files[0]);
      }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });
    
    // Handle file selection
    function handleFileSelect(file) {
      if (!file.name.toLowerCase().endsWith('.epub')) {
        alert('Please select a valid EPUB file');
        return;
      }
    
      if (file.size > 50 * 1024 * 1024) {
        alert('File size exceeds 50MB limit');
        return;
      }
    
      selectedFile = file;
      
      // Update UI
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
      
      uploadArea.style.display = 'none';
      fileInfo.style.display = 'block';
      convertBtn.disabled = false;
      resultSection.style.display = 'none';
    }
    
    // Remove file
    removeBtn.addEventListener('click', () => {
      selectedFile = null;
      convertedPdfBlob = null;
      fileInput.value = '';
      
      uploadArea.style.display = 'flex';
      fileInfo.style.display = 'none';
      convertBtn.disabled = true;
      progressSection.style.display = 'none';
      resultSection.style.display = 'none';
    });
    
    // Convert button
    convertBtn.addEventListener('click', async () => {
      if (!selectedFile) return;
      
      // Disable button and show spinner
      convertBtn.disabled = true;
      btnText.textContent = 'Converting...';
      spinner.style.display = 'inline-block';
      progressSection.style.display = 'block';
      resultSection.style.display = 'none';
      
      try {
        await convertEpubToPdf();
      } catch (error) {
        alert('Conversion failed: ' + error.message);
        resetConvertButton();
      }
    });
    
    // Simulate EPUB to PDF conversion
    async function convertEpubToPdf() {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await sleep(200);
        updateProgress(i);
      }
      
      // Simulate PDF generation
      await sleep(500);
      
      // Create a mock PDF blob (in real app, this would be actual conversion)
      const mockPdfContent = generateMockPdf();
      convertedPdfBlob = new Blob([mockPdfContent], { type: 'application/pdf' });
      
      // Show success
      progressSection.style.display = 'none';
      resultSection.style.display = 'block';
      resetConvertButton();
    }
    
    // Generate mock PDF content
    function generateMockPdf() {
      // This is a minimal PDF structure for demonstration
      const pdfContent = `%PDF-1.4
    1 0 obj
    <<
    /Type /Catalog
    /Pages 2 0 R
    >>
    endobj
    2 0 obj
    <<
    /Type /Pages
    /Kids [3 0 R]
    /Count 1
    >>
    endobj
    3 0 obj
    <<
    /Type /Page
    /Parent 2 0 R
    /MediaBox [0 0 612 792]
    /Contents 4 0 R
    /Resources <<
    /Font <<
    /F1 5 0 R
    >>
    >>
    >>
    endobj
    4 0 obj
    <<
    /Length 100
    >>
    stream
    BT
    /F1 24 Tf
    100 700 Td
    (Converted from: ${selectedFile.name}) Tj
    ET
    endstream
    endobj
    5 0 obj
    <<
    /Type /Font
    /Subtype /Type1
    /BaseFont /Helvetica
    >>
    endobj
    xref
    0 6
    0000000000 65535 f 
    0000000009 00000 n 
    0000000058 00000 n 
    0000000115 00000 n 
    0000000270 00000 n 
    0000000420 00000 n 
    trailer
    <<
    /Size 6
    /Root 1 0 R
    >>
    startxref
    500
    %%EOF`;
      
      return pdfContent;
    }
    
    // Download PDF
    downloadBtn.addEventListener('click', () => {
      if (!convertedPdfBlob) return;
      
      const url = URL.createObjectURL(convertedPdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name.replace('.epub', '.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    
    // Helper functions
    function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    function updateProgress(percent) {
      progressFill.style.width = percent + '%';
      progressText.textContent = `Processing: ${percent}%`;
    }
    
    function resetConvertButton() {
      convertBtn.disabled = false;
      btnText.textContent = 'Convert to PDF';
      spinner.style.display = 'none';
    }
    
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      console.log('EPUB to PDF Converter initialized');
    });
    
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
