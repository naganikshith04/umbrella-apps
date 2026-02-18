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
    document.getElementById('calculate-btn').addEventListener('click', calculateWaterIntake);
    
    function calculateWaterIntake() {
      const weight = parseFloat(document.getElementById('weight').value);
      const activity = document.getElementById('activity').value;
      const climate = document.getElementById('climate').value;
      
      if (!weight || weight <= 0) {
        alert('Please enter a valid weight');
        return;
      }
      
      // Base calculation: 33ml per kg of body weight
      let waterIntake = weight * 0.033;
      
      // Activity level multiplier
      const activityMultipliers = {
        'sedentary': 1.0,
        'light': 1.1,
        'moderate': 1.2,
        'active': 1.3,
        'very-active': 1.5
      };
      
      waterIntake *= activityMultipliers[activity];
      
      // Climate adjustment
      if (climate === 'hot') {
        waterIntake *= 1.2;
      } else if (climate === 'cold') {
        waterIntake *= 0.95;
      }
      
      // Display results
      const liters = waterIntake.toFixed(2);
      const glasses = Math.round(waterIntake * 4); // 1 liter = 4 glasses of 250ml
      
      document.getElementById('liters').textContent = liters;
      document.getElementById('glasses').textContent = glasses;
      document.getElementById('result').classList.remove('hidden');
      
      // Smooth scroll to result
      document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Allow Enter key to trigger calculation
    document.getElementById('weight').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        calculateWaterIntake();
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
