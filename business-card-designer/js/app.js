// Business Card Designer - Complete Implementation

// State Management
const state = {
    currentSide: 'front',
    template: 'modern',
    colors: {
        bg: '#ffffff',
        text: '#000000',
        accent: '#0066cc'
    },
    font: 'Arial',
    content: {
        name: 'John Doe',
        title: 'Creative Director',
        company: 'Company Name',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@company.com',
        website: 'www.company.com'
    },
    logo: null,
    photo: null
};

// Templates Configuration
const templates = {
    modern: {
        name: 'Modern',
        frontLayout: 'centered',
        backLayout: 'minimal'
    },
    professional: {
        name: 'Professional',
        frontLayout: 'left-aligned',
        backLayout: 'detailed'
    },
    creative: {
        name: 'Creative',
        frontLayout: 'artistic',
        backLayout: 'pattern'
    },
    minimal: {
        name: 'Minimal',
        frontLayout: 'simple',
        backLayout: 'clean'
    }
};

// Initialize Application
function init() {
    loadFromLocalStorage();
    setupEventListeners();
    createTemplateSelector();
    updateCardPreview();
    setupSideToggle();
}

// Setup Event Listeners
function setupEventListeners() {
    // Color Inputs
    const bgColor = document.getElementById('bg-color');
    const textColor = document.getElementById('text-color');
    const accentColor = document.getElementById('accent-color');

    if (bgColor) {
        bgColor.value = state.colors.bg;
        bgColor.addEventListener('input', (e) => {
            state.colors.bg = e.target.value;
            updateCardPreview();
            saveToLocalStorage();
        });
    }

    if (textColor) {
        textColor.value = state.colors.text;
        textColor.addEventListener('input', (e) => {
            state.colors.text = e.target.value;
            updateCardPreview();
            saveToLocalStorage();
        });
    }

    if (accentColor) {
        accentColor.value = state.colors.accent;
        accentColor.addEventListener('input', (e) => {
            state.colors.accent = e.target.value;
            updateCardPreview();
            saveToLocalStorage();
        });
    }

    // Font Family
    const fontFamily = document.getElementById('font-family');
    if (fontFamily) {
        fontFamily.value = state.font;
        fontFamily.addEventListener('change', (e) => {
            state.font = e.target.value;
            updateCardPreview();
            saveToLocalStorage();
        });
    }

    // Text Inputs
    const inputs = ['card-name', 'card-title', 'card-company', 'card-phone', 'card-email', 'card-website'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const key = id.replace('card-', '');
            element.value = state.content[key];
            element.addEventListener('input', (e) => {
                state.content[key] = e.target.value;
                updateCardPreview();
                saveToLocalStorage();
            });
        }
    });

    // File Uploads
    const logoUpload = document.getElementById('logo-upload');
    if (logoUpload) {
        logoUpload.addEventListener('change', handleLogoUpload);
    }

    const photoUpload = document.getElementById('photo-upload');
    if (photoUpload) {
        photoUpload.addEventListener('change', handlePhotoUpload);
    }

    // Download PDF
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPDF);
    }

    // Reset Design
    const resetBtn = document.getElementById('reset-design');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetDesign);
    }
}

// Create Template Selector
function createTemplateSelector() {
    const container = document.querySelector('.template-selector') || createTemplateSelectorContainer();
    if (!container) return;

    container.innerHTML = '<h3>Choose Template</h3>';
    const templatesDiv = document.createElement('div');
    templatesDiv.className = 'templates-grid';

    Object.keys(templates).forEach(key => {
        const btn = document.createElement('button');
        btn.className = `template-btn ${state.template === key ? 'active' : ''}`;
        btn.textContent = templates[key].name;
        btn.dataset.template = key;
        btn.addEventListener('click', () => selectTemplate(key));
        templatesDiv.appendChild(btn);
    });

    container.appendChild(templatesDiv);
}

function createTemplateSelectorContainer() {
    const container = document.createElement('div');
    container.className = 'template-selector';
    const controls = document.querySelector('.controls') || document.querySelector('.designer-controls');
    if (controls) {
        controls.insertBefore(container, controls.firstChild);
    }
    return container;
}

function selectTemplate(templateKey) {
    state.template = templateKey;
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.template === templateKey);
    });
    updateCardPreview();
    saveToLocalStorage();
}

