// Global state
let uploadedImages = [];
let compressedImages = [];
let currentComparisonIndex = null;

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const compressBtn = document.getElementById('compressBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const controlsSection = document.getElementById('controlsSection');
const imagesSection = document.getElementById('imagesSection');
const imagesTableBody = document.getElementById('imagesTableBody');
const statisticsSection = document.getElementById('statisticsSection');
const totalImages = document.getElementById('totalImages');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const spaceSaved = document.getElementById('spaceSaved');
const comparisonSection = document.getElementById('comparisonSection');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalPreviewSize = document.getElementById('originalPreviewSize');
const compressedPreviewSize = document.getElementById('compressedPreviewSize');
const closeComparison = document.getElementById('closeComparison');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateUI();
});

function setupEventListeners() {
    // Upload zone events
    uploadZone.addEventListener('click', () => fileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    // Quality slider
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
    });
    
    // Buttons
    compressBtn.addEventListener('click', compressAllImages);
    clearAllBtn.addEventListener('click', clearAll);
    downloadAllBtn.addEventListener('click', downloadAllAsZip);
    closeComparison.addEventListener('click', () => {
        comparisonSection.style.display = 'none';
    });
}

function handleFiles(files) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
        if (!validTypes.includes(file.type)) {
            alert(`${file.name} is not a supported format. Please upload JPG, PNG, or WebP.`);
            return;
        }
        
        if (uploadedImages.some(img => img.name === file.name && img.size === file.size)) {
            return; // Skip duplicates
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = {
                id: Date.now() + Math.random(),
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                dataUrl: e.target.result,
                compressed: null,
                compressedSize: null
            };
            uploadedImages.push(img);
            updateUI();
        };
        reader.readAsDataURL(file);
    });
}

function updateUI() {
    if (uploadedImages.length === 0) {
        controlsSection.style.display = 'none';
        imagesSection.style.display = 'none';
        statisticsSection.style.display = 'none';
        return;
    }
    
    controlsSection.style.display = 'block';
    imagesSection.style.display = 'block';
    
    renderImagesTable();
    updateStatistics();
}

function renderImagesTable() {
    imagesTableBody.innerHTML = '';
    
    uploadedImages.forEach((img, index) => {
        const row = document.createElement('tr');
        
        const originalSizeKB = (img.size / 1024).toFixed(2);
        const compressedSizeKB = img.compressedSize ? (img.compressedSize / 1024).toFixed(2) : '-';
        const reduction = img.compressedSize 
            ? (((img.size - img.compressedSize) / img.size) * 100).toFixed(1) 
            : '-';
        
        const status = img.compressed ? 
            '<span style="color: #10b981;">✓ Compressed</span>' : 
            '<span style="color: #6b7280;">Pending</span>';
        
        row.innerHTML = `
            <td>
                <img src="${img.dataUrl}" alt="${img.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            </td>
            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${img.name}</td>
            <td>${originalSizeKB} KB</td>
            <td>${compressedSizeKB !== '-' ? compressedSizeKB + ' KB' : '-'}</td>
            <td>${reduction !== '-' ? reduction + '%' : '-'}</td>
            <td>${status}</td>
            <td>
                ${img.compressed ? `
                    <button class="btn-preview" data-index="${index}">Preview</button>
                    <button class="btn-download" data-index="${index}">Download</button>
                ` : ''}
                <button class="btn-remove" data-index="${index}">Remove</button>
            </td>
        `;
        
        imagesTableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-preview').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            showComparison(index);
        });
    });
    
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            downloadSingle(index);
        });
    });
    
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeImage(index);
        });
    });
}

async function compressAllImages() {
    const quality = parseInt(qualitySlider.value) / 100;
    compressBtn.disabled = true;
    compressBtn.textContent = 'Compressing...';
    
    const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        quality: quality,
        initialQuality: quality
    };
    
    try {
        for (let i = 0; i < uploadedImages.length; i++) {
            const img = uploadedImages[i];
            
            try {
                const compressedFile = await imageCompression(img.file, options);
                
                // Convert to data URL
                const reader = new FileReader();
                await new Promise((resolve) => {
                    reader.onload = (e) => {
                        img.compressed = e.target.result;
                        img.compressedSize = compressedFile.size;
                        img.compressedFile = compressedFile;
                        resolve();
                    };
                    reader.readAsDataURL(compressedFile);
                });
                
            } catch (error) {
                console.error(`Error compressing ${img.name}:`, error);
                img.compressed = img.dataUrl;
                img.compressedSize = img.size;
            }
            
            updateUI();
        }
        
        statisticsSection.style.display = 'block';
        
    } catch (error) {
        alert('Error during compression: ' + error.message);
    } finally {
        compressBtn.disabled = false;
        compressBtn.textContent = 'Compress All Images';
    }
}

function updateStatistics() {
    const total = uploadedImages.length;
    const totalOriginal = uploadedImages.reduce((sum, img) => sum + img.size, 0);
    const totalCompressed = uploadedImages.reduce((sum, img) => sum + (img.compressedSize || 0), 0);
    const saved = totalOriginal - totalCompressed;
    const savedPercent = totalOriginal > 0 ? ((saved / totalOriginal) * 100).toFixed(1) : 0;
    
    totalImages.textContent = total;
    originalSize.textContent = (totalOriginal / 1024).toFixed(2) + ' KB';
    compressedSize.textContent = totalCompressed > 0 ? (totalCompressed / 1024).toFixed(2) + ' KB' : '-';
    spaceSaved.textContent = saved > 0 ? `${(saved / 1024).toFixed(2)} KB (${savedPercent}%)` : '-';
    
    if (uploadedImages.some(img => img.compressed)) {
        statisticsSection.style.display = 'block';
    }
}

function showComparison(index) {
    const img = uploadedImages[index];
    if (!img.compressed) return;
    
    currentComparisonIndex = index;
    
    originalPreview.src = img.dataUrl;
    compressedPreview.src = img.compressed;
    originalPreviewSize.textContent = `Original: ${(img.size / 1024).toFixed(2)} KB`;
    compressedPreviewSize.textContent = `Compressed: ${(img.compressedSize / 1024).toFixed(2)} KB`;
    
    comparisonSection.style.display = 'block';
    comparisonSection.scrollIntoView({ behavior: 'smooth' });
}

function downloadSingle(index) {
    const img = uploadedImages[index];
    if (!img.compressed) return;
    
    const link = document.createElement('a');
    link.href = img.compressed;
    link.download = `compressed_${img.name}`;
    link.click();
}

async function downloadAllAsZip() {
    const compressedImages = uploadedImages.filter(img => img.compressed);
    
    if (compressedImages.length === 0) {
        alert('Please compress images first.');
        return;
    }
    
    downloadAllBtn.disabled = true;
    downloadAllBtn.textContent = 'Creating ZIP...';
    
    try {
        const zip = new JSZip();
        
        for (const img of compressedImages) {
            // Convert data URL to blob
            const response = await fetch(img.compressed);
            const blob = await response.blob();
            zip.file(`compressed_${img.name}`, blob);
        }
        
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'compressed_images.zip');
        
    } catch (error) {
        alert('Error creating ZIP: ' + error.message);
    } finally {
        downloadAllBtn.disabled = false;
        downloadAllBtn.textContent = 'Download All as ZIP';
    }
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateUI();
}

function clearAll() {
    if (uploadedImages.length === 0) return;
    
    if (confirm('Are you sure you want to clear all images?')) {
        uploadedImages = [];
        compressedImages = [];
        fileInput.value = '';
        updateUI();
        comparisonSection.style.display = 'none';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}