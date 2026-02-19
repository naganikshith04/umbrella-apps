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
    document.getElementById('compareBtn').addEventListener('click', compareTexts);
    
    function compareTexts() {
      let text1 = document.getElementById('text1').value;
      let text2 = document.getElementById('text2').value;
      
      const ignoreWhitespace = document.getElementById('ignoreWhitespace').checked;
      const ignoreCase = document.getElementById('ignoreCase').checked;
      
      // Apply options
      if (ignoreWhitespace) {
        text1 = text1.replace(/\s+/g, ' ').trim();
        text2 = text2.replace(/\s+/g, ' ').trim();
      }
      
      if (ignoreCase) {
        text1 = text1.toLowerCase();
        text2 = text2.toLowerCase();
      }
      
      const diff = computeDiff(text1, text2);
      displayDiff(diff);
    }
    
    function computeDiff(text1, text2) {
      const words1 = text1.split(/(\s+)/);
      const words2 = text2.split(/(\s+)/);
      
      const dp = [];
      for (let i = 0; i <= words1.length; i++) {
        dp[i] = [];
        for (let j = 0; j <= words2.length; j++) {
          if (i === 0) {
            dp[i][j] = j;
          } else if (j === 0) {
            dp[i][j] = i;
          } else if (words1[i - 1] === words2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1];
          } else {
            dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
          }
        }
      }
      
      const result = [];
      let i = words1.length;
      let j = words2.length;
      
      let additions = 0;
      let deletions = 0;
      let modifications = 0;
      
      while (i > 0 || j > 0) {
        if (i === 0) {
          result.unshift({ type: 'added', value: words2[j - 1] });
          additions++;
          j--;
        } else if (j === 0) {
          result.unshift({ type: 'deleted', value: words1[i - 1] });
          deletions++;
          i--;
        } else if (words1[i - 1] === words2[j - 1]) {
          result.unshift({ type: 'unchanged', value: words1[i - 1] });
          i--;
          j--;
        } else {
          const deleteCost = dp[i - 1][j];
          const insertCost = dp[i][j - 1];
          const replaceCost = dp[i - 1][j - 1];
          
          if (replaceCost <= deleteCost && replaceCost <= insertCost) {
            if (words1[i - 1].trim() && words2[j - 1].trim()) {
              result.unshift({ type: 'modified', value: words1[i - 1], newValue: words2[j - 1] });
              modifications++;
            } else {
              result.unshift({ type: 'deleted', value: words1[i - 1] });
              result.unshift({ type: 'added', value: words2[j - 1] });
              deletions++;
              additions++;
            }
            i--;
            j--;
          } else if (deleteCost <= insertCost) {
            result.unshift({ type: 'deleted', value: words1[i - 1] });
            deletions++;
            i--;
          } else {
            result.unshift({ type: 'added', value: words2[j - 1] });
            additions++;
            j--;
          }
        }
      }
      
      return {
        diff: result,
        stats: { additions, deletions, modifications }
      };
    }
    
    function displayDiff(diffResult) {
      const diffOutput = document.getElementById('diffOutput');
      const statsDiv = document.getElementById('stats');
      
      diffOutput.innerHTML = '';
      
      diffResult.diff.forEach(item => {
        const span = document.createElement('span');
        
        if (item.type === 'added') {
          span.className = 'added';
          span.textContent = item.value;
          span.title = 'Added';
        } else if (item.type === 'deleted') {
          span.className = 'deleted';
          span.textContent = item.value;
          span.title = 'Deleted';
        } else if (item.type === 'modified') {
          span.className = 'modified';
          span.innerHTML = `<span class="deleted">${item.value}</span><span class="added">${item.newValue}</span>`;
          span.title = 'Modified';
        } else {
          span.className = 'unchanged';
          span.textContent = item.value;
        }
        
        diffOutput.appendChild(span);
      });
      
      statsDiv.innerHTML = `
        <div class="stat-item">
          <span class="stat-label added">Additions:</span>
          <span class="stat-value">${diffResult.stats.additions}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label deleted">Deletions:</span>
          <span class="stat-value">${diffResult.stats.deletions}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label modified">Modifications:</span>
          <span class="stat-value">${diffResult.stats.modifications}</span>
        </div>
      `;
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
