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
    // Conversion factors to meters
    const conversionFactors = {
      meters: 1,
      kilometers: 1000,
      centimeters: 0.01,
      millimeters: 0.001,
      miles: 1609.344,
      yards: 0.9144,
      feet: 0.3048,
      inches: 0.0254
    };
    
    // Get DOM elements
    const inputValue = document.getElementById('inputValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const result = document.getElementById('result');
    const convertBtn = document.getElementById('convertBtn');
    const swapBtn = document.getElementById('swapBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Convert function
    function convert() {
      const value = parseFloat(inputValue.value);
      
      if (isNaN(value) || inputValue.value === '') {
        result.textContent = 'Please enter a valid number';
        return;
      }
      
      const from = fromUnit.value;
      const to = toUnit.value;
      
      // Convert to meters first, then to target unit
      const valueInMeters = value * conversionFactors[from];
      const convertedValue = valueInMeters / conversionFactors[to];
      
      // Format the result
      result.textContent = convertedValue.toFixed(6).replace(/\.?0+$/, '');
    }
    
    // Swap units function
    function swapUnits() {
      const temp = fromUnit.value;
      fromUnit.value = toUnit.value;
      toUnit.value = temp;
      
      if (inputValue.value !== '') {
        convert();
      }
    }
    
    // Reset function
    function reset() {
      inputValue.value = '';
      fromUnit.value = 'meters';
      toUnit.value = 'feet';
      result.textContent = '0';
    }
    
    // Event listeners
    convertBtn.addEventListener('click', convert);
    swapBtn.addEventListener('click', swapUnits);
    resetBtn.addEventListener('click', reset);
    
    // Auto-convert on input change
    inputValue.addEventListener('input', () => {
      if (inputValue.value !== '') {
        convert();
      } else {
        result.textContent = '0';
      }
    });
    
    fromUnit.addEventListener('change', () => {
      if (inputValue.value !== '') {
        convert();
      }
    });
    
    toUnit.addEventListener('change', () => {
      if (inputValue.value !== '') {
        convert();
      }
    });
    
    // Allow Enter key to convert
    inputValue.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        convert();
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
