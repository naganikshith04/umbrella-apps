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
    // Work Hours Calculator JavaScript
    class WorkHoursCalculator {
      constructor() {
        this.entries = this.loadEntries();
        this.init();
      }
    
      init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.renderEntries();
        this.updateSummary();
      }
    
      setupEventListeners() {
        document.getElementById('addEntry').addEventListener('click', () => this.addEntry());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
        document.getElementById('exportCSV').addEventListener('click', () => this.exportCSV());
        document.getElementById('exportPDF').addEventListener('click', () => this.exportPDF());
        
        // Allow Enter key to add entry
        ['date', 'startTime', 'endTime', 'breakDuration', 'description'].forEach(id => {
          document.getElementById(id).addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addEntry();
          });
        });
      }
    
      setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        document.getElementById('exportStartDate').value = this.getFirstDayOfMonth();
        document.getElementById('exportEndDate').value = today;
      }
    
      getFirstDayOfMonth() {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
      }
    
      addEntry() {
        const date = document.getElementById('date').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const breakDuration = parseInt(document.getElementById('breakDuration').value) || 0;
        const description = document.getElementById('description').value;
    
        if (!date || !startTime || !endTime) {
          alert('Please fill in all required fields (Date, Start Time, End Time)');
          return;
        }
    
        const hours = this.calculateHours(startTime, endTime, breakDuration);
        
        if (hours <= 0) {
          alert('End time must be after start time');
          return;
        }
    
        const entry = {
          id: Date.now(),
          date,
          startTime,
          endTime,
          breakDuration,
          hours: hours.toFixed(2),
          description
        };
    
        this.entries.unshift(entry);
        this.saveEntries();
        this.renderEntries();
        this.updateSummary();
        this.clearForm();
      }
    
      calculateHours(startTime, endTime, breakMinutes) {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        let totalMinutes = endMinutes - startMinutes;
        
        // Handle overnight shifts
        if (totalMinutes < 0) {
          totalMinutes += 24 * 60;
        }
        
        totalMinutes -= breakMinutes;
        
        return totalMinutes / 60;
      }
    
      deleteEntry(id) {
        if (confirm('Are you sure you want to delete this entry?')) {
          this.entries = this.entries.filter(entry => entry.id !== id);
          this.saveEntries();
          this.renderEntries();
          this.updateSummary();
        }
      }
    
      clearAll() {
        if (confirm('Are you sure you want to delete all entries? This cannot be undone.')) {
          this.entries = [];
          this.saveEntries();
          this.renderEntries();
          this.updateSummary();
        }
      }
    
      renderEntries() {
        const entriesList = document.getElementById('entriesList');
        
        if (this.entries.length === 0) {
          entriesList.innerHTML = '<div class="no-entries">No work entries yet. Add your first entry above!</div>';
          return;
        }
    
        entriesList.innerHTML = this.entries.map(entry => `
          <div class="entry-card">
            <div class="entry-header">
              <div class="entry-date">${this.formatDate(entry.date)}</div>
              <button class="btn-delete" onclick="calculator.deleteEntry(${entry.id})">×</button>
            </div>
            <div class="entry-body">
              <div class="entry-time">
                <span class="time-badge">${entry.startTime}</span>
                <span class="arrow">→</span>
                <span class="time-badge">${entry.endTime}</span>
              </div>
              <div class="entry-details">
                <div class="entry-hours">
                  <strong>${entry.hours} hours</strong>
                  ${entry.breakDuration > 0 ? `<span class="break-info">(${entry.breakDuration} min break)</span>` : ''}
                </div>
                ${entry.description ? `<div class="entry-description">${entry.description}</div>` : ''}
              </div>
            </div>
          </div>
        `).join('');
      }
    
      updateSummary() {
        const today = new Date().toISOString().split('T')[0];
        const todayHours = this.getHoursForDate(today);
        const weekHours = this.getHoursForWeek();
        const monthHours = this.getHoursForMonth();
    
        document.getElementById('todayHours').textContent = `${todayHours.toFixed(2)} hrs`;
        document.getElementById('weekHours').textContent = `${weekHours.toFixed(2)} hrs`;
        document.getElementById('monthHours').textContent = `${monthHours.toFixed(2)} hrs`;
        document.getElementById('totalEntries').textContent = this.entries.length;
      }
    
      getHoursForDate(date) {
        return this.entries
          .filter(entry => entry.date === date)
          .reduce((sum, entry) => sum + parseFloat(entry.hours), 0);
      }
    
      getHoursForWeek() {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);
    
        return this.entries
          .filter(entry => new Date(entry.date) >= weekStart)
          .reduce((sum, entry) => sum + parseFloat(entry.hours), 0);
      }
    
      getHoursForMonth() {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
        return this.entries
          .filter(entry => new Date(entry.date) >= monthStart)
          .reduce((sum, entry) => sum + parseFloat(entry.hours), 0);
      }
    
      formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    
      clearForm() {
        document.getElementById('startTime').value = '';
        document.getElementById('endTime').value = '';
        document.getElementById('breakDuration').value = '0';
        document.getElementById('description').value = '';
      }
    
      getFilteredEntries() {
        const startDate = document.getElementById('exportStartDate').value;
        const endDate = document.getElementById('exportEndDate').value;
    
        if (!startDate || !endDate) {
          return this.entries;
        }
    
        return this.entries.filter(entry => {
          return entry.date >= startDate && entry.date <= endDate;
        }).sort((a, b) => a.date.localeCompare(b.date));
      }
    
      exportCSV() {
        const entries = this.getFilteredEntries();
        
        if (entries.length === 0) {
          alert('No entries to export for the selected date range.');
          return;
        }
    
        // CSV Header
        let csv = 'Date,Start Time,End Time,Break (min),Hours Worked,Description\n';
    
        // CSV Data
        entries.forEach(entry => {
          csv += `"${entry.date}","${entry.startTime}","${entry.endTime}",${entry.breakDuration},${entry.hours},"${entry.description || ''}"\n`;
        });
    
        // Add summary
        const totalHours = entries.reduce((sum, entry) => sum + parseFloat(entry.hours), 0);
        csv += `\nTotal Hours:,,,,,${totalHours.toFixed(2)}\n`;
    
        // Download
        this.downloadFile(csv, 'timesheet.csv', 'text/csv');
      }
    
      exportPDF() {
        const entries = this.getFilteredEntries();
        
        if (entries.length === 0) {
          alert('No entries to export for the selected date range.');
          return;
        }
    
        const startDate = document.getElementById('exportStartDate').value;
        const endDate = document.getElementById('exportEndDate').value;
        const totalHours = entries.reduce((sum, entry) => sum + parseFloat(entry.hours), 0);
    
        // Create HTML content for PDF
        let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Timesheet Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }
        h1 {
          color: #2563eb;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 10px;
        }
        .header-info {
          margin: 20px 0;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background-color: #2563eb;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .summary {
          margin-top: 30px;
          padding: 20px;
          background-color: #eff6ff;
          border-left: 4px solid #2563eb;
        }
        .summary-item {
          font-size: 16px;
          margin: 10px 0;
        }
        .summary-item strong {
          color: #2563eb;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <h1>Work Hours Timesheet</h1>
      <div class="header-info">
        <p><strong>Period:</strong> ${this.formatDate(startDate)} to ${this.formatDate(endDate)}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Break (min)</th>
            <th>Hours</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
    `;
    
        entries.forEach(entry => {
          html += `
          <tr>
            <td>${this.formatDate(entry.date)}</td>
            <td>${entry.startTime}</td>
            <td>${entry.endTime}</td>
            <td>${entry.breakDuration}</td>
            <td>${entry.hours}</td>
            <td>${entry.description || '-'}</td>
          </tr>
    `;
        });
    
        html += `
        </tbody>
      </table>
      
      <div class="summary">
        <div class="summary-item"><strong>Total Entries:</strong> ${entries.length}</div>
        <div class="summary-item"><strong>Total Hours Worked:</strong> ${totalHours.toFixed(2)} hours</div>
      </div>
      
      <div class="footer">
        <p>Work Hours Calculator - Timesheet Report</p>
      </div>
    </body>
    </html>
    `;
    
        // Open in new window for printing/saving as PDF
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        
        // Trigger print dialog after content loads
        printWindow.onload = function() {
          printWindow.print();
        };
      }
    
      downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    
      saveEntries() {
        localStorage.setItem('workHoursEntries', JSON.stringify(this.entries));
      }
    
      loadEntries() {
        const stored = localStorage.getItem('workHoursEntries');
        return stored ? JSON.parse(stored) : [];
      }
    }
    
    // Initialize the calculator
    let calculator;
    document.addEventListener('DOMContentLoaded', () => {
      calculator = new WorkHoursCalculator();
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
