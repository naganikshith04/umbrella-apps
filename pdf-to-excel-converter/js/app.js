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
            selectedFile: null,
            isPremium: false,
            totalPages: 0,
            isConverting: false
        };
    
        // DOM elements
        const elements = {
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            uploadBtn: document.getElementById('uploadBtn'),
            fileInfo: document.getElementById('fileInfo'),
            fileName: document.getElementById('fileName'),
            fileSize: document.getElementById('fileSize'),
            filePages: document.getElementById('filePages'),
            removeBtn: document.getElementById('removeBtn'),
            convertBtn: document.getElementById('convertBtn'),
            convertBtnText: document.getElementById('convertBtnText'),
            spinner: document.getElementById('spinner'),
            progressContainer: document.getElementById('progressContainer'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            resultSection: document.getElementById('resultSection'),
            resultMessage: document.getElementById('resultMessage'),
            downloadBtn: document.getElementById('downloadBtn'),
            convertAnotherBtn: document.getElementById('convertAnotherBtn'),
            multiPageOption: document.getElementById('multiPageOption'),
            ocrOption: document.getElementById('ocrOption'),
            ocrSettings: document.getElementById('ocrSettings'),
            ocrLanguage: document.getElementById('ocrLanguage'),
            ocrEnhance: document.getElementById('ocrEnhance'),
            preserveFormatting: document.getElementById('preserveFormatting'),
            outputFormat: document.getElementById('outputFormat'),
            pageSelectionSection: document.getElementById('pageSelectionSection'),
            pagePreview: document.getElementById('pagePreview'),
            customPageRange: document.getElementById('customPageRange'),
            premiumModal: document.getElementById('premiumModal'),
            modalClose: document.getElementById('modalClose')
        };
    
        // Initialize event listeners
        function init() {
            // Upload events
            elements.uploadBtn.addEventListener('click', () => elements.fileInput.click());
            elements.fileInput.addEventListener('change', handleFileSelect);
            elements.removeBtn.addEventListener('click', removeFile);
    
            // Drag and drop
            elements.uploadArea.addEventListener('dragover', handleDragOver);
            elements.uploadArea.addEventListener('dragleave', handleDragLeave);
            elements.uploadArea.addEventListener('drop', handleDrop);
            elements.uploadArea.addEventListener('click', (e) => {
                if (e.target === elements.uploadArea || e.target.closest('.upload-area')) {
                    elements.fileInput.click();
                }
            });
    
            // Conversion events
            elements.convertBtn.addEventListener('click', handleConvert);
            elements.downloadBtn.addEventListener('click', handleDownload);
            elements.convertAnotherBtn.addEventListener('click', resetConverter);
    
            // Multi-page option events
            elements.multiPageOption.addEventListener('change', handleMultiPageToggle);
    
            // OCR option events
            elements.ocrOption.addEventListener('change', handleOCRToggle);
    
            // Page range events
            const pageRangeRadios = document.querySelectorAll('input[name="pageRange"]');
            pageRangeRadios.forEach(radio => {
                radio.addEventListener('change', handlePageRangeChange);
            });
            elements.customPageRange.addEventListener('input', validatePageRange);
    
            // Premium modal events
            elements.modalClose.addEventListener('click', closePremiumModal);
            elements.premiumModal.addEventListener('click', (e) => {
                if (e.target === elements.premiumModal) {
                    closePremiumModal();
                }
            });
    
            // Upgrade button
            const upgradeBtn = document.querySelector('.btn-upgrade');
            if (upgradeBtn) {
                upgradeBtn.addEventListener('click', handleUpgrade);
            }
        }
    
        // File handling
        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (file) {
                processFile(file);
            }
        }
    
        function handleDragOver(e) {
            e.preventDefault();
            elements.uploadArea.classList.add('drag-over');
        }
    
        function handleDragLeave(e) {
            e.preventDefault();
            elements.uploadArea.classList.remove('drag-over');
        }
    
        function handleDrop(e) {
            e.preventDefault();
            elements.uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/pdf') {
                processFile(file);
            } else {
                showError('Please upload a valid PDF file');
            }
        }
    
        function processFile(file) {
            if (file.type !== 'application/pdf') {
                showError('Please upload a PDF file');
                return;
            }
    
            if (file.size > 10 * 1024 * 1024) {
                showError('File size must be less than 10MB');
                return;
            }
    
            state.selectedFile = file;
            
            // Simulate PDF page detection
            detectPDFPages(file).then(pageCount => {
                state.totalPages = pageCount;
                displayFileInfo(file, pageCount);
                elements.convertBtn.disabled = false;
                
                // Show page selection if multi-page
                if (pageCount > 1) {
                    elements.pageSelectionSection.style.display = 'block';
                    renderPagePreview(pageCount);
                } else {
                    elements.pageSelectionSection.style.display = 'none';
                }
            });
        }
    
        function detectPDFPages(file) {
            // Simulate PDF page detection
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const data = e.target.result;
                    // Simple heuristic: count "/Type /Page" occurrences
                    const text = new TextDecoder().decode(new Uint8Array(data));
                    const matches = text.match(/\/Type\s*\/Page[^s]/g);
                    const pageCount = matches ? matches.length : Math.floor(Math.random() * 10) + 1;
                    resolve(pageCount);
                };
                reader.readAsArrayBuffer(file);
            });
        }
    
        function displayFileInfo(file, pageCount) {
            elements.uploadArea.style.display = 'none';
            elements.fileInfo.style.display = 'block';
            elements.fileName.textContent = file.name;
            elements.fileSize.textContent = formatFileSize(file.size);
            elements.filePages.textContent = `${pageCount} page${pageCount > 1 ? 's' : ''}`;
        }
    
        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }
    
        function removeFile() {
            state.selectedFile = null;
            state.totalPages = 0;
            elements.fileInput.value = '';
            elements.fileInfo.style.display = 'none';
            elements.uploadArea.style.display = 'flex';
            elements.convertBtn.disabled = true;
            elements.resultSection.style.display = 'none';
            elements.pageSelectionSection.style.display = 'none';
            elements.progressContainer.style.display = 'none';
        }
    
        // Multi-page support
        function handleMultiPageToggle(e) {
            const isEnabled = e.target.checked;
            if (isEnabled && state.totalPages > 1) {
                elements.pageSelectionSection.style.display = 'block';
            } else {
                elements.pageSelectionSection.style.display = 'none';
            }
        }
    
        function renderPagePreview(pageCount) {
            elements.pagePreview.innerHTML = '';
            const previewHTML = `
                <div class="page-thumbnails">
                    ${Array.from({length: Math.min(pageCount, 10)}, (_, i) => `
                        <div class="page-thumb" data-page="${i + 1}">
                            <div class="thumb-placeholder">
                                <span>Page ${i + 1}</span>
                            </div>
                        </div>
                    `).join('')}
                    ${pageCount > 10 ? `<div class="page-thumb-more">+${pageCount - 10} more</div>` : ''}
                </div>
            `;
            elements.pagePreview.innerHTML = previewHTML;
        }
    
        function handlePageRangeChange(e) {
            const isCustom = e.target.value === 'custom';
            elements.customPageRange.disabled = !isCustom;
            if (isCustom) {
                elements.customPageRange.focus();
            }
        }
    
        function validatePageRange() {
            const value = elements.customPageRange.value;
            const pattern = /^(\d+(-\d+)?)(,\s*\d+(-\d+)?)*$/;
            
            if (value && !pattern.test(value)) {
                elements.customPageRange.setCustomValidity('Invalid page range format');
            } else {
                elements.customPageRange.setCustomValidity('');
            }
        }
    
        function getSelectedPages() {
            const multiPageEnabled = elements.multiPageOption.checked;
            if (!multiPageEnabled) {
                return [1]; // Only first page
            }
    
            const pageRangeType = document.querySelector('input[name="pageRange"]:checked').value;
            if (pageRangeType === 'all') {
                return Array.from({length: state.totalPages}, (_, i) => i + 1);
            } else {
                return parsePageRange(elements.customPageRange.value, state.totalPages);
            }
        }
    
        function parsePageRange(rangeStr, maxPages) {
            const pages = new Set();
            const parts = rangeStr.split(',');
            
            parts.forEach(part => {
                part = part.trim();
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(n => parseInt(n.trim()));
                    for (let i = start; i <= Math.min(end, maxPages); i++) {
                        if (i > 0) pages.add(i);
                    }
                } else {
                    const page = parseInt(part);
                    if (page > 0 && page <= maxPages) {
                        pages.add(page);
                    }
                }
            });
            
            return Array.from(pages).sort((a, b) => a - b);
        }
    
        // OCR support
        function handleOCRToggle(e) {
            const isEnabled = e.target.checked;
            
            if (isEnabled && !state.isPremium) {
                e.preventDefault();
                e.target.checked = false;
                showPremiumModal();
                return;
            }
            
            elements.ocrSettings.style.display = isEnabled ? 'block' : 'none';
        }
    
        function showPremiumModal() {
            elements.premiumModal.style.display = 'flex';
        }
    
        function closePremiumModal() {
            elements.premiumModal.style.display = 'none';
        }
    
        function handleUpgrade() {
            // Simulate premium upgrade
            alert('Redirecting to payment page...');
            // In production, this would redirect to a payment processor
            // For demo purposes, we'll just enable premium
            state.isPremium = true;
            closePremiumModal();
            elements.ocrOption.checked = true;
            elements.ocrSettings.style.display = 'block';
        }
    
        // Conversion handling
        function handleConvert() {
            if (!state.selectedFile || state.isConverting) return;
    
            state.isConverting = true;
            elements.convertBtn.disabled = true;
            elements.convertBtnText.textContent = 'Converting...';
            elements.spinner.style.display = 'inline-block';
            elements.progressContainer.style.display = 'block';
            elements.resultSection.style.display = 'none';
    
            const options = {
                multiPage: elements.multiPageOption.checked,
                selectedPages: getSelectedPages(),
                ocr: elements.ocrOption.checked && state.isPremium,
                ocrLanguage: elements.ocrLanguage.value,
                ocrEnhance: elements.ocrEnhance.checked,
                preserveFormatting: elements.preserveFormatting.checked,
                outputFormat: elements.outputFormat.value
            };
    
            simulateConversion(options);
        }
    
        function simulateConversion(options) {
            let progress = 0;
            const totalSteps = options.selectedPages.length;
            let currentStep = 0;
    
            const interval = setInterval(() => {
                currentStep++;
                progress = Math.min((currentStep / totalSteps) * 100, 100);
                
                updateProgress(progress, currentStep, totalSteps, options);
    
                if (progress >= 100) {
                    clearInterval(interval);
                    completeConversion(options);
                }
            }, 500);
        }
    
        function updateProgress(progress, currentStep, totalSteps, options) {
            elements.progressFill.style.width = progress + '%';
            
            let statusText = `Processing: ${Math.round(progress)}%`;
            
            if (options.multiPage && totalSteps > 1) {
                statusText += ` (Page ${currentStep}/${totalSteps})`;
            }
            
            if (options.ocr && currentStep <= totalSteps) {
                statusText += ' - Running OCR...';
            }
            
            elements.progressText.textContent = statusText;
        }
    
        function completeConversion(options) {
            state.isConverting = false;
            elements.convertBtn.disabled = false;
            elements.convertBtnText.textContent = 'Convert to Excel';
            elements.spinner.style.display = 'none';
            elements.progressContainer.style.display = 'none';
            elements.resultSection.style.display = 'block';
    
            let message = 'Your Excel file is ready for download';
            if (options.multiPage && options.selectedPages.length > 1) {
                message += ` (${options.selectedPages.length} pages converted to ${options.selectedPages.length} sheets)`;
            }
            if (options.ocr) {
                message += ' with OCR text extraction';
            }
            
            elements.resultMessage.textContent = message;
        }
    
        function handleDownload() {
            const options = {
                multiPage: elements.multiPageOption.checked,
                selectedPages: getSelectedPages(),
                ocr: elements.ocrOption.checked && state.isPremium,
                outputFormat: elements.outputFormat.value
            };
    
            // Simulate file download
            const fileName = state.selectedFile.name.replace('.pdf', `.${options.outputFormat}`);
            const blob = new Blob(['Simulated Excel content'], { 
                type: options.outputFormat === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
    
            showSuccess('File downloaded successfully!');
        }
    
        function resetConverter() {
            removeFile();
            elements.resultSection.style.display = 'none';
        }
    
        // Utility functions
        function showError(message) {
            alert('Error: ' + message);
        }
    
        function showSuccess(message) {
            console.log('Success: ' + message);
        }
    
        // Initialize the application
        init();
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
