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
    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isRunning = false;
    let isPaused = false;
    let isWorkSession = true;
    let completedSessions = 0;
    
    const timerDisplay = document.getElementById('timerDisplay');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const sessionType = document.getElementById('sessionType');
    const completedSessionsDisplay = document.getElementById('completedSessions');
    const workDurationInput = document.getElementById('workDuration');
    const breakDurationInput = document.getElementById('breakDuration');
    
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    function updateDisplay() {
      timerDisplay.textContent = formatTime(timeLeft);
    }
    
    function startTimer() {
      if (!isRunning) {
        isRunning = true;
        isPaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        
        timer = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
          } else {
            clearInterval(timer);
            handleSessionComplete();
          }
        }, 1000);
      }
    }
    
    function pauseTimer() {
      if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        isPaused = true;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        startBtn.textContent = 'Resume';
      }
    }
    
    function resetTimer() {
      clearInterval(timer);
      isRunning = false;
      isPaused = false;
      
      if (isWorkSession) {
        timeLeft = parseInt(workDurationInput.value) * 60;
      } else {
        timeLeft = parseInt(breakDurationInput.value) * 60;
      }
      
      updateDisplay();
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = true;
      startBtn.textContent = 'Start';
    }
    
    function handleSessionComplete() {
      isRunning = false;
      
      if (isWorkSession) {
        completedSessions++;
        completedSessionsDisplay.textContent = completedSessions;
        isWorkSession = false;
        sessionType.textContent = 'Break';
        timeLeft = parseInt(breakDurationInput.value) * 60;
        alert('Work session complete! Time for a break.');
      } else {
        isWorkSession = true;
        sessionType.textContent = 'Work';
        timeLeft = parseInt(workDurationInput.value) * 60;
        alert('Break complete! Time to work.');
      }
      
      updateDisplay();
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = true;
      startBtn.textContent = 'Start';
    }
    
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    workDurationInput.addEventListener('change', () => {
      if (!isRunning && !isPaused && isWorkSession) {
        timeLeft = parseInt(workDurationInput.value) * 60;
        updateDisplay();
      }
    });
    
    breakDurationInput.addEventListener('change', () => {
      if (!isRunning && !isPaused && !isWorkSession) {
        timeLeft = parseInt(breakDurationInput.value) * 60;
        updateDisplay();
      }
    });
    
    // Initialize display
    updateDisplay();
    
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
