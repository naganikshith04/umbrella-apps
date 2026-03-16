// Template definitions
const templates = [
    {
        name: '2-Grid',
        slots: [
            { x: 0, y: 0, width: 50, height: 100 },
            { x: 50, y: 0, width: 50, height: 100 }
        ]
    },
    {
        name: '3-Grid',
        slots: [
            { x: 0, y: 0, width: 33.33, height: 100 },
            { x: 33.33, y: 0, width: 33.33, height: 100 },
            { x: 66.66, y: 0, width: 33.34, height: 100 }
        ]
    },
    {
        name: '4-Grid',
        slots: [
            { x: 0, y: 0, width: 50, height: 50 },
            { x: 50, y: 0, width: 50, height: 50 },
            { x: 0, y: 50, width: 50, height: 50 },
            { x: 50, y: 50, width: 50, height: 50 }
        ]
    },
    {
        name: 'Feature',
        slots: [
            { x: 0, y: 0, width: 66.66, height: 100 },
            { x: 66.66, y: 0, width: 33.34, height: 50 },
            { x: 66.66, y: 50, width: 33.34, height: 50 }
        ]
    },
    {
        name: '6-Grid',
        slots: [
            { x: 0, y: 0, width: 33.33, height: 50 },
            { x: 33.33, y: 0, width: 33.33, height: 50 },
            { x: 66.66, y: 0, width: 33.34, height: 50 },
            { x: 0, y: 50, width: 33.33, height: 50 },
            { x: 33.33, y: 50, width: 33.33, height: 50 },
            { x: 66.66, y: 50, width: 33.34, height: 50 }
        ]
    }
];

// State management
const state = {
    uploadedPhotos: [],
    currentTemplate: 0,
    textOverlays: [],
    backgroundColor: '#ffffff',
    selectedSlot: null,
    draggedPhoto: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTemplates();
    setupEventListeners();
    renderCollage();
    loadFromLocalStorage();
});

// Initialize template selection
function initializeTemplates() {
    const container = document.querySelector('.template-grid');
    if (!container) return;

    templates.forEach((template, index) => {
        const templateDiv = document.createElement('div');
        templateDiv.className = `template-option ${index === 0 ? 'active' : ''}`;
        templateDiv.dataset.template = index;
        
        const preview = document.createElement('div');
        preview.className = 'template-preview';
        preview.style.position = 'relative';
        preview.style.width = '100%';
        preview.style.height = '80px';
        preview.style.backgroundColor = '#f0f0f0';
        
        template.slots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.style.position = 'absolute';
            slotDiv.style.left = slot.x + '%';
            slotDiv.style.top = slot.y + '%';
            slotDiv.style.width = slot.width + '%';
            slotDiv.style.height = slot.height + '%';
            slotDiv.style.border = '2px solid #fff';
            slotDiv.style.boxSizing = 'border-box';
            slotDiv.style.backgroundColor = '#ddd';
            preview.appendChild(slotDiv);
        });
        
        const name = document.createElement('div');
        name.textContent = template.name;
        name.style.textAlign = 'center';
        name.style.marginTop = '8px';
        name.style.fontSize = '12px';
        
        templateDiv.appendChild(preview);
        templateDiv.appendChild(name);
        
        templateDiv.addEventListener('click', () => {
            document.querySelectorAll('.template-option').forEach(opt => {
                opt.classList.remove('active');
            });
            templateDiv.classList.add('active');
            state.currentTemplate = index;
            renderCollage();
            saveToLocalStorage();
        });
        
        container.appendChild(templateDiv);
    });
}

