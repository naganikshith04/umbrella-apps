// Certificate Generator JavaScript

// State management
const state = {
  template: 'classic',
  recipientName: '',
  title: '',
  description: '',
  date: '',
  logo: null,
  signature: null,
  batchData: []
};

// Template configurations
const templates = {
  classic: {
    backgroundColor: '#ffffff',
    borderColor: '#2c5aa0',
    borderWidth: 20,
    accentColor: '#d4af37',
    fontFamily: 'serif'
  },
  modern: {
    backgroundColor: '#f8f9fa',
    borderColor: '#495057',
    borderWidth: 15,
    accentColor: '#007bff',
    fontFamily: 'sans-serif'
  },
  elegant: {
    backgroundColor: '#fff8f0',
    borderColor: '#8b4513',
    borderWidth: 25,
    accentColor: '#cd853f',
    fontFamily: 'cursive'
  },
  minimal: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 5,
    accentColor: '#333333',
    fontFamily: 'sans-serif'
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadFromLocalStorage();
  setDefaultDate();
});

// Event Listeners
function initializeEventListeners() {
  // Template selection
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', (e) => {
      document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.template = card.dataset.template;
      saveToLocalStorage();
    });
  });

  // Text inputs
  const recipientNameInput = document.getElementById('recipient-name');
  const titleInput = document.getElementById('certificate-title');
  const descriptionInput = document.getElementById('description-text');
  const dateInput = document.getElementById('issue-date');

  if (recipientNameInput) {
    recipientNameInput.addEventListener('input', (e) => {
      state.recipientName = e.target.value;
      saveToLocalStorage();
    });
  }

  if (titleInput) {
    titleInput.addEventListener('input', (e) => {
      state.title = e.target.value;
      saveToLocalStorage();
    });
  }

  if (descriptionInput) {
    descriptionInput.addEventListener('input', (e) => {
      state.description = e.target.value;
      saveToLocalStorage();
    });
  }

  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      state.date = e.target.value;
      saveToLocalStorage();
    });
  }

  // Logo upload
  const logoUpload = document.getElementById('logo-upload');
  const logoUploadZone = document.getElementById('logo-upload-zone');
  
  if (logoUpload && logoUploadZone) {
    logoUploadZone.addEventListener('click', () => logoUpload.click());
    logoUpload.addEventListener('change', handleLogoUpload);
    setupDragAndDrop(logoUploadZone, handleLogoUpload);
  }

  // Signature upload
  const signatureUpload = document.getElementById('signature-upload');
  const signatureUploadZone = document.getElementById('signature-upload-zone');
  
  if (signatureUpload && signatureUploadZone) {
    signatureUploadZone.addEventListener('click', () => signatureUpload.click());
    signatureUpload.addEventListener('change', handleSignatureUpload);
    setupDragAndDrop(signatureUploadZone, handleSignatureUpload);
  }

  // CSV upload for batch
  const csvUpload = document.getElementById('csv-upload');
  const csvUploadZone = document.getElementById('csv-upload-zone');
  
  if (csvUpload && csvUploadZone) {
    csvUploadZone.addEventListener('click', () => csvUpload.click());
    csvUpload.addEventListener('change', handleCSVUpload);
    setupDragAndDrop(csvUploadZone, handleCSVUpload);
  }

  // Preview button
  const previewBtn = document.getElementById('preview-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', generatePreview);
  }

  // Download button
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadCertificate);
  }

  // Batch download button
  const batchDownloadBtn = document.getElementById('batch-download-btn');
  if (batchDownloadBtn) {
    batchDownloadBtn.addEventListener('click', downloadBatchCertificates);
  }
}

// Drag and drop setup
function setupDragAndDrop(zone, handler) {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = { target: { files: files } };
      handler(event);
    }
  });
}

// Handle logo upload
function handleLogoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showNotification('Please upload an image file', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    state.logo = event.target.result;
    const logoPreview = document.getElementById('logo-preview');
    if (logoPreview) {
      logoPreview.innerHTML = `<img src="${event.target.result}" alt="Logo" style="max-width: 100%; max-height: 100px;">`;
    }
    saveToLocalStorage();
    showNotification('Logo uploaded successfully', 'success');
  };
  reader.readAsDataURL(file);
}

// Handle signature upload
function handleSignatureUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showNotification('Please upload an image file', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    state.signature = event.target.result;
    const signaturePreview = document.getElementById('signature-preview');
    if (signaturePreview) {
      signaturePreview.innerHTML = `<img src="${event.target.result}" alt="Signature" style="max-width: 100%; max-height: 80px;">`;
    }
    saveToLocalStorage();
    showNotification('Signature uploaded successfully', 'success');
  };
  reader.readAsDataURL(file);
}

