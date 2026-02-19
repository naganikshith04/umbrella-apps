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
    function convertCase(caseType) {
      const input = document.getElementById('inputText').value;
      const output = document.getElementById('output');
      const stats = document.getElementById('stats');
      
      if (!input.trim()) {
        output.textContent = 'Please enter some text first.';
        stats.textContent = '';
        return;
      }
      
      let result = '';
      
      switch(caseType) {
        case 'sentence':
          result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
          break;
        case 'lower':
          result = input.toLowerCase();
          break;
        case 'upper':
          result = input.toUpperCase();
          break;
        case 'capitalized':
          result = input.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
          break;
        case 'alternating':
          result = input.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
          break;
        case 'title':
          const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in', 'of'];
          result = input.toLowerCase().split(' ').map((word, index) => {
            if (index === 0 || !minorWords.includes(word)) {
              return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
          }).join(' ');
          break;
        case 'inverse':
          result = input.split('').map(c => {
            if (c === c.toUpperCase()) {
              return c.toLowerCase();
            } else {
              return c.toUpperCase();
            }
          }).join('');
          break;
      }
      
      output.textContent = result;
      
      const charCount = result.length;
      const wordCount = result.trim().split(/\s+/).filter(w => w.length > 0).length;
      const lineCount = result.split('\n').length;
      
      stats.innerHTML = `<strong>Stats:</strong> ${charCount} characters | ${wordCount} words | ${lineCount} lines`;
    }
    
    function copyText() {
      const output = document.getElementById('output');
      const text = output.textContent;
      
      if (!text || text === 'Please enter some text first.') {
        alert('No text to copy!');
        return;
      }
      
      navigator.clipboard.writeText(text).then(() => {
        const originalText = output.textContent;
        output.textContent = 'Copied to clipboard!';
        setTimeout(() => {
          output.textContent = originalText;
        }, 1500);
      }).catch(err => {
        alert('Failed to copy text: ' + err);
      });
    }
    
    document.getElementById('inputText').addEventListener('input', function() {
      const output = document.getElementById('output');
      const stats = document.getElementById('stats');
      if (!this.value.trim()) {
        output.textContent = '';
        stats.textContent = '';
      }
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
