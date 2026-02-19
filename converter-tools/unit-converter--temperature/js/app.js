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
    const celsiusInput = document.getElementById('celsius');
    const fahrenheitInput = document.getElementById('fahrenheit');
    const kelvinInput = document.getElementById('kelvin');
    const clearBtn = document.getElementById('clearBtn');
    
    let isUpdating = false;
    
    function roundToTwo(num) {
      return Math.round(num * 100) / 100;
    }
    
    function celsiusToFahrenheit(celsius) {
      return (celsius * 9/5) + 32;
    }
    
    function celsiusToKelvin(celsius) {
      return celsius + 273.15;
    }
    
    function fahrenheitToCelsius(fahrenheit) {
      return (fahrenheit - 32) * 5/9;
    }
    
    function kelvinToCelsius(kelvin) {
      return kelvin - 273.15;
    }
    
    celsiusInput.addEventListener('input', function() {
      if (isUpdating) return;
      
      const value = parseFloat(this.value);
      
      if (this.value === '' || isNaN(value)) {
        fahrenheitInput.value = '';
        kelvinInput.value = '';
        return;
      }
      
      isUpdating = true;
      fahrenheitInput.value = roundToTwo(celsiusToFahrenheit(value));
      kelvinInput.value = roundToTwo(celsiusToKelvin(value));
      isUpdating = false;
    });
    
    fahrenheitInput.addEventListener('input', function() {
      if (isUpdating) return;
      
      const value = parseFloat(this.value);
      
      if (this.value === '' || isNaN(value)) {
        celsiusInput.value = '';
        kelvinInput.value = '';
        return;
      }
      
      isUpdating = true;
      const celsius = fahrenheitToCelsius(value);
      celsiusInput.value = roundToTwo(celsius);
      kelvinInput.value = roundToTwo(celsiusToKelvin(celsius));
      isUpdating = false;
    });
    
    kelvinInput.addEventListener('input', function() {
      if (isUpdating) return;
      
      const value = parseFloat(this.value);
      
      if (this.value === '' || isNaN(value)) {
        celsiusInput.value = '';
        fahrenheitInput.value = '';
        return;
      }
      
      isUpdating = true;
      const celsius = kelvinToCelsius(value);
      celsiusInput.value = roundToTwo(celsius);
      fahrenheitInput.value = roundToTwo(celsiusToFahrenheit(celsius));
      isUpdating = false;
    });
    
    clearBtn.addEventListener('click', function() {
      celsiusInput.value = '';
      fahrenheitInput.value = '';
      kelvinInput.value = '';
      celsiusInput.focus();
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