// Handle CSV upload
function handleCSVUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.name.endsWith('.csv')) {
    showNotification('Please upload a CSV file', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const csv = event.target.result;
    parseCSV(csv);
  };
  reader.readAsText(file);
}

// Parse CSV data
function parseCSV(csv) {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    showNotification('CSV file must contain headers and at least one data row', 'error');
    return;
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }

  state.batchData = data;
  displayBatchPreview(data);
  showNotification(`Loaded ${data.length} recipients`, 'success');
}

// Display batch preview
function displayBatchPreview(data) {
  const preview = document.getElementById('batch-data-preview');
  if (!preview) return;

  if (data.length === 0) {
    preview.innerHTML = '<p class="text-muted">No data loaded</p>';
    return;
  }

  const headers = Object.keys(data[0]);
  let html = '<div class="table-responsive"><table class="table table-sm"><thead><tr>';
  
  headers.forEach(header => {
    html += `<th>${header}</th>`;
  });
  html += '</tr></thead><tbody>';

  data.forEach(row => {
    html += '<tr>';
    headers.forEach(header => {
      html += `<td>${row[header]}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table></div>';
  preview.innerHTML = html;

  const batchDownloadBtn = document.getElementById('batch-download-btn');
  if (batchDownloadBtn) {
    batchDownloadBtn.disabled = false;
  }
}

// Generate preview
function generatePreview() {
  if (!validateInputs()) {
    return;
  }

  const canvas = document.getElementById('certificate-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const template = templates[state.template];

  // Set canvas size
  canvas.width = 1200;
  canvas.height = 850;

  // Draw certificate
  drawCertificate(ctx, canvas.width, canvas.height, {
    recipientName: state.recipientName,
    title: state.title,
    description: state.description,
    date: state.date,
    logo: state.logo,
    signature: state.signature
  });

  showNotification('Preview generated', 'success');
}

// Draw certificate on canvas
function drawCertificate(ctx, width, height, data) {
  const template = templates[state.template];

  // Background
  ctx.fillStyle = template.backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = template.borderColor;
  ctx.lineWidth = template.borderWidth;
  ctx.strokeRect(template.borderWidth / 2, template.borderWidth / 2, 
                 width - template.borderWidth, height - template.borderWidth);

  // Inner border
  ctx.strokeStyle = template.accentColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(template.borderWidth + 20, template.borderWidth + 20,
                 width - template.borderWidth * 2 - 40, height - template.borderWidth * 2 - 40);

  // Logo
  if (data.logo) {
    const logoImg = new Image();
    logoImg.src = data.logo;
    logoImg.onload = () => {
      const logoSize = 100;
      ctx.drawImage(logoImg, (width - logoSize) / 2, 80, logoSize, logoSize);
    };
  }

  // Title
  ctx.fillStyle = template.accentColor;
  ctx.font = `bold 48px ${template.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.fillText(data.title || 'Certificate of Achievement', width / 2, 250);

  // Presented to
  ctx.fillStyle = '#333333';
  ctx.font = `italic 24px ${template.fontFamily}`;
  ctx.fillText('This certificate is presented to', width / 2, 320);

  // Recipient name
  ctx.fillStyle = template.borderColor;
  ctx.font = `bold 56px ${template.fontFamily}`;
  ctx.fillText(data.recipientName || 'Recipient Name', width / 2, 400);

  // Underline
  ctx.strokeStyle = template.accentColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 410);
  ctx.lineTo(900, 410);
  ctx.stroke();

  // Description
  ctx.fillStyle = '#555555';
  ctx.font = `20px ${template.fontFamily}`;
  const descLines = wrapText(ctx, data.description || 'For outstanding achievement and dedication', 600);
  descLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, 470 + index * 30);
  });

  // Date
  ctx.fillStyle = '#666666';
  ctx.font = `italic 18px ${template.fontFamily}`;
  ctx.fillText(`Date: ${data.date || formatDate(new Date())}`, width / 2, 620);

  // Signature
  if (data.signature) {
    const sigImg = new Image();
    sigImg.src = data.signature;
    sigImg.onload = () => {
      const sigWidth = 200;
      const sigHeight = 80;
      ctx.drawImage(sigImg, (width - sigWidth) / 2, 660, sigWidth, sigHeight);
      
      // Signature line
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 100, 750);
      ctx.lineTo(width / 2 + 100, 750);
      ctx.stroke();
      
      ctx.fillStyle = '#666666';
      ctx.font = `16px ${template.fontFamily}`;
      ctx.fillText('Authorized Signature', width / 2, 770);
    };
  }
}

// Wrap text to fit width
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  });
  lines.push(currentLine.trim());
  return lines;
}