// Setup Side Toggle
function setupSideToggle() {
    const container = document.querySelector('.side-toggle') || createSideToggleContainer();
    if (!container) return;

    container.innerHTML = `
        <button class="side-btn active" data-side="front">Front</button>
        <button class="side-btn" data-side="back">Back</button>
    `;

    container.querySelectorAll('.side-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.currentSide = btn.dataset.side;
            container.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateCardPreview();
        });
    });
}

function createSideToggleContainer() {
    const container = document.createElement('div');
    container.className = 'side-toggle';
    const preview = document.querySelector('.card-preview') || document.querySelector('.preview-section');
    if (preview) {
        preview.insertBefore(container, preview.firstChild);
    }
    return container;
}

// Handle Logo Upload
function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        state.logo = event.target.result;
        updateCardPreview();
        saveToLocalStorage();
    };
    reader.readAsDataURL(file);
}

// Handle Photo Upload
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        state.photo = event.target.result;
        updateCardPreview();
        saveToLocalStorage();
    };
    reader.readAsDataURL(file);
}

// Update Card Preview
function updateCardPreview() {
    const cardFront = document.getElementById('card-front');
    const cardBack = document.getElementById('card-back');

    if (state.currentSide === 'front') {
        if (cardFront) {
            cardFront.style.display = 'block';
            renderCardFront(cardFront);
        }
        if (cardBack) cardBack.style.display = 'none';
    } else {
        if (cardBack) {
            cardBack.style.display = 'block';
            renderCardBack(cardBack);
        }
        if (cardFront) cardFront.style.display = 'none';
    }

    update3DMockup();
}

// Render Card Front
function renderCardFront(container) {
    const template = templates[state.template];
    
    container.style.backgroundColor = state.colors.bg;
    container.style.color = state.colors.text;
    container.style.fontFamily = state.font;
    container.className = `business-card card-front template-${state.template}`;

    let html = '';

    // Logo
    if (state.logo) {
        html += `<div class="card-logo"><img src="${state.logo}" alt="Logo"></div>`;
    }

    // Photo
    if (state.photo && (state.template === 'professional' || state.template === 'creative')) {
        html += `<div class="card-photo"><img src="${state.photo}" alt="Photo"></div>`;
    }

    // Content based on template
    switch (template.frontLayout) {
        case 'centered':
            html += `
                <div class="card-content centered">
                    <h2 class="card-name" style="color: ${state.colors.accent}">${escapeHtml(state.content.name)}</h2>
                    <p class="card-title">${escapeHtml(state.content.title)}</p>
                    <p class="card-company" style="color: ${state.colors.accent}">${escapeHtml(state.content.company)}</p>
                </div>
            `;
            break;
        case 'left-aligned':
            html += `
                <div class="card-content left-aligned">
                    <h2 class="card-name">${escapeHtml(state.content.name)}</h2>
                    <p class="card-title" style="color: ${state.colors.accent}">${escapeHtml(state.content.title)}</p>
                    <div class="card-divider" style="background: ${state.colors.accent}"></div>
                    <p class="card-company">${escapeHtml(state.content.company)}</p>
                </div>
            `;
            break;
        case 'artistic':
            html += `
                <div class="card-content artistic">
                    <div class="accent-bar" style="background: ${state.colors.accent}"></div>
                    <h2 class="card-name">${escapeHtml(state.content.name)}</h2>
                    <p class="card-title">${escapeHtml(state.content.title)}</p>
                    <p class="card-company" style="color: ${state.colors.accent}">${escapeHtml(state.content.company)}</p>
                </div>
            `;
            break;
        case 'simple':
            html += `
                <div class="card-content simple">
                    <h2 class="card-name">${escapeHtml(state.content.name)}</h2>
                    <p class="card-title">${escapeHtml(state.content.title)}</p>
                </div>
            `;
            break;
    }

    container.innerHTML = html;
}

