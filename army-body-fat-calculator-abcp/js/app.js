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
    (function() {
      'use strict';
    
      // DOM Elements
      const genderSelect = document.getElementById('gender');
      const ageInput = document.getElementById('age');
      const heightInput = document.getElementById('height');
      const weightInput = document.getElementById('weight');
      const neckInput = document.getElementById('neck');
      const waistInput = document.getElementById('waist');
      const hipInput = document.getElementById('hip');
      const hipGroup = document.getElementById('hipGroup');
      const calculateBtn = document.getElementById('calculateBtn');
      const resultsSection = document.getElementById('results');
      const bodyFatResult = document.getElementById('bodyFatResult');
      const maxAllowed = document.getElementById('maxAllowed');
      const statusElement = document.getElementById('status');
      const infoBox = document.getElementById('infoBox');
    
      // Event Listeners
      genderSelect.addEventListener('change', toggleHipField);
      calculateBtn.addEventListener('click', calculateBodyFat);
    
      // Initialize
      toggleHipField();
    
      function toggleHipField() {
        const isFemale = genderSelect.value === 'female';
        hipGroup.style.display = isFemale ? 'block' : 'none';
        if (!isFemale) {
          hipInput.value = '';
        }
      }
    
      function getMaxBodyFat(gender, age) {
        if (gender === 'male') {
          if (age >= 17 && age <= 20) return 20;
          if (age >= 21 && age <= 27) return 22;
          if (age >= 28 && age <= 39) return 24;
          if (age >= 40) return 26;
        } else {
          if (age >= 17 && age <= 20) return 30;
          if (age >= 21 && age <= 27) return 32;
          if (age >= 28 && age <= 39) return 34;
          if (age >= 40) return 36;
        }
        return null;
      }
    
      function calculateMaleBodyFat(height, neck, waist) {
        // Army formula for males: 86.010 × log10(abdomen - neck) - 70.041 × log10(height) + 36.76
        const bodyFat = (86.010 * Math.log10(waist - neck)) - (70.041 * Math.log10(height)) + 36.76;
        return bodyFat;
      }
    
      function calculateFemaleBodyFat(height, neck, waist, hip) {
        // Army formula for females: 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387
        const bodyFat = (163.205 * Math.log10(waist + hip - neck)) - (97.684 * Math.log10(height)) - 78.387;
        return bodyFat;
      }
    
      function validateInputs() {
        const age = parseFloat(ageInput.value);
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        const neck = parseFloat(neckInput.value);
        const waist = parseFloat(waistInput.value);
        const gender = genderSelect.value;
    
        if (!age || age < 17 || age > 100) {
          alert('Please enter a valid age (17-100)');
          return false;
        }
    
        if (!height || height < 48 || height > 96) {
          alert('Please enter a valid height (48-96 inches)');
          return false;
        }
    
        if (!weight || weight < 80 || weight > 400) {
          alert('Please enter a valid weight (80-400 lbs)');
          return false;
        }
    
        if (!neck || neck < 8 || neck > 30) {
          alert('Please enter a valid neck circumference (8-30 inches)');
          return false;
        }
    
        if (!waist || waist < 20 || waist > 60) {
          alert('Please enter a valid waist circumference (20-60 inches)');
          return false;
        }
    
        if (gender === 'female') {
          const hip = parseFloat(hipInput.value);
          if (!hip || hip < 20 || hip > 60) {
            alert('Please enter a valid hip circumference (20-60 inches)');
            return false;
          }
        }
    
        if (neck >= waist) {
          alert('Neck circumference must be less than waist circumference');
          return false;
        }
    
        return true;
      }
    
      function calculateBodyFat() {
        if (!validateInputs()) {
          return;
        }
    
        const gender = genderSelect.value;
        const age = parseFloat(ageInput.value);
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        const neck = parseFloat(neckInput.value);
        const waist = parseFloat(waistInput.value);
        const hip = parseFloat(hipInput.value) || 0;
    
        let bodyFatPercentage;
    
        if (gender === 'male') {
          bodyFatPercentage = calculateMaleBodyFat(height, neck, waist);
        } else {
          bodyFatPercentage = calculateFemaleBodyFat(height, neck, waist, hip);
        }
    
        const maxAllowedBF = getMaxBodyFat(gender, age);
        const isPassing = bodyFatPercentage <= maxAllowedBF;
    
        // Display results
        bodyFatResult.textContent = bodyFatPercentage.toFixed(1) + '%';
        maxAllowed.textContent = maxAllowedBF + '%';
        
        statusElement.textContent = isPassing ? 'PASS' : 'FAIL';
        statusElement.className = 'result-value status ' + (isPassing ? 'pass' : 'fail');
    
        // Info box
        if (isPassing) {
          const difference = (maxAllowedBF - bodyFatPercentage).toFixed(1);
          infoBox.innerHTML = `<strong>Congratulations!</strong> You are ${difference}% below the maximum standard.`;
          infoBox.className = 'info-box success';
        } else {
          const difference = (bodyFatPercentage - maxAllowedBF).toFixed(1);
          infoBox.innerHTML = `<strong>Action Required:</strong> You are ${difference}% above the maximum standard. Consult with your unit for ABCP enrollment.`;
          infoBox.className = 'info-box warning';
        }
    
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    })();
    
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