// Setup event listeners
function setupEventListeners() {
    const uploadZone = document.getElementById('uploadZone');
    const photoInput = document.getElementById('photoInput');
    const uploadButton = document.getElementById('uploadButton');
    const downloadButton = document.getElementById('downloadButton');
    const resetButton = document.getElementById('resetButton');
    const addTextButton = document.getElementById('addTextButton');
    const bgColor = document.getElementById('bgColor');
    const textColor = document.getElementById('textColor');
    const fontSize = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');

    // Upload zone click
    if (uploadZone) {
        uploadZone.addEventListener('click', () => {
            photoInput?.click();
        });

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#007bff';
            uploadZone.style.backgroundColor = '#f0f8ff';
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.style.borderColor = '#ddd';
            uploadZone.style.backgroundColor = 'transparent';
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#ddd';
            uploadZone.style.backgroundColor = 'transparent';
            
            const files = Array.from(e.dataTransfer.files).filter(file => 
                file.type.startsWith('image/')
            );
            
            if (files.length > 0) {
                handlePhotoUpload(files);
            }
        });
    }

    // Photo input change
    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                handlePhotoUpload(files);
            }
        });
    }

    // Upload button
    if (uploadButton) {
        uploadButton.addEventListener('click', () => {
            photoInput?.click();
        });
    }

    // Download button
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadCollage);
    }

    // Reset button
    if (resetButton) {
        resetButton.addEventListener('click', resetCollage);
    }

    // Add text button
    if (addTextButton) {
        addTextButton.addEventListener('click', addTextOverlay);
    }

    // Background color
    if (bgColor) {
        bgColor.addEventListener('input', (e) => {
            state.backgroundColor = e.target.value;
            renderCollage();
            saveToLocalStorage();
        });
    }

    // Text color (for future text overlays)
    if (textColor) {
        textColor.addEventListener('input', () => {
            renderCollage();
        });
    }

    // Font size
    if (fontSize) {
        fontSize.addEventListener('input', (e) => {
            if (fontSizeValue) {
                fontSizeValue.textContent = e.target.value + 'px';
            }
            renderCollage();
        });
    }
}

// Handle photo upload
function handlePhotoUpload(files) {
    const promises = files.map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    resolve({
                        id: Date.now() + Math.random(),
                        src: e.target.result,
                        img: img,
                        slotIndex: null,
                        offsetX: 0,
                        offsetY: 0,
                        scale: 1
                    });
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    Promise.all(promises)
        .then(photos => {
            state.uploadedPhotos.push(...photos);
            renderPhotoGallery();
            renderCollage();
            saveToLocalStorage();
        })
        .catch(error => {
            console.error('Error uploading photos:', error);
            alert('Error uploading some photos. Please try again.');
        });
}

// Render photo gallery
function renderPhotoGallery() {
    const gallery = document.getElementById('photoGallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    state.uploadedPhotos.forEach((photo, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'gallery-photo';
        photoDiv.draggable = true;
        photoDiv.dataset.photoId = photo.id;

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = `Photo ${index + 1}`;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-photo';
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removePhoto(photo.id);
        });

        photoDiv.appendChild(img);
        photoDiv.appendChild(removeBtn);

        // Drag events
        photoDiv.addEventListener('dragstart', (e) => {
            state.draggedPhoto = photo;
            e.dataTransfer.effectAllowed = 'copy';
        });

        photoDiv.addEventListener('dragend', () => {
            state.draggedPhoto = null;
        });

        gallery.appendChild(photoDiv);
    });
}

// Remove photo
function removePhoto(photoId) {
    state.uploadedPhotos = state.uploadedPhotos.filter(p => p.id !== photoId);
    renderPhotoGallery();
    renderCollage();
    saveToLocalStorage();
}

