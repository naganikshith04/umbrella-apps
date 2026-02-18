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
    document.getElementById('calculate-btn').addEventListener('click', calculateAffordability);
    
    function calculateAffordability() {
      // Get input values
      const annualIncome = parseFloat(document.getElementById('annual-income').value) || 0;
      const monthlyDebt = parseFloat(document.getElementById('monthly-debt').value) || 0;
      const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
      const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
      const loanTerm = parseInt(document.getElementById('loan-term').value) || 30;
      
      // Validate inputs
      if (annualIncome <= 0) {
        alert('Please enter a valid annual income');
        return;
      }
      
      // Calculate monthly income
      const monthlyIncome = annualIncome / 12;
      
      // Use 28% front-end ratio and 36% back-end ratio (conservative approach)
      const maxMonthlyHousingPayment = monthlyIncome * 0.28;
      const maxTotalMonthlyDebt = monthlyIncome * 0.36;
      
      // Calculate maximum monthly payment based on back-end ratio
      const maxPaymentFromBackEnd = maxTotalMonthlyDebt - monthlyDebt;
      
      // Use the lower of the two ratios
      const maxMonthlyPayment = Math.min(maxMonthlyHousingPayment, maxPaymentFromBackEnd);
      
      if (maxMonthlyPayment <= 0) {
        alert('Your current debt is too high relative to your income. Consider reducing debt before buying a home.');
        return;
      }
      
      // Estimate that principal & interest is about 70% of total payment
      // (remaining 30% for taxes, insurance, HOA, etc.)
      const principalAndInterest = maxMonthlyPayment * 0.70;
      
      // Calculate maximum loan amount using mortgage formula
      const monthlyRate = (interestRate / 100) / 12;
      const numPayments = loanTerm * 12;
      
      let maxLoanAmount;
      if (monthlyRate === 0) {
        maxLoanAmount = principalAndInterest * numPayments;
      } else {
        maxLoanAmount = principalAndInterest * ((Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments)));
      }
      
      // Calculate maximum home price
      const maxHomePrice = maxLoanAmount + downPayment;
      
      // Calculate actual monthly payment for the max loan
      let actualPI;
      if (monthlyRate === 0) {
        actualPI = maxLoanAmount / numPayments;
      } else {
        actualPI = maxLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      }
      
      // Estimate property tax (1.2% annually) and insurance (0.5% annually)
      const monthlyPropertyTax = (maxHomePrice * 0.012) / 12;
      const monthlyInsurance = (maxHomePrice * 0.005) / 12;
      const totalMonthlyPayment = actualPI + monthlyPropertyTax + monthlyInsurance;
      
      // Calculate DTI ratio
      const dtiRatio = ((totalMonthlyPayment + monthlyDebt) / monthlyIncome) * 100;
      
      // Display results
      document.getElementById('max-price').textContent = formatCurrency(maxHomePrice);
      document.getElementById('max-loan').textContent = formatCurrency(maxLoanAmount);
      document.getElementById('monthly-payment').textContent = formatCurrency(actualPI);
      document.getElementById('dti-ratio').textContent = dtiRatio.toFixed(1) + '%';
      
      // DTI status
      const dtiStatus = document.getElementById('dti-status');
      if (dtiRatio <= 36) {
        dtiStatus.textContent = 'Excellent - Well within recommended range';
        dtiStatus.style.color = '#27ae60';
      } else if (dtiRatio <= 43) {
        dtiStatus.textContent = 'Good - Within acceptable range';
        dtiStatus.style.color = '#f39c12';
      } else {
        dtiStatus.textContent = 'High - May be difficult to qualify';
        dtiStatus.style.color = '#e74c3c';
      }
      
      // Breakdown
      document.getElementById('breakdown-pi').textContent = formatCurrency(actualPI);
      document.getElementById('breakdown-tax').textContent = formatCurrency(monthlyPropertyTax);
      document.getElementById('breakdown-insurance').textContent = formatCurrency(monthlyInsurance);
      document.getElementById('breakdown-total').textContent = formatCurrency(totalMonthlyPayment);
      
      // Show results
      document.getElementById('results').style.display = 'block';
      document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    function formatCurrency(amount) {
      return '$' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    // Allow Enter key to trigger calculation
    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          calculateAffordability();
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
