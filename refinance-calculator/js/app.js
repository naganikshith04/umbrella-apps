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
    document.getElementById('calculateBtn').addEventListener('click', function() {
      // Get input values
      const currentBalance = parseFloat(document.getElementById('currentBalance').value);
      const currentRate = parseFloat(document.getElementById('currentRate').value) / 100;
      const currentTerm = parseFloat(document.getElementById('currentTerm').value);
      const newRate = parseFloat(document.getElementById('newRate').value) / 100;
      const newTerm = parseFloat(document.getElementById('newTerm').value);
      const closingCosts = parseFloat(document.getElementById('closingCosts').value);
      
      // Validate inputs
      if (isNaN(currentBalance) || isNaN(currentRate) || isNaN(currentTerm) || 
          isNaN(newRate) || isNaN(newTerm) || isNaN(closingCosts)) {
        alert('Please fill in all fields with valid numbers');
        return;
      }
      
      // Calculate current monthly payment
      const currentMonthlyRate = currentRate / 12;
      const currentMonths = currentTerm * 12;
      const currentPayment = currentBalance * 
        (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentMonths)) / 
        (Math.pow(1 + currentMonthlyRate, currentMonths) - 1);
      
      // Calculate new monthly payment
      const newMonthlyRate = newRate / 12;
      const newMonths = newTerm * 12;
      const newPayment = currentBalance * 
        (newMonthlyRate * Math.pow(1 + newMonthlyRate, newMonths)) / 
        (Math.pow(1 + newMonthlyRate, newMonths) - 1);
      
      // Calculate total interest
      const currentTotalInterest = (currentPayment * currentMonths) - currentBalance;
      const newTotalInterest = (newPayment * newMonths) - currentBalance;
      
      // Calculate savings
      const monthlySavings = currentPayment - newPayment;
      const lifetimeSavings = currentTotalInterest - newTotalInterest - closingCosts;
      
      // Calculate break-even point
      const breakEvenMonths = Math.ceil(closingCosts / monthlySavings);
      
      // Display results
      document.getElementById('currentPayment').textContent = '$' + currentPayment.toFixed(2);
      document.getElementById('newPayment').textContent = '$' + newPayment.toFixed(2);
      document.getElementById('monthlySavings').textContent = '$' + monthlySavings.toFixed(2);
      document.getElementById('currentInterest').textContent = '$' + currentTotalInterest.toFixed(2);
      document.getElementById('newInterest').textContent = '$' + newTotalInterest.toFixed(2);
      document.getElementById('lifetimeSavings').textContent = '$' + lifetimeSavings.toFixed(2);
      document.getElementById('breakEven').textContent = breakEvenMonths + ' months';
      
      // Show results
      document.getElementById('results').classList.remove('hidden');
      
      // Scroll to results
      document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
