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


function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function initApp() {
    // This is where your specific app logic goes
    console.log('Ready to add app-specific functionality');

    // Generated app logic
    const inputText = document.getElementById('inputText');
      const outputText = document.getElementById('outputText');
      const convertBtn = document.getElementById('convertBtn');
      const copyBtn = document.getElementById('copyBtn');
      const trimSpaces = document.getElementById('trimSpaces');
      const removeEmpty = document.getElementById('removeEmpty');
      const addQuotes = document.getElementById('addQuotes');
      const addSpace = document.getElementById('addSpace');
      const notification = document.getElementById('notification');
    
      function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        setTimeout(() => {
          notification.classList.remove('show');
        }, 3000);
      }
    
      function convertToCommaSeparated() {
        let text = inputText.value;
        
        if (!text.trim()) {
          outputText.value = '';
          showNotification('Please enter some text to convert', 'error');
          return;
        }
    
        let lines = text.split('\n');
        
        if (trimSpaces.checked) {
          lines = lines.map(line => line.trim());
        }
        
        if (removeEmpty.checked) {
          lines = lines.filter(line => line.length > 0);
        }
        
        if (addQuotes.checked) {
          lines = lines.map(line => `"${line}"`);
        }
        
        const separator = addSpace.checked ? ', ' : ',';
        const result = lines.join(separator);
        
        outputText.value = result;
        showNotification('Conversion successful!', 'success');
      }
    
      function copyToClipboard() {
        if (!outputText.value) {
          showNotification('Nothing to copy', 'error');
          return;
        }
    
        outputText.select();
        outputText.setSelectionRange(0, 99999);
        
        navigator.clipboard.writeText(outputText.value).then(() => {
          showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
          showNotification('Failed to copy', 'error');
        });
      }

      // Event listeners
      convertBtn.addEventListener('click', convertToCommaSeparated);
      copyBtn.addEventListener('click', copyToClipboard);
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
