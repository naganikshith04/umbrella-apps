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
    // Meeting Scheduler Application
    class MeetingScheduler {
      constructor() {
        this.meetings = this.loadMeetings();
        this.currentFilter = 'all';
        this.calendarIntegrations = {
          google: { connected: false, token: null },
          outlook: { connected: false, token: null }
        };
        this.init();
      }
    
      init() {
        this.setupEventListeners();
        this.renderMeetings();
        this.loadCalendarIntegrations();
      }
    
      setupEventListeners() {
        // Form submission
        const form = document.getElementById('meetingForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    
        // Filter change
        const filterType = document.getElementById('filterType');
        filterType.addEventListener('change', (e) => this.handleFilterChange(e));
    
        // Calendar integration buttons
        const googleBtn = document.getElementById('googleCalendarBtn');
        const outlookBtn = document.getElementById('outlookCalendarBtn');
        
        googleBtn.addEventListener('click', () => this.handleCalendarIntegration('google'));
        outlookBtn.addEventListener('click', () => this.handleCalendarIntegration('outlook'));
    
        // Modal controls
        const modalClose = document.getElementById('modalClose');
        const modalCancelBtn = document.getElementById('modalCancelBtn');
        const modal = document.getElementById('calendarModal');
        
        modalClose.addEventListener('click', () => this.closeModal());
        modalCancelBtn.addEventListener('click', () => this.closeModal());
        
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeModal();
          }
        });
    
        // Authorization button
        const authorizeBtn = document.getElementById('authorizeBtn');
        authorizeBtn.addEventListener('click', () => this.handleAuthorization());
      }
    
      handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const meeting = {
          id: Date.now().toString(),
          title: formData.get('meetingTitle'),
          date: formData.get('meetingDate'),
          startTime: formData.get('startTime'),
          endTime: formData.get('endTime'),
          participants: formData.get('participants').split(',').map(p => p.trim()).filter(p => p),
          description: formData.get('description'),
          location: formData.get('location'),
          createdAt: new Date().toISOString()
        };
    
        // Validate times
        if (!this.validateTimes(meeting.startTime, meeting.endTime)) {
          this.showToast('End time must be after start time', 'error');
          return;
        }
    
        this.meetings.push(meeting);
        this.saveMeetings();
        this.renderMeetings();
        e.target.reset();
        this.showToast('Meeting scheduled successfully!', 'success');
      }
    
      validateTimes(startTime, endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        return end > start;
      }
    
      handleFilterChange(e) {
        this.currentFilter = e.target.value;
        this.renderMeetings();
      }
    
      filterMeetings() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
    
        switch (this.currentFilter) {
          case 'upcoming':
            return this.meetings.filter(m => {
              const meetingDateTime = new Date(`${m.date}T${m.startTime}`);
              return meetingDateTime >= now;
            });
          case 'past':
            return this.meetings.filter(m => {
              const meetingDateTime = new Date(`${m.date}T${m.endTime}`);
              return meetingDateTime < now;
            });
          case 'today':
            return this.meetings.filter(m => m.date === today);
          default:
            return this.meetings;
        }
      }
    
      renderMeetings() {
        const meetingsList = document.getElementById('meetingsList');
        const emptyState = document.getElementById('emptyState');
        const filteredMeetings = this.filterMeetings();
    
        if (filteredMeetings.length === 0) {
          meetingsList.innerHTML = '';
          emptyState.style.display = 'flex';
          return;
        }
    
        emptyState.style.display = 'none';
        
        // Sort meetings by date and time
        filteredMeetings.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.startTime}`);
          const dateB = new Date(`${b.date}T${b.startTime}`);
          return dateA - dateB;
        });
    
        meetingsList.innerHTML = filteredMeetings.map(meeting => this.createMeetingCard(meeting)).join('');
    
        // Add event listeners to delete buttons
        filteredMeetings.forEach(meeting => {
          const deleteBtn = document.getElementById(`delete-${meeting.id}`);
          const exportGoogleBtn = document.getElementById(`export-google-${meeting.id}`);
          const exportOutlookBtn = document.getElementById(`export-outlook-${meeting.id}`);
          
          if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteMeeting(meeting.id));
          }
          if (exportGoogleBtn) {
            exportGoogleBtn.addEventListener('click', () => this.exportToCalendar(meeting, 'google'));
          }
          if (exportOutlookBtn) {
            exportOutlookBtn.addEventListener('click', () => this.exportToCalendar(meeting, 'outlook'));
          }
        });
      }
    
      createMeetingCard(meeting) {
        const meetingDate = new Date(`${meeting.date}T${meeting.startTime}`);
        const isPast = meetingDate < new Date();
        const formattedDate = this.formatDate(meeting.date);
        
        return `
          <div class="meeting-card ${isPast ? 'past-meeting' : ''}">
            <div class="meeting-header">
              <h3 class="meeting-title">${this.escapeHtml(meeting.title)}</h3>
              <div class="meeting-actions">
                <button class="btn-icon export-btn" id="export-google-${meeting.id}" title="Export to Google Calendar">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#4285F4"/>
                  </svg>
                </button>
                <button class="btn-icon export-btn" id="export-outlook-${meeting.id}" title="Export to Outlook Calendar">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#0078D4"/>
                  </svg>
                </button>
                <button class="btn-icon delete-btn" id="delete-${meeting.id}" title="Delete meeting">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="meeting-details">
              <div class="meeting-detail">
                <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" fill="currentColor"/>
                </svg>
                <span>${formattedDate}</span>
              </div>
              <div class="meeting-detail">
                <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
                </svg>
                <span>${meeting.startTime} - ${meeting.endTime}</span>
              </div>
              ${meeting.location ? `
                <div class="meeting-detail">
                  <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                  </svg>
                  <span>${this.escapeHtml(meeting.location)}</span>
                </div>
              ` : ''}
              ${meeting.participants.length > 0 ? `
                <div class="meeting-detail">
                  <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                  </svg>
                  <span>${meeting.participants.length} participant(s)</span>
                </div>
              ` : ''}
            </div>
            ${meeting.description ? `
              <div class="meeting-description">
                <p>${this.escapeHtml(meeting.description)}</p>
              </div>
            ` : ''}
          </div>
        `;
      }
    
      deleteMeeting(id) {
        if (confirm('Are you sure you want to delete this meeting?')) {
          this.meetings = this.meetings.filter(m => m.id !== id);
          this.saveMeetings();
          this.renderMeetings();
          this.showToast('Meeting deleted successfully', 'success');
        }
      }
    
      // Calendar Integration Methods
      handleCalendarIntegration(provider) {
        const integration = this.calendarIntegrations[provider];
        
        if (!integration.connected) {
          this.showCalendarModal(provider);
        } else {
          this.showToast(`${provider === 'google' ? 'Google' : 'Outlook'} Calendar is already connected`, 'info');
          this.updateCalendarStatus();
        }
      }
    
      showCalendarModal(provider) {
        const modal = document.getElementById('calendarModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const authSection = document.getElementById('calendarAuthSection');
        const successSection = document.getElementById('calendarSuccessSection');
        
        modalTitle.textContent = `Connect ${provider === 'google' ? 'Google' : 'Outlook'} Calendar`;
        modalMessage.innerHTML = `<p>Connect your ${provider === 'google' ? 'Google' : 'Outlook'} Calendar to automatically sync your meetings.</p>`;
        
        authSection.style.display = 'block';
        successSection.style.display = 'none';
        
        modal.style.display = 'flex';
        modal.dataset.provider = provider;
      }
    
      handleAuthorization() {
        const modal = document.getElementById('calendarModal');
        const provider = modal.dataset.provider;
        
        // Simulate OAuth flow
        this.showToast('Connecting to calendar...', 'info');
        
        setTimeout(() => {
          // Simulate successful authorization
          const token = this.generateMockToken();
          this.calendarIntegrations[provider] = {
            connected: true,
            token: token,
            connectedAt: new Date().toISOString()
          };
          
          this.saveCalendarIntegrations();
          this.updateCalendarStatus();
          
          // Show success in modal
          const authSection = document.getElementById('calendarAuthSection');
          const successSection = document.getElementById('calendarSuccessSection');
          const calendarDetails = document.getElementById('calendarDetails');
          
          authSection.style.display = 'none';
          successSection.style.display = 'block';
          
          calendarDetails.innerHTML = `
            <p><strong>Provider:</strong> ${provider === 'google' ? 'Google Calendar' : 'Outlook Calendar'}</p>
            <p><strong>Status:</strong> Connected</p>
            <p><strong>Connected at:</strong> ${new Date().toLocaleString()}</p>
          `;
          
          this.showToast(`${provider === 'google' ? 'Google' : 'Outlook'} Calendar connected successfully!`, 'success');
        }, 1500);
      }
    
      exportToCalendar(meeting, provider) {
        const integration = this.calendarIntegrations[provider];
        
        if (!integration.connected) {
          this.showToast(`Please connect your ${provider === 'google' ? 'Google' : 'Outlook'} Calendar first`, 'error');
          this.handleCalendarIntegration(provider);
          return;
        }
    
        // Simulate export
        this.showToast('Exporting to calendar...', 'info');
        
        setTimeout(() => {
          // Create calendar event data
          const eventData = this.createCalendarEvent(meeting, provider);
          
          // In a real implementation, this would make an API call
          console.log(`Exporting to ${provider}:`, eventData);
          
          this.showToast(`Meeting exported to ${provider === 'google' ? 'Google' : 'Outlook'} Calendar!`, 'success');
          
          // Show modal with details
          this.showExportSuccessModal(meeting, provider);
        }, 1000);
      }
    
      createCalendarEvent(meeting, provider) {
        const startDateTime = new Date(`${meeting.date}T${meeting.startTime}`);
        const endDateTime = new Date(`${meeting.date}T${meeting.endTime}`);
        
        const event = {
          summary: meeting.title,
          description: meeting.description || '',
          location: meeting.location || '',
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          attendees: meeting.participants.map(email => ({ email })),
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 30 }
            ]
          }
        };
        
        return event;
      }
    
      showExportSuccessModal(meeting, provider) {
        const modal = document.getElementById('calendarModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const authSection = document.getElementById('calendarAuthSection');
        const successSection = document.getElementById('calendarSuccessSection');
        const calendarDetails = document.getElementById('calendarDetails');
        
        modalTitle.textContent = 'Export Successful';
        modalMessage.innerHTML = '';
        
        authSection.style.display = 'none';
        successSection.style.display = 'block';
        
        calendarDetails.innerHTML = `
          <p><strong>Meeting:</strong> ${this.escapeHtml(meeting.title)}</p>
          <p><strong>Date:</strong> ${this.formatDate(meeting.date)}</p>
          <p><strong>Time:</strong> ${meeting.startTime} - ${meeting.endTime}</p>
          <p><strong>Exported to:</strong> ${provider === 'google' ? 'Google Calendar' : 'Outlook Calendar'}</p>
        `;
        
        modal.style.display = 'flex';
      }
    
      updateCalendarStatus() {
        const statusDiv = document.getElementById('calendarStatus');
        const googleConnected = this.calendarIntegrations.google.connected;
        const outlookConnected = this.calendarIntegrations.outlook.connected;
        
        let statusHTML = '<div class="calendar-status-items">';
        
        if (googleConnected) {
          statusHTML += '<div class="status-item connected"><span class="status-dot"></span>Google Calendar Connected</div>';
        }
        
        if (outlookConnected) {
          statusHTML += '<div class="status-item connected"><span class="status-dot"></span>Outlook Calendar Connected</div>';
        }
        
        if (!googleConnected && !outlookConnected) {
          statusHTML += '<div class="status-item disconnected"><span class="status-dot"></span>No calendars connected</div>';
        }
        
        statusHTML += '</div>';
        statusDiv.innerHTML = statusHTML;
      }
    
      closeModal() {
        const modal = document.getElementById('calendarModal');
        modal.style.display = 'none';
      }
    
      generateMockToken() {
        return 'mock_token_' + Math.random().toString(36).substring(2, 15);
      }
    
      loadCalendarIntegrations() {
        const saved = localStorage.getItem('calendarIntegrations');
        if (saved) {
          this.calendarIntegrations = JSON.parse(saved);
        }
        this.updateCalendarStatus();
      }
    
      saveCalendarIntegrations() {
        localStorage.setItem('calendarIntegrations', JSON.stringify(this.calendarIntegrations));
      }
    
      // Utility Methods
      formatDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      }
    
      escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
    
      showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast toast-${type} show`;
        
        setTimeout(() => {
          toast.className = 'toast';
        }, 3000);
      }
    
      loadMeetings() {
        const saved = localStorage.getItem('meetings');
        return saved ? JSON.parse(saved) : [];
      }
    
      saveMeetings() {
        localStorage.setItem('meetings', JSON.stringify(this.meetings));
      }
    }
    
    // Initialize the application when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      new MeetingScheduler();
    });
    
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
