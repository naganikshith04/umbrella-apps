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
    document.getElementById('calculate-btn').addEventListener('click', calculateWHR);
    
    function calculateWHR() {
      const waistInput = parseFloat(document.getElementById('waist').value);
      const hipInput = parseFloat(document.getElementById('hip').value);
      const waistUnit = document.getElementById('waist-unit').value;
      const hipUnit = document.getElementById('hip-unit').value;
      const gender = document.getElementById('gender').value;
      
      // Validation
      if (!waistInput || !hipInput || !gender) {
        alert('Please fill in all fields');
        return;
      }
      
      if (waistInput <= 0 || hipInput <= 0) {
        alert('Please enter valid positive measurements');
        return;
      }
      
      // Convert to cm if needed
      let waist = waistUnit === 'inches' ? waistInput * 2.54 : waistInput;
      let hip = hipUnit === 'inches' ? hipInput * 2.54 : hipInput;
      
      // Calculate WHR
      const whr = waist / hip;
      
      // Display result
      document.getElementById('whr-value').textContent = whr.toFixed(2);
      
      // Determine risk category
      let riskLevel, riskText, healthInfo;
      
      if (gender === 'male') {
        if (whr < 0.90) {
          riskLevel = 'risk-low';
          riskText = 'Low Risk';
          healthInfo = 'Your waist-to-hip ratio indicates a low health risk. This suggests a healthy body fat distribution with lower risk of cardiovascular disease and metabolic disorders.';
        } else if (whr >= 0.90 && whr < 1.00) {
          riskLevel = 'risk-moderate';
          riskText = 'Moderate Risk';
          healthInfo = 'Your waist-to-hip ratio indicates a moderate health risk. Consider maintaining a healthy diet and regular exercise to improve your body composition.';
        } else {
          riskLevel = 'risk-high';
          riskText = 'High Risk';
          healthInfo = 'Your waist-to-hip ratio indicates a high health risk. This suggests increased risk of cardiovascular disease, type 2 diabetes, and other health conditions. Consult with a healthcare professional for personalized advice.';
        }
      } else { // female
        if (whr < 0.80) {
          riskLevel = 'risk-low';
          riskText = 'Low Risk';
          healthInfo = 'Your waist-to-hip ratio indicates a low health risk. This suggests a healthy body fat distribution with lower risk of cardiovascular disease and metabolic disorders.';
        } else if (whr >= 0.80 && whr < 0.86) {
          riskLevel = 'risk-moderate';
          riskText = 'Moderate Risk';
          healthInfo = 'Your waist-to-hip ratio indicates a moderate health risk. Consider maintaining a healthy diet and regular exercise to improve your body composition.';
        } else {
          riskLevel = 'risk-high';
          riskText = 'High Risk';
          healthInfo = 'Your waist-to-hip ratio indicates a high health risk. This suggests increased risk of cardiovascular disease, type 2 diabetes, and other health conditions. Consult with a healthcare professional for personalized advice.';
        }
      }
      
      // Update UI
      const riskCategory = document.getElementById('risk-category');
      riskCategory.className = 'risk-category ' + riskLevel;
      riskCategory.textContent = riskText;
      
      document.getElementById('health-info').textContent = healthInfo;
      
      // Show result
      document.getElementById('result').classList.remove('hidden');
      
      // Smooth scroll to result
      document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Allow Enter key to calculate
    document.getElementById('waist').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') calculateWHR();
    });
    
    document.getElementById('hip').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') calculateWHR();
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
