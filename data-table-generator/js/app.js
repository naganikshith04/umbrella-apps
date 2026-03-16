// State management
let tableData = [];
let filteredData = [];
let currentPage = 1;
let rowsPerPage = 10;
let sortColumn = null;
let sortDirection = 'asc';

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const clearBtn = document.getElementById('clearBtn');
const tableSection = document.getElementById('tableSection');
const controlsSection = document.getElementById('controlsSection');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const columnFilter = document.getElementById('columnFilter');
const filterValue = document.getElementById('filterValue');
const rowsPerPageSelect = document.getElementById('rowsPerPage');
const paginationContainer = document.getElementById('paginationContainer');
const paginationButtons = document.getElementById('paginationButtons');
const pageInfo = document.getElementById('pageInfo');
const recordCount = document.getElementById('recordCount');
const filterInfo = document.getElementById('filterInfo');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const printBtn = document.getElementById('printBtn');
const printView = document.getElementById('printView');
const printContent = document.getElementById('printContent');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // File upload
    uploadZone.addEventListener('click', () => fileInput.click());
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#007bff';
        uploadZone.style.background = '#f0f8ff';
    });
    
    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#ccc';
        uploadZone.style.background = '#f9f9f9';
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#ccc';
        uploadZone.style.background = '#f9f9f9';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // Clear data
    clearBtn.addEventListener('click', clearData);
    
    // Search
    searchInput.addEventListener('input', handleSearch);
    
    // Filter
    columnFilter.addEventListener('change', handleFilterChange);
    filterValue.addEventListener('input', handleFilter);
    
    // Pagination
    rowsPerPageSelect.addEventListener('change', (e) => {
        rowsPerPage = parseInt(e.target.value);
        currentPage = 1;
        renderTable();
    });
    
    // Export
    exportCsvBtn.addEventListener('click', exportToCsv);
    exportExcelBtn.addEventListener('click', exportToExcel);
    
    // Print
    printBtn.addEventListener('click', handlePrint);
}

// File handling
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.csv')) {
        parseCSV(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        parseExcel(file);
    } else {
        alert('Please upload a CSV or Excel file');
    }
}

function parseCSV(file) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            if (results.data.length > 0) {
                tableData = results.data;
                filteredData = [...tableData];
                initializeTable();
                saveToLocalStorage();
            } else {
                alert('No data found in CSV file');
            }
        },
        error: (error) => {
            alert('Error parsing CSV: ' + error.message);
        }
    });
}

function parseExcel(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            if (jsonData.length > 0) {
                tableData = jsonData;
                filteredData = [...tableData];
                initializeTable();
                saveToLocalStorage();
            } else {
                alert('No data found in Excel file');
            }
        } catch (error) {
            alert('Error parsing Excel: ' + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

// Table initialization
function initializeTable() {
    uploadZone.style.display = 'none';
    tableSection.style.display = 'block';
    controlsSection.style.display = 'block';
    
    populateColumnFilter();
    renderTableHeaders();
    currentPage = 1;
    renderTable();
}

function populateColumnFilter() {
    columnFilter.innerHTML = '<option value="">All Columns</option>';
    if (tableData.length > 0) {
        const columns = Object.keys(tableData[0]);
        columns.forEach(col => {
            const option = document.createElement('option');
            option.value = col;
            option.textContent = col;
            columnFilter.appendChild(option);
        });
    }
}

function renderTableHeaders() {
    tableHead.innerHTML = '';
    if (tableData.length > 0) {
        const columns = Object.keys(tableData[0]);
        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col;
            th.style.cursor = 'pointer';
            th.dataset.column = col;
            th.addEventListener('click', () => handleSort(col));
            
            if (sortColumn === col) {
                const arrow = sortDirection === 'asc' ? ' ▲' : ' ▼';
                th.textContent += arrow;
            }
            
            tableHead.appendChild(th);
        });
    }
}

// Sorting
function handleSort(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    filteredData.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];
        
        // Handle numbers
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
            aVal = aNum;
            bVal = bNum;
        } else {
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    renderTableHeaders();
    renderTable();
}

// Search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredData = [...tableData];
    } else {
        filteredData = tableData.filter(row => {
            return Object.values(row).some(val => 
                String(val).toLowerCase().includes(searchTerm)
            );
        });
    }
    
    applyColumnFilter();
    currentPage = 1;
    renderTable();
}

// Filter
function handleFilterChange() {
    filterValue.value = '';
    handleFilter();
}

