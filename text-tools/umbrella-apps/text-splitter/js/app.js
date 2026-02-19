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
      const splitButton = document.getElementById('splitButton');
      const output = document.getElementById('output');
      const resultCount = document.getElementById('resultCount');
      const customDelimiter = document.getElementById('customDelimiter');
      const regexPattern = document.getElementById('regexPattern');
      
      splitButton.addEventListener('click', function() {
        const text = inputText.value;
        
        if (!text.trim()) {
          output.innerHTML = '<p class="error">Please enter some text to split.</p>';
          resultCount.textContent = '';
          return;
        }
        
        const selectedType = document.querySelector('input[name="splitType"]:checked').value;
        let results = [];
        
        try {
          switch(selectedType) {
            case 'lines':
              results = text.split('\n');
              break;
              
            case 'words':
              results = text.split(/\s+/).filter(word => word.length > 0);
              break;
              
            case 'characters':
              results = text.split('');
              break;
              
            case 'custom':
              const delimiter = customDelimiter.value;
              if (!delimiter) {
                output.innerHTML = '<p class="error">Please enter a custom delimiter.</p>';
                resultCount.textContent = '';
                return;
              }
              results = text.split(delimiter);
              break;
              
            case 'regex':
              const pattern = regexPattern.value;
              if (!pattern) {
                output.innerHTML = '<p class="error">Please enter a regex pattern.</p>';
                resultCount.textContent = '';
                return;
              }
              try {
                const regex = new RegExp(pattern);
                results = text.split(regex);
              } catch (e) {
                output.innerHTML = '<p class="error">Invalid regex pattern: ' + e.message + '</p>';
                resultCount.textContent = '';
                return;
              }
              break;
          }
          
          // Display results
          resultCount.textContent = `Total parts: ${results.length}`;
          
          let outputHTML = '<div class="results-list">';
          results.forEach((part, index) => {
            const displayPart = part.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            outputHTML += `<div class="result-item">
              <span class="item-number">${index + 1}.</span>
              <span class="item-content">${displayPart || '<em>(empty)</em>'}</span>
            </div>`;
          });
          outputHTML += '</div>';
          
          output.innerHTML = outputHTML;
          
        } catch (error) {
          output.innerHTML = `<p class="error">Error: ${error.message}</p>`;
          resultCount.textContent = '';
        }
      });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
