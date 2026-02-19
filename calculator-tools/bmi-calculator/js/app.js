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

// BMI Calculator Function
function calculateBMI() {
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const resultDiv = document.getElementById('result');
    const bmiValueSpan = document.getElementById('bmiValue');
    const bmiCategorySpan = document.getElementById('bmiCategory');
    const bmiDescriptionP = document.getElementById('bmiDescription');
    const bmiIndicator = document.getElementById('bmiIndicator');

    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);

    // Validate inputs
    const weightValidation = utils.validateInput(weightInput.value, 'number');
    const heightValidation = utils.validateInput(heightInput.value, 'number');

    if (!weightValidation.valid) {
        utils.showNotification(weightValidation.message, 'error');
        return;
    }

    if (!heightValidation.valid) {
        utils.showNotification(heightValidation.message, 'error');
        return;
    }

    // Calculate BMI (height should be in meters)
    const bmi = weight / (height * height);
    
    // Determine BMI category
    let category = '';
    let description = '';
    let indicatorPosition = 0;

    if (bmi < 18.5) {
        category = 'Underweight';
        description = 'You may need to gain weight. Consult a healthcare provider.';
        indicatorPosition = (bmi / 18.5) * 25;
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
        description = 'You have a healthy weight. Keep it up!';
        indicatorPosition = 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        description = 'You may need to lose some weight. Consider a healthy diet and exercise.';
        indicatorPosition = 50 + ((bmi - 25) / 5) * 25;
    } else {
        category = 'Obese';
        description = 'You should consult a healthcare provider for advice.';
        indicatorPosition = Math.min(75 + ((bmi - 30) / 10) * 25, 100);
    }

    // Display results
    if (bmiValueSpan) bmiValueSpan.textContent = bmi.toFixed(1);
    if (bmiCategorySpan) bmiCategorySpan.textContent = category;
    if (bmiDescriptionP) bmiDescriptionP.textContent = description;
    if (bmiIndicator) bmiIndicator.style.left = `${indicatorPosition}%`;
    if (resultDiv) resultDiv.style.display = 'block';
}

// Main app initialization function
function initApp() {
    console.log('BMI Calculator ready');

    // Get DOM elements
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const calculateBtn = document.getElementById('calculateBtn');

    // Check if elements exist before adding listeners
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateBMI);
    }

    // Allow Enter key to trigger calculation on both inputs
    if (weightInput) {
        weightInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateBMI();
            }
        });
    }

    if (heightInput) {
        heightInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateBMI();
            }
        });
    }
}

// Export utils for use in other scripts (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
