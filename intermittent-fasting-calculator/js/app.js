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
    const fastingMethodSelect = document.getElementById('fasting-method');
      const customHoursDiv = document.getElementById('custom-hours');
      const fastingHoursInput = document.getElementById('fasting-hours');
      const eatingHoursInput = document.getElementById('eating-hours');
      const startTimeInput = document.getElementById('start-time');
      const calculateBtn = document.getElementById('calculate-btn');
      const resultsDiv = document.getElementById('results');
    
      // Tips database
      const tipsDatabase = {
        '16:8': [
          'Start with 12:12 if you\'re new to fasting',
          'Stay hydrated during fasting hours',
          'Black coffee and tea are allowed during fasting',
          'Break your fast with a balanced meal',
          'Listen to your body and adjust as needed'
        ],
        '18:6': [
          'This is an advanced fasting method',
          'Ensure adequate nutrition in your eating window',
          'Stay busy during fasting hours',
          'Consider electrolyte supplementation',
          'Monitor your energy levels closely'
        ],
        '20:4': [
          'This is a very advanced protocol',
          'Eat nutrient-dense foods in your window',
          'May not be suitable for everyone',
          'Consider cycling with easier protocols',
          'Prioritize protein and healthy fats'
        ],
        '14:10': [
          'Great for beginners',
          'Easy to maintain long-term',
          'Allows flexibility in meal timing',
          'Good for gradual adaptation',
          'Can be done daily without stress'
        ],
        '12:12': [
          'Perfect starting point for beginners',
          'Mimics natural eating patterns',
          'Very sustainable long-term',
          'Good for metabolic health',
          'Easy to fit into any lifestyle'
        ]
      };
    
      // Show/hide custom hours
      fastingMethodSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
          customHoursDiv.classList.remove('hidden');
        } else {
          customHoursDiv.classList.add('hidden');
        }
      });

      calculateBtn.addEventListener('click', function() {
        const method = fastingMethodSelect.value;
        const startTime = startTimeInput.value;

        if (!startTime) {
          alert('Please select a start time');
          return;
        }

        let fastingHours, eatingHours;

        if (method === 'custom') {
          fastingHours = parseInt(fastingHoursInput.value);
          eatingHours = parseInt(eatingHoursInput.value);
          
          if (!fastingHours || !eatingHours || fastingHours + eatingHours !== 24) {
            alert('Fasting and eating hours must add up to 24');
            return;
          }
        } else {
          const [fasting, eating] = method.split(':').map(Number);
          fastingHours = fasting;
          eatingHours = eating;
        }

        // Calculate times
        const start = new Date('2000-01-01 ' + startTime);
        const fastEnd = new Date(start.getTime() + fastingHours * 60 * 60 * 1000);
        const eatEnd = new Date(fastEnd.getTime() + eatingHours * 60 * 60 * 1000);

        const formatTime = (date) => {
          return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        };

        // Get tips
        const methodKey = method === 'custom' ? '16:8' : method;
        const tips = tipsDatabase[methodKey] || tipsDatabase['16:8'];

        // Display results
        resultsDiv.innerHTML = `
          <h3>Your Fasting Schedule</h3>
          <div class="schedule">
            <div class="schedule-item">
              <strong>Fasting Period:</strong> ${fastingHours} hours
              <br>
              <span class="time-range">${formatTime(start)} - ${formatTime(fastEnd)}</span>
            </div>
            <div class="schedule-item">
              <strong>Eating Window:</strong> ${eatingHours} hours
              <br>
              <span class="time-range">${formatTime(fastEnd)} - ${formatTime(eatEnd)}</span>
            </div>
          </div>
          <div class="tips">
            <h4>Tips for Success:</h4>
            <ul>
              ${tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
        `;

        resultsDiv.classList.remove('hidden');
      });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
