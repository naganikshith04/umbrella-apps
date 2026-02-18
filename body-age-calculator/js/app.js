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
    const form = document.getElementById('bodyAgeForm');
      const stressSlider = document.getElementById('stressLevel');
      const stressValue = document.getElementById('stressValue');
      const dietSlider = document.getElementById('dietQuality');
      const dietValue = document.getElementById('dietValue');
      const resultDiv = document.getElementById('result');
    
      // Update slider values
      stressSlider.addEventListener('input', function() {
        stressValue.textContent = this.value;
      });

      dietSlider.addEventListener('input', function() {
        dietValue.textContent = this.value;
      });

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateBodyAge();
      });

      function calculateBodyAge() {
        // Get form values
        const actualAge = parseInt(document.getElementById('actualAge').value);
        const gender = document.getElementById('gender').value;
        const activityLevel = document.getElementById('activityLevel').value;
        const sleepHours = parseFloat(document.getElementById('sleepHours').value);
        const stressLevel = parseInt(stressSlider.value);
        const dietQuality = parseInt(dietSlider.value);
        const smoking = document.getElementById('smoking').value === 'yes';
        const alcohol = document.getElementById('alcohol').value;

        // Validate
        if (!actualAge || actualAge < 18 || actualAge > 100) {
          alert('Please enter a valid age between 18 and 100');
          return;
        }

        // Start with actual age
        let bodyAge = actualAge;

        // Activity level adjustments
        if (activityLevel === 'sedentary') bodyAge += 2;
        else if (activityLevel === 'light') bodyAge += 0;
        else if (activityLevel === 'moderate') bodyAge -= 2;
        else if (activityLevel === 'active') bodyAge -= 4;
        else if (activityLevel === 'very-active') bodyAge -= 6;

        // Sleep adjustments
        if (sleepHours < 6) bodyAge += 3;
        else if (sleepHours >= 6 && sleepHours < 7) bodyAge += 1;
        else if (sleepHours >= 7 && sleepHours <= 9) bodyAge -= 1;
        else if (sleepHours > 9) bodyAge += 1;

        // Stress adjustments
        bodyAge += Math.floor(stressLevel / 2);

        // Diet quality adjustments (higher is better)
        bodyAge -= Math.floor((dietQuality - 5) / 2);

        // Smoking adjustments
        if (smoking) bodyAge += 8;

        // Alcohol adjustments
        if (alcohol === 'heavy') bodyAge += 4;
        else if (alcohol === 'moderate') bodyAge += 1;
        else if (alcohol === 'light') bodyAge += 0;
        else if (alcohol === 'none') bodyAge -= 1;

        // Ensure body age is reasonable
        bodyAge = Math.max(18, Math.min(120, bodyAge));

        // Calculate difference
        const difference = bodyAge - actualAge;
        
        // Display results
        let message, className, advice;
        
        if (difference < -5) {
          message = 'Excellent! Your body is significantly younger than your chronological age.';
          className = 'excellent';
          advice = 'Keep up the great lifestyle habits!';
        } else if (difference < 0) {
          message = 'Great! Your body is younger than your chronological age.';
          className = 'good';
          advice = 'You\'re doing well. Keep maintaining these healthy habits.';
        } else if (difference === 0) {
          message = 'Your body age matches your chronological age.';
          className = 'average';
          advice = 'Consider improving your lifestyle to reduce your body age.';
        } else if (difference <= 5) {
          message = 'Your body is slightly older than your chronological age.';
          className = 'warning';
          advice = 'Focus on improving exercise, sleep, and stress management.';
        } else {
          message = 'Your body is significantly older than your chronological age.';
          className = 'poor';
          advice = 'Consider making significant lifestyle changes. Consult a healthcare professional.';
        }

        resultDiv.innerHTML = `
          <h2>Your Body Age: <span class="body-age">${Math.round(bodyAge)}</span> years</h2>
          <p class="difference ${difference < 0 ? 'positive' : 'negative'}">
            ${difference < 0 ? '' : '+'}${Math.round(difference)} years compared to your actual age
          </p>
          <div class="result-message ${className}">
            <p><strong>${message}</strong></p>
            <p>${advice}</p>
          </div>
        `;
        
        resultDiv.style.display = 'block';
      }
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
