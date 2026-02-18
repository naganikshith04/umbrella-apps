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
    const weightInput = document.getElementById('weight');
        const bodyFatInput = document.getElementById('bodyFat');
        const calculateBtn = document.getElementById('calculateBtn');
        const resultsDiv = document.getElementById('results');
        const errorDiv = document.getElementById('error');
        const lbmResult = document.getElementById('lbmResult');
        const fatMassResult = document.getElementById('fatMassResult');
        const proteinSedentary = document.getElementById('proteinSedentary');
        const proteinModerate = document.getElementById('proteinModerate');
        const proteinActive = document.getElementById('proteinActive');
        const proteinHighPerformance = document.getElementById('proteinHighPerformance');
    
        function calculateLBM() {
            // Hide previous results and errors
            resultsDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';

            // Get input values
            const weight = parseFloat(weightInput.value);
            const bodyFat = parseFloat(bodyFatInput.value);

            // Validate inputs
            if (isNaN(weight) || weight <= 0) {
                errorDiv.textContent = 'Please enter a valid weight';
                errorDiv.style.display = 'block';
                return;
            }

            if (isNaN(bodyFat) || bodyFat < 0 || bodyFat > 100) {
                errorDiv.textContent = 'Please enter a valid body fat percentage (0-100)';
                errorDiv.style.display = 'block';
                return;
            }

            // Calculate fat mass and lean body mass
            const fatMass = (bodyFat / 100) * weight;
            const lbm = weight - fatMass;

            // Calculate protein recommendations (g per kg of LBM)
            const sedentary = lbm * 1.2;
            const moderate = lbm * 1.6;
            const active = lbm * 2.0;
            const highPerformance = lbm * 2.4;

            // Display results
            lbmResult.textContent = lbm.toFixed(2);
            fatMassResult.textContent = fatMass.toFixed(2);
            proteinSedentary.textContent = sedentary.toFixed(0);
            proteinModerate.textContent = moderate.toFixed(0);
            proteinActive.textContent = active.toFixed(0);
            proteinHighPerformance.textContent = highPerformance.toFixed(0);

            resultsDiv.style.display = 'block';
        }

        calculateBtn.addEventListener('click', calculateLBM);
        
        weightInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateLBM();
        });

        bodyFatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateLBM();
        });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
