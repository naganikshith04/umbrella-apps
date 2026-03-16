// Timeline Creator JavaScript

class TimelineCreator {
    constructor() {
        this.events = this.loadEvents();
        this.zoomLevel = 1;
        this.currentStyle = 'horizontal';
        this.editingEventId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTimeline();
        this.renderEventList();
        this.updateDisplayTitle();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEventSubmit();
        });

        // Timeline style change
        document.getElementById('timeline-style').addEventListener('change', (e) => {
            this.currentStyle = e.target.value;
            this.renderTimeline();
        });

        // Timeline title change
        document.getElementById('timeline-title').addEventListener('input', (e) => {
            this.updateDisplayTitle();
        });

        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
            this.applyZoom();
        });

        document.getElementById('zoom-out').addEventListener('click', () => {
            this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
            this.applyZoom();
        });

        document.getElementById('reset-view').addEventListener('click', () => {
            this.zoomLevel = 1;
            this.applyZoom();
            document.getElementById('timeline-container').scrollLeft = 0;
            document.getElementById('timeline-container').scrollTop = 0;
        });

        // Export functions
        document.getElementById('export-image').addEventListener('click', () => {
            this.exportAsImage();
        });

        document.getElementById('export-pdf').addEventListener('click', () => {
            this.exportAsPDF();
        });

        // Clear timeline
        document.getElementById('clear-timeline').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all events?')) {
                this.events = [];
                this.saveEvents();
                this.renderTimeline();
                this.renderEventList();
            }
        });

        // Modal close
        document.getElementById('event-modal').addEventListener('click', (e) => {
            if (e.target.id === 'event-modal') {
                this.closeModal();
            }
        });

        // Edit and delete buttons
        document.getElementById('edit-event').addEventListener('click', () => {
            this.editModalEvent();
        });

        document.getElementById('delete-event').addEventListener('click', () => {
            this.deleteModalEvent();
        });

        // Image upload preview
        document.getElementById('event-image').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });
    }

    handleEventSubmit() {
        const title = document.getElementById('event-title').value.trim();
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const description = document.getElementById('event-description').value.trim();
        const color = document.getElementById('event-color').value;
        const imageInput = document.getElementById('event-image');

        if (!title || !date) {
            alert('Please provide at least a title and date for the event.');
            return;
        }

        const event = {
            id: Date.now(),
            title,
            date,
            time,
            description,
            color,
            image: imageInput.dataset.imageData || null
        };

        this.events.push(event);
        this.events.sort((a, b) => new Date(a.date + ' ' + (a.time || '00:00')) - new Date(b.date + ' ' + (b.time || '00:00')));
        this.saveEvents();
        this.renderTimeline();
        this.renderEventList();
        this.resetForm();
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('event-image').dataset.imageData = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    resetForm() {
        document.getElementById('event-form').reset();
        document.getElementById('event-image').dataset.imageData = '';
        document.getElementById('event-color').value = '#3498db';
    }

    renderTimeline() {
        const container = document.getElementById('timeline-events');
        container.innerHTML = '';
        container.className = `timeline-${this.currentStyle}`;

        if (this.events.length === 0) {
            container.innerHTML = '<div class="empty-timeline">No events yet. Add your first event to get started!</div>';
            return;
        }

        this.events.forEach((event, index) => {
            const eventElement = this.createTimelineEvent(event, index);
            container.appendChild(eventElement);
        });
    }

    createTimelineEvent(event, index) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'timeline-event';
        eventDiv.dataset.eventId = event.id;
        eventDiv.style.setProperty('--event-color', event.color);

        const dateObj = new Date(event.date + ' ' + (event.time || '00:00'));
        const formattedDate = this.formatDate(dateObj);
        const formattedTime = event.time ? this.formatTime(event.time) : '';

        eventDiv.innerHTML = `
            <div class="event-marker" style="background-color: ${event.color}"></div>
            <div class="event-content">
                <div class="event-date-badge">${formattedDate}</div>
                ${formattedTime ? `<div class="event-time-badge">${formattedTime}</div>` : ''}
                <h3 class="event-title-display">${this.escapeHtml(event.title)}</h3>
                ${event.description ? `<p class="event-description-display">${this.escapeHtml(event.description)}</p>` : ''}
                ${event.image ? `<img src="${event.image}" alt="${this.escapeHtml(event.title)}" class="event-image-display">` : ''}
            </div>
        `;

        eventDiv.addEventListener('click', () => {
            this.openModal(event);
        });

        return eventDiv;
    }

    renderEventList() {
        const list = document.getElementById('event-list');
        list.innerHTML = '';

        if (this.events.length === 0) {
            list.innerHTML = '<div class="empty-list">No events added yet</div>';
            return;
        }

        this.events.forEach(event => {
            const listItem = document.createElement('div');
            listItem.className = 'event-list-item';
            listItem.dataset.eventId = event.id;

            const dateObj = new Date(event.date + ' ' + (event.time || '00:00'));
            const formattedDate = this.formatDate(dateObj);

            listItem.innerHTML = `
                <div class="event-list-marker" style="background-color: ${event.color}"></div>
                <div class="event-list-content">
                    <div class="event-list-title">${this.escapeHtml(event.title)}</div>
                    <div class="event-list-date">${formattedDate}</div>
                </div>
            `;

            listItem.addEventListener('click', () => {
                this.openModal(event);
                document.querySelector(`[data-event-id="${event.id}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            list.appendChild(listItem);
        });
    }

    openModal(event) {
        const modal = document.getElementById('event-modal');
        document.getElementById('modal-title').textContent = event.title;
        
        const dateObj = new Date(event.date + ' ' + (event.time || '00:00'));
        const formattedDate = this.formatDate(dateObj);
        const formattedTime = event.time ? this.formatTime(event.time) : '';
        
        document.getElementById('modal-date').textContent = formattedDate + (formattedTime ? ' at ' + formattedTime : '');
        document.getElementById('modal-description').textContent = event.description || 'No description provided';
        
        const modalImage = document.getElementById('modal-image');
        if (event.image) {
            modalImage.src = event.image;
            modalImage.style.display = 'block';
        } else {
            modalImage.style.display = 'none';
        }

        modal.dataset.eventId = event.id;
        modal.style.display = 'flex';
    }

    closeModal() {
        document.getElementById('event-modal').style.display = 'none';
        this.editingEventId = null;
    }

    editModalEvent() {
        const eventId = parseInt(document.getElementById('event-modal').dataset.eventId);
        const event = this.events.find(e => e.id === eventId);
        
        if (event) {
            document.getElementById('event-title').value = event.title;
            document.getElementById('event-date').value = event.date;
            document.getElementById('event-time').value = event.time || '';
            document.getElementById('event-description').value = event.description || '';
            document.getElementById('event-color').value = event.color;
            
            if (event.image) {
                document.getElementById('event-image').dataset.imageData = event.image;
            }

            this.events = this.events.filter(e => e.id !== eventId);
            this.saveEvents();
            this.renderTimeline();
            this.renderEventList();
            this.closeModal();
            
            document.getElementById('event-title').focus();
        }
    }

    deleteModalEvent() {
        if (confirm('Are you sure you want to delete this event?')) {
            const eventId = parseInt(document.getElementById('event-modal').dataset.eventId);
            this.events = this.events.filter(e => e.id !== eventId);
            this.saveEvents();
            this.renderTimeline();
            this.renderEventList();
            this.closeModal();
        }
    }

    updateDisplayTitle() {
        const title = document.getElementById('timeline-title').value.trim() || 'My Timeline';
        document.getElementById('display-title').textContent = title;
    }

    applyZoom() {
        const container = document.getElementById('timeline-events');
        container.style.transform = `scale(${this.zoomLevel})`;
        container.style.transformOrigin = 'top left';
    }

    async exportAsImage() {
        try {
            const element = document.getElementById('timeline-container');
            const originalOverflow = element.style.overflow;
            element.style.overflow = 'visible';

            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true
            });

            element.style.overflow = originalOverflow;

            canvas.toBlob((blob) => {
                saveAs(blob, 'timeline.png');
            });
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export as image. Please try again.');
        }
    }

    async exportAsPDF() {
        try {
            const element = document.getElementById('timeline-container');
            const originalOverflow = element.style.overflow;
            element.style.overflow = 'visible';

            const opt = {
                margin: 10,
                filename: 'timeline.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            };

            await html2pdf().set(opt).from(element).save();
            element.style.overflow = originalOverflow;
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export as PDF. Please try again.');
        }
    }

    formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveEvents() {
        localStorage.setItem('timelineEvents', JSON.stringify(this.events));
    }

    loadEvents() {
        const saved = localStorage.getItem('timelineEvents');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the timeline creator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TimelineCreator();
});