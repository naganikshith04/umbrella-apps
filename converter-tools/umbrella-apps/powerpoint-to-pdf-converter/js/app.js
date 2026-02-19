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
    // PowerPoint to PDF Converter - Main JavaScript
    
    // State management
    const state = {
        selectedFile: null,
        conversionOptions: {
            includeNotes: false,
            includeHiddenSlides: false,
            quality: 'medium',
            pageOrientation: 'auto',
            slidesPerPage: 1,
            customSlidesCount: 3,
            handoutLayout: 'none',
            includeDate: false,
            includePageNumbers: true,
            includeNotesArea: false,
            slideRangeType: 'all',
            customRange: ''
        }
    };
    
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeBtn = document.getElementById('removeBtn');
    const optionsSection = document.getElementById('optionsSection');
    const convertBtn = document.getElementById('convertBtn');
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const resultSection = document.getElementById('resultSection');
    const downloadBtn = document.getElementById('downloadBtn');
    const convertAnotherBtn = document.getElementById('convertAnotherBtn');
    
    // Option elements
    const includeNotesCheckbox = document.getElementById('includeNotes');
    const includeHiddenSlidesCheckbox = document.getElementById('includeHiddenSlides');
    const qualitySelect = document.getElementById('quality');
    const pageOrientationSelect = document.getElementById('pageOrientation');
    const slidesPerPageSelect = document.getElementById('slidesPerPage');
    const customSlidesGroup = document.getElementById('customSlidesGroup');
    const customSlidesCount = document.getElementById('customSlidesCount');
    const handoutLayoutSelect = document.getElementById('handoutLayout');
    const handoutOptionsGroup = document.getElementById('handoutOptionsGroup');
    const includeDateCheckbox = document.getElementById('includeDate');
    const includePageNumbersCheckbox = document.getElementById('includePageNumbers');
    const includeNotesAreaCheckbox = document.getElementById('includeNotesArea');
    const slideRangeTypeSelect = document.getElementById('slideRangeType');
    const customRangeGroup = document.getElementById('customRangeGroup');
    const customRangeInput = document.getElementById('customRange');
    
    // Event Listeners - File Upload
    uploadArea.addEventListener('click', () => fileInput.click());
    browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    removeBtn.addEventListener('click', () => {
        resetUpload();
    });
    
    // Event Listeners - Options
    includeNotesCheckbox.addEventListener('change', (e) => {
        state.conversionOptions.includeNotes = e.target.checked;
    });
    
    includeHiddenSlidesCheckbox.addEventListener('change', (e) => {
        state.conversionOptions.includeHiddenSlides = e.target.checked;
    });
    
    qualitySelect.addEventListener('change', (e) => {
        state.conversionOptions.quality = e.target.value;
    });
    
    pageOrientationSelect.addEventListener('change', (e) => {
        state.conversionOptions.pageOrientation = e.target.value;
    });
    
    slidesPerPageSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        state.conversionOptions.slidesPerPage = value;
        
        if (value === 'custom') {
            customSlidesGroup.style.display = 'block';
            state.conversionOptions.customSlidesCount = parseInt(customSlidesCount.value) || 3;
        } else {
            customSlidesGroup.style.display = 'none';
            state.conversionOptions.customSlidesCount = parseInt(value);
        }
    });
    
    customSlidesCount.addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        if (value < 1) value = 1;
        if (value > 16) value = 16;
        e.target.value = value;
        state.conversionOptions.customSlidesCount = value;
    });
    
    handoutLayoutSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        state.conversionOptions.handoutLayout = value;
        
        if (value !== 'none') {
            handoutOptionsGroup.style.display = 'block';
        } else {
            handoutOptionsGroup.style.display = 'none';
        }
    });
    
    includeDateCheckbox.addEventListener('change', (e) => {
        state.conversionOptions.includeDate = e.target.checked;
    });
    
    includePageNumbersCheckbox.addEventListener('change', (e) => {
        state.conversionOptions.includePageNumbers = e.target.checked;
    });
    
    includeNotesAreaCheckbox.addEventListener('change', (e) => {
        state.conversionOptions.includeNotesArea = e.target.checked;
    });
    
    slideRangeTypeSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        state.conversionOptions.slideRangeType = value;
        
        if (value === 'custom') {
            customRangeGroup.style.display = 'block';
        } else {
            customRangeGroup.style.display = 'none';
        }
    });
    
    customRangeInput.addEventListener('input', (e) => {
        state.conversionOptions.customRange = e.target.value;
    });
    
    // Event Listeners - Conversion
    convertBtn.addEventListener('click', () => {
        if (state.selectedFile) {
            startConversion();
        }
    });
    
    downloadBtn.addEventListener('click', () => {
        downloadPDF();
    });
    
    convertAnotherBtn.addEventListener('click', () => {
        resetAll();
    });
    
    // File handling functions
    function handleFileSelect(file) {
        const validTypes = [
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
        
        const validExtensions = ['.ppt', '.pptx'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
            alert('Please select a valid PowerPoint file (.ppt or .pptx)');
            return;
        }
        
        if (file.size > 50 * 1024 * 1024) {
            alert('File size must be less than 50MB');
            return;
        }
        
        state.selectedFile = file;
        displayFilePreview(file);
    }
    
    function displayFilePreview(file) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        
        uploadArea.style.display = 'none';
        filePreview.style.display = 'block';
        optionsSection.style.display = 'block';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    function resetUpload() {
        state.selectedFile = null;
        fileInput.value = '';
        uploadArea.style.display = 'flex';
        filePreview.style.display = 'none';
        optionsSection.style.display = 'none';
    }
    
    function resetAll() {
        resetUpload();
        progressSection.style.display = 'none';
        resultSection.style.display = 'none';
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        
        // Reset options to defaults
        includeNotesCheckbox.checked = false;
        includeHiddenSlidesCheckbox.checked = false;
        qualitySelect.value = 'medium';
        pageOrientationSelect.value = 'auto';
        slidesPerPageSelect.value = '1';
        customSlidesGroup.style.display = 'none';
        customSlidesCount.value = '3';
        handoutLayoutSelect.value = 'none';
        handoutOptionsGroup.style.display = 'none';
        includeDateCheckbox.checked = false;
        includePageNumbersCheckbox.checked = true;
        includeNotesAreaCheckbox.checked = false;
        slideRangeTypeSelect.value = 'all';
        customRangeGroup.style.display = 'none';
        customRangeInput.value = '';
        
        state.conversionOptions = {
            includeNotes: false,
            includeHiddenSlides: false,
            quality: 'medium',
            pageOrientation: 'auto',
            slidesPerPage: 1,
            customSlidesCount: 3,
            handoutLayout: 'none',
            includeDate: false,
            includePageNumbers: true,
            includeNotesArea: false,
            slideRangeType: 'all',
            customRange: ''
        };
    }
    
    // Conversion functions
    function startConversion() {
        optionsSection.style.display = 'none';
        progressSection.style.display = 'block';
        
        // Validate custom range if selected
        if (state.conversionOptions.slideRangeType === 'custom') {
            if (!validateSlideRange(state.conversionOptions.customRange)) {
                alert('Invalid slide range format. Please use format like: 1-5, 8, 10-12');
                optionsSection.style.display = 'block';
                progressSection.style.display = 'none';
                return;
            }
        }
        
        simulateConversion();
    }
    
    function validateSlideRange(range) {
        if (!range || range.trim() === '') return false;
        
        // Check format: numbers, hyphens, commas, and spaces only
        const validFormat = /^[\d\s,\-]+$/;
        if (!validFormat.test(range)) return false;
        
        // Check each part
        const parts = range.split(',');
        for (let part of parts) {
            part = part.trim();
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n.trim()));
                if (isNaN(start) || isNaN(end) || start > end || start < 1) {
                    return false;
                }
            } else {
                const num = parseInt(part);
                if (isNaN(num) || num < 1) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    function simulateConversion() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            progressText.textContent = Math.round(progress) + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    showResult();
                }, 500);
            }
        }, 300);
    }
    
    function showResult() {
        progressSection.style.display = 'none';
        resultSection.style.display = 'block';
    }
    
    function downloadPDF() {
        // Create a summary of conversion options
        const options = state.conversionOptions;
        let optionsSummary = `Conversion Options:\n`;
        optionsSummary += `- Quality: ${options.quality}\n`;
        optionsSummary += `- Page Orientation: ${options.pageOrientation}\n`;
        
        if (options.slidesPerPage === 'custom') {
            optionsSummary += `- Slides Per Page: ${options.customSlidesCount} (custom)\n`;
        } else {
            optionsSummary += `- Slides Per Page: ${options.slidesPerPage}\n`;
        }
        
        if (options.handoutLayout !== 'none') {
            optionsSummary += `- Handout Layout: ${options.handoutLayout}\n`;
            optionsSummary += `  - Include Date: ${options.includeDate ? 'Yes' : 'No'}\n`;
            optionsSummary += `  - Include Page Numbers: ${options.includePageNumbers ? 'Yes' : 'No'}\n`;
            optionsSummary += `  - Include Notes Area: ${options.includeNotesArea ? 'Yes' : 'No'}\n`;
        }
        
        optionsSummary += `- Include Notes: ${options.includeNotes ? 'Yes' : 'No'}\n`;
        optionsSummary += `- Include Hidden Slides: ${options.includeHiddenSlides ? 'Yes' : 'No'}\n`;
        optionsSummary += `- Slide Range: ${options.slideRangeType}`;
        
        if (options.slideRangeType === 'custom') {
            optionsSummary += ` (${options.customRange})`;
        }
        
        // In a real application, this would trigger an actual download
        // For demo purposes, we'll create a text file with the options
        const blob = new Blob([optionsSummary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = state.selectedFile.name.replace(/\.(ppt|pptx)$/i, '_conversion_options.txt');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('In a production environment, your converted PDF would download now.\n\n' + optionsSummary);
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        console.log('PowerPoint to PDF Converter initialized');
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
