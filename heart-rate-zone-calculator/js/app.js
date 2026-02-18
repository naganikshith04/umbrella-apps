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
    document.getElementById('calculate-btn').addEventListener('click', calculateZones);
    
    function calculateZones() {
      const age = parseInt(document.getElementById('age').value);
      const restingHR = parseInt(document.getElementById('resting-hr').value);
      
      if (!age || age < 1 || age > 120) {
        alert('Please enter a valid age between 1 and 120');
        return;
      }
      
      const maxHR = 220 - age;
      const useKarvonen = restingHR && restingHR >= 30 && restingHR <= 100;
      
      const zones = [
        { name: 'Zone 1 - Very Light', min: 50, max: 60, color: '#4ade80' },
        { name: 'Zone 2 - Light', min: 60, max: 70, color: '#60a5fa' },
        { name: 'Zone 3 - Moderate', min: 70, max: 80, color: '#fbbf24' },
        { name: 'Zone 4 - Hard', min: 80, max: 90, color: '#fb923c' },
        { name: 'Zone 5 - Maximum', min: 90, max: 100, color: '#ef4444' }
      ];
      
      const zonesContainer = document.getElementById('zones-container');
      zonesContainer.innerHTML = '';
      
      zones.forEach(zone => {
        let minHR, maxHRZone;
        
        if (useKarvonen) {
          // Karvonen Formula: ((MaxHR - RestingHR) × %Intensity) + RestingHR
          const hrReserve = maxHR - restingHR;
          minHR = Math.round((hrReserve * (zone.min / 100)) + restingHR);
          maxHRZone = Math.round((hrReserve * (zone.max / 100)) + restingHR);
        } else {
          // Simple percentage of max HR
          minHR = Math.round(maxHR * (zone.min / 100));
          maxHRZone = Math.round(maxHR * (zone.max / 100));
        }
        
        const zoneCard = document.createElement('div');
        zoneCard.className = 'zone-card';
        zoneCard.style.borderLeftColor = zone.color;
        zoneCard.innerHTML = `
          <h4>${zone.name} (${zone.min}-${zone.max}%)</h4>
          <p>${minHR} - ${maxHRZone} bpm</p>
        `;
        
        zonesContainer.appendChild(zoneCard);
      });
      
      document.getElementById('results').classList.remove('hidden');
      document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Allow Enter key to trigger calculation
    document.getElementById('age').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        calculateZones();
      }
    });
    
    document.getElementById('resting-hr').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        calculateZones();
      }
    });
    
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
