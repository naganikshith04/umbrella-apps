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
      const findText = document.getElementById('findText');
      const replaceText = document.getElementById('replaceText');
      const outputText = document.getElementById('outputText');
      const caseSensitive = document.getElementById('caseSensitive');
      const wholeWord = document.getElementById('wholeWord');
      const useRegex = document.getElementById('useRegex');
      const replaceBtn = document.getElementById('replaceBtn');
      const clearBtn = document.getElementById('clearBtn');
      const copyBtn = document.getElementById('copyBtn');
      const matchCount = document.getElementById('matchCount');
    
      function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
    
      function performReplace() {
        const input = inputText.value;
        const find = findText.value;
        const replace = replaceText.value;
    
        if (!input || !find) {
          outputText.value = input;
          matchCount.textContent = 'Matches: 0';
          return;
        }
    
        let result;
        let count = 0;
    
        try {
          if (useRegex.checked) {
            const flags = caseSensitive.checked ? 'g' : 'gi';
            const regex = new RegExp(find, flags);
            const matches = input.match(regex);
            count = matches ? matches.length : 0;
            result = input.replace(regex, replace);
          } else {
            let pattern = escapeRegExp(find);
            
            if (wholeWord.checked) {
              pattern = '\\b' + pattern + '\\b';
            }
            
            const flags = caseSensitive.checked ? 'g' : 'gi';
            const regex = new RegExp(pattern, flags);
            const matches = input.match(regex);
            count = matches ? matches.length : 0;
            result = input.replace(regex, replace);
          }
    
          outputText.value = result;
          matchCount.textContent = `Matches: ${count}`;
        } catch (error) {
          outputText.value = 'Error: Invalid regular expression';
          matchCount.textContent = 'Matches: 0';
        }
      }
    
      replaceBtn.addEventListener('click', performReplace);
    
      inputText.addEventListener('input', function() {
        if (findText.value) {
          performReplace();
        }
      });

      findText.addEventListener('input', performReplace);
      replaceText.addEventListener('input', performReplace);
      caseSensitive.addEventListener('change', performReplace);
      wholeWord.addEventListener('change', performReplace);
      useRegex.addEventListener('change', performReplace);

      clearBtn.addEventListener('click', function() {
        inputText.value = '';
        findText.value = '';
        replaceText.value = '';
        outputText.value = '';
        matchCount.textContent = 'Matches: 0';
      });

      copyBtn.addEventListener('click', function() {
        if (!outputText.value) {
          alert('Nothing to copy!');
          return;
        }
        navigator.clipboard.writeText(outputText.value).then(() => {
          utils.showNotification('Copied to clipboard!');
        }).catch(() => {
          alert('Failed to copy');
        });
      });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
