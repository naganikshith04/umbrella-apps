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
    document.getElementById('pregnancyForm').addEventListener('submit', function(e) {
      e.preventDefault();
      calculateWeightGain();
    });
    
    function calculateWeightGain() {
      // Get input values
      const heightFt = parseFloat(document.getElementById('heightFt').value);
      const heightIn = parseFloat(document.getElementById('heightIn').value);
      const preWeight = parseFloat(document.getElementById('preWeight').value);
      const currentWeight = parseFloat(document.getElementById('currentWeight').value);
      const weeks = parseFloat(document.getElementById('weeks').value);
      const pregnancyType = document.getElementById('pregnancyType').value;
      
      // Validate inputs
      if (isNaN(heightFt) || isNaN(heightIn) || isNaN(preWeight) || isNaN(currentWeight) || isNaN(weeks)) {
        alert('Please fill in all fields with valid numbers');
        return;
      }
      
      // Calculate height in inches
      const totalHeightInches = (heightFt * 12) + heightIn;
      
      // Calculate BMI
      const bmi = (preWeight / (totalHeightInches * totalHeightInches)) * 703;
      
      // Determine BMI category and recommended weight gain
      let category = '';
      let minGain = 0;
      let maxGain = 0;
      
      if (pregnancyType === 'single') {
        if (bmi < 18.5) {
          category = 'Underweight';
          minGain = 28;
          maxGain = 40;
        } else if (bmi >= 18.5 && bmi < 25) {
          category = 'Normal Weight';
          minGain = 25;
          maxGain = 35;
        } else if (bmi >= 25 && bmi < 30) {
          category = 'Overweight';
          minGain = 15;
          maxGain = 25;
        } else {
          category = 'Obese';
          minGain = 11;
          maxGain = 20;
        }
      } else { // twins
        if (bmi < 18.5) {
          category = 'Underweight';
          minGain = 50;
          maxGain = 62;
        } else if (bmi >= 18.5 && bmi < 25) {
          category = 'Normal Weight';
          minGain = 37;
          maxGain = 54;
        } else if (bmi >= 25 && bmi < 30) {
          category = 'Overweight';
          minGain = 31;
          maxGain = 50;
        } else {
          category = 'Obese';
          minGain = 25;
          maxGain = 42;
        }
      }
      
      // Calculate current weight gain
      const currentGain = currentWeight - preWeight;
      
      // Calculate expected gain at current week
      // Most weight gain occurs after week 13
      let expectedGain = 0;
      if (weeks <= 13) {
        expectedGain = (minGain + maxGain) / 2 * 0.1; // About 10% in first trimester
      } else {
        const weeksAfter13 = weeks - 13;
        const remainingWeeks = 40 - 13;
        const remainingGain = ((minGain + maxGain) / 2) * 0.9;
        expectedGain = (((minGain + maxGain) / 2) * 0.1) + (remainingGain * (weeksAfter13 / remainingWeeks));
      }
      
      // Determine status
      let status = '';
      let statusColor = '';
      if (currentGain < expectedGain - 5) {
        status = 'Below Expected Range';
        statusColor = '#ff9800';
      } else if (currentGain > expectedGain + 5) {
        status = 'Above Expected Range';
        statusColor = '#ff5722';
      } else {
        status = 'On Track';
        statusColor = '#4caf50';
      }
      
      // Calculate progress percentage
      const progressPercent = Math.min((currentGain / maxGain) * 100, 100);
      
      // Display results
      document.getElementById('bmiValue').textContent = bmi.toFixed(1);
      document.getElementById('bmiCategory').textContent = category;
      document.getElementById('currentGain').textContent = currentGain.toFixed(1) + ' lbs';
      document.getElementById('recommendedGain').textContent = minGain + ' - ' + maxGain + ' lbs';
      document.getElementById('expectedGain').textContent = expectedGain.toFixed(1) + ' lbs';
      document.getElementById('status').textContent = status;
      document.getElementById('status').style.color = statusColor;
      
      // Update progress bar
      const progressFill = document.getElementById('progressFill');
      progressFill.style.width = progressPercent + '%';
      
      // Guidelines text
      let guidelines = '';
      if (pregnancyType === 'single') {
        guidelines = `For ${category.toLowerCase()} individuals with a single pregnancy, the recommended total weight gain is ${minGain}-${maxGain} lbs. `;
        if (weeks > 13) {
          const weeklyRate = ((minGain + maxGain) / 2 * 0.9) / 27;
          guidelines += `After the first trimester, aim for approximately ${weeklyRate.toFixed(1)} lbs per week.`;
        } else {
          guidelines += `During the first trimester, weight gain is typically minimal (2-4 lbs total).`;
        }
      } else {
        guidelines = `For ${category.toLowerCase()} individuals with twins, the recommended total weight gain is ${minGain}-${maxGain} lbs. Weight gain with twins is typically higher than singleton pregnancies.`;
      }
      
      document.getElementById('guidelines').textContent = guidelines;
      
      // Show results
      document.getElementById('results').classList.remove('hidden');
      
      // Scroll to results
      document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
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