// Render collage
function renderCollage() {
    const canvas = document.getElementById('collageCanvas');
    const container = document.getElementById('collageContainer');
    
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const template = templates[state.currentTemplate];

    // Set canvas size
    canvas.width = 800;
    canvas.height = 800;

    // Clear canvas
    ctx.fillStyle = state.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw slots and photos
    template.slots.forEach((slot, index) => {
        const x = (slot.x / 100) * canvas.width;
        const y = (slot.y / 100) * canvas.height;
        const width = (slot.width / 100) * canvas.width;
        const height = (slot.height / 100) * canvas.height;

        // Draw slot background
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(x, y, width, height);

        // Draw slot border
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Find photo for this slot
        const photo = state.uploadedPhotos.find(p => p.slotIndex === index);
        
        if (photo && photo.img) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.clip();

            const imgAspect = photo.img.width / photo.img.height;
            const slotAspect = width / height;

            let drawWidth, drawHeight, drawX, drawY;

            if (imgAspect > slotAspect) {
                drawHeight = height * photo.scale;
                drawWidth = drawHeight * imgAspect;
            } else {
                drawWidth = width * photo.scale;
                drawHeight = drawWidth / imgAspect;
            }

            drawX = x + (width - drawWidth) / 2 + photo.offsetX;
            drawY = y + (height - drawHeight) / 2 + photo.offsetY;

            ctx.drawImage(photo.img, drawX, drawY, drawWidth, drawHeight);
            ctx.restore();
        } else {
            // Draw placeholder
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(x + 10, y + 10, width - 20, height - 20);
            ctx.fillStyle = '#999';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Drop photo here', x + width / 2, y + height / 2);
        }
    });

    // Draw text overlays
    state.textOverlays.forEach(overlay => {
        ctx.save();
        ctx.fillStyle = overlay.color;
        ctx.font = `${overlay.fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(overlay.text, overlay.x, overlay.y);
        ctx.restore();
    });

    // Setup drop zones
    setupDropZones(canvas, template);
}

// Setup drop zones on canvas
function setupDropZones(canvas, template) {
    const container = document.getElementById('collageContainer');
    if (!container) return;

    // Remove old event listeners by cloning
    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);

    newCanvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    newCanvas.addEventListener('drop', (e) => {
        e.preventDefault();
        
        if (!state.draggedPhoto) return;

        const rect = newCanvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Find which slot was dropped on
        const slotIndex = template.slots.findIndex(slot => {
            return x >= slot.x && x <= slot.x + slot.width &&
                   y >= slot.y && y <= slot.y + slot.height;
        });

        if (slotIndex !== -1) {
            // Remove photo from any previous slot
            state.uploadedPhotos.forEach(p => {
                if (p.slotIndex === slotIndex) {
                    p.slotIndex = null;
                }
            });

            // Assign photo to slot
            state.draggedPhoto.slotIndex = slotIndex;
            state.draggedPhoto.offsetX = 0;
            state.draggedPhoto.offsetY = 0;
            state.draggedPhoto.scale = 1;

            renderCollage();
            saveToLocalStorage();
        }
    });

    // Click to select slot
    newCanvas.addEventListener('click', (e) => {
        const rect = newCanvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const slotIndex = template.slots.findIndex(slot => {
            return x >= slot.x && x <= slot.x + slot.width &&
                   y >= slot.y && y <= slot.y + slot.height;
        });

        if (slotIndex !== -1) {
            state.selectedSlot = slotIndex;
            showSlotControls(slotIndex);
        }
    });

    // Mouse wheel for zoom
    newCanvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const rect = newCanvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const slotIndex = template.slots.findIndex(slot => {
            return x >= slot.x && x <= slot.x + slot.width &&
                   y >= slot.y && y <= slot.y + slot.height;
        });

        if (slotIndex !== -1) {
            const photo = state.uploadedPhotos.find(p => p.slotIndex === slotIndex);
            if (photo) {
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                photo.scale = Math.max(0.5, Math.min(3, photo.scale + delta));
                renderCollage();
                saveToLocalStorage();
            }
        }
    });

    // Drag to pan
    let isDragging = false;
    let dragStartX, dragStartY;
    let dragPhoto = null;

    newCanvas.addEventListener('mousedown', (e) => {
        const rect = newCanvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const slotIndex = template.slots.findIndex(slot => {
            return x >= slot.x && x <= slot.x + slot.width &&
                   y >= slot.y && y <= slot.y + slot.height;
        });

        if (slotIndex !== -1) {
            dragPhoto = state.uploadedPhotos.find(p => p.slotIndex === slotIndex);
            if (dragPhoto) {
                isDragging = true;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                newCanvas.style.cursor = 'move';
            }
        }
    });

    newCanvas.addEventListener('mousemove', (e) => {
        if (!isDragging || !dragPhoto) return;

        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;

        dragPhoto.offsetX += dx;
        dragPhoto.offsetY += dy;

        dragStartX = e.clientX;
        dragStartY = e.clientY;

        renderCollage();
    });

    newCanvas.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            dragPhoto = null;
            newCanvas.style.cursor = 'default';
            saveToLocalStorage();
        }
    });

    newCanvas.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            dragPhoto = null;
            newCanvas.style.cursor = 'default';
        }
    });
}

// Show slot controls
function showSlotControls(slotIndex) {
    const photo = state.uploadedPhotos.find(p => p.slotIndex === slotIndex);
    if (!photo) return;

    // Could implement UI controls here
    console.log('Selected slot:', slotIndex, 'with photo:', photo);
}

// Add text overlay
function addTextOverlay() {
    const textInput = document.getElementById('textInput');
    const textColor = document.getElementById('textColor');
    const fontSize = document.getElementById('fontSize');

    if (!textInput || !textInput.value.trim()) {
        alert('Please enter text to add');
        return;
    }

    const overlay = {
        id: Date.now() + Math.random(),
        text: textInput.value.trim(),
        color: textColor?.value || '#000000',
        fontSize: parseInt(fontSize?.value || 32),
        x: 400,
        y: 400
    };

    state.textOverlays.push(overlay);
    textInput.value = '';
    
    renderCollage();
    makeTextDraggable();
    saveToLocalStorage();
}

// Make text draggable
function makeTextDraggable() {
    const canvas = document.getElementById('collageCanvas');
    if (!canvas) return;

    // Text dragging is complex on canvas, simplified implementation
    // In a real app, you'd track text positions and implement full drag support
}

// Download collage
async function downloadCollage() {
    const canvas = document.getElementById('collageCanvas');
    if (!canvas) return;

    try {
        // Use canvas.toBlob for better quality
        canvas.toBlob((blob) => {
            if (blob) {
                saveAs(blob, `collage-${Date.now()}.png`);
            } else {
                // Fallback
                const link = document.createElement('a');
                link.download = `collage-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        }, 'image/png');
    } catch (error) {
        console.error('Error downloading collage:', error);
        alert('Error downloading collage. Please try again.');
    }
}

