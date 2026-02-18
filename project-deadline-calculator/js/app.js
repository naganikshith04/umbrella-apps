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
    const calculateBtn = document.getElementById('calculateBtn');
      const resultDiv = document.getElementById('result');
      const errorDiv = document.getElementById('error');
      
      calculateBtn.addEventListener('click', calculateDeadline);
      
      function calculateDeadline() {
        // Clear previous results
        errorDiv.classList.add('hidden');
        resultDiv.classList.add('hidden');
        
        // Get input values
        const projectName = document.getElementById('projectName').value.trim();
        const startDateInput = document.getElementById('startDate').value;
        const duration = parseInt(document.getElementById('duration').value);
        
        // Validate inputs
        if (!projectName) {
          showError('Please enter a project name');
          return;
        }
        
        if (!startDateInput) {
          showError('Please select a start date');
          return;
        }
        
        if (!duration || duration < 1) {
          showError('Please enter a valid duration (at least 1 day)');
          return;
        }
        
        // Get selected work days
        const workDayCheckboxes = document.querySelectorAll('.workday:checked');
        if (workDayCheckboxes.length === 0) {
          showError('Please select at least one work day');
          return;
        }
        
        const workDays = Array.from(workDayCheckboxes).map(cb => parseInt(cb.value));
        
        // Calculate deadline
        const startDate = new Date(startDateInput);
        let currentDate = new Date(startDate);
        let workDaysCount = 0;
        let calendarDays = 0;
        
        while (workDaysCount < duration) {
          const dayOfWeek = currentDate.getDay();
          
          if (workDays.includes(dayOfWeek)) {
            workDaysCount++;
          }
          
          if (workDaysCount < duration) {
            currentDate.setDate(currentDate.getDate() + 1);
            calendarDays++;
          }
        }
        
        calendarDays++; // Include the final day
        
        // Display results
        document.getElementById('resultProject').textContent = projectName;
        document.getElementById('resultStart').textContent = formatDate(startDate);
        document.getElementById('resultEnd').textContent = formatDate(currentDate);
        document.getElementById('resultDays').textContent = duration;
        document.getElementById('resultCalendar').textContent = calendarDays;
        
        resultDiv.classList.remove('hidden');
      }
      
      function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
      }
      
      function formatDate(date) {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      }
      
      // Set default start date to today
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('startDate').value = today;
    
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
