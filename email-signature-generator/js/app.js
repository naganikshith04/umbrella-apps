// Email Signature Generator JavaScript

// State management
let state = {
    fullName: '',
    jobTitle: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    photoUrl: '',
    template: 'modern'
};

// DOM Elements
const elements = {
    signatureForm: document.getElementById('signatureForm'),
    fullName: document.getElementById('fullName'),
    jobTitle: document.getElementById('jobTitle'),
    company: document.getElementById('company'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    website: document.getElementById('website'),
    address: document.getElementById('address'),
    facebook: document.getElementById('facebook'),
    twitter: document.getElementById('twitter'),
    linkedin: document.getElementById('linkedin'),
    instagram: document.getElementById('instagram'),
    photoUpload: document.getElementById('photoUpload'),
    uploadZone: document.getElementById('uploadZone'),
    imagePreview: document.getElementById('imagePreview'),
    previewImg: document.getElementById('previewImg'),
    removeImage: document.getElementById('removeImage'),
    signaturePreview: document.getElementById('signaturePreview'),
    refreshPreview: document.getElementById('refreshPreview'),
    copyHtml: document.getElementById('copyHtml'),
    downloadHtml: document.getElementById('downloadHtml'),
    codeContainer: document.getElementById('codeContainer'),
    htmlCode: document.getElementById('htmlCode'),
    closeCode: document.getElementById('closeCode'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// Template selection
const templateRadios = document.querySelectorAll('input[name="template"]');

// Initialize
function init() {
    loadFromLocalStorage();
    attachEventListeners();
    updatePreview();
}

// Load data from localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('emailSignatureData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            state = { ...state, ...data };
            populateForm();
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

// Populate form with saved data
function populateForm() {
    if (elements.fullName) elements.fullName.value = state.fullName || '';
    if (elements.jobTitle) elements.jobTitle.value = state.jobTitle || '';
    if (elements.company) elements.company.value = state.company || '';
    if (elements.email) elements.email.value = state.email || '';
    if (elements.phone) elements.phone.value = state.phone || '';
    if (elements.website) elements.website.value = state.website || '';
    if (elements.address) elements.address.value = state.address || '';
    if (elements.facebook) elements.facebook.value = state.facebook || '';
    if (elements.twitter) elements.twitter.value = state.twitter || '';
    if (elements.linkedin) elements.linkedin.value = state.linkedin || '';
    if (elements.instagram) elements.instagram.value = state.instagram || '';
    
    if (state.photoUrl && elements.imagePreview && elements.previewImg) {
        elements.previewImg.src = state.photoUrl;
        elements.imagePreview.style.display = 'block';
        if (elements.uploadZone) elements.uploadZone.style.display = 'none';
    }
    
    const templateRadio = document.querySelector(`input[name="template"][value="${state.template}"]`);
    if (templateRadio) templateRadio.checked = true;
}

// Save to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('emailSignatureData', JSON.stringify(state));
    } catch (e) {
        console.error('Error saving data:', e);
    }
}

// Attach event listeners
function attachEventListeners() {
    // Form inputs
    if (elements.fullName) elements.fullName.addEventListener('input', handleInputChange);
    if (elements.jobTitle) elements.jobTitle.addEventListener('input', handleInputChange);
    if (elements.company) elements.company.addEventListener('input', handleInputChange);
    if (elements.email) elements.email.addEventListener('input', handleInputChange);
    if (elements.phone) elements.phone.addEventListener('input', handleInputChange);
    if (elements.website) elements.website.addEventListener('input', handleInputChange);
    if (elements.address) elements.address.addEventListener('input', handleInputChange);
    if (elements.facebook) elements.facebook.addEventListener('input', handleInputChange);
    if (elements.twitter) elements.twitter.addEventListener('input', handleInputChange);
    if (elements.linkedin) elements.linkedin.addEventListener('input', handleInputChange);
    if (elements.instagram) elements.instagram.addEventListener('input', handleInputChange);
    
    // Template selection
    templateRadios.forEach(radio => {
        radio.addEventListener('change', handleTemplateChange);
    });
    
    // Photo upload
    if (elements.photoUpload) {
        elements.photoUpload.addEventListener('change', handlePhotoUpload);
    }
    
    if (elements.uploadZone) {
        elements.uploadZone.addEventListener('click', () => {
            if (elements.photoUpload) elements.photoUpload.click();
        });
        
        elements.uploadZone.addEventListener('dragover', handleDragOver);
        elements.uploadZone.addEventListener('drop', handleDrop);
    }
    
    // Remove image
    if (elements.removeImage) {
        elements.removeImage.addEventListener('click', handleRemoveImage);
    }
    
    // Preview and export buttons
    if (elements.refreshPreview) {
        elements.refreshPreview.addEventListener('click', updatePreview);
    }
    
    if (elements.copyHtml) {
        elements.copyHtml.addEventListener('click', handleCopyHtml);
    }
    
    if (elements.downloadHtml) {
        elements.downloadHtml.addEventListener('click', handleDownloadHtml);
    }
    
    if (elements.closeCode) {
        elements.closeCode.addEventListener('click', () => {
            if (elements.codeContainer) {
                elements.codeContainer.style.display = 'none';
            }
        });
    }
    
    // Form submission
    if (elements.signatureForm) {
        elements.signatureForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updatePreview();
        });
    }
}

