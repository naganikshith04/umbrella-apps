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
    function addExpense() {
      const expensesList = document.getElementById('expenses-list');
      const expenseItem = document.createElement('div');
      expenseItem.className = 'expense-item';
      expenseItem.innerHTML = `
        <input type="text" class="expense-name" placeholder="Expense name">
        <input type="number" class="expense-amount" placeholder="0.00" min="0" step="0.01">
        <button class="btn-remove" onclick="removeExpense(this)">Remove</button>
      `;
      expensesList.appendChild(expenseItem);
    }
    
    function removeExpense(button) {
      const expensesList = document.getElementById('expenses-list');
      if (expensesList.children.length > 1) {
        button.parentElement.remove();
      } else {
        alert('You must have at least one expense item.');
      }
    }
    
    function addCategory() {
      const categoriesList = document.getElementById('categories-list');
      const categoryItem = document.createElement('div');
      categoryItem.className = 'category-item';
      categoryItem.innerHTML = `
        <input type="text" class="category-name" placeholder="Category name">
        <input type="number" class="category-budget" placeholder="Budget amount" min="0" step="0.01">
        <input type="number" class="category-spent" placeholder="Amount spent" min="0" step="0.01">
        <button class="btn-remove" onclick="removeCategory(this)">Remove</button>
      `;
      categoriesList.appendChild(categoryItem);
    }
    
    function removeCategory(button) {
      const categoriesList = document.getElementById('categories-list');
      if (categoriesList.children.length > 1) {
        button.parentElement.remove();
      } else {
        alert('You must have at least one category item.');
      }
    }
    
    function calculateBudget() {
      // Get income
      const income = parseFloat(document.getElementById('income').value) || 0;
      
      // Calculate total expenses
      const expenseAmounts = document.querySelectorAll('.expense-amount');
      let totalExpenses = 0;
      expenseAmounts.forEach(input => {
        totalExpenses += parseFloat(input.value) || 0;
      });
      
      // Calculate remaining balance
      const remainingBalance = income - totalExpenses;
      
      // Calculate savings rate
      const savingsRate = income > 0 ? ((remainingBalance / income) * 100).toFixed(2) : 0;
      
      // Display results
      document.getElementById('total-income').textContent = `$${income.toFixed(2)}`;
      document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
      document.getElementById('remaining-balance').textContent = `$${remainingBalance.toFixed(2)}`;
      document.getElementById('remaining-balance').style.color = remainingBalance >= 0 ? '#27ae60' : '#e74c3c';
      document.getElementById('savings-rate').textContent = `${savingsRate}%`;
      document.getElementById('savings-rate').style.color = savingsRate >= 20 ? '#27ae60' : savingsRate >= 10 ? '#f39c12' : '#e74c3c';
      
      // Show results section
      document.getElementById('results-section').style.display = 'block';
      
      // Check for overspending and generate alerts
      checkOverspending(income, totalExpenses, remainingBalance);
    }
    
    function checkOverspending(income, totalExpenses, remainingBalance) {
      const alertsContainer = document.getElementById('alerts-container');
      const alertsSection = document.getElementById('alerts-section');
      alertsContainer.innerHTML = '';
      
      let hasAlerts = false;
      
      // Check overall budget
      if (remainingBalance < 0) {
        hasAlerts = true;
        const alert = createAlert(
          'critical',
          'Overall Budget Exceeded',
          `You are overspending by $${Math.abs(remainingBalance).toFixed(2)}`,
          [
            'Review all expenses and identify non-essential items to cut',
            'Consider finding additional income sources',
            'Prioritize essential expenses like housing, food, and utilities'
          ]
        );
        alertsContainer.appendChild(alert);
      } else if (remainingBalance < income * 0.1) {
        hasAlerts = true;
        const alert = createAlert(
          'warning',
          'Low Savings Rate',
          `You are only saving $${remainingBalance.toFixed(2)} (${((remainingBalance / income) * 100).toFixed(1)}% of income)`,
          [
            'Aim to save at least 20% of your income',
            'Review discretionary spending like entertainment and dining out',
            'Set up automatic transfers to a savings account'
          ]
        );
        alertsContainer.appendChild(alert);
      }
      
      // Check category budgets
      const categoryItems = document.querySelectorAll('.category-item');
      categoryItems.forEach(item => {
        const name = item.querySelector('.category-name').value;
        const budget = parseFloat(item.querySelector('.category-budget').value) || 0;
        const spent = parseFloat(item.querySelector('.category-spent').value) || 0;
        
        if (name && budget > 0) {
          if (spent > budget) {
            hasAlerts = true;
            const overspent = spent - budget;
            const percentage = ((overspent / budget) * 100).toFixed(1);
            const alert = createAlert(
              'critical',
              `${name} - Budget Exceeded`,
              `Overspent by $${overspent.toFixed(2)} (${percentage}% over budget)`,
              [
                `Reduce spending in ${name} category immediately`,
                `Set spending limits or use cash-only for ${name}`,
                `Track daily expenses in this category more carefully`
              ]
            );
            alertsContainer.appendChild(alert);
          } else if (spent > budget * 0.9) {
            hasAlerts = true;
            const remaining = budget - spent;
            const alert = createAlert(
              'warning',
              `${name} - Approaching Budget Limit`,
              `Only $${remaining.toFixed(2)} remaining in budget`,
              [
                `Monitor ${name} spending closely for the rest of the month`,
                `Postpone non-urgent purchases in this category`,
                `Consider if this budget allocation is realistic`
              ]
            );
            alertsContainer.appendChild(alert);
          }
        }
      });
      
      // Check if expenses are too high relative to income
      if (income > 0 && totalExpenses > income * 0.8 && remainingBalance >= 0) {
        hasAlerts = true;
        const alert = createAlert(
          'info',
          'High Expense Ratio',
          `Your expenses are ${((totalExpenses / income) * 100).toFixed(1)}% of your income`,
          [
            'Try to keep expenses below 80% of income',
            'Build an emergency fund with your savings',
            'Look for opportunities to reduce recurring expenses'
          ]
        );
        alertsContainer.appendChild(alert);
      }
      
      // Show or hide alerts section
      if (hasAlerts) {
        alertsSection.style.display = 'block';
      } else {
        alertsSection.style.display = 'none';
      }
    }
    
    function createAlert(type, title, message, recommendations) {
      const alert = document.createElement('div');
      alert.className = `alert alert-${type}`;
      
      const icon = type === 'critical' ? '🚨' : type === 'warning' ? '⚠️' : 'ℹ️';
      
      let recommendationsHTML = '';
      if (recommendations && recommendations.length > 0) {
        recommendationsHTML = '<div class="recommendations"><strong>Recommendations:</strong><ul>';
        recommendations.forEach(rec => {
          recommendationsHTML += `<li>${rec}</li>`;
        });
        recommendationsHTML += '</ul></div>';
      }
      
      alert.innerHTML = `
        <div class="alert-header">
          <span class="alert-icon">${icon}</span>
          <strong>${title}</strong>
        </div>
        <div class="alert-message">${message}</div>
        ${recommendationsHTML}
      `;
      
      return alert;
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
