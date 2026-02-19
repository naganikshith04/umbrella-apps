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
    
    @keyframes diceRoll {
        0%, 100% { transform: rotateX(0deg) rotateY(0deg); }
        25% { transform: rotateX(360deg) rotateY(180deg); }
        50% { transform: rotateX(180deg) rotateY(360deg); }
        75% { transform: rotateX(360deg) rotateY(180deg); }
    }
    
    .dice {
        display: inline-block;
        width: 60px;
        height: 60px;
        margin: 10px;
        background: linear-gradient(145deg, #ffffff, #e6e6e6);
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-size: 32px;
        font-weight: bold;
        line-height: 60px;
        text-align: center;
        color: #333;
        animation: diceRoll 0.5s ease-in-out;
    }
    
    .rolling .dice {
        animation: diceRoll 0.5s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    initApp();
});

// Main app initialization function
function initApp() {
    console.log('Dice Roller ready');

    const diceTypeSelect = document.getElementById('dice-type');
    const numDiceInput = document.getElementById('num-dice');
    const rollBtn = document.getElementById('roll-btn');
    const diceDisplay = document.getElementById('dice-display');
    const totalDisplay = document.getElementById('total-display');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');

    let rollHistory = [];

    // Roll dice function
    function rollDice(sides, count) {
        const rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(Math.floor(Math.random() * sides) + 1);
        }
        return rolls;
    }

    // Display dice results with animation
    function displayResults(rolls, diceType) {
        diceDisplay.innerHTML = '';
        diceDisplay.classList.add('rolling');
        
        setTimeout(() => {
            diceDisplay.classList.remove('rolling');
            rolls.forEach((roll, index) => {
                setTimeout(() => {
                    const diceElement = document.createElement('div');
                    diceElement.className = 'dice';
                    diceElement.textContent = roll;
                    diceElement.style.animationDelay = `${index * 0.1}s`;
                    diceDisplay.appendChild(diceElement);
                }, index * 100);
            });
            
            // Calculate and display total
            const total = rolls.reduce((sum, roll) => sum + roll, 0);
            totalDisplay.textContent = `Total: ${total}`;
            totalDisplay.style.display = 'block';
            
            // Add to history
            addToHistory(rolls, diceType, total);
        }, 500);
    }

    // Add roll to history
    function addToHistory(rolls, diceType, total) {
        const historyItem = {
            rolls: rolls,
            diceType: diceType,
            total: total,
            timestamp: new Date().toLocaleTimeString()
        };
        
        rollHistory.unshift(historyItem);
        if (rollHistory.length > 10) {
            rollHistory.pop();
        }
        
        updateHistoryDisplay();
    }

    // Update history display
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        
        if (rollHistory.length === 0) {
            historyList.innerHTML = '<li style="color: #666;">No rolls yet</li>';
            return;
        }
        
        rollHistory.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${item.rolls.length}d${item.diceType}</strong>: 
                [${item.rolls.join(', ')}] = <strong>${item.total}</strong>
                <span style="color: #666; font-size: 0.9em;">(${item.timestamp})</span>
            `;
            historyList.appendChild(li);
        });
    }

    // Clear history
    function clearHistory() {
        if (confirm('Clear all roll history?')) {
            rollHistory = [];
            updateHistoryDisplay();
            utils.showNotification('History cleared', 'success');
        }
    }

    // Roll button click
    rollBtn.addEventListener('click', function() {
        const sides = parseInt(diceTypeSelect.value);
        const count = parseInt(numDiceInput.value);
        
        if (count < 1 || count > 20) {
            utils.showNotification('Please roll between 1 and 20 dice', 'error');
            return;
        }
        
        const rolls = rollDice(sides, count);
        displayResults(rolls, sides);
        utils.showNotification(`Rolled ${count}d${sides}!`, 'success');
    });

    // Clear history button
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Allow Enter key to roll
    [numDiceInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                rollBtn.click();
            }
        });
    });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
