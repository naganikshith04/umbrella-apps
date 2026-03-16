// Global state
let currentData = [];
let currentHeaders = [];
let batchFiles = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateStats();
});

function initializeEventListeners() {
    // File upload
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    
    fileInput.addEventListener('change', handleFileSelect);
    
    uploadZone.addEventListener('click', () => fileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#007bff';
        uploadZone.style.backgroundColor = '#f0f8ff';
    });
    
    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#ccc';
        uploadZone.style.backgroundColor = 'transparent';
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#ccc';
        uploadZone.style.backgroundColor = 'transparent';
        
        const files = Array.from(e.dataTransfer.files).filter(f => 
            f.name.endsWith('.csv') || f.type === 'text/csv'
        );
        
        if (files.length > 0) {
            if (files.length === 1) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect({ target: { files: files } });
            } else {
                handleBatchFiles(files);
            }
        }
    });
    
    // Buttons
    document.getElementById('convertBtn').addEventListener('click', convertToExcel);
    document.getElementById('downloadBtn').addEventListener('click', downloadExcel);
    document.getElementById('clearBtn').addEventListener('click', clearAll);
    document.getElementById('addRowBtn').addEventListener('click', addRow);
    document.getElementById('addColBtn').addEventListener('click', addColumn);
    document.getElementById('deleteRowBtn').addEventListener('click', deleteSelectedRows);
    document.getElementById('batchConvertBtn').addEventListener('click', batchConvert);
    
    // Delimiter change
    document.getElementById('delimiter').addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            parseCSV(fileInput.files[0]);
        }
    });
    
    // Has header change
    document.getElementById('hasHeader').addEventListener('change', () => {
        if (currentData.length > 0) {
            renderTable();
        }
    });
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
        alert('Please select a valid CSV file');
        return;
    }
    
    parseCSV(file);
}

function parseCSV(file) {
    const delimiter = document.getElementById('delimiter').value;
    const hasHeader = document.getElementById('hasHeader').checked;
    
    Papa.parse(file, {
        delimiter: delimiter === 'auto' ? '' : delimiter,
        skipEmptyLines: true,
        complete: (results) => {
            if (results.errors.length > 0) {
                console.error('Parse errors:', results.errors);
            }
            
            if (results.data.length === 0) {
                alert('No data found in CSV file');
                return;
            }
            
            if (hasHeader && results.data.length > 0) {
                currentHeaders = results.data[0];
                currentData = results.data.slice(1);
            } else {
                currentHeaders = results.data[0].map((_, i) => `Column ${i + 1}`);
                currentData = results.data;
            }
            
            renderTable();
            updateStats();
            document.getElementById('previewSection').style.display = 'block';
            document.getElementById('convertBtn').disabled = false;
        },
        error: (error) => {
            alert('Error parsing CSV: ' + error.message);
        }
    });
}

function renderTable() {
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');
    const hasHeader = document.getElementById('hasHeader').checked;
    
    // Clear existing content
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Render header
    const headerRow = document.createElement('tr');
    
    // Checkbox column
    const checkboxTh = document.createElement('th');
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.addEventListener('change', (e) => {
        document.querySelectorAll('.row-checkbox').forEach(cb => {
            cb.checked = e.target.checked;
        });
    });
    checkboxTh.appendChild(selectAllCheckbox);
    headerRow.appendChild(checkboxTh);
    
    // Row number column
    const rowNumTh = document.createElement('th');
    rowNumTh.textContent = '#';
    headerRow.appendChild(rowNumTh);
    
    // Data columns
    currentHeaders.forEach((header, index) => {
        const th = document.createElement('th');
        th.contentEditable = true;
        th.textContent = header;
        th.addEventListener('blur', (e) => {
            currentHeaders[index] = e.target.textContent;
        });
        headerRow.appendChild(th);
    });
    
    tableHead.appendChild(headerRow);
    
    // Render body
    currentData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        // Checkbox
        const checkboxTd = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'row-checkbox';
        checkbox.dataset.rowIndex = rowIndex;
        checkboxTd.appendChild(checkbox);
        tr.appendChild(checkboxTd);
        
        // Row number
        const rowNumTd = document.createElement('td');
        rowNumTd.textContent = rowIndex + 1;
        tr.appendChild(rowNumTd);
        
        // Data cells
        row.forEach((cell, cellIndex) => {
            const td = document.createElement('td');
            td.contentEditable = true;
            td.textContent = cell;
            td.addEventListener('blur', (e) => {
                currentData[rowIndex][cellIndex] = e.target.textContent;
            });
            tr.appendChild(td);
        });
        
        tableBody.appendChild(tr);
    });
    
    updateStats();
}

