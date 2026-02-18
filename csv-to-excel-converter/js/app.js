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
    (function() {
      let csvData = null;
      let parsedData = null;
    
      const fileInput = document.getElementById('csvFile');
      const fileName = document.getElementById('fileName');
      const convertBtn = document.getElementById('convertBtn');
      const resetBtn = document.getElementById('resetBtn');
      const statusMessage = document.getElementById('statusMessage');
      const previewSection = document.getElementById('previewSection');
      const previewContainer = document.getElementById('previewContainer');
      const hasHeaderCheckbox = document.getElementById('hasHeader');
      const delimiterSelect = document.getElementById('delimiter');
    
      // Formatting options
      const boldHeadersCheckbox = document.getElementById('boldHeaders');
      const freezeHeaderCheckbox = document.getElementById('freezeHeader');
      const autoFilterCheckbox = document.getElementById('autoFilter');
      const alternateRowsCheckbox = document.getElementById('alternateRows');
      const headerColorInput = document.getElementById('headerColor');
      const autoWidthCheckbox = document.getElementById('autoWidth');
    
      fileInput.addEventListener('change', handleFileSelect);
      convertBtn.addEventListener('click', convertToExcel);
      resetBtn.addEventListener('click', resetForm);
      hasHeaderCheckbox.addEventListener('change', updatePreview);
      delimiterSelect.addEventListener('change', handleFileReparse);
    
      function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
          if (!file.name.endsWith('.csv')) {
            showStatus('Please select a valid CSV file', 'error');
            return;
          }
    
          fileName.textContent = file.name;
          const reader = new FileReader();
          
          reader.onload = function(e) {
            csvData = e.target.result;
            parseCSV(csvData);
            convertBtn.disabled = false;
            showStatus('File loaded successfully', 'success');
          };
          
          reader.onerror = function() {
            showStatus('Error reading file', 'error');
          };
          
          reader.readAsText(file);
        }
      }
    
      function handleFileReparse() {
        if (csvData) {
          parseCSV(csvData);
        }
      }
    
      function parseCSV(csv) {
        const delimiter = delimiterSelect.value === '\\t' ? '\t' : delimiterSelect.value;
        const lines = csv.split('\n').filter(line => line.trim());
        parsedData = lines.map(line => parseCSVLine(line, delimiter));
        updatePreview();
      }
    
      function parseCSVLine(line, delimiter) {
        const result = [];
        let current = '';
        let inQuotes = false;
    
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];
    
          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === delimiter && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current);
        return result;
      }
    
      function updatePreview() {
        if (!parsedData || parsedData.length === 0) {
          previewSection.style.display = 'none';
          return;
        }
    
        previewSection.style.display = 'block';
        const hasHeader = hasHeaderCheckbox.checked;
        
        let html = '<table class="preview-table">';
        
        parsedData.forEach((row, index) => {
          if (index === 0 && hasHeader) {
            html += '<thead><tr>';
            row.forEach(cell => {
              html += `<th>${escapeHtml(cell)}</th>`;
            });
            html += '</tr></thead><tbody>';
          } else {
            if (index === 0 && !hasHeader) {
              html += '<tbody>';
            }
            html += '<tr>';
            row.forEach(cell => {
              html += `<td>${escapeHtml(cell)}</td>`;
            });
            html += '</tr>';
          }
        });
        
        html += '</tbody></table>';
        previewContainer.innerHTML = html;
      }
    
      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
    
      async function convertToExcel() {
        if (!parsedData || parsedData.length === 0) {
          showStatus('No data to convert', 'error');
          return;
        }
    
        try {
          showStatus('Converting...', 'info');
          convertBtn.disabled = true;
    
          // Check if SheetJS library is available
          if (typeof XLSX === 'undefined') {
            showStatus('Excel library not loaded. Please include SheetJS library.', 'error');
            convertBtn.disabled = false;
            return;
          }
    
          const hasHeader = hasHeaderCheckbox.checked;
          const boldHeaders = boldHeadersCheckbox.checked;
          const freezeHeader = freezeHeaderCheckbox.checked;
          const autoFilter = autoFilterCheckbox.checked;
          const alternateRows = alternateRowsCheckbox.checked;
          const headerColor = headerColorInput.value;
          const autoWidth = autoWidthCheckbox.checked;
    
          // Create workbook and worksheet
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(parsedData);
    
          // Apply formatting
          const range = XLSX.utils.decode_range(ws['!ref']);
          
          // Auto-fit column widths
          if (autoWidth) {
            const colWidths = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
              let maxWidth = 10;
              for (let R = range.s.r; R <= range.e.r; ++R) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = ws[cellAddress];
                if (cell && cell.v) {
                  const cellLength = cell.v.toString().length;
                  maxWidth = Math.max(maxWidth, cellLength);
                }
              }
              colWidths.push({ wch: Math.min(maxWidth + 2, 50) });
            }
            ws['!cols'] = colWidths;
          }
    
          // Apply header formatting
          if (hasHeader && range.s.r <= range.e.r) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
              if (!ws[cellAddress]) continue;
              
              ws[cellAddress].s = {
                font: { bold: boldHeaders, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: headerColor.replace('#', '') } },
                alignment: { horizontal: "center", vertical: "center" }
              };
            }
    
            // Freeze header row
            if (freezeHeader) {
              ws['!freeze'] = { xSplit: 0, ySplit: 1 };
            }
    
            // Auto-filter
            if (autoFilter) {
              ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
            }
          }
    
          // Alternate row colors
          if (alternateRows) {
            const startRow = hasHeader ? 1 : 0;
            for (let R = startRow; R <= range.e.r; ++R) {
              if ((R - startRow) % 2 === 1) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                  const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                  if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
                  ws[cellAddress].s = ws[cellAddress].s || {};
                  ws[cellAddress].s.fill = { fgColor: { rgb: "F2F2F2" } };
                }
              }
            }
          }
    
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
          // Generate Excel file
          const originalFileName = fileName.textContent.replace('.csv', '');
          XLSX.writeFile(wb, `${originalFileName}.xlsx`);
    
          showStatus('Excel file downloaded successfully!', 'success');
          convertBtn.disabled = false;
        } catch (error) {
          showStatus('Error converting file: ' + error.message, 'error');
          convertBtn.disabled = false;
        }
      }
    
      function resetForm() {
        fileInput.value = '';
        fileName.textContent = 'No file selected';
        csvData = null;
        parsedData = null;
        convertBtn.disabled = true;
        previewSection.style.display = 'none';
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
        hasHeaderCheckbox.checked = true;
        delimiterSelect.value = ',';
        boldHeadersCheckbox.checked = true;
        freezeHeaderCheckbox.checked = true;
        autoFilterCheckbox.checked = false;
        alternateRowsCheckbox.checked = false;
        headerColorInput.value = '#4CAF50';
        autoWidthCheckbox.checked = true;
      }
    
      function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        
        if (type === 'success') {
          setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
          }, 3000);
        }
      }
    })();
    
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
