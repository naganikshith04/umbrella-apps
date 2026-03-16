// Data structure for storing URLs and analytics
let urlDatabase = JSON.parse(localStorage.getItem('urlDatabase')) || [];
let clickData = JSON.parse(localStorage.getItem('clickData')) || [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadLinks();
    setupEventListeners();
    updateAnalytics();
}

function setupEventListeners() {
    document.getElementById('shortenBtn').addEventListener('click', shortenUrl);
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    document.getElementById('downloadQrBtn').addEventListener('click', downloadQR);
    document.getElementById('exportLinksBtn').addEventListener('click', exportLinks);
    document.getElementById('exportStatsBtn').addEventListener('click', exportStats);
    document.getElementById('searchLinks').addEventListener('input', filterLinks);
    document.getElementById('sortLinks').addEventListener('change', sortLinks);
    document.getElementById('linkSelect').addEventListener('change', updateAnalytics);
    document.getElementById('timeRange').addEventListener('change', updateAnalytics);
    
    // Enter key support for URL input
    document.getElementById('longUrl').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') shortenUrl();
    });
}

function shortenUrl() {
    const longUrl = document.getElementById('longUrl').value.trim();
    const customCode = document.getElementById('customCode').value.trim();
    
    // Validation
    if (!longUrl) {
        showError('Please enter a URL');
        return;
    }
    
    if (!isValidUrl(longUrl)) {
        showError('Please enter a valid URL');
        return;
    }
    
    // Check if custom code already exists
    if (customCode && urlDatabase.some(item => item.shortCode === customCode)) {
        showError('Custom code already exists. Please choose another.');
        return;
    }
    
    // Generate short code
    const shortCode = customCode || generateShortCode();
    const shortUrl = `${window.location.origin}/${shortCode}`;
    
    // Create URL entry
    const urlEntry = {
        id: Date.now(),
        longUrl: longUrl,
        shortCode: shortCode,
        shortUrl: shortUrl,
        createdAt: new Date().toISOString(),
        clicks: 0
    };
    
    urlDatabase.unshift(urlEntry);
    saveToStorage();
    
    // Display result
    displayResult(shortUrl);
    generateQRCode(shortUrl);
    
    // Reset form
    document.getElementById('longUrl').value = '';
    document.getElementById('customCode').value = '';
    
    // Update UI
    loadLinks();
    updateLinkSelect();
}

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function generateShortCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    do {
        code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    } while (urlDatabase.some(item => item.shortCode === code));
    return code;
}

function displayResult(shortUrl) {
    const resultContainer = document.getElementById('resultContainer');
    const shortUrlOutput = document.getElementById('shortUrlOutput');
    
    shortUrlOutput.value = shortUrl;
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function generateQRCode(url) {
    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    
    // Simple QR code generation (basic implementation)
    // In production, use a proper QR library like qrcode.js
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Create a simple pattern based on URL
    ctx.fillStyle = '#000000';
    const gridSize = 20;
    const cellSize = size / gridSize;
    
    // Generate deterministic pattern from URL
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
        hash = ((hash << 5) - hash) + url.charCodeAt(i);
        hash = hash & hash;
    }
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const seed = hash + x * 1000 + y;
            if (Math.abs(Math.sin(seed)) > 0.5) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
    
    // Add corner markers
    drawCornerMarker(ctx, 0, 0, cellSize);
    drawCornerMarker(ctx, size - 3 * cellSize, 0, cellSize);
    drawCornerMarker(ctx, 0, size - 3 * cellSize, cellSize);
}

function drawCornerMarker(ctx, x, y, cellSize) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, cellSize * 3, cellSize * 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + cellSize * 0.5, y + cellSize * 0.5, cellSize * 2, cellSize * 2);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + cellSize, y + cellSize, cellSize, cellSize);
}

function copyToClipboard() {
    const shortUrlOutput = document.getElementById('shortUrlOutput');
    shortUrlOutput.select();
    document.execCommand('copy');
    
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 2000);
}

function downloadQR() {
    const canvas = document.getElementById('qrCanvas');
    canvas.toBlob((blob) => {
        saveAs(blob, 'qr-code.png');
    });
}

