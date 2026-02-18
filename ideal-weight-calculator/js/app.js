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
      const resultsSection = document.getElementById('results');
      
      calculateBtn.addEventListener('click', calculateIdealWeight);
      
      function calculateIdealWeight() {
        const height = parseFloat(document.getElementById('height').value);
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const currentWeight = parseFloat(document.getElementById('currentWeight').value);
        
        // Validation
        if (!height || !age || !gender || !currentWeight) {
          alert('Please fill in all fields');
          return;
        }
        
        if (height < 100 || height > 250) {
          alert('Please enter a valid height between 100 and 250 cm');
          return;
        }
        
        if (age < 1 || age > 120) {
          alert('Please enter a valid age');
          return;
        }
        
        if (currentWeight < 20 || currentWeight > 300) {
          alert('Please enter a valid weight');
          return;
        }
        
        // Calculate ideal weight using multiple formulas
        const heightInMeters = height / 100;
        const heightInInches = height / 2.54;
        
        // Robinson Formula
        let robinson;
        if (gender === 'male') {
          robinson = 52 + 1.9 * (heightInInches - 60);
        } else {
          robinson = 49 + 1.7 * (heightInInches - 60);
        }
        
        // Miller Formula
        let miller;
        if (gender === 'male') {
          miller = 56.2 + 1.41 * (heightInInches - 60);
        } else {
          miller = 53.1 + 1.36 * (heightInInches - 60);
        }
        
        // Devine Formula
        let devine;
        if (gender === 'male') {
          devine = 50 + 2.3 * (heightInInches - 60);
        } else {
          devine = 45.5 + 2.3 * (heightInInches - 60);
        }
        
        // Hamwi Formula
        let hamwi;
        if (gender === 'male') {
          hamwi = 48 + 2.7 * (heightInInches - 60);
        } else {
          hamwi = 45.5 + 2.2 * (heightInInches - 60);
        }
        
        // BMI-based ideal weight (BMI 21.5 as target)
        const idealBMI = 21.5;
        const bmiBasedWeight = idealBMI * heightInMeters * heightInMeters;
        
        // Calculate average and range
        const weights = [robinson, miller, devine, hamwi, bmiBasedWeight];
        const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
        const minWeight = Math.min(...weights);
        const maxWeight = Math.max(...weights);
        
        // Calculate current BMI
        const currentBMI = currentWeight / (heightInMeters * heightInMeters);
        
        // Display results
        displayResults(minWeight, maxWeight, avgWeight, currentBMI, currentWeight, heightInMeters, age, gender);
        
        // Show results section
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }

      function displayResults(minWeight, maxWeight, avgWeight, currentBMI, currentWeight, heightInMeters, age, gender) {
        const difference = currentWeight - avgWeight;
        const diffPercent = ((difference / avgWeight) * 100).toFixed(1);

        let statusClass, statusText;
        if (currentBMI < 18.5) {
          statusClass = 'underweight';
          statusText = 'Underweight';
        } else if (currentBMI < 25) {
          statusClass = 'normal';
          statusText = 'Normal Weight';
        } else if (currentBMI < 30) {
          statusClass = 'overweight';
          statusText = 'Overweight';
        } else {
          statusClass = 'obese';
          statusText = 'Obese';
        }

        resultsSection.innerHTML = `
          <h2>Your Ideal Weight Results</h2>
          <div class="result-box">
            <div class="result-item">
              <h3>Ideal Weight Range</h3>
              <p class="big-number">${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg</p>
              <p>Average: <strong>${avgWeight.toFixed(1)} kg</strong></p>
            </div>
            <div class="result-item">
              <h3>Your Current Status</h3>
              <p class="status ${statusClass}">${statusText}</p>
              <p>BMI: <strong>${currentBMI.toFixed(1)}</strong></p>
              <p>Current Weight: <strong>${currentWeight} kg</strong></p>
            </div>
            <div class="result-item">
              <h3>Weight Difference</h3>
              <p class="big-number ${difference > 0 ? 'negative' : 'positive'}">
                ${difference > 0 ? '+' : ''}${difference.toFixed(1)} kg
              </p>
              <p>${Math.abs(diffPercent)}% ${difference > 0 ? 'above' : 'below'} ideal</p>
            </div>
          </div>
          <div class="recommendations">
            <h3>Recommendations</h3>
            ${generateRecommendations(difference, currentBMI)}
          </div>
        `;
      }

      function generateRecommendations(difference, currentBMI) {
        let recommendations = '<ul>';
        
        if (difference > 5) {
          recommendations += '<li>Consider a gradual weight loss plan of 0.5-1 kg per week</li>';
          recommendations += '<li>Focus on a balanced diet with controlled portions</li>';
          recommendations += '<li>Increase physical activity to 150+ minutes per week</li>';
        } else if (difference < -5) {
          recommendations += '<li>Consider a gradual weight gain plan</li>';
          recommendations += '<li>Increase caloric intake with nutritious foods</li>';
          recommendations += '<li>Include strength training exercises</li>';
        } else {
          recommendations += '<li>Maintain your current weight through balanced nutrition</li>';
          recommendations += '<li>Continue regular physical activity</li>';
          recommendations += '<li>Monitor your weight periodically</li>';
        }
        
        recommendations += '<li>Consult with a healthcare professional for personalized advice</li>';
        recommendations += '</ul>';
        
        return recommendations;
      }
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