// Reset collage
function resetCollage() {
    if (!confirm('Are you sure you want to reset? All photos and text will be removed.')) {
        return;
    }

    state.uploadedPhotos = [];
    state.textOverlays = [];
    state.currentTemplate = 0;
    state.backgroundColor = '#ffffff';
    state.selectedSlot = null;

    const bgColor = document.getElementById('bgColor');
    if (bgColor) bgColor.value = '#ffffff';

    const textInput = document.getElementById('textInput');
    if (textInput) textInput.value = '';

    document.querySelectorAll('.template-option').forEach((opt, index) => {
        opt.classList.toggle('active', index === 0);
    });

    renderPhotoGallery();
    renderCollage();
    saveToLocalStorage();
}

// Save to localStorage
function saveToLocalStorage() {
    try {
        const saveData = {
            photos: state.uploadedPhotos.map(p => ({
                id: p.id,
                src: p.src,
                slotIndex: p.slotIndex,
                offsetX: p.offsetX,
                offsetY: p.offsetY,
                scale: p.scale
            })),
            textOverlays: state.textOverlays,
            currentTemplate: state.currentTemplate,
            backgroundColor: state.backgroundColor
        };
        localStorage.setItem('photoCollage', JSON.stringify(saveData));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Load from localStorage
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('photoCollage');
        if (!saved) return;

        const data = JSON.parse(saved);

        state.currentTemplate = data.currentTemplate || 0;
        state.backgroundColor = data.backgroundColor || '#ffffff';
        state.textOverlays = data.textOverlays || [];

        const bgColor = document.getElementById('bgColor');
        if (bgColor) bgColor.value = state.backgroundColor;

        document.querySelectorAll('.template-option').forEach((opt, index) => {
            opt.classList.toggle('active', index === state.currentTemplate);
        });

        if (data.photos && data.photos.length > 0) {
            const promises = data.photos.map(photoData => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        resolve({
                            id: photoData.id,
                            src: photoData.src,
                            img: img,
                            slotIndex: photoData.slotIndex,
                            offsetX: photoData.offsetX || 0,
                            offsetY: photoData.offsetY || 0,
                            scale: photoData.scale || 1
                        });
                    };
                    img.onerror = () => resolve(null);
                    img.src = photoData.src;
                });
            });

            Promise.all(promises).then(photos => {
                state.uploadedPhotos = photos.filter(p => p !== null);
                renderPhotoGallery();
                renderCollage();
            });
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}