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
    console.log('Add/Subtract Days Calculator ready');

    const startDateInput = document.getElementById('startDate');
    const daysInput = document.getElementById('daysInput');
    const addBtn = document.getElementById('addBtn');
    const subtractBtn = document.getElementById('subtractBtn');
    const resultDiv = document.getElementById('result');
    
    // Set default date to today
    const today = new Date();
    startDateInput.valueAsDate = today;
    
    function formatDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }
    
    function calculateDate(operation) {
        const startDate = new Date(startDateInput.value);
        const days = parseInt(daysInput.value) || 0;
        
        if (!startDateInput.value) {
            resultDiv.innerHTML = '<p class="error">Please select a start date.</p>';
            resultDiv.style.display = 'block';
            utils.showNotification('Please select a start date', 'error');
            return;
        }
        
        if (days === 0) {
            resultDiv.innerHTML = '<p class="error">Please enter a number of days (not zero).</p>';
            resultDiv.style.display = 'block';
            utils.showNotification('Please enter a valid number of days', 'error');
            return;
        }
        
        const resultDate = new Date(startDate);
        
        if (operation === 'add') {
            resultDate.setDate(startDate.getDate() + days);
        } else if (operation === 'subtract') {
            resultDate.setDate(startDate.getDate() - days);
        }
        
        const daysDifference = Math.abs(days);
        const operationText = operation === 'add' ? 'after' : 'before';
        
        resultDiv.innerHTML = `
            <div class="result-success">
                <h3>Result:</h3>
                <p class="result-date">${formatDate(resultDate)}</p>
                <p class="result-details">
                    ${daysDifference} day${daysDifference !== 1 ? 's' : ''} ${operationText} 
                    ${formatDate(startDate)}
                </p>
                <p class="result-short">${resultDate.toISOString().split('T')[0]}</p>
            </div>
        `;
        resultDiv.style.display = 'block';
        resultDiv.classList.add('fade-in');
        
        utils.showNotification(`Date calculated successfully!`, 'success');
    }
    
    addBtn.addEventListener('click', function() {
        calculateDate('add');
    });
    
    subtractBtn.addEventListener('click', function() {
        calculateDate('subtract');
    });
    
    // Allow Enter key to add days
    [startDateInput, daysInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateDate('add');
            }
        });
    });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
