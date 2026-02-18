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
    const balanceInput = document.getElementById('balance');
      const aprInput = document.getElementById('apr');
      const paymentInput = document.getElementById('payment');
      const calculateBtn = document.getElementById('calculateBtn');
      const resetBtn = document.getElementById('resetBtn');
      const resultsSection = document.getElementById('results');
      const errorDiv = document.getElementById('error');
      
      let payoffChart = null;
      
      calculateBtn.addEventListener('click', calculatePayoff);
      resetBtn.addEventListener('click', resetCalculator);
      
      function calculatePayoff() {
        // Hide previous results and errors
        resultsSection.style.display = 'none';
        errorDiv.style.display = 'none';

        // Get input values
        const balance = parseFloat(balanceInput.value);
        const apr = parseFloat(aprInput.value);
        const monthlyPayment = parseFloat(paymentInput.value);

        // Validate inputs
        if (isNaN(balance) || balance <= 0) {
          errorDiv.textContent = 'Please enter a valid balance';
          errorDiv.style.display = 'block';
          return;
        }

        if (isNaN(apr) || apr < 0) {
          errorDiv.textContent = 'Please enter a valid APR';
          errorDiv.style.display = 'block';
          return;
        }

        if (isNaN(monthlyPayment) || monthlyPayment <= 0) {
          errorDiv.textContent = 'Please enter a valid monthly payment';
          errorDiv.style.display = 'block';
          return;
        }

        // Calculate minimum payment (usually 2% of balance or $25, whichever is higher)
        const minPayment = Math.max(balance * 0.02, 25);

        // Check if payment is sufficient
        const monthlyRate = apr / 100 / 12;
        const monthlyInterest = balance * monthlyRate;

        if (monthlyPayment <= monthlyInterest) {
          errorDiv.textContent = `Your monthly payment ($${monthlyPayment.toFixed(2)}) is too low to pay off this balance. Monthly interest alone is $${monthlyInterest.toFixed(2)}. Please increase your payment.`;
          errorDiv.style.display = 'block';
          return;
        }

        // Calculate payoff details
        let currentBalance = balance;
        let totalPaid = 0;
        let totalInterest = 0;
        let months = 0;
        const maxMonths = 600; // 50 years max to prevent infinite loops

        while (currentBalance > 0 && months < maxMonths) {
          months++;
          const interestCharge = currentBalance * monthlyRate;
          const principalPayment = Math.min(monthlyPayment - interestCharge, currentBalance);
          
          totalInterest += interestCharge;
          totalPaid += interestCharge + principalPayment;
          currentBalance -= principalPayment;
        }

        // Calculate years and months
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        // Display results
        document.getElementById('payoffTime').textContent = 
          years > 0 ? `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : `${months} month${months !== 1 ? 's' : ''}`;
        document.getElementById('totalPaid').textContent = `$${totalPaid.toFixed(2)}`;
        document.getElementById('totalInterest').textContent = `$${totalInterest.toFixed(2)}`;
        document.getElementById('monthlySaved').textContent = 
          monthlyPayment > minPayment ? `$${(monthlyPayment - minPayment).toFixed(2)}` : '$0.00';

        resultsSection.style.display = 'block';
      }

      function resetCalculator() {
        balanceInput.value = '';
        aprInput.value = '';
        paymentInput.value = '';
        resultsSection.style.display = 'none';
        errorDiv.style.display = 'none';
      }

      // Allow Enter key to trigger calculation
      [balanceInput, aprInput, paymentInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            calculatePayoff();
          }
        });
      });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