function loadLinks() {
    const tbody = document.getElementById('linksTableBody');
    tbody.innerHTML = '';
    
    const searchTerm = document.getElementById('searchLinks').value.toLowerCase();
    const sortBy = document.getElementById('sortLinks').value;
    
    let filteredLinks = urlDatabase.filter(link => 
        link.longUrl.toLowerCase().includes(searchTerm) ||
        link.shortCode.toLowerCase().includes(searchTerm)
    );
    
    // Sort links
    filteredLinks.sort((a, b) => {
        switch(sortBy) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'clicks':
                return b.clicks - a.clicks;
            default:
                return 0;
        }
    });
    
    filteredLinks.forEach(link => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="${link.longUrl}" target="_blank" class="truncate">${link.longUrl}</a></td>
            <td><code>${link.shortCode}</code></td>
            <td>${link.clicks}</td>
            <td>${new Date(link.createdAt).toLocaleDateString()}</td>
            <td>
                <button onclick="copyLink('${link.shortUrl}')" class="btn-small">Copy</button>
                <button onclick="viewAnalytics('${link.id}')" class="btn-small">Stats</button>
                <button onclick="deleteLink(${link.id})" class="btn-small btn-danger">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateLinkSelect();
}

function copyLink(url) {
    const temp = document.createElement('input');
    document.body.appendChild(temp);
    temp.value = url;
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    
    showSuccess('Link copied to clipboard!');
}

function viewAnalytics(linkId) {
    document.getElementById('linkSelect').value = linkId;
    updateAnalytics();
    document.getElementById('analytics').scrollIntoView({ behavior: 'smooth' });
}

function deleteLink(linkId) {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    urlDatabase = urlDatabase.filter(link => link.id !== linkId);
    clickData = clickData.filter(click => click.linkId !== linkId);
    saveToStorage();
    loadLinks();
    updateAnalytics();
}

function filterLinks() {
    loadLinks();
}

function sortLinks() {
    loadLinks();
}

function updateLinkSelect() {
    const select = document.getElementById('linkSelect');
    const currentValue = select.value;
    
    select.innerHTML = '<option value="all">All Links</option>';
    
    urlDatabase.forEach(link => {
        const option = document.createElement('option');
        option.value = link.id;
        option.textContent = `${link.shortCode} (${link.clicks} clicks)`;
        select.appendChild(option);
    });
    
    if (currentValue) {
        select.value = currentValue;
    }
}

function updateAnalytics() {
    const linkId = document.getElementById('linkSelect').value;
    const timeRange = document.getElementById('timeRange').value;
    
    let filteredClicks = clickData;
    
    // Filter by link
    if (linkId !== 'all') {
        filteredClicks = filteredClicks.filter(click => click.linkId === parseInt(linkId));
    }
    
    // Filter by time range
    const now = new Date();
    filteredClicks = filteredClicks.filter(click => {
        const clickDate = new Date(click.timestamp);
        const diffDays = (now - clickDate) / (1000 * 60 * 60 * 24);
        
        switch(timeRange) {
            case '7days':
                return diffDays <= 7;
            case '30days':
                return diffDays <= 30;
            case '90days':
                return diffDays <= 90;
            case 'all':
            default:
                return true;
        }
    });
    
    updateClicksChart(filteredClicks);
    updateLocationsChart(filteredClicks);
    updateDevicesChart(filteredClicks);
}

let clicksChart, locationsChart, devicesChart;

