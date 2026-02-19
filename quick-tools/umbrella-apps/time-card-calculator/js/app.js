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
    class TimeCardCalculator {
      constructor() {
        this.timeEntries = [];
        this.init();
      }
    
      init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.addInitialDays();
      }
    
      setDefaultDate() {
        const today = new Date();
        const weekEnding = new Date(today);
        weekEnding.setDate(today.getDate() + (6 - today.getDay()));
        document.getElementById('weekEnding').valueAsDate = weekEnding;
      }
    
      setupEventListeners() {
        document.getElementById('addDayBtn').addEventListener('click', () => this.addDayEntry());
        document.getElementById('calculateBtn').addEventListener('click', () => this.calculate());
        document.getElementById('printBtn').addEventListener('click', () => this.printTimesheet());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
      }
    
      addInitialDays() {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        days.forEach(day => this.addDayEntry(day));
      }
    
      addDayEntry(dayName = '') {
        const entryId = Date.now() + Math.random();
        const entry = {
          id: entryId,
          day: dayName,
          date: '',
          timeIn: '09:00',
          timeOut: '17:00',
          breakMinutes: 30
        };
        
        this.timeEntries.push(entry);
        this.renderTimeEntries();
      }
    
      renderTimeEntries() {
        const container = document.getElementById('timeEntries');
        container.innerHTML = '';
    
        this.timeEntries.forEach((entry, index) => {
          const entryDiv = document.createElement('div');
          entryDiv.className = 'time-entry';
          entryDiv.innerHTML = `
            <div class="entry-header">
              <h3>Day ${index + 1}</h3>
              <button class="btn-remove" data-id="${entry.id}">Remove</button>
            </div>
            <div class="entry-fields">
              <div class="field">
                <label>Day:</label>
                <input type="text" class="day-input" data-id="${entry.id}" value="${entry.day}">
              </div>
              <div class="field">
                <label>Date:</label>
                <input type="date" class="date-input" data-id="${entry.id}" value="${entry.date}">
              </div>
              <div class="field">
                <label>Time In:</label>
                <input type="time" class="time-in-input" data-id="${entry.id}" value="${entry.timeIn}">
              </div>
              <div class="field">
                <label>Time Out:</label>
                <input type="time" class="time-out-input" data-id="${entry.id}" value="${entry.timeOut}">
              </div>
              <div class="field">
                <label>Break (min):</label>
                <input type="number" class="break-input" data-id="${entry.id}" value="${entry.breakMinutes}" min="0">
              </div>
              <div class="field">
                <label>Hours:</label>
                <span class="hours-display" data-id="${entry.id}">0.00</span>
              </div>
            </div>
          `;
          container.appendChild(entryDiv);
        });
    
        this.attachEntryListeners();
      }
    
      attachEntryListeners() {
        document.querySelectorAll('.btn-remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = parseFloat(e.target.dataset.id);
            this.removeEntry(id);
          });
        });
    
        document.querySelectorAll('.day-input, .date-input, .time-in-input, .time-out-input, .break-input').forEach(input => {
          input.addEventListener('change', (e) => {
            const id = parseFloat(e.target.dataset.id);
            this.updateEntry(id, e.target);
          });
        });
      }
    
      updateEntry(id, input) {
        const entry = this.timeEntries.find(e => e.id === id);
        if (!entry) return;
    
        if (input.classList.contains('day-input')) {
          entry.day = input.value;
        } else if (input.classList.contains('date-input')) {
          entry.date = input.value;
        } else if (input.classList.contains('time-in-input')) {
          entry.timeIn = input.value;
        } else if (input.classList.contains('time-out-input')) {
          entry.timeOut = input.value;
        } else if (input.classList.contains('break-input')) {
          entry.breakMinutes = parseFloat(input.value) || 0;
        }
    
        this.updateEntryHours(id);
      }
    
      updateEntryHours(id) {
        const entry = this.timeEntries.find(e => e.id === id);
        if (!entry || !entry.timeIn || !entry.timeOut) return;
    
        const hours = this.calculateHours(entry.timeIn, entry.timeOut, entry.breakMinutes);
        const display = document.querySelector(`.hours-display[data-id="${id}"]`);
        if (display) {
          display.textContent = hours.toFixed(2);
        }
      }
    
      calculateHours(timeIn, timeOut, breakMinutes) {
        const [inHour, inMin] = timeIn.split(':').map(Number);
        const [outHour, outMin] = timeOut.split(':').map(Number);
    
        let totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
        
        if (totalMinutes < 0) {
          totalMinutes += 24 * 60;
        }
    
        totalMinutes -= breakMinutes;
        return Math.max(0, totalMinutes / 60);
      }
    
      removeEntry(id) {
        this.timeEntries = this.timeEntries.filter(e => e.id !== id);
        this.renderTimeEntries();
        this.calculate();
      }
    
      calculate() {
        let totalHours = 0;
    
        this.timeEntries.forEach(entry => {
          if (entry.timeIn && entry.timeOut) {
            const hours = this.calculateHours(entry.timeIn, entry.timeOut, entry.breakMinutes);
            totalHours += hours;
            this.updateEntryHours(entry.id);
          }
        });
    
        const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;
        const regularHours = Math.min(totalHours, 40);
        const overtimeHours = Math.max(0, totalHours - 40);
        
        const regularPay = regularHours * hourlyRate;
        const overtimePay = overtimeHours * hourlyRate * 1.5;
        const totalPay = regularPay + overtimePay;
    
        document.getElementById('totalHours').textContent = totalHours.toFixed(2);
        document.getElementById('regularHours').textContent = regularHours.toFixed(2);
        document.getElementById('overtimeHours').textContent = overtimeHours.toFixed(2);
        document.getElementById('regularPay').textContent = `$${regularPay.toFixed(2)}`;
        document.getElementById('overtimePay').textContent = `$${overtimePay.toFixed(2)}`;
        document.getElementById('totalPay').textContent = `$${totalPay.toFixed(2)}`;
      }
    
      printTimesheet() {
        this.calculate();
        
        const employeeName = document.getElementById('employeeName').value || 'N/A';
        const weekEnding = document.getElementById('weekEnding').value || 'N/A';
        const hourlyRate = document.getElementById('hourlyRate').value || '0.00';
        
        document.getElementById('printEmployeeName').textContent = employeeName;
        document.getElementById('printWeekEnding').textContent = weekEnding;
        document.getElementById('printHourlyRate').textContent = hourlyRate;
        
        const tableBody = document.getElementById('printTableBody');
        tableBody.innerHTML = '';
        
        this.timeEntries.forEach(entry => {
          if (entry.timeIn && entry.timeOut) {
            const hours = this.calculateHours(entry.timeIn, entry.timeOut, entry.breakMinutes);
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${entry.date || 'N/A'}</td>
              <td>${entry.day || 'N/A'}</td>
              <td>${entry.timeIn}</td>
              <td>${entry.timeOut}</td>
              <td>${entry.breakMinutes}</td>
              <td>${hours.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
          }
        });
        
        document.getElementById('printTotalHours').textContent = document.getElementById('totalHours').textContent;
        document.getElementById('printRegularHours').textContent = document.getElementById('regularHours').textContent;
        document.getElementById('printOvertimeHours').textContent = document.getElementById('overtimeHours').textContent;
        document.getElementById('printRegularPay').textContent = document.getElementById('regularPay').textContent;
        document.getElementById('printOvertimePay').textContent = document.getElementById('overtimePay').textContent;
        document.getElementById('printTotalPay').textContent = document.getElementById('totalPay').textContent;
        
        window.print();
      }
    
      reset() {
        if (confirm('Are you sure you want to reset all entries?')) {
          this.timeEntries = [];
          document.getElementById('employeeName').value = 'John Doe';
          document.getElementById('hourlyRate').value = '15.00';
          this.setDefaultDate();
          this.addInitialDays();
          this.calculate();
        }
      }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
      new TimeCardCalculator();
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