function updateStats() {
    document.getElementById('rowCount').textContent = currentData.length;
    document.getElementById('colCount').textContent = currentHeaders.length || 0;
    document.getElementById('batchCount').textContent = batchFiles.length;
    
    const totalSize = batchFiles.reduce((sum, file) => sum + file.size, 0);
    document.getElementById('totalSize').textContent = formatFileSize(totalSize);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function addRow() {
    if (currentHeaders.length === 0) {
        alert('Please load a CSV file first');
        return;
    }
    
    const newRow = new Array(currentHeaders.length).fill('');
    currentData.push(newRow);
    renderTable();
}

function addColumn() {
    if (currentData.length === 0) {
        alert('Please load a CSV file first');
        return;
    }
    
    currentHeaders.push(`Column ${currentHeaders.length + 1}`);
    currentData.forEach(row => row.push(''));
    renderTable();
}

function deleteSelectedRows() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    if (checkboxes.length === 0) {
        alert('Please select rows to delete');
        return;
    }
    
    const rowIndices = Array.from(checkboxes)
        .map(cb => parseInt(cb.dataset.rowIndex))
        .sort((a, b) => b - a);
    
    rowIndices.forEach(index => {
        currentData.splice(index, 1);
    });
    
    renderTable();
}

function convertToExcel() {
    if (currentData.length === 0) {
        alert('No data to convert');
        return;
    }
    
    try {
        const wb = XLSX.utils.book_new();
        const wsData = [currentHeaders, ...currentData];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Auto-size columns
        const colWidths = currentHeaders.map((_, i) => {
            const maxLength = Math.max(
                currentHeaders[i].length,
                ...currentData.map(row => (row[i] || '').toString().length)
            );
            return { wch: Math.min(maxLength + 2, 50) };
        });
        ws['!cols'] = colWidths;
        
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        
        // Store workbook for download
        window.currentWorkbook = wb;
        
        document.getElementById('downloadBtn').disabled = false;
        alert('Conversion successful! Click Download to save the file.');
    } catch (error) {
        alert('Error converting to Excel: ' + error.message);
    }
}

function downloadExcel() {
    if (!window.currentWorkbook) {
        alert('Please convert the file first');
        return;
    }
    
    try {
        const fileName = 'converted_' + Date.now() + '.xlsx';
        XLSX.writeFile(window.currentWorkbook, fileName);
    } catch (error) {
        alert('Error downloading file: ' + error.message);
    }
}

function clearAll() {
    currentData = [];
    currentHeaders = [];
    document.getElementById('fileInput').value = '';
    document.getElementById('tableHead').innerHTML = '';
    document.getElementById('tableBody').innerHTML = '';
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('convertBtn').disabled = true;
    document.getElementById('downloadBtn').disabled = true;
    window.currentWorkbook = null;
    updateStats();
}

function handleBatchFiles(files) {
    batchFiles = Array.from(files);
    renderBatchFileList();
    updateStats();
}

function renderBatchFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    
    if (batchFiles.length === 0) {
        fileList.innerHTML = '<p style="text-align: center; color: #999;">No files selected</p>';
        return;
    }
    
    batchFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee;';
        
        const fileInfo = document.createElement('span');
        fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer;';
        removeBtn.addEventListener('click', () => {
            batchFiles.splice(index, 1);
            renderBatchFileList();
            updateStats();
        });
        
        fileItem.appendChild(fileInfo);
        fileItem.appendChild(removeBtn);
        fileList.appendChild(fileItem);
    });
}

async function batchConvert() {
    if (batchFiles.length === 0) {
        alert('Please add files for batch conversion');
        return;
    }
    
    const convertBtn = document.getElementById('batchConvertBtn');
    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';
    
    try {
        for (let i = 0; i < batchFiles.length; i++) {
            const file = batchFiles[i];
            convertBtn.textContent = `Converting ${i + 1}/${batchFiles.length}...`;
            
            await convertSingleFile(file);
        }
        
        alert(`Successfully converted ${batchFiles.length} files!`);
        batchFiles = [];
        renderBatchFileList();
        updateStats();
    } catch (error) {
        alert('Error during batch conversion: ' + error.message);
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert All';
    }
}

function convertSingleFile(file) {
    return new Promise((resolve, reject) => {
        const delimiter = document.getElementById('delimiter').value;
        const hasHeader = document.getElementById('hasHeader').checked;
        
        Papa.parse(file, {
            delimiter: delimiter === 'auto' ? '' : delimiter,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    if (results.data.length === 0) {
                        reject(new Error(`No data in ${file.name}`));
                        return;
                    }
                    
                    let headers, data;
                    if (hasHeader && results.data.length > 0) {
                        headers = results.data[0];
                        data = results.data.slice(1);
                    } else {
                        headers = results.data[0].map((_, i) => `Column ${i + 1}`);
                        data = results.data;
                    }
                    
                    const wb = XLSX.utils.book_new();
                    const wsData = [headers, ...data];
                    const ws = XLSX.utils.aoa_to_sheet(wsData);
                    
                    const colWidths = headers.map((_, i) => {
                        const maxLength = Math.max(
                            headers[i].length,
                            ...data.map(row => (row[i] || '').toString().length)
                        );
                        return { wch: Math.min(maxLength + 2, 50) };
                    });
                    ws['!cols'] = colWidths;
                    
                    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                    
                    const fileName = file.name.replace(/\.csv$/i, '') + '.xlsx';
                    XLSX.writeFile(wb, fileName);
                    
                    resolve();
                } catch (error) {
                    reject(error);
                }
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}

// Add file input to batch
document.getElementById('fileInput').addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 1) {
        handleBatchFiles(files);
    }
});