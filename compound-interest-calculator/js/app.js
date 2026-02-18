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


function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}



function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function initApp() {
    // This is where your specific app logic goes
    console.log('Ready to add app-specific functionality');

    // Generated app logic
    const calculateBtn = document.getElementById('calculateBtn');
      const resultsDiv = document.getElementById('results');
      const chartContainer = document.getElementById('chart-container');
      
      let chartInstance = null;
      
      calculateBtn.addEventListener('click', calculateCompoundInterest);
      
      function calculateCompoundInterest() {
        // Get input values
        const principal = parseFloat(document.getElementById('principal').value) || 0;
        const rate = parseFloat(document.getElementById('rate').value) || 0;
        const time = parseFloat(document.getElementById('time').value) || 0;
        const compoundFreq = parseFloat(document.getElementById('compound').value) || 12;
        const monthlyContribution = parseFloat(document.getElementById('contribution').value) || 0;
        
        // Validate inputs
        if (principal < 0 || rate < 0 || time < 0 || monthlyContribution < 0) {
          alert('Please enter valid positive numbers');
          return;
        }
        
        // Calculate compound interest with contributions
        const r = rate / 100;
        const n = compoundFreq;
        const t = time;
        
        // Future value of initial principal
        const futureValuePrincipal = principal * Math.pow(1 + r / n, n * t);
        
        // Future value of monthly contributions
        let futureValueContributions = 0;
        if (monthlyContribution > 0) {
          // Convert to the compound frequency
          const contributionPerPeriod = monthlyContribution * (12 / compoundFreq);
          futureValueContributions = contributionPerPeriod * 
            ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
        }
        
        const futureValue = futureValuePrincipal + futureValueContributions;
        const totalContributions = monthlyContribution * 12 * time;
        const totalPrincipal = principal + totalContributions;
        const totalInterest = futureValue - totalPrincipal;
        
        // Display results
        document.getElementById('futureValue').textContent = formatCurrency(futureValue);
        document.getElementById('totalPrincipal').textContent = formatCurrency(totalPrincipal);
        document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
        document.getElementById('totalContributions').textContent = formatCurrency(totalContributions);
        
        resultsDiv.classList.remove('hidden');
        chartContainer.classList.remove('hidden');
        
        // Generate chart data
        generateChart(principal, rate, time, compoundFreq, monthlyContribution);
      }
      
      function generateChart(principal, rate, time, compoundFreq, monthlyContribution) {
        const years = Math.ceil(time);
        const labels = [];
        const principalData = [];
        const interestData = [];
        
        for (let year = 0; year <= years; year++) {
          labels.push(`Year ${year}`);
          
          const r = rate / 100;
          const n = compoundFreq;
          const t = year;
          
          // Calculate values at this year
          const fvPrincipal = principal * Math.pow(1 + r / n, n * t);
          
          let fvContributions = 0;
          if (monthlyContribution > 0 && year > 0) {
            const contributionPerPeriod = monthlyContribution * (12 / compoundFreq);
            fvContributions = contributionPerPeriod * 
              ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
          }
          
          const totalValue = fvPrincipal + fvContributions;
          const totalPrincipalAtYear = principal + (monthlyContribution * 12 * year);
          const interestAtYear = totalValue - totalPrincipalAtYear;
          
          principalData.push(totalPrincipalAtYear.toFixed(2));
          interestData.push(interestAtYear.toFixed(2));
        }
        
        // Destroy existing chart if it exists
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        // Create new chart
        const ctx = document.getElementById('growthChart').getContext('2d');
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Total Principal',
                data: principalData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
              },
              {
                label: 'Interest Earned',
                data: interestData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              title: {
                display: true,
                text: 'Investment Growth Over Time'
              },
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }
        });
      }
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
