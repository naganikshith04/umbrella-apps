// Report Builder Application
class ReportBuilder {
    constructor() {
        this.dataSources = [];
        this.sections = [];
        this.currentSection = null;
        this.currentElement = null;
        this.charts = new Map();
        this.sectionCounter = 0;
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.setupUploadZone();
        this.renderDataSources();
        this.renderSections();
        this.updateReportDate();
        
        // Add initial section if none exist
        if (this.sections.length === 0) {
            this.addSection();
        }
    }

    setupEventListeners() {
        // File upload
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Add elements
        document.getElementById('addSectionBtn').addEventListener('click', () => this.addSection());
        document.getElementById('addChartBtn').addEventListener('click', () => this.addChart());
        document.getElementById('addTableBtn').addEventListener('click', () => this.addTable());
        document.getElementById('addTextBtn').addEventListener('click', () => this.addText());
        
        // Template selector
        document.getElementById('templateSelector').addEventListener('change', (e) => this.applyTemplate(e.target.value));
        
        // Export and save
        document.getElementById('exportPdfBtn').addEventListener('click', () => this.exportToPDF());
        document.getElementById('saveReportBtn').addEventListener('click', () => this.saveReport());
        
        // Data modal
        document.getElementById('applyDataBtn').addEventListener('click', () => this.applyDataToChart());
        document.getElementById('cancelDataBtn').addEventListener('click', () => this.closeDataModal());
        
        // Chart configuration
        document.getElementById('chartTypeSelector').addEventListener('change', () => this.updateSampleChart());
        document.getElementById('xAxisSelect').addEventListener('change', () => this.updateSampleChart());
        document.getElementById('yAxisSelect').addEventListener('change', () => this.updateSampleChart());
        document.getElementById('chartTitleInput').addEventListener('input', () => this.updateSampleChart());
    }

