// Global variables
let parsedData = null;
let currentChart = null;
let chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadFromLocalStorage();
});

// Event Listeners
function initializeEventListeners() {
    // Upload zone
    const uploadZone = document.getElementById('uploadZone');
    const csvFileInput = document.getElementById('csvFileInput');
    
    uploadZone.addEventListener('click', () => csvFileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#36A2EB';
        uploadZone.style.backgroundColor = '#f0f8ff';
    });
    
    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#ddd';
        uploadZone.style.backgroundColor = '#f9f9f9';
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#ddd';
        uploadZone.style.backgroundColor = '#f9f9f9';
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
    
    csvFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
    
    // Parse data button
    document.getElementById('parseDataBtn').addEventListener('click', parseTextData);
    
    // Generate chart button
    document.getElementById('generateChartBtn').addEventListener('click', generateChart);
    
    // Chart type change
    document.getElementById('chartType').addEventListener('change', () => {
        if (currentChart) {
            generateChart();
        }
    });
    
    // Color and title changes
    document.getElementById('chartColor').addEventListener('input', () => {
        if (currentChart) {
            generateChart();
        }
    });
    
    document.getElementById('backgroundColor').addEventListener('input', () => {
        if (currentChart) {
            generateChart();
        }
    });
    
    document.getElementById('chartTitle').addEventListener('input', () => {
        if (currentChart) {
            generateChart();
        }
    });
    
    // Download and export buttons
    document.getElementById('downloadImageBtn').addEventListener('click', downloadChartAsImage);
    document.getElementById('exportJsonBtn').addEventListener('click', exportDataAsJson);
    document.getElementById('resetBtn').addEventListener('click', resetAll);
}

// File upload handler
function handleFileUpload(file) {
    if (!file.name.endsWith('.csv')) {
        showError('Please upload a valid CSV file');
        return;
    }
    
    Papa.parse(file, {
        complete: (results) => {
            if (results.data && results.data.length > 0) {
                parsedData = results.data.filter(row => row.some(cell => cell.trim() !== ''));
                displayDataPreview(parsedData);
                document.getElementById('dataPreviewSection').style.display = 'block';
                document.getElementById('chartControlsSection').style.display = 'block';
                saveToLocalStorage();
            } else {
                showError('CSV file is empty or invalid');
            }
        },
        error: (error) => {
            showError('Error parsing CSV: ' + error.message);
        }
    });
}

// Parse text data
function parseTextData() {
    const textarea = document.getElementById('dataTextarea');
    const text = textarea.value.trim();
    
    if (!text) {
        showError('Please enter some data');
        return;
    }
    
    Papa.parse(text, {
        complete: (results) => {
            if (results.data && results.data.length > 0) {
                parsedData = results.data.filter(row => row.some(cell => cell.trim() !== ''));
                displayDataPreview(parsedData);
                document.getElementById('dataPreviewSection').style.display = 'block';
                document.getElementById('chartControlsSection').style.display = 'block';
                saveToLocalStorage();
            } else {
                showError('Invalid data format');
            }
        },
        error: (error) => {
            showError('Error parsing data: ' + error.message);
        }
    });
}

// Display data preview
function displayDataPreview(data) {
    if (!data || data.length === 0) return;
    
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header || `Column ${index + 1}`;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows (skip header row)
    for (let i = 1; i < Math.min(data.length, 11); i++) {
        const row = document.createElement('tr');
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            row.appendChild(td);
        });
        tableBody.appendChild(row);
    }
    
    if (data.length > 11) {
        const row = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = data[0].length;
        td.textContent = `... and ${data.length - 11} more rows`;
        td.style.textAlign = 'center';
        td.style.fontStyle = 'italic';
        td.style.color = '#666';
        row.appendChild(td);
        tableBody.appendChild(row);
    }
}