function updateClicksChart(clicks) {
    const canvas = document.getElementById('clicksChart');
    const ctx = canvas.getContext('2d');
    
    // Group clicks by date
    const clicksByDate = {};
    clicks.forEach(click => {
        const date = new Date(click.timestamp).toLocaleDateString();
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });
    
    const dates = Object.keys(clicksByDate).sort((a, b) => new Date(a) - new Date(b));
    const counts = dates.map(date => clicksByDate[date]);
    
    if (clicksChart) {
        clicksChart.destroy();
    }
    
    clicksChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Clicks',
                data: counts,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateLocationsChart(clicks) {
    const canvas = document.getElementById('locationsChart');
    const ctx = canvas.getContext('2d');
    
    // Group by location
    const locationCounts = {};
    clicks.forEach(click => {
        const location = click.location || 'Unknown';
        locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    
    const locations = Object.keys(locationCounts);
    const counts = Object.values(locationCounts);
    
    if (locationsChart) {
        locationsChart.destroy();
    }
    
    locationsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: locations,
            datasets: [{
                label: 'Clicks by Location',
                data: counts,
                backgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateDevicesChart(clicks) {
    const canvas = document.getElementById('devicesChart');
    const ctx = canvas.getContext('2d');
    
    // Group by device
    const deviceCounts = {};
    clicks.forEach(click => {
        const device = click.device || 'Unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    
    const devices = Object.keys(deviceCounts);
    const counts = Object.values(deviceCounts);
    
    if (devicesChart) {
        devicesChart.destroy();
    }
    
    devicesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: devices,
            datasets: [{
                data: counts,
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function exportLinks() {
    const data = urlDatabase.map(link => ({
        'Long URL': link.longUrl,
        'Short Code': link.shortCode,
        'Short URL': link.shortUrl,
        'Clicks': link.clicks,
        'Created': new Date(link.createdAt).toLocaleString()
    }));
    
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `url-links-${Date.now()}.csv`);
}

function exportStats() {
    const linkId = document.getElementById('linkSelect').value;
    const timeRange = document.getElementById('timeRange').value;
    
    let filteredClicks = clickData;
    
    if (linkId !== 'all') {
        filteredClicks = filteredClicks.filter(click => click.linkId === parseInt(linkId));
    }
    
    const now = new Date();
    filteredClicks = filteredClicks.filter(click => {
        const clickDate = new Date(click.timestamp);
        const diffDays = (now - clickDate) / (1000 * 60 * 60 * 24);
        
        switch(timeRange) {
            case '7days':
                return diffDays <= 7;
            case '30days':
                return diffDays <= 30;
            case '90days':
                return diffDays <= 90;
            case 'all':
            default:
                return true;
        }
    });
    
    const data = filteredClicks.map(click => {
        const link = urlDatabase.find(l => l.id === click.linkId);
        return {
            'Short Code': link ? link.shortCode : 'Unknown',
            'Timestamp': new Date(click.timestamp).toLocaleString(),
            'Location': click.location || 'Unknown',
            'Device': click.device || 'Unknown',
            'Referrer': click.referrer || 'Direct'
        };
    });
    
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `url-statistics-${Date.now()}.csv`);
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

function saveToStorage() {
    localStorage.setItem('urlDatabase', JSON.stringify(urlDatabase));
    localStorage.setItem('clickData', JSON.stringify(clickData));
}

function showError(message) {
    alert(message);
}

function showSuccess(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Simulate click tracking (in real implementation, this would be server-side)
function trackClick(shortCode) {
    const link = urlDatabase.find(l => l.shortCode === shortCode);
    if (!link) return;
    
    link.clicks++;
    
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    let device = 'Desktop';
    if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
        device = /tablet|ipad/.test(userAgent) ? 'Tablet' : 'Mobile';
    }
    
    // Get location (simulated - in production use IP geolocation API)
    const locations = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia', 'India'];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    const clickEntry = {
        linkId: link.id,
        timestamp: new Date().toISOString(),
        location: location,
        device: device,
        referrer: document.referrer || 'Direct'
    };
    
    clickData.push(clickEntry);
    saveToStorage();
}

// Add some demo data if database is empty
if (urlDatabase.length === 0) {
    const demoLinks = [
        {
            id: Date.now(),
            longUrl: 'https://www.example.com/very/long/url/path/to/page',
            shortCode: 'demo01',
            shortUrl: `${window.location.origin}/demo01`,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            clicks: 45
        },
        {
            id: Date.now() + 1,
            longUrl: 'https://www.example.com/another/long/url',
            shortCode: 'demo02',
            shortUrl: `${window.location.origin}/demo02`,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            clicks: 23
        }
    ];
    
    urlDatabase = demoLinks;
    
    // Generate demo click data
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    const locations = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France'];
    
    demoLinks.forEach(link => {
        for (let i = 0; i < link.clicks; i++) {
            const daysAgo = Math.floor(Math.random() * 7);
            clickData.push({
                linkId: link.id,
                timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
                location: locations[Math.floor(Math.random() * locations.length)],
                device: devices[Math.floor(Math.random() * devices.length)],
                referrer: Math.random() > 0.5 ? 'Direct' : 'Social Media'
            });
        }
    });
    
    saveToStorage();
}

// Add CSS for animations
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
    
    .truncate {
        max-width: 300px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
    }
    
    .btn-small {
        padding: 4px 8px;
        font-size: 12px;
        margin: 0 2px;
    }
    
    .btn-danger {
        background-color: #ef4444;
    }
    
    .btn-danger:hover {
        background-color: #dc2626;
    }
`;
document.head.appendChild(style);