// Handle input changes
function handleInputChange(e) {
    const field = e.target.id;
    state[field] = e.target.value;
    saveToLocalStorage();
    updatePreview();
}

// Handle template change
function handleTemplateChange(e) {
    state.template = e.target.value;
    saveToLocalStorage();
    updatePreview();
}

// Handle photo upload
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        processImageFile(file);
    }
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.borderColor = '#007bff';
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.borderColor = '#ddd';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImageFile(file);
    } else {
        showToast('Please upload an image file', 'error');
    }
}

// Process image file
function processImageFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        state.photoUrl = e.target.result;
        if (elements.previewImg) elements.previewImg.src = e.target.result;
        if (elements.imagePreview) elements.imagePreview.style.display = 'block';
        if (elements.uploadZone) elements.uploadZone.style.display = 'none';
        saveToLocalStorage();
        updatePreview();
        showToast('Image uploaded successfully', 'success');
    };
    reader.onerror = () => {
        showToast('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
}

// Handle remove image
function handleRemoveImage() {
    state.photoUrl = '';
    if (elements.previewImg) elements.previewImg.src = '';
    if (elements.imagePreview) elements.imagePreview.style.display = 'none';
    if (elements.uploadZone) elements.uploadZone.style.display = 'block';
    if (elements.photoUpload) elements.photoUpload.value = '';
    saveToLocalStorage();
    updatePreview();
    showToast('Image removed', 'success');
}

// Update preview
function updatePreview() {
    if (!elements.signaturePreview) return;
    
    const html = generateSignatureHTML();
    elements.signaturePreview.innerHTML = html;
}

// Generate signature HTML based on template
function generateSignatureHTML() {
    const { template } = state;
    
    switch (template) {
        case 'modern':
            return generateModernTemplate();
        case 'classic':
            return generateClassicTemplate();
        case 'minimal':
            return generateMinimalTemplate();
        case 'corporate':
            return generateCorporateTemplate();
        default:
            return generateModernTemplate();
    }
}

// Modern template
function generateModernTemplate() {
    const socialLinks = generateSocialLinks('modern');
    const photoSection = state.photoUrl ? `
        <td style="padding-right: 20px; vertical-align: top;">
            <img src="${state.photoUrl}" alt="${state.fullName}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #007bff;">
        </td>
    ` : '';
    
    return `
        <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #333; max-width: 600px;">
            <tr>
                ${photoSection}
                <td style="vertical-align: top;">
                    <table cellpadding="0" cellspacing="0" border="0">
                        ${state.fullName ? `<tr><td style="font-size: 20px; font-weight: bold; color: #007bff; padding-bottom: 5px;">${escapeHtml(state.fullName)}</td></tr>` : ''}
                        ${state.jobTitle ? `<tr><td style="font-size: 14px; color: #666; padding-bottom: 3px;">${escapeHtml(state.jobTitle)}</td></tr>` : ''}
                        ${state.company ? `<tr><td style="font-size: 14px; font-weight: bold; color: #333; padding-bottom: 10px;">${escapeHtml(state.company)}</td></tr>` : ''}
                        ${state.email ? `<tr><td style="padding-bottom: 5px;"><a href="mailto:${escapeHtml(state.email)}" style="color: #007bff; text-decoration: none;">📧 ${escapeHtml(state.email)}</a></td></tr>` : ''}
                        ${state.phone ? `<tr><td style="padding-bottom: 5px; color: #333;">📱 ${escapeHtml(state.phone)}</td></tr>` : ''}
                        ${state.website ? `<tr><td style="padding-bottom: 5px;"><a href="${escapeHtml(state.website)}" style="color: #007bff; text-decoration: none;">🌐 ${escapeHtml(state.website)}</a></td></tr>` : ''}
                        ${state.address ? `<tr><td style="padding-bottom: 10px; color: #666;">📍 ${escapeHtml(state.address)}</td></tr>` : ''}
                        ${socialLinks ? `<tr><td style="padding-top: 10px;">${socialLinks}</td></tr>` : ''}
                    </table>
                </td>
            </tr>
        </table>
    `;
}

// Classic template
function generateClassicTemplate() {
    const socialLinks = generateSocialLinks('classic');
    const photoSection = state.photoUrl ? `
        <td style="padding-right: 20px; vertical-align: top; border-right: 3px solid #2c3e50;">
            <img src="${state.photoUrl}" alt="${state.fullName}" style="width: 100px; height: 100px; object-fit: cover;">
        </td>
    ` : '';
    
    return `
        <table cellpadding="0" cellspacing="0" border="0" style="font-family: Georgia, serif; font-size: 14px; color: #2c3e50; max-width: 600px;">
            <tr>
                ${photoSection}
                <td style="vertical-align: top; padding-left: ${state.photoUrl ? '20px' : '0'};">
                    <table cellpadding="0" cellspacing="0" border="0">
                        ${state.fullName ? `<tr><td style="font-size: 22px; font-weight: bold; color: #2c3e50; padding-bottom: 5px;">${escapeHtml(state.fullName)}</td></tr>` : ''}
                        ${state.jobTitle ? `<tr><td style="font-size: 14px; font-style: italic; color: #7f8c8d; padding-bottom: 3px;">${escapeHtml(state.jobTitle)}</td></tr>` : ''}
                        ${state.company ? `<tr><td style="font-size: 14px; color: #34495e; padding-bottom: 15px;">${escapeHtml(state.company)}</td></tr>` : ''}
                        ${state.email ? `<tr><td style="padding-bottom: 5px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(state.email)}" style="color: #2c3e50; text-decoration: none;">${escapeHtml(state.email)}</a></td></tr>` : ''}
                        ${state.phone ? `<tr><td style="padding-bottom: 5px;"><strong>Phone:</strong> ${escapeHtml(state.phone)}</td></tr>` : ''}
                        ${state.website ? `<tr><td style="padding-bottom: 5px;"><strong>Web:</strong> <a href="${escapeHtml(state.website)}" style="color: #2c3e50; text-decoration: none;">${escapeHtml(state.website)}</a></td></tr>` : ''}
                        ${state.address ? `<tr><td style="padding-bottom: 10px;"><strong>Address:</strong> ${escapeHtml(state.address)}</td></tr>` : ''}
                        ${socialLinks ? `<tr><td style="padding-top: 10px; border-top: 1px solid #bdc3c7;">${socialLinks}</td></tr>` : ''}
                    </table>
                </td>
            </tr>
        </table>
    `;
}

// Minimal template
function generateMinimalTemplate() {
    const socialLinks = generateSocialLinks('minimal');
    const photoSection = state.photoUrl ? `
        <tr>
            <td style="text-align: center; padding-bottom: 15px;">
                <img src="${state.photoUrl}" alt="${state.fullName}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
            </td>
        </tr>
    ` : '';
    
    return `
        <table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #333; max-width: 500px;">
            ${photoSection}
            ${state.fullName ? `<tr><td style="font-size: 18px; font-weight: 600; color: #000; padding-bottom: 5px; text-align: center;">${escapeHtml(state.fullName)}</td></tr>` : ''}
            ${state.jobTitle ? `<tr><td style="font-size: 13px; color: #666; padding-bottom: 2px; text-align: center;">${escapeHtml(state.jobTitle)}</td></tr>` : ''}
            ${state.company ? `<tr><td style="font-size: 13px; color: #666; padding-bottom: 15px; text-align: center;">${escapeHtml(state.company)}</td></tr>` : ''}
            ${state.email ? `<tr><td style="padding-bottom: 5px; text-align: center;"><a href="mailto:${escapeHtml(state.email)}" style="color: #333; text-decoration: none;">${escapeHtml(state.email)}</a></td></tr>` : ''}
            ${state.phone ? `<tr><td style="padding-bottom: 5px; text-align: center;">${escapeHtml(state.phone)}</td></tr>` : ''}
            ${state.website ? `<tr><td style="padding-bottom: 5px; text-align: center;"><a href="${escapeHtml(state.website)}" style="color: #333; text-decoration: none;">${escapeHtml(state.website)}</a></td></tr>` : ''}
            ${state.address ? `<tr><td style="padding-bottom: 10px; text-align: center; font-size: 12px; color: #999;">${escapeHtml(state.address)}</td></tr>` : ''}
            ${socialLinks ? `<tr><td style="padding-top: 10px; text-align: center;">${socialLinks}</td></tr>` : ''}
        </table>
    `;
}

// Corporate template
function generateCorporateTemplate() {
    const socialLinks = generateSocialLinks('corporate');
    const photoSection = state.photoUrl ? `
        <td style="padding: 20px; background-color: #f8f9fa; vertical-align: top;">
            <img src="${state.photoUrl}" alt="${state.fullName}" style="width: 120px; height: 120px; object-fit: cover; border: 5px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        </td>
    ` : '';
    
    return `
        <table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; color: #333; max-width: 650px; border: 1px solid #e0e0e0;">
            <tr>
                ${photoSection}
                <td style="padding: 20px; vertical-align: top;">
                    <table cellpadding="0" cellspacing="0" border="0">
                        ${state.fullName ? `<tr><td style="font-size: 24px; font-weight: bold; color: #1a1a1a; padding-bottom: 5px;">${escapeHtml(state.fullName)}</td></tr>` : ''}
                        ${state.jobTitle ? `<tr><td style="font-size: 14px; color: #666; padding-bottom: 3px;">${escapeHtml(state.jobTitle)}</td></tr>` : ''}
                        ${state.company ? `<tr><td style="font-size: 16px; font-weight: 600; color: #0066cc; padding-bottom: 15px;">${escapeHtml(state.company)}</td></tr>` : ''}
                        <tr><td style="height: 2px; background-color: #0066cc; margin-bottom: 15px;"></td></tr>
                        ${state.email ? `<tr><td style="padding: 8px 0;"><span style="color: #666; font-weight: 600;">E:</span> <a href="mailto:${escapeHtml(state.email)}" style="color: #0066cc; text-decoration: none;">${escapeHtml(state.email)}</a></td></tr>` : ''}
                        ${state.phone ? `<tr><td style="padding: 8px 0;"><span style="color: #666; font-weight: 600;">P:</span> ${escapeHtml(state.phone)}</td></tr>` : ''}
                        ${state.website ? `<tr><td style="padding: 8px 0;"><span style="color: #666; font-weight: 600;">W:</span> <a href="${escapeHtml(state.website)}" style="color: #0066cc; text-decoration: none;">${escapeHtml(state.website)}</a></td></tr>` : ''}
                        ${state.address ? `<tr><td style="padding: 8px 0;"><span style="color: #666; font-weight: 600;">A:</span> ${escapeHtml(state.address)}</td></tr>` : ''}
                        ${socialLinks ? `<tr><td style="padding-top: 15px;">${socialLinks}</td></tr>` : ''}
                    </table>
                </td>
            </tr>
        </table>
    `;
}

// Generate social links
function generateSocialLinks(template) {
    const links = [];
    const iconStyle = template === 'minimal' ? 'width: 24px; height: 24px; margin: 0 5px;' : 'width: 28px; height: 28px; margin-right: 10px;';
    
    if (state.facebook) {
        links.push(`<a href="${escapeHtml(state.facebook)}" style="text-decoration: none;"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="${iconStyle}"></a>`);
    }
    if (state.twitter) {
        links.push(`<a href="${escapeHtml(state.twitter)}" style="text-decoration: none;"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="${iconStyle}"></a>`);
    }
    if (state.linkedin) {
        links.push(`<a href="${escapeHtml(state.linkedin)}" style="text-decoration: none;"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="${iconStyle}"></a>`);
    }
    if (state.instagram) {
        links.push(`<a href="${escapeHtml(state.instagram)}" style="text-decoration: none;"><img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" style="${iconStyle}"></a>`);
    }
    
    return links.join('');
}

// Handle copy HTML
function handleCopyHtml() {
    const html = generateSignatureHTML();
    
    // Create a temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = html;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('HTML copied to clipboard!', 'success');
        
        // Show code modal
        if (elements.htmlCode && elements.codeContainer) {
            elements.htmlCode.textContent = html;
            elements.codeContainer.style.display = 'flex';
        }
    } catch (err) {
        // Fallback to clipboard API
        navigator.clipboard.writeText(html).then(() => {
            showToast('HTML copied to clipboard!', 'success');
            if (elements.htmlCode && elements.codeContainer) {
                elements.htmlCode.textContent = html;
                elements.codeContainer.style.display = 'flex';
            }
        }).catch(() => {
            showToast('Failed to copy HTML', 'error');
        });
    } finally {
        document.body.removeChild(textarea);
    }
}

// Handle download HTML
function handleDownloadHtml() {
    const html = generateSignatureHTML();
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Signature - ${state.fullName || 'Signature'}</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif;">
    ${html}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const fileName = `email-signature-${state.fullName.replace(/\s+/g, '-').toLowerCase() || 'signature'}.html`;
    
    if (typeof saveAs === 'function') {
        saveAs(blob, fileName);
        showToast('Signature downloaded successfully!', 'success');
    } else {
        // Fallback download method
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Signature downloaded successfully!', 'success');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    if (!elements.toast || !elements.toastMessage) return;
    
    elements.toastMessage.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate URL
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}