// Render Card Back
function renderCardBack(container) {
    const template = templates[state.template];
    
    container.style.backgroundColor = state.colors.bg;
    container.style.color = state.colors.text;
    container.style.fontFamily = state.font;
    container.className = `business-card card-back template-${state.template}`;

    let html = '';

    // Logo on back
    if (state.logo) {
        html += `<div class="card-logo-back"><img src="${state.logo}" alt="Logo"></div>`;
    }

    // Contact Information
    html += `
        <div class="card-contact">
            <div class="contact-item">
                <span class="contact-icon" style="color: ${state.colors.accent}">📞</span>
                <span class="contact-text">${escapeHtml(state.content.phone)}</span>
            </div>
            <div class="contact-item">
                <span class="contact-icon" style="color: ${state.colors.accent}">✉️</span>
                <span class="contact-text">${escapeHtml(state.content.email)}</span>
            </div>
            <div class="contact-item">
                <span class="contact-icon" style="color: ${state.colors.accent}">🌐</span>
                <span class="contact-text">${escapeHtml(state.content.website)}</span>
            </div>
        </div>
    `;

    // Pattern/Design based on template
    if (template.backLayout === 'pattern') {
        html += `<div class="back-pattern" style="background: linear-gradient(135deg, ${state.colors.accent}22 25%, transparent 25%)"></div>`;
    }

    container.innerHTML = html;
}

// Update 3D Mockup
function update3DMockup() {
    const mockupContainer = document.querySelector('.mockup-3d') || create3DMockupContainer();
    if (!mockupContainer) return;

    mockupContainer.innerHTML = `
        <div class="card-3d-wrapper">
            <div class="card-3d" style="transform: rotateY(${state.currentSide === 'front' ? '0deg' : '180deg'})">
                <div class="card-3d-front">
                    ${document.getElementById('card-front')?.innerHTML || ''}
                </div>
                <div class="card-3d-back">
                    ${document.getElementById('card-back')?.innerHTML || ''}
                </div>
            </div>
        </div>
    `;

    // Apply styles to 3D mockup
    const front3d = mockupContainer.querySelector('.card-3d-front');
    const back3d = mockupContainer.querySelector('.card-3d-back');
    
    if (front3d) {
        front3d.style.backgroundColor = state.colors.bg;
        front3d.style.color = state.colors.text;
        front3d.style.fontFamily = state.font;
    }
    
    if (back3d) {
        back3d.style.backgroundColor = state.colors.bg;
        back3d.style.color = state.colors.text;
        back3d.style.fontFamily = state.font;
    }
}

function create3DMockupContainer() {
    const container = document.createElement('div');
    container.className = 'mockup-3d';
    const preview = document.querySelector('.card-preview') || document.querySelector('.preview-section');
    if (preview) {
        preview.appendChild(container);
    }
    return container;
}

