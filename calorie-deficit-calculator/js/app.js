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
      
      calculateBtn.addEventListener('click', calculateCalories);
      
      function calculateCalories() {
        // Get input values
        const age = parseFloat(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const activity = parseFloat(document.getElementById('activity').value);
        const goal = document.getElementById('goal').value;
        const weeklyGoal = parseFloat(document.getElementById('deficit').value);
        
        // Validate inputs
        if (!age || !gender || !weight || !height || !activity || !goal || isNaN(weeklyGoal)) {
          alert('Please fill in all fields correctly.');
          return;
        }
        
        if (weeklyGoal < 0 || weeklyGoal > 2) {
          alert('Weekly goal should be between 0 and 2 kg.');
          return;
        }
        
        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
        
        // Calculate TDEE
        const tdee = bmr * activity;
        
        // Calculate calorie adjustment
        // 1 kg of fat = approximately 7700 calories
        const caloriesPerKg = 7700;
        const weeklyCalorieAdjustment = weeklyGoal * caloriesPerKg;
        const dailyCalorieAdjustment = weeklyCalorieAdjustment / 7;
        
        let targetCalories;
        let adjustmentText;
        let recommendation;
        
        if (goal === 'lose') {
          targetCalories = tdee - dailyCalorieAdjustment;
          adjustmentText = `-${Math.round(dailyCalorieAdjustment)} calories/day`;
          recommendation = `To lose ${weeklyGoal} kg per week, consume ${Math.round(targetCalories)} calories daily. This creates a deficit of ${Math.round(dailyCalorieAdjustment)} calories per day.`;
          
          // Safety check
          const minCalories = gender === 'male' ? 1500 : 1200;
          if (targetCalories < minCalories) {
            recommendation += ` <strong>Warning:</strong> This is below the recommended minimum of ${minCalories} calories. Consider a smaller weekly goal for safer weight loss.`;
          }
        } else if (goal === 'maintain') {
          targetCalories = tdee;
          adjustmentText = `0 calories/day`;
          recommendation = `To maintain your current weight, consume approximately ${Math.round(targetCalories)} calories daily.`;
        } else { // gain
          targetCalories = tdee + dailyCalorieAdjustment;
          adjustmentText = `+${Math.round(dailyCalorieAdjustment)} calories/day`;
          recommendation = `To gain ${weeklyGoal} kg per week, consume ${Math.round(targetCalories)} calories daily. This creates a surplus of ${Math.round(dailyCalorieAdjustment)} calories per day.`;
        }
        
        // Display results
        document.getElementById('bmr').textContent = `${Math.round(bmr)} calories/day`;
        document.getElementById('tdee').textContent = `${Math.round(tdee)} calories/day`;
        document.getElementById('targetCalories').textContent = `${Math.round(targetCalories)} calories/day`;
        document.getElementById('adjustment').textContent = adjustmentText;
        document.getElementById('recommendation').innerHTML = recommendation;
        
        // Show results
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
