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
    const textInput = document.getElementById('textInput');
      const slugOutput = document.getElementById('slugOutput');
      const generateBtn = document.getElementById('generateBtn');
      const clearBtn = document.getElementById('clearBtn');
      const copyBtn = document.getElementById('copyBtn');
      const lowercaseCheckbox = document.getElementById('lowercase');
      const removeSpecialCheckbox = document.getElementById('removeSpecial');
      const separatorSelect = document.getElementById('separator');
      const notification = document.getElementById('notification');
    
      function generateSlug(text) {
        let slug = text.trim();
        
        // Convert to lowercase if option is checked
        if (lowercaseCheckbox.checked) {
          slug = slug.toLowerCase();
        }
        
        // Remove special characters if option is checked
        if (removeSpecialCheckbox.checked) {
          // Remove accents and diacritics
          slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          // Remove special characters except spaces and selected separator
          slug = slug.replace(/[^a-zA-Z0-9\s-_.]/g, '');
        }
        
        // Get selected separator
        const separator = separatorSelect.value;
        
        // Replace spaces with separator
        slug = slug.replace(/\s+/g, separator);
        
        // Replace multiple separators with single separator
        const separatorRegex = new RegExp(`\\${separator}+`, 'g');
        slug = slug.replace(separatorRegex, separator);
        
        // Remove leading and trailing separators
        const trimRegex = new RegExp(`^\\${separator}+|\\${separator}+$`, 'g');
        slug = slug.replace(trimRegex, '');
        
        return slug;
      }
    
      function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
          notification.classList.remove('show');
        }, 3000);
      }
    
      // Generate slug on button click
      generateBtn.addEventListener('click', function() {
        const text = textInput.value;
        if (text.trim() === '') {
          showNotification('Please enter some text', 'error');
          return;
        }
        
        const slug = generateSlug(text);
        slugOutput.value = slug;
        showNotification('Slug generated successfully!', 'success');
      });

      // Clear inputs
      clearBtn.addEventListener('click', function() {
        textInput.value = '';
        slugOutput.value = '';
      });

      // Copy to clipboard
      copyBtn.addEventListener('click', function() {
        const slug = slugOutput.value;
        if (!slug) {
          showNotification('No slug to copy!', 'error');
          return;
        }

        navigator.clipboard.writeText(slug).then(() => {
          showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
          showNotification('Failed to copy', 'error');
        });
      });

      // Allow Enter key to generate
      textInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          generateBtn.click();
        }
      });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
