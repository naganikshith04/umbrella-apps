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
      
      // Muscle gain rates (kg per month) based on experience and gender
      const muscleGainRates = {
        male: {
          beginner: { min: 0.9, max: 1.4 },
          intermediate: { min: 0.45, max: 0.9 },
          advanced: { min: 0.23, max: 0.45 },
          elite: { min: 0.11, max: 0.23 }
        },
        female: {
          beginner: { min: 0.45, max: 0.7 },
          intermediate: { min: 0.23, max: 0.45 },
          advanced: { min: 0.11, max: 0.23 },
          elite: { min: 0.05, max: 0.11 }
        }
      };
      
      calculateBtn.addEventListener('click', function() {
        const gender = document.getElementById('gender').value;
        const experience = document.getElementById('experience').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const timeframe = document.getElementById('timeframe').value;
        
        // Validation
        if (!weight || weight < 30 || weight > 300) {
          alert('Please enter a valid body weight between 30 and 300 kg');
          return;
        }
        
        // Get rates for selected gender and experience
        const rates = muscleGainRates[gender][experience];
        
        let minGain = rates.min;
        let maxGain = rates.max;
        
        // Convert to yearly if needed
        if (timeframe === 'year') {
          minGain *= 12;
          maxGain *= 12;
        }
        
        const avgGain = (minGain + maxGain) / 2;
        
        // Calculate as percentage of body weight
        const minPercent = ((minGain / weight) * 100).toFixed(2);
        const maxPercent = ((maxGain / weight) * 100).toFixed(2);
        const avgPercent = ((avgGain / weight) * 100).toFixed(2);
        
        // Display results
        const timeframeText = timeframe === 'month' ? 'month' : 'year';
        document.getElementById('minGain').textContent = `${minGain.toFixed(2)} kg (${minPercent}% of body weight) per ${timeframeText}`;
        document.getElementById('maxGain').textContent = `${maxGain.toFixed(2)} kg (${maxPercent}% of body weight) per ${timeframeText}`;
        document.getElementById('avgGain').textContent = `${avgGain.toFixed(2)} kg (${avgPercent}% of body weight) per ${timeframeText}`;
        
        // Show results
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