// Download certificate
async function downloadCertificate() {
  if (!validateInputs()) {
    return;
  }

  const canvas = document.getElementById('certificate-canvas');
  if (!canvas) return;

  // Ensure canvas is rendered
  await new Promise(resolve => setTimeout(resolve, 500));

  const opt = {
    margin: 0,
    filename: `certificate-${state.recipientName.replace(/\s+/g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, canvas: canvas },
    jsPDF: { unit: 'px', format: [canvas.width, canvas.height], orientation: 'landscape' }
  };

  html2pdf().set(opt).from(canvas).save();
  showNotification('Certificate downloaded', 'success');
}

// Download batch certificates
async function downloadBatchCertificates() {
  if (state.batchData.length === 0) {
    showNotification('No batch data loaded', 'error');
    return;
  }

  if (!state.title) {
    showNotification('Please enter a certificate title', 'error');
    return;
  }

  const zip = new JSZip();
  const canvas = document.getElementById('certificate-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const totalCerts = state.batchData.length;
  let processed = 0;

  showNotification(`Generating ${totalCerts} certificates...`, 'info');

  for (const row of state.batchData) {
    const recipientName = row.name || row.Name || row.recipient || row.Recipient || '';
    const description = row.description || row.Description || state.description || '';
    const date = row.date || row.Date || state.date || formatDate(new Date());

    // Draw certificate
    drawCertificate(ctx, canvas.width, canvas.height, {
      recipientName: recipientName,
      title: state.title,
      description: description,
      date: date,
      logo: state.logo,
      signature: state.signature
    });

    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 300));

    // Convert to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    
    // Add to zip
    const filename = `certificate-${recipientName.replace(/\s+/g, '-')}.png`;
    zip.file(filename, blob);

    processed++;
    showNotification(`Processing: ${processed}/${totalCerts}`, 'info');
  }

  // Generate and download zip
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, 'certificates.zip');
  
  showNotification(`Generated ${totalCerts} certificates`, 'success');
}

// Validate inputs
function validateInputs() {
  if (!state.recipientName.trim()) {
    showNotification('Please enter recipient name', 'error');
    return false;
  }

  if (!state.title.trim()) {
    showNotification('Please enter certificate title', 'error');
    return false;
  }

  return true;
}

// Set default date
function setDefaultDate() {
  const dateInput = document.getElementById('issue-date');
  if (dateInput && !dateInput.value) {
    dateInput.value = formatDateInput(new Date());
    state.date = dateInput.value;
  }
}

// Format date for input
function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format date for display
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

// Show notification
function showNotification(message, type = 'info') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
    color: white;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// LocalStorage functions
function saveToLocalStorage() {
  try {
    const dataToSave = {
      template: state.template,
      recipientName: state.recipientName,
      title: state.title,
      description: state.description,
      date: state.date,
      logo: state.logo,
      signature: state.signature
    };
    localStorage.setItem('certificateGenerator', JSON.stringify(dataToSave));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('certificateGenerator');
    if (saved) {
      const data = JSON.parse(saved);
      
      state.template = data.template || 'classic';
      state.recipientName = data.recipientName || '';
      state.title = data.title || '';
      state.description = data.description || '';
      state.date = data.date || '';
      state.logo = data.logo || null;
      state.signature = data.signature || null;

      // Update UI
      const recipientNameInput = document.getElementById('recipient-name');
      if (recipientNameInput) recipientNameInput.value = state.recipientName;

      const titleInput = document.getElementById('certificate-title');
      if (titleInput) titleInput.value = state.title;

      const descriptionInput = document.getElementById('description-text');
      if (descriptionInput) descriptionInput.value = state.description;

      const dateInput = document.getElementById('issue-date');
      if (dateInput) dateInput.value = state.date;

      // Update template selection
      document.querySelectorAll('.template-card').forEach(card => {
        if (card.dataset.template === state.template) {
          card.classList.add('selected');
        }
      });

      // Update logo preview
      if (state.logo) {
        const logoPreview = document.getElementById('logo-preview');
        if (logoPreview) {
          logoPreview.innerHTML = `<img src="${state.logo}" alt="Logo" style="max-width: 100%; max-height: 100px;">`;
        }
      }

      // Update signature preview
      if (state.signature) {
        const signaturePreview = document.getElementById('signature-preview');
        if (signaturePreview) {
          signaturePreview.innerHTML = `<img src="${state.signature}" alt="Signature" style="max-width: 100%; max-height: 80px;">`;
        }
      }
    }
  } catch (e) {
    console.error('Error loading from localStorage:', e);
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

  .drag-over {
    border-color: #007bff !important;
    background-color: #e7f3ff !important;
  }

  .template-card.selected {
    border: 2px solid #007bff !important;
    box-shadow: 0 4px 8px rgba(0,123,255,0.3) !important;
  }
`;
document.head.appendChild(style);