function handleFilter() {
    const column = columnFilter.value;
    const value = filterValue.value.toLowerCase().trim();
    
    // Start with search results
    handleSearch();
    
    if (column && value) {
        filteredData = filteredData.filter(row => 
            String(row[column]).toLowerCase().includes(value)
        );
        filterInfo.textContent = `Filtered by ${column}: "${value}"`;
        filterInfo.style.display = 'block';
    } else {
        filterInfo.style.display = 'none';
    }
    
    currentPage = 1;
    renderTable();
}

function applyColumnFilter() {
    const column = columnFilter.value;
    const value = filterValue.value.toLowerCase().trim();
    
    if (column && value) {
        filteredData = filteredData.filter(row => 
            String(row[column]).toLowerCase().includes(value)
        );
    }
}

// Render table
function renderTable() {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = filteredData.slice(start, end);
    
    tableBody.innerHTML = '';
    
    if (pageData.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = Object.keys(tableData[0] || {}).length || 1;
        td.textContent = 'No data found';
        td.style.textAlign = 'center';
        tr.appendChild(td);
        tableBody.appendChild(tr);
    } else {
        pageData.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(val => {
                const td = document.createElement('td');
                td.textContent = val;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }
    
    updateRecordCount();
    renderPagination();
}

function updateRecordCount() {
    const start = filteredData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
    const end = Math.min(currentPage * rowsPerPage, filteredData.length);
    recordCount.textContent = `Showing ${start}-${end} of ${filteredData.length} records`;
}

// Pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    paginationButtons.innerHTML = '';
    
    // Previous button
    const prevBtn = createPaginationButton('Previous', currentPage > 1, () => {
        currentPage--;
        renderTable();
    });
    paginationButtons.appendChild(prevBtn);
    
    // Page numbers
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    if (startPage > 1) {
        const firstBtn = createPaginationButton('1', true, () => {
            currentPage = 1;
            renderTable();
        });
        paginationButtons.appendChild(firstBtn);
        
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '5px 10px';
            paginationButtons.appendChild(dots);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPaginationButton(i.toString(), true, () => {
            currentPage = i;
            renderTable();
        }, i === currentPage);
        paginationButtons.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '5px 10px';
            paginationButtons.appendChild(dots);
        }
        
        const lastBtn = createPaginationButton(totalPages.toString(), true, () => {
            currentPage = totalPages;
            renderTable();
        });
        paginationButtons.appendChild(lastBtn);
    }
    
    // Next button
    const nextBtn = createPaginationButton('Next', currentPage < totalPages, () => {
        currentPage++;
        renderTable();
    });
    paginationButtons.appendChild(nextBtn);
}

function createPaginationButton(text, enabled, onClick, active = false) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.disabled = !enabled;
    if (active) {
        btn.style.background = '#007bff';
        btn.style.color = 'white';
    }
    if (enabled) {
        btn.addEventListener('click', onClick);
    }
    return btn;
}

// Export functions
function exportToCsv() {
    if (filteredData.length === 0) {
        alert('No data to export');
        return;
    }
    
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'data_export.csv');
}

function exportToExcel() {
    if (filteredData.length === 0) {
        alert('No data to export');
        return;
    }
    
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'data_export.xlsx');
}

// Print
function handlePrint() {
    if (filteredData.length === 0) {
        alert('No data to print');
        return;
    }
    
    // Create print table
    let html = '<table style="width: 100%; border-collapse: collapse;">';
    
    // Headers
    html += '<thead><tr>';
    Object.keys(filteredData[0]).forEach(col => {
        html += `<th style="border: 1px solid #ddd; padding: 8px; background: #f2f2f2;">${col}</th>`;
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    filteredData.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(val => {
            html += `<td style="border: 1px solid #ddd; padding: 8px;">${val}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    
    printContent.innerHTML = html;
    printView.style.display = 'block';
    
    setTimeout(() => {
        window.print();
    }, 100);
}

// Handle print close
window.addEventListener('afterprint', () => {
    printView.style.display = 'none';
});

// Clear data
function clearData() {
    if (confirm('Are you sure you want to clear all data?')) {
        tableData = [];
        filteredData = [];
        currentPage = 1;
        sortColumn = null;
        sortDirection = 'asc';
        searchInput.value = '';
        filterValue.value = '';
        columnFilter.selectedIndex = 0;
        fileInput.value = '';
        
        tableSection.style.display = 'none';
        controlsSection.style.display = 'none';
        uploadZone.style.display = 'flex';
        
        localStorage.removeItem('tableData');
    }
}

// LocalStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('tableData', JSON.stringify(tableData));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('tableData');
        if (saved) {
            tableData = JSON.parse(saved);
            if (tableData.length > 0) {
                filteredData = [...tableData];
                initializeTable();
            }
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        localStorage.removeItem('tableData');
    }
}