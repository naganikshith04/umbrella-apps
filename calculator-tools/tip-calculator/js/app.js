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
            if (num <= 0) {
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

// Tip Calculator Function
function calculateTip() {
    const billAmountInput = document.getElementById('billAmount');
    const tipPercentageInput = document.getElementById('tipPercentage');
    const splitCountInput = document.getElementById('splitCount');
    const tipAmountDisplay = document.getElementById('tipAmount');
    const totalAmountDisplay = document.getElementById('totalAmount');
    const perPersonAmountDisplay = document.getElementById('perPersonAmount');
    const resultsDiv = document.getElementById('results');

    const billAmount = parseFloat(billAmountInput.value) || 0;
    const tipPercentage = parseFloat(tipPercentageInput.value) || 0;
    const splitCount = parseInt(splitCountInput.value) || 1;

    // Validate inputs
    const billValidation = utils.validateInput(billAmountInput.value, 'number');
    
    if (!billValidation.valid) {
        utils.showNotification(billValidation.message, 'error');
        return;
    }

    if (billAmount <= 0) {
        utils.showNotification('Please enter a valid bill amount', 'error');
        return;
    }

    if (splitCount < 1) {
        utils.showNotification('Split count must be at least 1', 'error');
        splitCountInput.value = 1;
        return;
    }

    // Calculate tip and totals
    const tipAmount = billAmount * (tipPercentage / 100);
    const totalAmount = billAmount + tipAmount;
    const perPersonAmount = totalAmount / splitCount;

    // Display results with proper formatting
    if (tipAmountDisplay) tipAmountDisplay.textContent = '$' + tipAmount.toFixed(2);
    if (totalAmountDisplay) totalAmountDisplay.textContent = '$' + totalAmount.toFixed(2);
    if (perPersonAmountDisplay) perPersonAmountDisplay.textContent = '$' + perPersonAmount.toFixed(2);

    // Show results section
    if (resultsDiv) {
        resultsDiv.style.display = 'block';
    }
}

// Main app initialization function
function initApp() {
    console.log('Tip Calculator ready');

    // Get DOM elements
    const billAmountInput = document.getElementById('billAmount');
    const tipPercentageInput = document.getElementById('tipPercentage');
    const splitCountInput = document.getElementById('splitCount');
    const calculateBtn = document.getElementById('calculateBtn');

    // Check if elements exist
    if (!billAmountInput || !calculateBtn) {
        console.error('Required elements not found');
        return;
    }

    // Add event listener to calculate button
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateTip);
    }

    // Allow Enter key to trigger calculation on all inputs
    if (billAmountInput) {
        billAmountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateTip();
            }
        });
    }

    if (tipPercentageInput) {
        tipPercentageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateTip();
            }
        });
    }

    if (splitCountInput) {
        splitCountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateTip();
            }
        });
    }

    // Auto-calculate when tip percentage changes
    if (tipPercentageInput) {
        tipPercentageInput.addEventListener('input', function() {
            if (billAmountInput.value) {
                calculateTip();
            }
        });
    }

    // Auto-calculate when split count changes
    if (splitCountInput) {
        splitCountInput.addEventListener('input', function() {
            if (billAmountInput.value) {
                calculateTip();
            }
        });
    }

    // Set default values
    if (tipPercentageInput && !tipPercentageInput.value) {
        tipPercentageInput.value = 15;
    }
    
    if (splitCountInput && !splitCountInput.value) {
        splitCountInput.value = 1;
    }
}

// Export utils for use in other scripts (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
