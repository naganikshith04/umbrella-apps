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
    const startDateInput = document.getElementById('start-date');
      const endDateInput = document.getElementById('end-date');
      const calculateBtn = document.getElementById('calculate-btn');
      const resultDiv = document.getElementById('result');
      
      // Set default dates
      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);
      
      startDateInput.valueAsDate = today;
      endDateInput.valueAsDate = nextYear;
      
      calculateBtn.addEventListener('click', calculateDifference);
      
      function calculateDifference() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        
        if (!startDateInput.value || !endDateInput.value) {
          alert('Please select both start and end dates');
          return;
        }
        
        if (endDate < startDate) {
          alert('End date must be after start date');
          return;
        }
        
        // Calculate differences
        const timeDiff = endDate - startDate;
        const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
        const totalWeeks = Math.floor(totalDays / 7);
        
        // Calculate years, months, and days
        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();
        let days = endDate.getDate() - startDate.getDate();
        
        if (days < 0) {
          months--;
          const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
          days += prevMonth.getDate();
        }
        
        if (months < 0) {
          years--;
          months += 12;
        }
        
        // Update result display
        document.getElementById('total-days').textContent = totalDays;
        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
        document.getElementById('weeks').textContent = totalWeeks;
        document.getElementById('hours').textContent = totalHours;
        
        resultDiv.style.display = 'block';
      }
      
      // Calculate on page load with default values
      calculateDifference();
    
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
