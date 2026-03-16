// JSON Formatter Pro - Main JavaScript

// Import required libraries (assumed to be loaded via CDN)
// Prism.js for syntax highlighting
// FileSaver.js for file downloads

// DOM Elements
const jsonInput = document.getElementById('jsonInput');
const formatBtn = document.getElementById('formatBtn');
const minifyBtn = document.getElementById('minifyBtn');
const validateBtn = document.getElementById('validateBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const fileInput = document.getElementById('fileInput');
const treeViewBtn = document.getElementById('treeViewBtn');
const codeViewBtn = document.getElementById('codeViewBtn');
const treeView = document.getElementById('treeView');
const codeView = document.getElementById('codeView');
const highlightedCode = document.getElementById('highlightedCode');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const charCount = document.getElementById('charCount');
const lineCount = document.getElementById('lineCount');
const sizeCount = document.getElementById('sizeCount');

// State
let currentJSON = null;
let currentView = 'code'; // 'code' or 'tree'

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateStats();
    attachEventListeners();
    showCodeView();
});

// Event Listeners
function attachEventListeners() {
    jsonInput.addEventListener('input', handleInputChange);
    formatBtn.addEventListener('click', formatJSON);
    minifyBtn.addEventListener('click', minifyJSON);
    validateBtn.addEventListener('click', validateJSON);
    clearBtn.addEventListener('click', clearAll);
    downloadBtn.addEventListener('click', downloadJSON);
    fileInput.addEventListener('change', handleFileUpload);
    treeViewBtn.addEventListener('click', showTreeView);
    codeViewBtn.addEventListener('click', showCodeView);
}

// Handle input changes
function handleInputChange() {
    const value = jsonInput.value;
    updateStats();
    saveToLocalStorage(value);
    clearMessages();
}

// Update statistics
function updateStats() {
    const text = jsonInput.value;
    const chars = text.length;
    const lines = text.split('\n').length;
    const bytes = new Blob([text]).size;
    const kb = (bytes / 1024).toFixed(2);

    if (charCount) charCount.textContent = chars;
    if (lineCount) lineCount.textContent = lines;
    if (sizeCount) sizeCount.textContent = `${kb} KB`;
}

// Format JSON
function formatJSON() {
    clearMessages();
    const input = jsonInput.value.trim();

    if (!input) {
        showError('Please enter JSON data to format');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        currentJSON = parsed;
        const formatted = JSON.stringify(parsed, null, 2);
        jsonInput.value = formatted;
        updateStats();
        saveToLocalStorage(formatted);
        highlightSyntax(formatted);
        showSuccess('JSON formatted successfully!');
        
        if (currentView === 'tree') {
            renderTreeView(parsed);
        }
    } catch (error) {
        showError(`Invalid JSON: ${error.message}`);
        highlightError(error);
    }
}

// Minify JSON
function minifyJSON() {
    clearMessages();
    const input = jsonInput.value.trim();

    if (!input) {
        showError('Please enter JSON data to minify');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        currentJSON = parsed;
        const minified = JSON.stringify(parsed);
        jsonInput.value = minified;
        updateStats();
        saveToLocalStorage(minified);
        highlightSyntax(minified);
        showSuccess('JSON minified successfully!');
        
        if (currentView === 'tree') {
            renderTreeView(parsed);
        }
    } catch (error) {
        showError(`Invalid JSON: ${error.message}`);
        highlightError(error);
    }
}

// Validate JSON
function validateJSON() {
    clearMessages();
    const input = jsonInput.value.trim();

    if (!input) {
        showError('Please enter JSON data to validate');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        currentJSON = parsed;
        showSuccess('✓ Valid JSON!');
        highlightSyntax(input);
        
        if (currentView === 'tree') {
            renderTreeView(parsed);
        }
    } catch (error) {
        showError(`✗ Invalid JSON: ${error.message}`);
        highlightError(error);
    }
}

// Clear all
function clearAll() {
    jsonInput.value = '';
    highlightedCode.textContent = '';
    treeView.innerHTML = '';
    currentJSON = null;
    clearMessages();
    updateStats();
    localStorage.removeItem('jsonFormatterData');
    showSuccess('Cleared successfully!');
}

// Download JSON
function downloadJSON() {
    const input = jsonInput.value.trim();

    if (!input) {
        showError('No JSON data to download');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        const blob = new Blob([formatted], { type: 'application/json' });
        
        if (typeof saveAs !== 'undefined') {
            saveAs(blob, 'formatted.json');
        } else {
            // Fallback download method
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'formatted.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        
        showSuccess('JSON downloaded successfully!');
    } catch (error) {
        showError(`Cannot download invalid JSON: ${error.message}`);
    }
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
        showError('Please upload a valid JSON file');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
        const content = e.target.result;
        jsonInput.value = content;
        updateStats();
        saveToLocalStorage(content);
        clearMessages();
        
        try {
            const parsed = JSON.parse(content);
            currentJSON = parsed;
            showSuccess('File loaded successfully!');
            highlightSyntax(content);
            
            if (currentView === 'tree') {
                renderTreeView(parsed);
            }
        } catch (error) {
            showError(`Invalid JSON in file: ${error.message}`);
        }
    };
    
    reader.onerror = () => {
        showError('Error reading file');
    };
    
    reader.readAsText(file);
    fileInput.value = '';
}