    setupUploadZone() {
        const uploadZone = document.getElementById('uploadZone');
        
        uploadZone.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#007bff';
            uploadZone.style.backgroundColor = '#f0f8ff';
        });
        
        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#ddd';
            uploadZone.style.backgroundColor = '';
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#ddd';
            uploadZone.style.backgroundColor = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        });
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (fileExtension === 'csv') {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    this.addDataSource(file.name, results.data);
                    this.showToast('Data source imported successfully!');
                },
                error: (error) => {
                    this.showToast('Error parsing CSV file: ' + error.message, 'error');
                }
            });
        } else if (fileExtension === 'json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const dataArray = Array.isArray(data) ? data : [data];
                    this.addDataSource(file.name, dataArray);
                    this.showToast('Data source imported successfully!');
                } catch (error) {
                    this.showToast('Error parsing JSON file: ' + error.message, 'error');
                }
            };
            reader.readAsText(file);
        } else {
            this.showToast('Unsupported file format. Please upload CSV or JSON.', 'error');
        }
    }

    addDataSource(name, data) {
        const dataSource = {
            id: Date.now(),
            name: name,
            data: data,
            columns: data.length > 0 ? Object.keys(data[0]) : []
        };
        
        this.dataSources.push(dataSource);
        this.renderDataSources();
        this.saveToStorage();
    }

    renderDataSources() {
        const list = document.getElementById('dataSourcesList');
        const select = document.getElementById('dataSourceSelect');
        
        list.innerHTML = '';
        select.innerHTML = '<option value="">Select data source...</option>';
        
        this.dataSources.forEach(source => {
            // List item
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${source.name}</span>
                <small>${source.data.length} rows, ${source.columns.length} columns</small>
                <button class="btn-icon" onclick="reportBuilder.removeDataSource(${source.id})">×</button>
            `;
            list.appendChild(li);
            
            // Select option
            const option = document.createElement('option');
            option.value = source.id;
            option.textContent = source.name;
            select.appendChild(option);
        });
    }

    removeDataSource(id) {
        this.dataSources = this.dataSources.filter(s => s.id !== id);
        this.renderDataSources();
        this.saveToStorage();
        this.showToast('Data source removed');
    }

    addSection() {
        this.sectionCounter++;
        const section = {
            id: Date.now(),
            title: `Section ${this.sectionCounter}`,
            elements: []
        };
        
        this.sections.push(section);
        this.renderSections();
        this.renderReport();
        this.saveToStorage();
    }

    renderSections() {
        const list = document.getElementById('sectionsList');
        list.innerHTML = '';
        
        this.sections.forEach((section, index) => {
            const li = document.createElement('li');
            li.className = this.currentSection?.id === section.id ? 'active' : '';
            li.innerHTML = `
                <input type="text" value="${section.title}" 
                       onchange="reportBuilder.updateSectionTitle(${section.id}, this.value)"
                       onclick="event.stopPropagation()">
                <div>
                    <button class="btn-icon" onclick="reportBuilder.moveSection(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="btn-icon" onclick="reportBuilder.moveSection(${index}, 1)" ${index === this.sections.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="btn-icon" onclick="reportBuilder.removeSection(${section.id})">×</button>
                </div>
            `;
            li.addEventListener('click', () => this.selectSection(section.id));
            list.appendChild(li);
        });
    }

    selectSection(id) {
        this.currentSection = this.sections.find(s => s.id === id);
        this.renderSections();
        this.highlightSection(id);
    }

    highlightSection(id) {
        document.querySelectorAll('.report-section').forEach(section => {
            section.style.outline = section.dataset.sectionId == id ? '2px solid #007bff' : '';
        });
    }

    updateSectionTitle(id, title) {
        const section = this.sections.find(s => s.id === id);
        if (section) {
            section.title = title;
            this.renderReport();
            this.saveToStorage();
        }
    }

    moveSection(index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < this.sections.length) {
            [this.sections[index], this.sections[newIndex]] = [this.sections[newIndex], this.sections[index]];
            this.renderSections();
            this.renderReport();
            this.saveToStorage();
        }
    }

    removeSection(id) {
        this.sections = this.sections.filter(s => s.id !== id);
        if (this.currentSection?.id === id) {
            this.currentSection = this.sections[0] || null;
        }
        this.renderSections();
        this.renderReport();
        this.saveToStorage();
    }

    addChart() {
        if (!this.currentSection) {
            this.showToast('Please select a section first', 'error');
            return;
        }
        
        if (this.dataSources.length === 0) {
            this.showToast('Please import a data source first', 'error');
            return;
        }
        
        this.currentElement = {
            type: 'chart',
            id: Date.now(),
            config: null
        };
        
        this.openDataModal();
    }

    addTable() {
        if (!this.currentSection) {
            this.showToast('Please select a section first', 'error');
            return;
        }
        
        if (this.dataSources.length === 0) {
            this.showToast('Please import a data source first', 'error');
            return;
        }
        
        const dataSourceId = this.dataSources[0].id;
        const dataSource = this.dataSources.find(s => s.id === dataSourceId);
        
        const element = {
            type: 'table',
            id: Date.now(),
            dataSourceId: dataSourceId,
            columns: dataSource.columns
        };
        
        this.currentSection.elements.push(element);
        this.renderReport();
        this.saveToStorage();
        this.showToast('Table added');
    }

    addText() {
        if (!this.currentSection) {
            this.showToast('Please select a section first', 'error');
            return;
        }
        
        const element = {
            type: 'text',
            id: Date.now(),
            content: 'Enter your analysis here...'
        };
        
        this.currentSection.elements.push(element);
        this.renderReport();
        this.saveToStorage();
        this.showToast('Text block added');
    }

    openDataModal() {
        const modal = document.getElementById('dataModal');
        modal.style.display = 'flex';
        
        // Reset form
        document.getElementById('dataSourceSelect').value = '';
        document.getElementById('chartTypeSelector').value = 'bar';
        document.getElementById('chartTitleInput').value = 'Chart Title';
        document.getElementById('xAxisSelect').innerHTML = '<option value="">Select X axis...</option>';
        document.getElementById('yAxisSelect').innerHTML = '<option value="">Select Y axis...</option>';
        
        // Setup data source change listener
        document.getElementById('dataSourceSelect').onchange = (e) => {
            const dataSource = this.dataSources.find(s => s.id == e.target.value);
            if (dataSource) {
                this.populateAxisSelectors(dataSource);
            }
        };
    }

    closeDataModal() {
        document.getElementById('dataModal').style.display = 'none';
        this.currentElement = null;
    }

    populateAxisSelectors(dataSource) {
        const xAxisSelect = document.getElementById('xAxisSelect');
        const yAxisSelect = document.getElementById('yAxisSelect');
        
        xAxisSelect.innerHTML = '<option value="">Select X axis...</option>';
        yAxisSelect.innerHTML = '<option value="">Select Y axis...</option>';
        
        dataSource.columns.forEach(col => {
            const xOption = document.createElement('option');
            xOption.value = col;
            xOption.textContent = col;
            xAxisSelect.appendChild(xOption);
            
            const yOption = document.createElement('option');
            yOption.value = col;
            yOption.textContent = col;
            yAxisSelect.appendChild(yOption);
        });
        
        // Auto-select first columns
        if (dataSource.columns.length > 0) {
            xAxisSelect.value = dataSource.columns[0];
            if (dataSource.columns.length > 1) {
                yAxisSelect.value = dataSource.columns[1];
            }
        }
        
        this.updateSampleChart();
    }

    updateSampleChart() {
        const dataSourceId = document.getElementById('dataSourceSelect').value;
        const chartType = document.getElementById('chartTypeSelector').value;
        const xAxis = document.getElementById('xAxisSelect').value;
        const yAxis = document.getElementById('yAxisSelect').value;
        const title = document.getElementById('chartTitleInput').value;
        
        if (!dataSourceId || !xAxis || !yAxis) return;
        
        const dataSource = this.dataSources.find(s => s.id == dataSourceId);
        if (!dataSource) return;
        
        const canvas = document.getElementById('sampleChart');
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (canvas.chart) {
            canvas.chart.destroy();
        }
        
        // Prepare data
        const labels = dataSource.data.map(row => row[xAxis]).slice(0, 10);
        const values = dataSource.data.map(row => {
            const val = row[yAxis];
            return typeof val === 'number' ? val : parseFloat(val) || 0;
        }).slice(0, 10);
        
        const config = {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: yAxis,
                    data: values,
                    backgroundColor: chartType === 'pie' || chartType === 'doughnut' 
                        ? this.generateColors(values.length)
                        : 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: title
                    },
                    legend: {
                        display: chartType === 'pie' || chartType === 'doughnut'
                    }
                },
                scales: chartType === 'pie' || chartType === 'doughnut' ? {} : {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
        
        canvas.chart = new Chart(ctx, config);
    }

    generateColors(count) {
        const colors = [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(199, 199, 199, 0.5)',
            'rgba(83, 102, 255, 0.5)',
            'rgba(255, 99, 255, 0.5)',
            'rgba(99, 255, 132, 0.5)'
        ];
        
        return Array(count).fill(0).map((_, i) => colors[i % colors.length]);
    }

    applyDataToChart() {
        const dataSourceId = document.getElementById('dataSourceSelect').value;
        const chartType = document.getElementById('chartTypeSelector').value;
        const xAxis = document.getElementById('xAxisSelect').value;
        const yAxis = document.getElementById('yAxisSelect').value;
        const title = document.getElementById('chartTitleInput').value;
        
        if (!dataSourceId || !xAxis || !yAxis) {
            this.showToast('Please select all required fields', 'error');
            return;
        }
        
        this.currentElement.config = {
            dataSourceId: parseInt(dataSourceId),
            chartType,
            xAxis,
            yAxis,
            title
        };
        
        this.currentSection.elements.push(this.currentElement);
        this.renderReport();
        this.saveToStorage();
        this.closeDataModal();
        this.showToast('Chart added successfully');
    }

    renderReport() {
        const container = document.getElementById('reportContainer');
        container.innerHTML = '';
        
        this.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'report-section';
            sectionDiv.dataset.sectionId = section.id;
            
            const header = document.createElement('h2');
            header.textContent = section.title;
            sectionDiv.appendChild(header);
            
            section.elements.forEach(element => {
                const elementDiv = this.renderElement(element);
                if (elementDiv) {
                    sectionDiv.appendChild(elementDiv);
                }
            });
            
            container.appendChild(sectionDiv);
        });
        
        // Re-highlight current section
        if (this.currentSection) {
            this.highlightSection(this.currentSection.id);
        }
    }

    renderElement(element) {
        const div = document.createElement('div');
        div.className = 'report-element';
        div.dataset.elementId = element.id;
        
        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-icon delete-element';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = () => this.removeElement(element.id);
        div.appendChild(deleteBtn);
        
        if (element.type === 'chart') {
            div.classList.add('chart-element');
            this.renderChartElement(element, div);
        } else if (element.type === 'table') {
            div.classList.add('table-element');
            this.renderTableElement(element, div);
        } else if (element.type === 'text') {
            div.classList.add('text-element');
            this.renderTextElement(element, div);
        }
        
        return div;
    }

    renderChartElement(element, container) {
        if (!element.config) return;
        
        const dataSource = this.dataSources.find(s => s.id === element.config.dataSourceId);
        if (!dataSource) {
            container.innerHTML += '<p>Data source not found</p>';
            return;
        }
        
        const canvas = document.createElement('canvas');
        canvas.style.maxHeight = '400px';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Prepare data
        const labels = dataSource.data.map(row => row[element.config.xAxis]);
        const values = dataSource.data.map(row => {
            const val = row[element.config.yAxis];
            return typeof val === 'number' ? val : parseFloat(val) || 0;
        });
        
        const config = {
            type: element.config.chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: element.config.yAxis,
                    data: values,
                    backgroundColor: element.config.chartType === 'pie' || element.config.chartType === 'doughnut'
                        ? this.generateColors(values.length)
                        : 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: element.config.title,
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: element.config.chartType === 'pie' || element.config.chartType === 'doughnut'
                    }
                },
                scales: element.config.chartType === 'pie' || element.config.chartType === 'doughnut' ? {} : {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
        
        const chart = new Chart(ctx, config);
        this.charts.set(element.id, chart);
    }

    renderTableElement(element, container) {
        const dataSource = this.dataSources.find(s => s.id === element.dataSourceId);
        if (!dataSource) {
            container.innerHTML += '<p>Data source not found</p>';
            return;
        }
        
        const table = document.createElement('table');
        
        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        element.columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Body (limit to 10 rows for display)
        const tbody = document.createElement('tbody');
        dataSource.data.slice(0, 10).forEach(row => {
            const tr = document.createElement('tr');
            element.columns.forEach(col => {
                const td = document.createElement('td');
                td.textContent = row[col] ?? '';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        
        container.appendChild(table);
        
        if (dataSource.data.length > 10) {
            const note = document.createElement('p');
            note.style.fontSize = '0.9em';
            note.style.color = '#666';
            note.textContent = `Showing 10 of ${dataSource.data.length} rows`;
            container.appendChild(note);
        }
    }

    renderTextElement(element, container) {
        const textarea = document.createElement('textarea');
        textarea.value = element.content;
        textarea.rows = 5;
        textarea.style.width = '100%';
        textarea.style.padding = '10px';
        textarea.style.border = '1px solid #ddd';
        textarea.style.borderRadius = '4px';
        textarea.style.fontFamily = 'inherit';
        textarea.style.fontSize = '14px';
        textarea.addEventListener('input', (e) => {
            element.content = e.target.value;
            this.saveToStorage();
        });
        container.appendChild(textarea);
    }

    removeElement(elementId) {
        this.sections.forEach(section => {
            section.elements = section.elements.filter(e => e.id !== elementId);
        });
        
        // Destroy chart if exists
        if (this.charts.has(elementId)) {
            this.charts.get(elementId).destroy();
            this.charts.delete(elementId);
        }
        
        this.renderReport();
        this.saveToStorage();
        this.showToast('Element removed');
    }

    applyTemplate(template) {
        const reportContainer = document.getElementById('reportContainer');
        
        // Remove existing template classes
        reportContainer.className = 'report-container';
        
        if (template === 'modern') {
            reportContainer.classList.add('template-modern');
        } else if (template === 'classic') {
            reportContainer.classList.add('template-classic');
        } else if (template === 'minimal') {
            reportContainer.classList.add('template-minimal');
        }
        
        this.showToast(`${template.charAt(0).toUpperCase() + template.slice(1)} template applied`);
    }

    updateReportDate() {
        const dateElement = document.getElementById('reportDate');
        const now = new Date();
        const formatted = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateElement.textContent = formatted;
    }

    async exportToPDF() {
        if (this.sections.length === 0) {
            this.showToast('Please add at least one section', 'error');
            return;
        }
        
        this.showToast('Generating PDF...');
        
        const reportContainer = document.getElementById('reportContainer');
        
        // Hide delete buttons for export
        const deleteButtons = reportContainer.querySelectorAll('.delete-element');
        deleteButtons.forEach(btn => btn.style.display = 'none');
        
        // Remove section outlines
        document.querySelectorAll('.report-section').forEach(section => {
            section.style.outline = 'none';
        });
        
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `report-${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };
        
        try {
            await html2pdf().set(opt).from(reportContainer).save();
            this.showToast('PDF exported successfully!');
        } catch (error) {
            this.showToast('Error exporting PDF: ' + error.message, 'error');
        } finally {
            // Restore delete buttons
            deleteButtons.forEach(btn => btn.style.display = '');
            
            // Restore section highlight
            if (this.currentSection) {
                this.highlightSection(this.currentSection.id);
            }
        }
    }

    saveReport() {
        this.saveToStorage();
        this.showToast('Report saved successfully!');
    }

    saveToStorage() {
        const data = {
            dataSources: this.dataSources,
            sections: this.sections,
            sectionCounter: this.sectionCounter
        };
        localStorage.setItem('reportBuilderData', JSON.stringify(data));
    }

    loadFromStorage() {
        const stored = localStorage.getItem('reportBuilderData');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.dataSources = data.dataSources || [];
                this.sections = data.sections || [];
                this.sectionCounter = data.sectionCounter || 0;
            } catch (error) {
                console.error('Error loading from storage:', error);
            }
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast show ' + type;
        
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }
}

// Initialize the application
const reportBuilder = new ReportBuilder();