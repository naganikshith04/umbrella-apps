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
        'use strict';
    
        // State management
        let historicalData = [];
        let chart = null;
    
        // Load historical data from localStorage
        function loadHistoricalData() {
            const saved = localStorage.getItem('netWorthHistory');
            if (saved) {
                historicalData = JSON.parse(saved);
            }
        }
    
        // Save historical data to localStorage
        function saveHistoricalData() {
            localStorage.setItem('netWorthHistory', JSON.stringify(historicalData));
        }
    
        // Format currency
        function formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
            }).format(value);
        }
    
        // Format date
        function formatDate(date) {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        }
    
        // Get input value
        function getInputValue(id) {
            const value = parseFloat(document.getElementById(id).value) || 0;
            return value;
        }
    
        // Calculate total assets
        function calculateTotalAssets() {
            const cash = getInputValue('cash');
            const investments = getInputValue('investments');
            const realEstate = getInputValue('real-estate');
            const vehicles = getInputValue('vehicles');
            const otherAssets = getInputValue('other-assets');
            
            return cash + investments + realEstate + vehicles + otherAssets;
        }
    
        // Calculate total liabilities
        function calculateTotalLiabilities() {
            const mortgage = getInputValue('mortgage');
            const carLoans = getInputValue('car-loans');
            const studentLoans = getInputValue('student-loans');
            const creditCards = getInputValue('credit-cards');
            const otherLiabilities = getInputValue('other-liabilities');
            
            return mortgage + carLoans + studentLoans + creditCards + otherLiabilities;
        }
    
        // Update displays
        function updateCalculations() {
            const totalAssets = calculateTotalAssets();
            const totalLiabilities = calculateTotalLiabilities();
            const netWorth = totalAssets - totalLiabilities;
    
            document.getElementById('total-assets').textContent = formatCurrency(totalAssets);
            document.getElementById('total-liabilities').textContent = formatCurrency(totalLiabilities);
            document.getElementById('net-worth').textContent = formatCurrency(netWorth);
        }
    
        // Save snapshot
        function saveSnapshot() {
            const totalAssets = calculateTotalAssets();
            const totalLiabilities = calculateTotalLiabilities();
            const netWorth = totalAssets - totalLiabilities;
    
            const snapshot = {
                id: Date.now(),
                date: new Date().toISOString(),
                assets: totalAssets,
                liabilities: totalLiabilities,
                netWorth: netWorth
            };
    
            historicalData.push(snapshot);
            historicalData.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            saveHistoricalData();
            updateHistoricalDisplay();
            updateChart();
    
            // Show feedback
            const btn = document.getElementById('save-snapshot');
            const originalText = btn.textContent;
            btn.textContent = 'Snapshot Saved!';
            btn.style.background = '#28a745';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }
    
        // Delete snapshot
        function deleteSnapshot(id) {
            if (confirm('Are you sure you want to delete this snapshot?')) {
                historicalData = historicalData.filter(item => item.id !== id);
                saveHistoricalData();
                updateHistoricalDisplay();
                updateChart();
            }
        }
    
        // Update historical display
        function updateHistoricalDisplay() {
            const tbody = document.getElementById('history-tbody');
            const snapshotCount = document.getElementById('snapshot-count');
            
            snapshotCount.textContent = `Snapshots: ${historicalData.length}`;
    
            if (historicalData.length === 0) {
                tbody.innerHTML = '<tr class="no-data"><td colspan="6">No historical data yet. Save a snapshot to start tracking!</td></tr>';
                return;
            }
    
            tbody.innerHTML = '';
            
            historicalData.forEach((snapshot, index) => {
                const row = document.createElement('tr');
                
                // Calculate change from previous snapshot
                let changeHtml = '<span style="color: #999;">-</span>';
                if (index > 0) {
                    const change = snapshot.netWorth - historicalData[index - 1].netWorth;
                    const changePercent = (change / Math.abs(historicalData[index - 1].netWorth)) * 100;
                    const changeClass = change >= 0 ? 'positive-change' : 'negative-change';
                    const changeSign = change >= 0 ? '+' : '';
                    changeHtml = `<span class="${changeClass}">${changeSign}${formatCurrency(change)} (${changeSign}${changePercent.toFixed(2)}%)</span>`;
                }
    
                row.innerHTML = `
                    <td>${formatDate(new Date(snapshot.date))}</td>
                    <td>${formatCurrency(snapshot.assets)}</td>
                    <td>${formatCurrency(snapshot.liabilities)}</td>
                    <td><strong>${formatCurrency(snapshot.netWorth)}</strong></td>
                    <td>${changeHtml}</td>
                    <td><button class="btn-delete" data-id="${snapshot.id}">Delete</button></td>
                `;
                
                tbody.appendChild(row);
            });
    
            // Add event listeners to delete buttons
            tbody.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', function() {
                    deleteSnapshot(parseInt(this.getAttribute('data-id')));
                });
            });
        }
    
        // Clear all history
        function clearHistory() {
            if (confirm('Are you sure you want to clear all historical data? This cannot be undone.')) {
                historicalData = [];
                saveHistoricalData();
                updateHistoricalDisplay();
                updateChart();
            }
        }
    
        // Update chart
        function updateChart() {
            const canvas = document.getElementById('net-worth-chart');
            const ctx = canvas.getContext('2d');
    
            // Destroy existing chart
            if (chart) {
                chart.destroy();
            }
    
            if (historicalData.length === 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = '16px Arial';
                ctx.fillStyle = '#999';
                ctx.textAlign = 'center';
                ctx.fillText('No data to display. Save snapshots to see your growth!', canvas.width / 2, canvas.height / 2);
                return;
            }
    
            // Prepare data
            const labels = historicalData.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            });
    
            const netWorthData = historicalData.map(item => item.netWorth);
            const assetsData = historicalData.map(item => item.assets);
            const liabilitiesData = historicalData.map(item => item.liabilities);
    
            // Simple chart implementation
            drawChart(ctx, canvas, labels, netWorthData, assetsData, liabilitiesData);
        }
    
        // Draw chart (simple implementation)
        function drawChart(ctx, canvas, labels, netWorthData, assetsData, liabilitiesData) {
            const padding = 50;
            const width = canvas.width - padding * 2;
            const height = canvas.height - padding * 2;
    
            // Set canvas size
            canvas.width = canvas.offsetWidth;
            canvas.height = 300;
    
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            // Find min and max values
            const allValues = [...netWorthData, ...assetsData, ...liabilitiesData];
            const maxValue = Math.max(...allValues);
            const minValue = Math.min(...allValues, 0);
            const range = maxValue - minValue;
    
            // Draw axes
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(padding, padding);
            ctx.lineTo(padding, canvas.height - padding);
            ctx.lineTo(canvas.width - padding, canvas.height - padding);
            ctx.stroke();
    
            // Draw grid lines
            ctx.strokeStyle = '#f0f0f0';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 5; i++) {
                const y = padding + (height / 5) * i;
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(canvas.width - padding, y);
                ctx.stroke();
    
                // Draw y-axis labels
                const value = maxValue - (range / 5) * i;
                ctx.fillStyle = '#666';
                ctx.font = '12px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(formatCurrency(value), padding - 10, y + 5);
            }
    
            // Draw lines
            function drawLine(data, color, lineWidth = 2) {
                if (data.length === 0) return;
    
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
    
                data.forEach((value, index) => {
                    const x = padding + (width / (data.length - 1 || 1)) * index;
                    const y = canvas.height - padding - ((value - minValue) / range) * height;
    
                    if (index === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });
    
                ctx.stroke();
    
                // Draw points
                ctx.fillStyle = color;
                data.forEach((value, index) => {
                    const x = padding + (width / (data.length - 1 || 1)) * index;
                    const y = canvas.height - padding - ((value - minValue) / range) * height;
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
    
            // Draw all lines
            drawLine(assetsData, '#28a745', 2);
            drawLine(liabilitiesData, '#dc3545', 2);
            drawLine(netWorthData, '#667eea', 3);
    
            // Draw legend
            const legendY = 20;
            const legendItems = [
                { label: 'Net Worth', color: '#667eea' },
                { label: 'Assets', color: '#28a745' },
                { label: 'Liabilities', color: '#dc3545' }
            ];
    
            let legendX = canvas.width - padding - 200;
            legendItems.forEach((item, index) => {
                ctx.fillStyle = item.color;
                ctx.fillRect(legendX, legendY + index * 25, 20, 3);
                ctx.fillStyle = '#333';
                ctx.font = '14px Arial';
                ctx.textAlign = 'left';
                ctx.fillText(item.label, legendX + 30, legendY + index * 25 + 5);
            });
    
            // Draw x-axis labels
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            labels.forEach((label, index) => {
                if (labels.length > 10 && index % Math.ceil(labels.length / 10) !== 0) return;
                const x = padding + (width / (labels.length - 1 || 1)) * index;
                ctx.save();
                ctx.translate(x, canvas.height - padding + 20);
                ctx.rotate(-Math.PI / 4);
                ctx.fillText(label, 0, 0);
                ctx.restore();
            });
        }
    
        // Initialize
        function init() {
            loadHistoricalData();
            updateCalculations();
            updateHistoricalDisplay();
            updateChart();
    
            // Add event listeners to all inputs
            const inputs = document.querySelectorAll('input[type="number"]');
            inputs.forEach(input => {
                input.addEventListener('input', updateCalculations);
            });
    
            // Save snapshot button
            document.getElementById('save-snapshot').addEventListener('click', saveSnapshot);
    
            // Clear history button
            document.getElementById('clear-history').addEventListener('click', clearHistory);
    
            // Update chart on window resize
            window.addEventListener('resize', updateChart);
        }
    
        // Start when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
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
