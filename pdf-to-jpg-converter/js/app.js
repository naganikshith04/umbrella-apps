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
    
        // State management
        const state = {
            pdfFiles: [],
            convertedImages: [],
            isProcessing: false,
            settings: {
                dpi: 300,
                quality: 92
            }
        };
    
        // DOM elements
        const elements = {
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            fileList: document.getElementById('fileList'),
            convertBtn: document.getElementById('convertBtn'),
            clearBtn: document.getElementById('clearBtn'),
            dpiSelect: document.getElementById('dpiSelect'),
            qualitySlider: document.getElementById('qualitySlider'),
            qualityValue: document.getElementById('qualityValue'),
            progressSection: document.getElementById('progressSection'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            resultsSection: document.getElementById('resultsSection')
        };
    
        // Initialize
        function init() {
            setupEventListeners();
            loadPdfJs();
        }
    
        // Load PDF.js library
        function loadPdfJs() {
            if (typeof pdfjsLib === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                script.onload = () => {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                };
                document.head.appendChild(script);
            }
        }
    
        // Setup event listeners
        function setupEventListeners() {
            // Upload area click
            elements.uploadArea.addEventListener('click', () => {
                elements.fileInput.click();
            });
    
            // File input change
            elements.fileInput.addEventListener('change', handleFileSelect);
    
            // Drag and drop
            elements.uploadArea.addEventListener('dragover', handleDragOver);
            elements.uploadArea.addEventListener('dragleave', handleDragLeave);
            elements.uploadArea.addEventListener('drop', handleDrop);
    
            // Settings
            elements.dpiSelect.addEventListener('change', (e) => {
                state.settings.dpi = parseInt(e.target.value);
            });
    
            elements.qualitySlider.addEventListener('input', (e) => {
                state.settings.quality = parseInt(e.target.value);
                elements.qualityValue.textContent = e.target.value + '%';
            });
    
            // Buttons
            elements.convertBtn.addEventListener('click', convertAllPdfs);
            elements.clearBtn.addEventListener('click', clearAll);
        }
    
        // Handle file selection
        function handleFileSelect(e) {
            const files = Array.from(e.target.files);
            addFiles(files);
        }
    
        // Handle drag over
        function handleDragOver(e) {
            e.preventDefault();
            e.stopPropagation();
            elements.uploadArea.classList.add('drag-over');
        }
    
        // Handle drag leave
        function handleDragLeave(e) {
            e.preventDefault();
            e.stopPropagation();
            elements.uploadArea.classList.remove('drag-over');
        }
    
        // Handle drop
        function handleDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            elements.uploadArea.classList.remove('drag-over');
            
            const files = Array.from(e.dataTransfer.files).filter(file => 
                file.type === 'application/pdf'
            );
            addFiles(files);
        }
    
        // Add files to state
        function addFiles(files) {
            files.forEach(file => {
                if (file.type === 'application/pdf') {
                    const fileObj = {
                        id: Date.now() + Math.random(),
                        file: file,
                        name: file.name,
                        size: file.size,
                        status: 'pending'
                    };
                    state.pdfFiles.push(fileObj);
                }
            });
            
            updateFileList();
            updateButtons();
        }
    
        // Update file list display
        function updateFileList() {
            if (state.pdfFiles.length === 0) {
                elements.fileList.innerHTML = '';
                return;
            }
    
            elements.fileList.innerHTML = `
                <h3>Selected Files (${state.pdfFiles.length})</h3>
                <div class="file-items">
                    ${state.pdfFiles.map(fileObj => `
                        <div class="file-item" data-id="${fileObj.id}">
                            <div class="file-icon">📄</div>
                            <div class="file-info">
                                <div class="file-name">${escapeHtml(fileObj.name)}</div>
                                <div class="file-size">${formatFileSize(fileObj.size)}</div>
                            </div>
                            <div class="file-status status-${fileObj.status}">
                                ${getStatusText(fileObj.status)}
                            </div>
                            <button class="file-remove" onclick="window.pdfConverter.removeFile('${fileObj.id}')" ${state.isProcessing ? 'disabled' : ''}>
                                ×
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    
        // Remove file
        function removeFile(id) {
            state.pdfFiles = state.pdfFiles.filter(f => f.id != id);
            updateFileList();
            updateButtons();
        }
    
        // Update buttons state
        function updateButtons() {
            const hasFiles = state.pdfFiles.length > 0;
            elements.convertBtn.disabled = !hasFiles || state.isProcessing;
            elements.clearBtn.disabled = !hasFiles || state.isProcessing;
        }
    
        // Convert all PDFs
        async function convertAllPdfs() {
            if (state.isProcessing || state.pdfFiles.length === 0) return;
    
            state.isProcessing = true;
            state.convertedImages = [];
            elements.resultsSection.innerHTML = '';
            elements.progressSection.style.display = 'block';
            updateButtons();
    
            let completed = 0;
            const total = state.pdfFiles.length;
    
            for (const fileObj of state.pdfFiles) {
                fileObj.status = 'processing';
                updateFileList();
    
                try {
                    const images = await convertPdfToImages(fileObj);
                    fileObj.status = 'completed';
                    fileObj.images = images;
                    state.convertedImages.push(...images);
                } catch (error) {
                    console.error('Error converting PDF:', error);
                    fileObj.status = 'error';
                    fileObj.error = error.message;
                }
    
                completed++;
                updateProgress(completed, total);
                updateFileList();
            }
    
            state.isProcessing = false;
            updateButtons();
            displayResults();
        }
    
        // Convert single PDF to images
        async function convertPdfToImages(fileObj) {
            const arrayBuffer = await fileObj.file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const images = [];
    
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const scale = state.settings.dpi / 72;
                const viewport = page.getViewport({ scale });
    
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
    
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
    
                const blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, 'image/jpeg', state.settings.quality / 100);
                });
    
                const fileName = fileObj.name.replace('.pdf', '') + `_page_${pageNum}.jpg`;
                images.push({
                    blob: blob,
                    fileName: fileName,
                    url: URL.createObjectURL(blob),
                    pageNum: pageNum
                });
            }
    
            return images;
        }
    
        // Update progress
        function updateProgress(completed, total) {
            const percentage = (completed / total) * 100;
            elements.progressFill.style.width = percentage + '%';
            elements.progressText.textContent = `Processing: ${completed} / ${total}`;
        }
    
        // Display results
        function displayResults() {
            if (state.convertedImages.length === 0) {
                elements.resultsSection.innerHTML = '<p class="no-results">No images generated</p>';
                return;
            }
    
            elements.resultsSection.innerHTML = `
                <div class="results-header">
                    <h3>Converted Images (${state.convertedImages.length})</h3>
                    <button class="btn btn-primary" onclick="window.pdfConverter.downloadAll()">
                        Download All as ZIP
                    </button>
                </div>
                <div class="results-grid">
                    ${state.convertedImages.map((img, index) => `
                        <div class="result-item">
                            <img src="${img.url}" alt="${escapeHtml(img.fileName)}">
                            <div class="result-info">
                                <div class="result-name">${escapeHtml(img.fileName)}</div>
                                <button class="btn btn-small" onclick="window.pdfConverter.downloadSingle(${index})">
                                    Download
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    
        // Download single image
        function downloadSingle(index) {
            const img = state.convertedImages[index];
            const link = document.createElement('a');
            link.href = img.url;
            link.download = img.fileName;
            link.click();
        }
    
        // Download all as ZIP
        async function downloadAll() {
            // Load JSZip if not already loaded
            if (typeof JSZip === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
                await new Promise(resolve => {
                    script.onload = resolve;
                    document.head.appendChild(script);
                });
            }
    
            const zip = new JSZip();
            
            for (const img of state.convertedImages) {
                zip.file(img.fileName, img.blob);
            }
    
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'converted_images.zip';
            link.click();
        }
    
        // Clear all
        function clearAll() {
            if (state.isProcessing) return;
            
            state.pdfFiles = [];
            state.convertedImages.forEach(img => URL.revokeObjectURL(img.url));
            state.convertedImages = [];
            
            elements.fileInput.value = '';
            elements.fileList.innerHTML = '';
            elements.resultsSection.innerHTML = '';
            elements.progressSection.style.display = 'none';
            elements.progressFill.style.width = '0%';
            
            updateButtons();
        }
    
        // Utility functions
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        }
    
        function getStatusText(status) {
            const statusMap = {
                'pending': 'Pending',
                'processing': 'Processing...',
                'completed': '✓ Completed',
                'error': '✗ Error'
            };
            return statusMap[status] || status;
        }
    
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    
        // Expose public API
        window.pdfConverter = {
            removeFile,
            downloadSingle,
            downloadAll
        };
    
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
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
