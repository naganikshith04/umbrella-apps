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
    // Loan Calculator Logic
    document.getElementById('loanForm').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateLoan();
    });
    
    function calculateLoan() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value);
        const interestRate = parseFloat(document.getElementById('interestRate').value);
        const loanTerm = parseFloat(document.getElementById('loanTerm').value);
        
        const results = calculateLoanDetails(loanAmount, interestRate, loanTerm);
        
        document.getElementById('monthlyPayment').textContent = '$' + results.monthlyPayment.toFixed(2);
        document.getElementById('totalPayment').textContent = '$' + results.totalPayment.toFixed(2);
        document.getElementById('totalInterest').textContent = '$' + results.totalInterest.toFixed(2);
        
        document.getElementById('results').style.display = 'block';
        
        generatePaymentSchedule(loanAmount, interestRate, loanTerm, results.monthlyPayment);
    }
    
    function calculateLoanDetails(principal, annualRate, years) {
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;
        
        let monthlyPayment;
        if (monthlyRate === 0) {
            monthlyPayment = principal / numberOfPayments;
        } else {
            monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        }
        
        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - principal;
        
        return {
            monthlyPayment: monthlyPayment,
            totalPayment: totalPayment,
            totalInterest: totalInterest
        };
    }
    
    function generatePaymentSchedule(principal, annualRate, years, monthlyPayment) {
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;
        let balance = principal;
        
        let scheduleHTML = '<table><thead><tr><th>Payment #</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>';
        
        for (let i = 1; i <= numberOfPayments; i++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;
            
            if (balance < 0) balance = 0;
            
            if (i <= 12 || i > numberOfPayments - 12 || i % 12 === 0) {
                scheduleHTML += `<tr>
                    <td>${i}</td>
                    <td>$${monthlyPayment.toFixed(2)}</td>
                    <td>$${principalPayment.toFixed(2)}</td>
                    <td>$${interestPayment.toFixed(2)}</td>
                    <td>$${balance.toFixed(2)}</td>
                </tr>`;
            }
        }
        
        scheduleHTML += '</tbody></table>';
        document.getElementById('paymentSchedule').innerHTML = scheduleHTML;
    }
    
    // Refinancing Comparison Tool Logic
    document.getElementById('compareBtn').addEventListener('click', function() {
        compareRefinancing();
    });
    
    function compareRefinancing() {
        const currentLoanAmount = parseFloat(document.getElementById('currentLoanAmount').value);
        const currentInterestRate = parseFloat(document.getElementById('currentInterestRate').value);
        const currentRemainingTerm = parseFloat(document.getElementById('currentRemainingTerm').value);
        
        const newLoanAmount = parseFloat(document.getElementById('newLoanAmount').value);
        const newInterestRate = parseFloat(document.getElementById('newInterestRate').value);
        const newLoanTerm = parseFloat(document.getElementById('newLoanTerm').value);
        
        const currentLoan = calculateLoanDetails(currentLoanAmount, currentInterestRate, currentRemainingTerm);
        const newLoan = calculateLoanDetails(newLoanAmount, newInterestRate, newLoanTerm);
        
        document.getElementById('currentMonthlyPayment').textContent = '$' + currentLoan.monthlyPayment.toFixed(2);
        document.getElementById('currentTotalPayment').textContent = '$' + currentLoan.totalPayment.toFixed(2);
        document.getElementById('currentTotalInterest').textContent = '$' + currentLoan.totalInterest.toFixed(2);
        
        document.getElementById('newMonthlyPayment').textContent = '$' + newLoan.monthlyPayment.toFixed(2);
        document.getElementById('newTotalPayment').textContent = '$' + newLoan.totalPayment.toFixed(2);
        document.getElementById('newTotalInterest').textContent = '$' + newLoan.totalInterest.toFixed(2);
        
        const monthlySavings = currentLoan.monthlyPayment - newLoan.monthlyPayment;
        const totalSavings = currentLoan.totalPayment - newLoan.totalPayment;
        const interestSavings = currentLoan.totalInterest - newLoan.totalInterest;
        
        document.getElementById('monthlySavings').textContent = '$' + monthlySavings.toFixed(2);
        document.getElementById('monthlySavings').className = monthlySavings >= 0 ? 'positive' : 'negative';
        
        document.getElementById('totalSavings').textContent = '$' + totalSavings.toFixed(2);
        document.getElementById('totalSavings').className = totalSavings >= 0 ? 'positive' : 'negative';
        
        document.getElementById('interestSavings').textContent = '$' + interestSavings.toFixed(2);
        document.getElementById('interestSavings').className = interestSavings >= 0 ? 'positive' : 'negative';
        
        document.getElementById('comparisonResults').style.display = 'block';
    }
    
    // Auto-sync loan amounts for refinancing
    document.getElementById('currentLoanAmount').addEventListener('input', function() {
        document.getElementById('newLoanAmount').value = this.value;
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
