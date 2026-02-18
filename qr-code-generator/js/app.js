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
            if (num <= 0) {
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
    
    #qr-code {
        margin: 20px auto;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 150px;
    }
    
    #qr-code canvas {
        border: 2px solid #e5e7eb;
        border-radius: 8px;
    }
    
    .qr-section {
        text-align: center;
        margin-top: 2rem;
    }
    
    #download-btn {
        margin-top: 1rem;
        background: #10b981;
        color: white;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.3s;
    }
    
    #download-btn:hover {
        background: #059669;
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    initApp();
});

// Global QR code instance
let qrCodeInstance = null;

// Main app initialization function
function initApp() {
    console.log('QR Code Generator ready');

    // Get DOM elements
    const textInput = document.getElementById('text-input');
    const sizeInput = document.getElementById('size-input');
    const sizeDisplay = document.getElementById('size-display');
    const colorInput = document.getElementById('color-input');
    const bgColorInput = document.getElementById('bg-color-input');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const qrCodeDiv = document.getElementById('qr-code');

    // Check if elements exist
    if (!textInput || !generateBtn || !qrCodeDiv) {
        console.error('Required elements not found');
        return;
    }

    // Update size display
    if (sizeInput && sizeDisplay) {
        sizeInput.addEventListener('input', function() {
            sizeDisplay.textContent = `${this.value}x${this.value}`;
        });
    }

    // Generate QR Code function
    function generateQRCode() {
        const text = textInput.value.trim();
        
        // Validate input
        if (!text) {
            utils.showNotification('Please enter text or URL to generate QR code', 'error');
            textInput.focus();
            return;
        }

        const size = parseInt(sizeInput ? sizeInput.value : 256);
        const colorDark = colorInput ? colorInput.value : '#000000';
        const colorLight = bgColorInput ? bgColorInput.value : '#ffffff';

        // Clear previous QR code
        qrCodeDiv.innerHTML = '';

        try {
            // Create new QR code
            qrCodeInstance = new QRCode(qrCodeDiv, {
                text: text,
                width: size,
                height: size,
                colorDark: colorDark,
                colorLight: colorLight,
                correctLevel: QRCode.CorrectLevel.H
            });

            // Show download button
            if (downloadBtn) {
                downloadBtn.style.display = 'inline-block';
            }

            utils.showNotification('QR Code generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating QR code:', error);
            utils.showNotification('Failed to generate QR code', 'error');
        }
    }

    // Download QR Code function
    function downloadQRCode() {
        const canvas = qrCodeDiv.querySelector('canvas');
        
        if (!canvas) {
            utils.showNotification('Please generate a QR code first', 'error');
            return;
        }

        try {
            // Convert canvas to blob and download
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = 'qrcode.png';
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                
                utils.showNotification('QR Code downloaded!', 'success');
            });
        } catch (error) {
            console.error('Error downloading QR code:', error);
            utils.showNotification('Failed to download QR code', 'error');
        }
    }

    // Event listeners
    if (generateBtn) {
        generateBtn.addEventListener('click', generateQRCode);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadQRCode);
    }

    // Allow Enter key to generate
    if (textInput) {
        textInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateQRCode();
            }
        });
    }

    // Regenerate when colors change
    if (colorInput) {
        colorInput.addEventListener('change', function() {
            if (textInput.value.trim() && qrCodeInstance) {
                generateQRCode();
            }
        });
    }

    if (bgColorInput) {
        bgColorInput.addEventListener('change', function() {
            if (textInput.value.trim() && qrCodeInstance) {
                generateQRCode();
            }
        });
    }

    // Regenerate when size changes (on slider release)
    if (sizeInput) {
        sizeInput.addEventListener('change', function() {
            if (textInput.value.trim() && qrCodeInstance) {
                generateQRCode();
            }
        });
    }

    // Set default placeholder or example
    if (textInput && !textInput.value) {
        textInput.placeholder = 'Enter text, URL, or contact info...';
    }
}

// Export utils for use in other scripts (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
