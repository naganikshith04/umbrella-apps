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
    document.getElementById('calculateBtn').addEventListener('click', calculateRefund);
    
    // Standard deduction amounts for 2024
    const standardDeductions = {
      single: 14600,
      married: 29200,
      head: 21900
    };
    
    // Simplified tax brackets for 2024 (single filer example)
    const taxBrackets = {
      single: [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: 243725, rate: 0.32 },
        { limit: 609350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
      ],
      married: [
        { limit: 23200, rate: 0.10 },
        { limit: 94300, rate: 0.12 },
        { limit: 201050, rate: 0.22 },
        { limit: 383900, rate: 0.24 },
        { limit: 487450, rate: 0.32 },
        { limit: 731200, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
      ],
      head: [
        { limit: 16550, rate: 0.10 },
        { limit: 63100, rate: 0.12 },
        { limit: 100500, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: 243700, rate: 0.32 },
        { limit: 609350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
      ]
    };
    
    function calculateTaxOwed(taxableIncome, filingStatus) {
      const brackets = taxBrackets[filingStatus];
      let tax = 0;
      let previousLimit = 0;
      
      for (let bracket of brackets) {
        if (taxableIncome > previousLimit) {
          const taxableInBracket = Math.min(taxableIncome, bracket.limit) - previousLimit;
          tax += taxableInBracket * bracket.rate;
          previousLimit = bracket.limit;
        } else {
          break;
        }
      }
      
      return tax;
    }
    
    function calculateRefund() {
      const income = parseFloat(document.getElementById('income').value) || 0;
      const taxPaid = parseFloat(document.getElementById('taxPaid').value) || 0;
      const filingStatus = document.getElementById('filingStatus').value;
      const deductions = parseFloat(document.getElementById('deductions').value) || 0;
      
      if (income <= 0) {
        alert('Please enter a valid income amount.');
        return;
      }
      
      // Calculate taxable income
      const standardDeduction = standardDeductions[filingStatus];
      const totalDeductions = standardDeduction + deductions;
      const taxableIncome = Math.max(0, income - totalDeductions);
      
      // Calculate tax owed
      const taxOwed = calculateTaxOwed(taxableIncome, filingStatus);
      
      // Calculate refund
      const refund = taxPaid - taxOwed;
      
      // Display results
      document.getElementById('taxableIncome').textContent = '$' + taxableIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      document.getElementById('taxOwed').textContent = '$' + taxOwed.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      document.getElementById('taxPaidDisplay').textContent = '$' + taxPaid.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      document.getElementById('refundAmount').textContent = '$' + Math.abs(refund).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      
      // Display message
      const messageEl = document.getElementById('refundMessage');
      if (refund > 0) {
        messageEl.textContent = '🎉 You will receive a refund!';
        messageEl.className = 'refund-message positive';
      } else if (refund < 0) {
        messageEl.textContent = '⚠️ You owe additional taxes.';
        messageEl.className = 'refund-message negative';
      } else {
        messageEl.textContent = '✓ Your taxes are perfectly balanced!';
        messageEl.className = 'refund-message positive';
      }
      
      // Show results
      document.getElementById('results').classList.remove('hidden');
      
      // Smooth scroll to results
      document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Allow Enter key to trigger calculation
    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          calculateRefund();
        }
      });
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
