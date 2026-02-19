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
    initApp();
});

// Main app initialization function
function initApp() {
    console.log('Loan Calculator ready');

    // Get DOM elements
    const calculateBtn = document.getElementById('calculateBtn');
    const loanAmountInput = document.getElementById('loanAmount');
    const interestRateInput = document.getElementById('interestRate');
    const loanTermInput = document.getElementById('loanTerm');
    const resultsDiv = document.getElementById('results');
    const amortizationDiv = document.getElementById('amortizationSchedule');
    const monthlyPaymentSpan = document.getElementById('monthlyPayment');
    const totalPaymentSpan = document.getElementById('totalPayment');
    const totalInterestSpan = document.getElementById('totalInterest');
    const scheduleBody = document.getElementById('scheduleBody');

    calculateBtn.addEventListener('click', calculateLoan);

    // Allow Enter key to trigger calculation
    [loanAmountInput, interestRateInput, loanTermInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateLoan();
            }
        });
    });

    function calculateLoan() {
        // Get input values
        const principal = parseFloat(loanAmountInput.value);
        const annualRate = parseFloat(interestRateInput.value);
        const years = parseInt(loanTermInput.value);

        // Validation
        if (!principal || principal <= 0) {
            utils.showNotification('Please enter a valid loan amount', 'error');
            return;
        }

        if (!annualRate || annualRate < 0) {
            utils.showNotification('Please enter a valid interest rate', 'error');
            return;
        }

        if (!years || years <= 0) {
            utils.showNotification('Please enter a valid loan term', 'error');
            return;
        }

        // Calculate monthly payment
        const monthlyRate = annualRate / 100 / 12;
        const numPayments = years * 12;
        
        let monthlyPayment;
        if (monthlyRate === 0) {
            monthlyPayment = principal / numPayments;
        } else {
            monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                            (Math.pow(1 + monthlyRate, numPayments) - 1);
        }

        const totalPayment = monthlyPayment * numPayments;
        const totalInterest = totalPayment - principal;

        // Display results
        monthlyPaymentSpan.textContent = '$' + monthlyPayment.toFixed(2);
        totalPaymentSpan.textContent = '$' + totalPayment.toFixed(2);
        totalInterestSpan.textContent = '$' + totalInterest.toFixed(2);

        // Generate amortization schedule
        generateAmortizationSchedule(principal, monthlyRate, monthlyPayment, numPayments);

        // Show results
        resultsDiv.style.display = 'block';
        amortizationDiv.style.display = 'block';
        resultsDiv.classList.add('fade-in');

        utils.showNotification('Loan calculated successfully!', 'success');
    }

    function generateAmortizationSchedule(principal, monthlyRate, monthlyPayment, numPayments) {
        scheduleBody.innerHTML = '';
        
        let balance = principal;
        let totalInterestPaid = 0;

        for (let month = 1; month <= numPayments; month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;
            totalInterestPaid += interestPayment;

            // Make sure balance doesn't go negative due to rounding
            if (balance < 0) balance = 0;

            // Only show first 12 months, last 12 months, and every 12 months in between
            if (month <= 12 || month > numPayments - 12 || month % 12 === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${month}</td>
                    <td>$${monthlyPayment.toFixed(2)}</td>
                    <td>$${principalPayment.toFixed(2)}</td>
                    <td>$${interestPayment.toFixed(2)}</td>
                    <td>$${balance.toFixed(2)}</td>
                `;
                scheduleBody.appendChild(row);
            } else if (month === 13 && numPayments > 24) {
                // Add ellipsis row
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="5" style="text-align: center; color: #666;">
                        ... (showing yearly intervals) ...
                    </td>
                `;
                scheduleBody.appendChild(row);
            }
        }
    }
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