// Generate chart
function generateChart() {
    if (!parsedData || parsedData.length < 2) {
        showError('No data available to generate chart');
        return;
    }
    
    const chartType = document.getElementById('chartType').value;
    const chartTitle = document.getElementById('chartTitle').value || 'Chart';
    const chartColor = document.getElementById('chartColor').value;
    const backgroundColor = document.getElementById('backgroundColor').value;
    
    // Prepare data
    const labels = [];
    const datasets = [];
    
    // Extract labels (first column, skip header)
    for (let i = 1; i < parsedData.length; i++) {
        if (parsedData[i][0]) {
            labels.push(parsedData[i][0]);
        }
    }
    
    // Extract datasets (remaining columns)
    const numDatasets = parsedData[0].length - 1;
    
    for (let col = 1; col <= numDatasets; col++) {
        const datasetLabel = parsedData[0][col] || `Dataset ${col}`;
        const data = [];
        
        for (let row = 1; row < parsedData.length; row++) {
            const value = parseFloat(parsedData[row][col]);
            data.push(isNaN(value) ? 0 : value);
        }
        
        const color = chartColor !== '#4BC0C0' ? chartColor : chartColors[col - 1] || chartColors[0];
        
        datasets.push({
            label: datasetLabel,
            data: data,
            backgroundColor: chartType === 'pie' ? chartColors : color,
            borderColor: color,
            borderWidth: 2,
            fill: chartType === 'line' ? false : true,
            tension: 0.4,
            pointRadius: chartType === 'scatter' ? 5 : 3,
            pointHoverRadius: chartType === 'scatter' ? 7 : 5
        });
    }
    
    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }
    
    // Create new chart
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    
    const config = {
        type: chartType,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y !== undefined ? context.parsed.y : context.parsed;
                            return label;
                        }
                    }
                }
            },
            scales: chartType !== 'pie' ? {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            } : {}
        }
    };
    
    currentChart = new Chart(ctx, config);
    
    // Show chart display section
    document.getElementById('chartDisplaySection').style.display = 'block';
    
    // Scroll to chart
    document.getElementById('chartDisplaySection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Download chart as image
async function downloadChartAsImage() {
    if (!currentChart) {
        showError('No chart to download');
        return;
    }
    
    try {
        const canvas = document.getElementById('chartCanvas');
        const link = document.createElement('a');
        link.download = `chart-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        showError('Error downloading chart: ' + error.message);
    }
}

// Export data as JSON
function exportDataAsJson() {
    if (!parsedData) {
        showError('No data to export');
        return;
    }
    
    try {
        const headers = parsedData[0];
        const jsonData = [];
        
        for (let i = 1; i < parsedData.length; i++) {
            const row = {};
            for (let j = 0; j < headers.length; j++) {
                row[headers[j] || `column_${j}`] = parsedData[i][j];
            }
            jsonData.push(row);
        }
        
        const dataStr = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `chart-data-${Date.now()}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        showError('Error exporting JSON: ' + error.message);
    }
}

// Reset all
function resetAll() {
    if (confirm('Are you sure you want to reset everything?')) {
        parsedData = null;
        
        if (currentChart) {
            currentChart.destroy();
            currentChart = null;
        }
        
        document.getElementById('dataTextarea').value = '';
        document.getElementById('csvFileInput').value = '';
        document.getElementById('chartTitle').value = '';
        document.getElementById('chartType').value = 'bar';
        document.getElementById('chartColor').value = '#4BC0C0';
        document.getElementById('backgroundColor').value = '#ffffff';
        
        document.getElementById('dataPreviewSection').style.display = 'none';
        document.getElementById('chartControlsSection').style.display = 'none';
        document.getElementById('chartDisplaySection').style.display = 'none';
        
        document.getElementById('tableHeader').innerHTML = '';
        document.getElementById('tableBody').innerHTML = '';
        
        localStorage.removeItem('chartGeneratorData');
    }
}

// Show error message
function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// LocalStorage functions
function saveToLocalStorage() {
    if (parsedData) {
        try {
            localStorage.setItem('chartGeneratorData', JSON.stringify({
                data: parsedData,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
}

function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem('chartGeneratorData');
        if (stored) {
            const { data, timestamp } = JSON.parse(stored);
            
            // Check if data is less than 24 hours old
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                parsedData = data;
                displayDataPreview(parsedData);
                document.getElementById('dataPreviewSection').style.display = 'block';
                document.getElementById('chartControlsSection').style.display = 'block';
            } else {
                localStorage.removeItem('chartGeneratorData');
            }
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);