// Download PDF
async function downloadPDF() {
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Generating PDF...';
    }

    try {
        // Create a container for both sides
        const pdfContainer = document.createElement('div');
        pdfContainer.style.width = '1050px'; // 3.5 inches at 300 DPI
        pdfContainer.style.padding = '20px';
        pdfContainer.style.backgroundColor = 'white';

        // Clone and prepare front
        const frontClone = document.getElementById('card-front').cloneNode(true);
        frontClone.style.display = 'block';
        frontClone.style.width = '1050px';
        frontClone.style.height = '600px'; // 2 inches at 300 DPI
        frontClone.style.marginBottom = '40px';
        renderCardFront(frontClone);

        // Clone and prepare back
        const backClone = document.getElementById('card-back').cloneNode(true);
        backClone.style.display = 'block';
        backClone.style.width = '1050px';
        backClone.style.height = '600px';
        renderCardBack(backClone);

        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Business Card - Print Ready';
        title.style.marginBottom = '20px';
        title.style.textAlign = 'center';

        const frontTitle = document.createElement('h3');
        frontTitle.textContent = 'Front';
        frontTitle.style.marginBottom = '10px';

        const backTitle = document.createElement('h3');
        backTitle.textContent = 'Back';
        backTitle.style.marginBottom = '10px';
        backTitle.style.marginTop = '20px';

        pdfContainer.appendChild(title);
        pdfContainer.appendChild(frontTitle);
        pdfContainer.appendChild(frontClone);
        pdfContainer.appendChild(backTitle);
        pdfContainer.appendChild(backClone);

        document.body.appendChild(pdfContainer);

        // Generate PDF
        const opt = {
            margin: 0.5,
            filename: `business-card-${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: { 
                unit: 'in', 
                format: 'letter', 
                orientation: 'portrait' 
            }
        };

        await html2pdf().set(opt).from(pdfContainer).save();

        // Cleanup
        document.body.removeChild(pdfContainer);

        if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.textContent = 'Download PDF';
        }
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try again.');
        if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.textContent = 'Download PDF';
        }
    }
}

// Reset Design
function resetDesign() {
    if (!confirm('Are you sure you want to reset your design? This cannot be undone.')) {
        return;
    }

    state.template = 'modern';
    state.colors = {
        bg: '#ffffff',
        text: '#000000',
        accent: '#0066cc'
    };
    state.font = 'Arial';
    state.content = {
        name: 'John Doe',
        title: 'Creative Director',
        company: 'Company Name',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@company.com',
        website: 'www.company.com'
    };
    state.logo = null;
    state.photo = null;

    // Reset form inputs
    document.getElementById('bg-color').value = state.colors.bg;
    document.getElementById('text-color').value = state.colors.text;
    document.getElementById('accent-color').value = state.colors.accent;
    document.getElementById('font-family').value = state.font;
    document.getElementById('card-name').value = state.content.name;
    document.getElementById('card-title').value = state.content.title;
    document.getElementById('card-company').value = state.content.company;
    document.getElementById('card-phone').value = state.content.phone;
    document.getElementById('card-email').value = state.content.email;
    document.getElementById('card-website').value = state.content.website;
    document.getElementById('logo-upload').value = '';
    document.getElementById('photo-upload').value = '';

    createTemplateSelector();
    updateCardPreview();
    saveToLocalStorage();
}

// Local Storage Functions
function saveToLocalStorage() {
    try {
        localStorage.setItem('businessCardDesign', JSON.stringify(state));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('businessCardDesign');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(state, parsed);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add Dynamic Styles
function addDynamicStyles() {
    if (document.getElementById('dynamic-card-styles')) return;

    const style = document.createElement('style');
    style.id = 'dynamic-card-styles';
    style.textContent = `
        .business-card {
            width: 350px;
            height: 200px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 20px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .card-logo img, .card-logo-back img {
            max-width: 80px;
            max-height: 60px;
            object-fit: contain;
        }

        .card-photo img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid currentColor;
        }

        .card-content {
            margin-top: 15px;
        }

        .card-content.centered {
            text-align: center;
        }

        .card-content.left-aligned {
            text-align: left;
        }

        .card-content.artistic {
            position: relative;
            padding-left: 15px;
        }

        .accent-bar {
            position: absolute;
            left: 0;
            top: 0;
            width: 5px;
            height: 100%;
        }

        .card-name {
            font-size: 24px;
            font-weight: bold;
            margin: 5px 0;
        }

        .card-title {
            font-size: 14px;
            margin: 5px 0;
            opacity: 0.9;
        }

        .card-company {
            font-size: 16px;
            font-weight: 600;
            margin: 5px 0;
        }

        .card-divider {
            height: 2px;
            width: 50px;
            margin: 10px 0;
        }

        .card-contact {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 20px;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
        }

        .contact-icon {
            font-size: 16px;
        }

        .back-pattern {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            opacity: 0.1;
            background-size: 20px 20px;
            pointer-events: none;
        }

        .template-selector {
            margin-bottom: 20px;
        }

        .templates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }

        .template-btn {
            padding: 12px;
            border: 2px solid #ddd;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 500;
        }

        .template-btn:hover {
            border-color: #0066cc;
            background: #f0f7ff;
        }

        .template-btn.active {
            border-color: #0066cc;
            background: #0066cc;
            color: white;
        }

        .side-toggle {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            justify-content: center;
        }

        .side-btn {
            padding: 10px 20px;
            border: 2px solid #ddd;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 500;
        }

        .side-btn:hover {
            border-color: #0066cc;
            background: #f0f7ff;
        }

        .side-btn.active {
            border-color: #0066cc;
            background: #0066cc;
            color: white;
        }

        .mockup-3d {
            margin-top: 30px;
            perspective: 1000px;
        }

        .card-3d-wrapper {
            width: 350px;
            height: 200px;
            margin: 0 auto;
        }

        .card-3d {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.8s;
        }

        .card-3d-front, .card-3d-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 8px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .card-3d-back {
            transform: rotateY(180deg);
        }

        .template-modern .card-content.centered {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
        }

        .template-professional .card-photo {
            position: absolute;
            top: 20px;
            right: 20px;
        }

        .template-creative .accent-bar {
            width: 8px;
        }

        @media print {
            .business-card {
                width: 3.5in;
                height: 2in;
                box-shadow: none;
                page-break-after: always;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize on DOM Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addDynamicStyles();
        init();
    });
} else {
    addDynamicStyles();
    init();
}