// Show code view
function showCodeView() {
    currentView = 'code';
    codeView.style.display = 'block';
    treeView.style.display = 'none';
    codeViewBtn.classList.add('active');
    treeViewBtn.classList.remove('active');
    
    const input = jsonInput.value.trim();
    if (input) {
        try {
            JSON.parse(input);
            highlightSyntax(input);
        } catch (error) {
            highlightedCode.textContent = input;
        }
    }
}

// Show tree view
function showTreeView() {
    currentView = 'tree';
    treeView.style.display = 'block';
    codeView.style.display = 'none';
    treeViewBtn.classList.add('active');
    codeViewBtn.classList.remove('active');
    
    const input = jsonInput.value.trim();
    
    if (!input) {
        treeView.innerHTML = '<div class="tree-empty">No JSON data to display</div>';
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        currentJSON = parsed;
        renderTreeView(parsed);
    } catch (error) {
        treeView.innerHTML = `<div class="tree-error">Invalid JSON: ${error.message}</div>`;
    }
}

// Render tree view
function renderTreeView(data, container = treeView, isRoot = true) {
    if (isRoot) {
        container.innerHTML = '';
    }
    
    const ul = document.createElement('ul');
    ul.className = 'tree-list';
    
    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'tree-item';
            
            if (typeof item === 'object' && item !== null) {
                const toggle = document.createElement('span');
                toggle.className = 'tree-toggle';
                toggle.textContent = '▼';
                
                const key = document.createElement('span');
                key.className = 'tree-key';
                key.textContent = `[${index}]`;
                
                const type = document.createElement('span');
                type.className = 'tree-type';
                type.textContent = Array.isArray(item) ? 'Array' : 'Object';
                
                li.appendChild(toggle);
                li.appendChild(key);
                li.appendChild(type);
                
                const childContainer = document.createElement('div');
                childContainer.className = 'tree-children';
                renderTreeView(item, childContainer, false);
                li.appendChild(childContainer);
                
                toggle.addEventListener('click', () => {
                    childContainer.classList.toggle('collapsed');
                    toggle.textContent = childContainer.classList.contains('collapsed') ? '▶' : '▼';
                });
            } else {
                const key = document.createElement('span');
                key.className = 'tree-key';
                key.textContent = `[${index}]`;
                
                const value = document.createElement('span');
                value.className = `tree-value tree-${typeof item}`;
                value.textContent = JSON.stringify(item);
                
                li.appendChild(key);
                li.appendChild(document.createTextNode(': '));
                li.appendChild(value);
            }
            
            ul.appendChild(li);
        });
    } else if (typeof data === 'object' && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
            const li = document.createElement('li');
            li.className = 'tree-item';
            
            if (typeof value === 'object' && value !== null) {
                const toggle = document.createElement('span');
                toggle.className = 'tree-toggle';
                toggle.textContent = '▼';
                
                const keySpan = document.createElement('span');
                keySpan.className = 'tree-key';
                keySpan.textContent = key;
                
                const type = document.createElement('span');
                type.className = 'tree-type';
                type.textContent = Array.isArray(value) ? 'Array' : 'Object';
                
                li.appendChild(toggle);
                li.appendChild(keySpan);
                li.appendChild(document.createTextNode(': '));
                li.appendChild(type);
                
                const childContainer = document.createElement('div');
                childContainer.className = 'tree-children';
                renderTreeView(value, childContainer, false);
                li.appendChild(childContainer);
                
                toggle.addEventListener('click', () => {
                    childContainer.classList.toggle('collapsed');
                    toggle.textContent = childContainer.classList.contains('collapsed') ? '▶' : '▼';
                });
            } else {
                const keySpan = document.createElement('span');
                keySpan.className = 'tree-key';
                keySpan.textContent = key;
                
                const valueSpan = document.createElement('span');
                valueSpan.className = `tree-value tree-${typeof value}`;
                valueSpan.textContent = JSON.stringify(value);
                
                li.appendChild(keySpan);
                li.appendChild(document.createTextNode(': '));
                li.appendChild(valueSpan);
            }
            
            ul.appendChild(li);
        });
    }
    
    container.appendChild(ul);
}

// Syntax highlighting
function highlightSyntax(code) {
    if (typeof Prism !== 'undefined') {
        highlightedCode.textContent = code;
        Prism.highlightElement(highlightedCode);
    } else {
        highlightedCode.textContent = code;
    }
}

// Highlight error in code
function highlightError(error) {
    const input = jsonInput.value;
    highlightedCode.textContent = input;
    
    if (typeof Prism !== 'undefined') {
        try {
            Prism.highlightElement(highlightedCode);
        } catch (e) {
            // Fallback if highlighting fails
        }
    }
}

// Show error message
function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
}

// Show success message
function showSuccess(message) {
    if (successMessage) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
}

// Clear messages
function clearMessages() {
    if (errorMessage) errorMessage.style.display = 'none';
    if (successMessage) successMessage.style.display = 'none';
}

// LocalStorage functions
function saveToLocalStorage(data) {
    try {
        localStorage.setItem('jsonFormatterData', data);
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem('jsonFormatterData');
        if (data) {
            jsonInput.value = data;
            updateStats();
        }
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to format
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        formatJSON();
    }
    
    // Ctrl/Cmd + M to minify
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        minifyJSON();
    }
    
    // Ctrl/Cmd + K to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearAll();
    }
});