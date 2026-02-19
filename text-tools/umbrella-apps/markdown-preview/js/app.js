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
    // Initialize marked with options
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
        sanitize: false
    });
    
    // Get DOM elements
    const markdownInput = document.getElementById('markdownInput');
    const preview = document.getElementById('preview');
    const clearBtn = document.getElementById('clearBtn');
    const syntaxHighlightToggle = document.getElementById('syntaxHighlightToggle');
    
    // State
    let syntaxHighlightingEnabled = true;
    
    // Apply syntax highlighting to code blocks
    function applySyntaxHighlighting() {
        if (syntaxHighlightingEnabled) {
            const codeBlocks = preview.querySelectorAll('pre code');
            codeBlocks.forEach((block) => {
                // Remove existing highlighting
                block.removeAttribute('data-highlighted');
                // Apply new highlighting
                hljs.highlightElement(block);
            });
        }
    }
    
    // Update preview
    function updatePreview() {
        const markdownText = markdownInput.value;
        
        if (!markdownText.trim()) {
            preview.innerHTML = '<p style="color: #999; font-style: italic;">Your preview will appear here...</p>';
            return;
        }
        
        try {
            // Convert markdown to HTML
            const htmlContent = marked.parse(markdownText);
            preview.innerHTML = htmlContent;
            
            // Apply syntax highlighting if enabled
            if (syntaxHighlightingEnabled) {
                applySyntaxHighlighting();
            } else {
                // Remove highlighting classes if disabled
                const codeBlocks = preview.querySelectorAll('pre code');
                codeBlocks.forEach((block) => {
                    block.className = '';
                    block.removeAttribute('data-highlighted');
                });
            }
        } catch (error) {
            preview.innerHTML = `<p style="color: #dc3545;">Error rendering markdown: ${error.message}</p>`;
        }
    }
    
    // Event listeners
    markdownInput.addEventListener('input', updatePreview);
    
    clearBtn.addEventListener('click', () => {
        markdownInput.value = '';
        updatePreview();
    });
    
    syntaxHighlightToggle.addEventListener('change', (e) => {
        syntaxHighlightingEnabled = e.target.checked;
        updatePreview();
    });
    
    // Load initial content from localStorage if available
    window.addEventListener('DOMContentLoaded', () => {
        const savedContent = localStorage.getItem('markdownContent');
        if (savedContent) {
            markdownInput.value = savedContent;
        }
        updatePreview();
    });
    
    // Save content to localStorage on input
    markdownInput.addEventListener('input', () => {
        localStorage.setItem('markdownContent', markdownInput.value);
    });
    
    // Initial render
    updatePreview();
    
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
