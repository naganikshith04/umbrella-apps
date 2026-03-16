// Global state
let currentData = [];
let isJsonMode = true;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadFromLocalStorage();
});

// Event Listeners
function initializeEventListeners() {
    document.getElementById('inputData').addEventListener('input', handleInputChange);
    document.getElementById('fileUpload').addEventListener('change', handleFileUpload);
    document.getElementById('clearInput').addEventListener('click', clearInput);
    document.getElementById('convertBtn').addEventListener('click', handleConvert);
    document.getElementById('flattenNested').addEventListener('change', handleConvert);
    document.getElementById('copyOutput').addEventListener('click', copyOutput);
    document.getElementById('downloadBtn').addEventListener('click', downloadOutput);
    
    // Mode toggle
    const modeButtons = document.querySelectorAll('[data-mode]');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;
            switchMode(mode);
        });
    });
}

// Switch between JSON to CSV and CSV to JSON
function switchMode(mode) {
    isJsonMode = mode === 'json-to-csv';
    document.querySelectorAll('[data-mode]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    const jsonOptions = document.getElementById('jsonOptions');
    if (jsonOptions) {
        jsonOptions.style.display = isJsonMode ? 'block' : 'none';
    }
    
    clearInput();
    clearOutput();
}

// Handle input change
function handleInputChange() {
    const input = document.getElementById('inputData').value.trim();
    saveToLocalStorage();
    
    if (input) {
        document.getElementById('convertBtn').disabled = false;
    } else {
        document.getElementById('convertBtn').disabled = true;
    }
}

// Handle file upload
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        document.getElementById('inputData').value = event.target.result;
        handleInputChange();
        handleConvert();
    };
    reader.onerror = () => {
        showError('Failed to read file');
    };
    reader.readAsText(file);
}

// Clear input
function clearInput() {
    document.getElementById('inputData').value = '';
    document.getElementById('fileUpload').value = '';
    document.getElementById('convertBtn').disabled = true;
    clearOutput();
    localStorage.removeItem('jsonCsvConverterInput');
}

// Clear output
function clearOutput() {
    document.getElementById('outputData').value = '';
    document.getElementById('outputSection').style.display = 'none';
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('recordCount').textContent = '0';
    currentData = [];
}

// Handle conversion
function handleConvert() {
    const input = document.getElementById('inputData').value.trim();
    if (!input) {
        showError('Please enter data to convert');
        return;
    }
    
    try {
        if (isJsonMode) {
            convertJsonToCsv(input);
        } else {
            convertCsvToJson(input);
        }
    } catch (error) {
        showError(error.message);
    }
}

// Convert JSON to CSV
function convertJsonToCsv(jsonString) {
    let jsonData;
    
    try {
        jsonData = JSON.parse(jsonString);
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
    
    // Ensure data is an array
    if (!Array.isArray(jsonData)) {
        jsonData = [jsonData];
    }
    
    if (jsonData.length === 0) {
        throw new Error('JSON array is empty');
    }
    
    // Flatten if option is checked
    const shouldFlatten = document.getElementById('flattenNested').checked;
    if (shouldFlatten) {
        jsonData = jsonData.map(item => flattenObject(item));
    }
    
    currentData = jsonData;
    
    // Convert to CSV using PapaParse
    const csv = Papa.unparse(jsonData, {
        quotes: true,
        header: true
    });
    
    // Display output
    document.getElementById('outputData').value = csv;
    document.getElementById('outputSection').style.display = 'block';
    document.getElementById('recordCount').textContent = jsonData.length;
    
    // Show preview table
    displayPreviewTable(jsonData);
}

// Convert CSV to JSON
function convertCsvToJson(csvString) {
    const result = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
    });
    
    if (result.errors.length > 0) {
        const errorMsg = result.errors.map(e => e.message).join(', ');
        throw new Error(`CSV parsing error: ${errorMsg}`);
    }
    
    if (result.data.length === 0) {
        throw new Error('CSV data is empty');
    }
    
    currentData = result.data;
    
    // Convert to JSON
    const json = JSON.stringify(result.data, null, 2);
    
    // Display output
    document.getElementById('outputData').value = json;
    document.getElementById('outputSection').style.display = 'block';
    document.getElementById('recordCount').textContent = result.data.length;
    
    // Show preview table
    displayPreviewTable(result.data);
}

// Flatten nested object
function flattenObject(obj, parent = '', result = {}) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const propName = parent ? `${parent}.${key}` : key;
            
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], propName, result);
            } else if (Array.isArray(obj[key])) {
                result[propName] = JSON.stringify(obj[key]);
            } else {
                result[propName] = obj[key];
            }
        }
    }
    return result;
}

// Display preview table
function displayPreviewTable(data) {
    if (data.length === 0) {
        document.getElementById('previewSection').style.display = 'none';
        return;
    }
    
    const previewTable = document.getElementById('previewTable');
    const maxRows = 10; // Show first 10 rows
    const previewData = data.slice(0, maxRows);
    
    // Get all unique keys
    const keys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
    
    // Create table header
    let html = '<thead><tr>';
    keys.forEach(key => {
        html += `<th>${escapeHtml(key)}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Create table rows
    previewData.forEach(row => {
        html += '<tr>';
        keys.forEach(key => {
            let value = row[key];
            if (value === null || value === undefined) {
                value = '';
            } else if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            html += `<td>${escapeHtml(String(value))}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody>';
    
    if (data.length > maxRows) {
        html += `<tfoot><tr><td colspan="${keys.length}" style="text-align: center; font-style: italic;">Showing ${maxRows} of ${data.length} rows</td></tr></tfoot>`;
    }
    
    previewTable.innerHTML = html;
    document.getElementById('previewSection').style.display = 'block';
}

// Copy output to clipboard
async function copyOutput() {
    const output = document.getElementById('outputData').value;
    if (!output) {
        showError('Nothing to copy');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(output);
        showSuccess('Copied to clipboard!');
    } catch (error) {
        // Fallback method
        const textarea = document.getElementById('outputData');
        textarea.select();
        document.execCommand('copy');
        showSuccess('Copied to clipboard!');
    }
}

// Download output
function downloadOutput() {
    const output = document.getElementById('outputData').value;
    if (!output) {
        showError('Nothing to download');
        return;
    }
    
    const filename = isJsonMode ? 'converted.csv' : 'converted.json';
    const mimeType = isJsonMode ? 'text/csv' : 'application/json';
    
    const blob = new Blob([output], { type: mimeType });
    saveAs(blob, filename);
    showSuccess('File downloaded!');
}

// Show error message
function showError(message) {
    // Create or update error element
    let errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #f44336; color: white; padding: 15px 20px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 1000; max-width: 300px;';
        document.body.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Show success message
function showSuccess(message) {
    let successDiv = document.getElementById('successMessage');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.id = 'successMessage';
        successDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px 20px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 1000; max-width: 300px;';
        document.body.appendChild(successDiv);
    }
    
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 2000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Save to localStorage
function saveToLocalStorage() {
    try {
        const input = document.getElementById('inputData').value;
        localStorage.setItem('jsonCsvConverterInput', input);
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

// Load from localStorage
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('jsonCsvConverterInput');
        if (saved) {
            document.getElementById('inputData').value = saved;
            handleInputChange();
        }
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
    }
}