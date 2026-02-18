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
    const calculateBtn = document.getElementById('calculateBtn');
      const resultsDiv = document.getElementById('results');
      
      function calculateLoan() {
        // Get input values
        const loanAmount = parseFloat(document.getElementById('loanAmount').value);
        const interestRate = parseFloat(document.getElementById('interestRate').value);
        const loanTerm = parseFloat(document.getElementById('loanTerm').value);
        const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        const tradeIn = parseFloat(document.getElementById('tradeIn').value) || 0;
        
        // Validate inputs
        if (!loanAmount || loanAmount <= 0) {
          alert('Please enter a valid vehicle price');
          return;
        }
        
        if (!interestRate || interestRate < 0) {
          alert('Please enter a valid interest rate');
          return;
        }
        
        if (!loanTerm || loanTerm <= 0) {
          alert('Please enter a valid loan term');
          return;
        }
        
        // Calculate actual loan amount
        const actualLoanAmount = loanAmount - downPayment - tradeIn;
        
        if (actualLoanAmount <= 0) {
          alert('Down payment and trade-in exceed vehicle price');
          return;
        }
        
        // Convert annual interest rate to monthly
        const monthlyRate = (interestRate / 100) / 12;
        const numberOfPayments = loanTerm * 12;
        
        // Calculate monthly payment using loan formula
        let monthlyPayment;
        if (monthlyRate === 0) {
          monthlyPayment = actualLoanAmount / numberOfPayments;
        } else {
          monthlyPayment = actualLoanAmount * 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        }
        
        // Calculate totals
        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - actualLoanAmount;
        const totalCost = totalPayment + downPayment + tradeIn;
        
        // Display results
        document.getElementById('monthlyPayment').textContent = `$${monthlyPayment.toFixed(2)}`;
        document.getElementById('totalInterest').textContent = `$${totalInterest.toFixed(2)}`;
        document.getElementById('totalPayment').textContent = `$${totalPayment.toFixed(2)}`;
        document.getElementById('totalCost').textContent = `$${totalCost.toFixed(2)}`;
        
        resultsDiv.style.display = 'block';
      }

      calculateBtn.addEventListener('click', calculateLoan);
      
      // Allow Enter key to trigger calculation
      document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            calculateLoan();
          }
        });
      });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
