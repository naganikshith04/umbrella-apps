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
    document.getElementById('calculateBtn').addEventListener('click', calculatePace);
    document.getElementById('calculateTargetBtn').addEventListener('click', calculateTarget);
    
    function calculatePace() {
      const distance = parseFloat(document.getElementById('distance').value);
      const distanceUnit = document.getElementById('distanceUnit').value;
      const hours = parseInt(document.getElementById('hours').value) || 0;
      const minutes = parseInt(document.getElementById('minutes').value) || 0;
      const seconds = parseInt(document.getElementById('seconds').value) || 0;
      
      if (!distance || distance <= 0) {
        alert('Please enter a valid distance');
        return;
      }
      
      if (hours === 0 && minutes === 0 && seconds === 0) {
        alert('Please enter a valid time');
        return;
      }
      
      // Convert distance to kilometers
      let distanceInKm = distance;
      if (distanceUnit === 'miles') {
        distanceInKm = distance * 1.60934;
      } else if (distanceUnit === 'meters') {
        distanceInKm = distance / 1000;
      }
      
      // Convert time to total seconds
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      // Calculate pace per km (in seconds)
      const pacePerKmSeconds = totalSeconds / distanceInKm;
      const pacePerKmMin = Math.floor(pacePerKmSeconds / 60);
      const pacePerKmSec = Math.round(pacePerKmSeconds % 60);
      
      // Calculate pace per mile
      const distanceInMiles = distanceInKm * 0.621371;
      const pacePerMileSeconds = totalSeconds / distanceInMiles;
      const pacePerMileMin = Math.floor(pacePerMileSeconds / 60);
      const pacePerMileSec = Math.round(pacePerMileSeconds % 60);
      
      // Calculate speed in km/h
      const speedKmh = (distanceInKm / totalSeconds) * 3600;
      
      // Display results
      document.getElementById('pacePerKm').textContent = 
        `${pacePerKmMin}:${pacePerKmSec.toString().padStart(2, '0')} min/km`;
      document.getElementById('pacePerMile').textContent = 
        `${pacePerMileMin}:${pacePerMileSec.toString().padStart(2, '0')} min/mile`;
      document.getElementById('speed').textContent = 
        `${speedKmh.toFixed(2)} km/h`;
      
      document.getElementById('results').classList.remove('hidden');
    }
    
    function calculateTarget() {
      const paceMin = parseInt(document.getElementById('knownPaceMin').value) || 0;
      const paceSec = parseInt(document.getElementById('knownPaceSec').value) || 0;
      const targetDistance = parseFloat(document.getElementById('targetDistance').value);
      const targetHours = parseInt(document.getElementById('targetHours').value) || 0;
      const targetMinutes = parseInt(document.getElementById('targetMinutes').value) || 0;
      const targetSeconds = parseInt(document.getElementById('targetSeconds').value) || 0;
      
      if (paceMin === 0 && paceSec === 0) {
        alert('Please enter a valid pace');
        return;
      }
      
      const paceInSeconds = paceMin * 60 + paceSec;
      const targetTimeInSeconds = targetHours * 3600 + targetMinutes * 60 + targetSeconds;
      
      let resultText = '';
      
      // If distance is empty, calculate distance from time and pace
      if (!targetDistance || targetDistance <= 0) {
        if (targetTimeInSeconds === 0) {
          alert('Please enter either a target distance or target time');
          return;
        }
        
        const calculatedDistance = targetTimeInSeconds / paceInSeconds;
        resultText = `You can run ${calculatedDistance.toFixed(2)} km in the given time`;
      } 
      // If time is empty, calculate time from distance and pace
      else if (targetTimeInSeconds === 0) {
        const calculatedTimeSeconds = targetDistance * paceInSeconds;
        const calcHours = Math.floor(calculatedTimeSeconds / 3600);
        const calcMinutes = Math.floor((calculatedTimeSeconds % 3600) / 60);
        const calcSeconds = Math.round(calculatedTimeSeconds % 60);
        
        resultText = `Time needed: ${calcHours}:${calcMinutes.toString().padStart(2, '0')}:${calcSeconds.toString().padStart(2, '0')}`;
      }
      // Both are filled - show comparison
      else {
        const expectedTimeSeconds = targetDistance * paceInSeconds;
        const difference = targetTimeInSeconds - expectedTimeSeconds;
        
        if (Math.abs(difference) < 1) {
          resultText = 'Your target time matches your pace perfectly!';
        } else if (difference > 0) {
          const diffMin = Math.floor(Math.abs(difference) / 60);
          const diffSec = Math.round(Math.abs(difference) % 60);
          resultText = `You have ${diffMin}:${diffSec.toString().padStart(2, '0')} extra time. You can run slower!`;
        } else {
          const diffMin = Math.floor(Math.abs(difference) / 60);
          const diffSec = Math.round(Math.abs(difference) % 60);
          resultText = `You need to be ${diffMin}:${diffSec.toString().padStart(2, '0')} faster to meet your target!`;
        }
      }
      
      document.getElementById('targetResultContent').innerHTML = 
        `<span class="result-value">${resultText}</span>`;
      document.getElementById('targetResults').classList.remove('hidden');
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
