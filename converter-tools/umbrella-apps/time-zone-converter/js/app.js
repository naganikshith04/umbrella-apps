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
    
      // Time zone data with DST information
      const timeZones = [
        { value: 'Pacific/Midway', label: '(UTC-11:00) Midway Island', offset: -11, dst: false },
        { value: 'Pacific/Honolulu', label: '(UTC-10:00) Hawaii', offset: -10, dst: false },
        { value: 'America/Anchorage', label: '(UTC-09:00) Alaska', offset: -9, dst: true },
        { value: 'America/Los_Angeles', label: '(UTC-08:00) Pacific Time (US & Canada)', offset: -8, dst: true },
        { value: 'America/Denver', label: '(UTC-07:00) Mountain Time (US & Canada)', offset: -7, dst: true },
        { value: 'America/Chicago', label: '(UTC-06:00) Central Time (US & Canada)', offset: -6, dst: true },
        { value: 'America/New_York', label: '(UTC-05:00) Eastern Time (US & Canada)', offset: -5, dst: true },
        { value: 'America/Caracas', label: '(UTC-04:00) Caracas', offset: -4, dst: false },
        { value: 'America/Santiago', label: '(UTC-04:00) Santiago', offset: -4, dst: true },
        { value: 'America/Sao_Paulo', label: '(UTC-03:00) Brasilia', offset: -3, dst: true },
        { value: 'America/Argentina/Buenos_Aires', label: '(UTC-03:00) Buenos Aires', offset: -3, dst: false },
        { value: 'Atlantic/South_Georgia', label: '(UTC-02:00) Mid-Atlantic', offset: -2, dst: false },
        { value: 'Atlantic/Azores', label: '(UTC-01:00) Azores', offset: -1, dst: true },
        { value: 'Europe/London', label: '(UTC+00:00) London', offset: 0, dst: true },
        { value: 'Europe/Paris', label: '(UTC+01:00) Paris', offset: 1, dst: true },
        { value: 'Europe/Berlin', label: '(UTC+01:00) Berlin', offset: 1, dst: true },
        { value: 'Europe/Athens', label: '(UTC+02:00) Athens', offset: 2, dst: true },
        { value: 'Africa/Cairo', label: '(UTC+02:00) Cairo', offset: 2, dst: false },
        { value: 'Europe/Moscow', label: '(UTC+03:00) Moscow', offset: 3, dst: false },
        { value: 'Asia/Dubai', label: '(UTC+04:00) Dubai', offset: 4, dst: false },
        { value: 'Asia/Karachi', label: '(UTC+05:00) Karachi', offset: 5, dst: false },
        { value: 'Asia/Kolkata', label: '(UTC+05:30) Mumbai, Kolkata', offset: 5.5, dst: false },
        { value: 'Asia/Dhaka', label: '(UTC+06:00) Dhaka', offset: 6, dst: false },
        { value: 'Asia/Bangkok', label: '(UTC+07:00) Bangkok', offset: 7, dst: false },
        { value: 'Asia/Singapore', label: '(UTC+08:00) Singapore', offset: 8, dst: false },
        { value: 'Asia/Hong_Kong', label: '(UTC+08:00) Hong Kong', offset: 8, dst: false },
        { value: 'Asia/Tokyo', label: '(UTC+09:00) Tokyo', offset: 9, dst: false },
        { value: 'Australia/Sydney', label: '(UTC+10:00) Sydney', offset: 10, dst: true },
        { value: 'Pacific/Auckland', label: '(UTC+12:00) Auckland', offset: 12, dst: true }
      ];
    
      let activeSlots = 1;
      const MAX_SLOTS = 6;
    
      // Initialize the app
      function init() {
        populateTimeZoneSelects();
        setCurrentTime();
        setupEventListeners();
        updateConversions();
      }
    
      // Populate all timezone dropdowns
      function populateTimeZoneSelects() {
        const sourceSelect = document.getElementById('source-timezone');
        const targetSelects = document.querySelectorAll('.target-timezone');
        
        // Populate source timezone
        timeZones.forEach(tz => {
          const option = document.createElement('option');
          option.value = tz.value;
          option.textContent = tz.label;
          sourceSelect.appendChild(option.cloneNode(true));
        });
    
        // Set default to user's timezone or New York
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const defaultTz = timeZones.find(tz => tz.value === userTimeZone);
        sourceSelect.value = defaultTz ? defaultTz.value : 'America/New_York';
    
        // Populate target timezones
        targetSelects.forEach((select, index) => {
          timeZones.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz.value;
            option.textContent = tz.label;
            select.appendChild(option.cloneNode(true));
          });
          
          // Set different default timezones for variety
          const defaults = ['Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'America/Los_Angeles', 'Asia/Dubai', 'America/Sao_Paulo'];
          select.value = defaults[index] || timeZones[index].value;
        });
      }
    
      // Set current time in the input
      function setCurrentTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
        document.getElementById('source-time').value = dateTimeString;
      }
    
      // Setup event listeners
      function setupEventListeners() {
        document.getElementById('source-time').addEventListener('change', updateConversions);
        document.getElementById('source-timezone').addEventListener('change', updateConversions);
        document.getElementById('use-current-time').addEventListener('click', () => {
          setCurrentTime();
          updateConversions();
        });
        document.getElementById('add-timezone').addEventListener('click', addTimeZoneSlot);
        document.getElementById('clear-all').addEventListener('click', clearAll);
        document.getElementById('copy-times').addEventListener('click', copyAllTimes);
    
        // Delegate event for target timezone changes and remove buttons
        document.getElementById('timezone-slots').addEventListener('change', (e) => {
          if (e.target.classList.contains('target-timezone')) {
            updateConversions();
          }
        });
    
        document.getElementById('timezone-slots').addEventListener('click', (e) => {
          if (e.target.classList.contains('remove-slot')) {
            const slot = e.target.closest('.timezone-slot');
            removeTimeZoneSlot(slot);
          }
        });
      }
    
      // Check if a date is in DST for a given timezone
      function isDST(date, timeZone) {
        const jan = new Date(date.getFullYear(), 0, 1);
        const jul = new Date(date.getFullYear(), 6, 1);
        
        const janOffset = getTimezoneOffset(jan, timeZone);
        const julOffset = getTimezoneOffset(jul, timeZone);
        const currentOffset = getTimezoneOffset(date, timeZone);
        
        const maxOffset = Math.max(janOffset, julOffset);
        return currentOffset < maxOffset;
      }
    
      // Get timezone offset for a specific date and timezone
      function getTimezoneOffset(date, timeZone) {
        const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
        return (utcDate.getTime() - tzDate.getTime()) / 60000; // in minutes
      }
    
      // Update DST status display
      function updateDSTStatus(sourceDate, sourceTimeZone) {
        const dstStatusEl = document.getElementById('dst-status');
        const dstDetailsEl = document.getElementById('dst-details');
        
        const tzInfo = timeZones.find(tz => tz.value === sourceTimeZone);
        
        if (!tzInfo || !tzInfo.dst) {
          dstStatusEl.textContent = 'No DST';
          dstStatusEl.className = 'dst-status no-dst';
          dstDetailsEl.textContent = 'This timezone does not observe Daylight Saving Time';
          return;
        }
    
        const inDST = isDST(sourceDate, sourceTimeZone);
        
        if (inDST) {
          dstStatusEl.textContent = 'Active (DST)';
          dstStatusEl.className = 'dst-status active-dst';
          dstDetailsEl.textContent = 'Daylight Saving Time is currently active in this timezone';
        } else {
          dstStatusEl.textContent = 'Standard Time';
          dstStatusEl.className = 'dst-status standard-time';
          dstDetailsEl.textContent = 'Standard Time is currently in effect';
        }
      }
    
      // Add timezone slot
      function addTimeZoneSlot() {
        if (activeSlots >= MAX_SLOTS) {
          document.querySelector('.slot-limit-message').style.display = 'block';
          setTimeout(() => {
            document.querySelector('.slot-limit-message').style.display = 'none';
          }, 3000);
          return;
        }
    
        const slotsContainer = document.getElementById('timezone-slots');
        const newSlot = document.createElement('div');
        newSlot.className = 'timezone-slot';
        newSlot.dataset.slot = activeSlots;
        
        newSlot.innerHTML = `
          <div class="slot-header">
            <select class="target-timezone"></select>
            <button class="remove-slot">×</button>
          </div>
          <div class="converted-time"></div>
          <div class="time-difference"></div>
          <div class="dst-badge"></div>
        `;
        
        slotsContainer.appendChild(newSlot);
        
        // Populate the new select
        const select = newSlot.querySelector('.target-timezone');
        timeZones.forEach(tz => {
          const option = document.createElement('option');
          option.value = tz.value;
          option.textContent = tz.label;
          select.appendChild(option);
        });
        
        // Set a different default
        const usedTimezones = Array.from(document.querySelectorAll('.target-timezone'))
          .slice(0, -1)
          .map(s => s.value);
        const availableTz = timeZones.find(tz => !usedTimezones.includes(tz.value));
        select.value = availableTz ? availableTz.value : timeZones[activeSlots % timeZones.length].value;
        
        activeSlots++;
        
        if (activeSlots >= MAX_SLOTS) {
          document.getElementById('add-timezone').disabled = true;
          document.getElementById('add-timezone').textContent = 'Maximum Reached';
        }
        
        updateConversions();
      }
    
      // Remove timezone slot
      function removeTimeZoneSlot(slot) {
        if (activeSlots <= 1) return; // Keep at least one slot
        
        slot.remove();
        activeSlots--;
        
        document.getElementById('add-timezone').disabled = false;
        document.getElementById('add-timezone').textContent = '+ Add Time Zone';
        
        // Renumber remaining slots
        document.querySelectorAll('.timezone-slot').forEach((s, index) => {
          s.dataset.slot = index;
          if (index === 0) {
            s.querySelector('.remove-slot').style.display = 'none';
          }
        });
      }
    
      // Update all conversions
      function updateConversions() {
        const sourceTimeInput = document.getElementById('source-time').value;
        const sourceTimeZone = document.getElementById('source-timezone').value;
        
        if (!sourceTimeInput) return;
        
        const sourceDate = new Date(sourceTimeInput);
        
        // Update DST status for source timezone
        updateDSTStatus(sourceDate, sourceTimeZone);
        
        // Convert source time to UTC
        const sourceString = sourceDate.toLocaleString('en-US', { timeZone: sourceTimeZone });
        const sourceInTz = new Date(sourceString);
        const utcTime = sourceDate.getTime() - (sourceInTz.getTime() - sourceDate.getTime());
        
        // Update all timezone slots
        const slots = document.querySelectorAll('.timezone-slot');
        slots.forEach(slot => {
          const targetTimeZone = slot.querySelector('.target-timezone').value;
          const convertedTimeEl = slot.querySelector('.converted-time');
          const timeDiffEl = slot.querySelector('.time-difference');
          const dstBadgeEl = slot.querySelector('.dst-badge');
          
          // Convert to target timezone
          const targetDate = new Date(utcTime);
          const options = {
            timeZone: targetTimeZone,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          };
          
          const convertedTime = targetDate.toLocaleString('en-US', options);
          convertedTimeEl.textContent = convertedTime;
          
          // Calculate time difference
          const sourceOffset = getTimezoneOffset(sourceDate, sourceTimeZone);
          const targetOffset = getTimezoneOffset(targetDate, targetTimeZone);
          const diffMinutes = sourceOffset - targetOffset;
          const diffHours = Math.floor(Math.abs(diffMinutes) / 60);
          const diffMins = Math.abs(diffMinutes) % 60;
          
          let diffText = '';
          if (diffMinutes === 0) {
            diffText = 'Same time';
          } else {
            const sign = diffMinutes > 0 ? '+' : '-';
            diffText = `${sign}${diffHours}h ${diffMins > 0 ? diffMins + 'm' : ''}`;
          }
          timeDiffEl.textContent = diffText;
          
          // DST badge
          const tzInfo = timeZones.find(tz => tz.value === targetTimeZone);
          if (tzInfo && tzInfo.dst) {
            const inDST = isDST(targetDate, targetTimeZone);
            if (inDST) {
              dstBadgeEl.textContent = '☀ DST Active';
              dstBadgeEl.className = 'dst-badge dst-active';
            } else {
              dstBadgeEl.textContent = '🌙 Standard Time';
              dstBadgeEl.className = 'dst-badge dst-standard';
            }
          } else {
            dstBadgeEl.textContent = 'No DST';
            dstBadgeEl.className = 'dst-badge dst-none';
          }
        });
      }
    
      // Clear all and reset
      function clearAll() {
        // Remove all slots except the first one
        const slots = document.querySelectorAll('.timezone-slot');
        for (let i = slots.length - 1; i > 0; i--) {
          slots[i].remove();
        }
        activeSlots = 1;
        
        document.getElementById('add-timezone').disabled = false;
        document.getElementById('add-timezone').textContent = '+ Add Time Zone';
        
        setCurrentTime();
        updateConversions();
      }
    
      // Copy all times to clipboard
      function copyAllTimes() {
        const sourceTime = document.getElementById('source-time').value;
        const sourceTimeZone = document.getElementById('source-timezone').value;
        const sourceTzLabel = document.getElementById('source-timezone').selectedOptions[0].textContent;
        
        let copyText = `Source: ${sourceTime} ${sourceTzLabel}\n\n`;
        
        const slots = document.querySelectorAll('.timezone-slot');
        slots.forEach((slot, index) => {
          const tzLabel = slot.querySelector('.target-timezone').selectedOptions[0].textContent;
          const convertedTime = slot.querySelector('.converted-time').textContent;
          const timeDiff = slot.querySelector('.time-difference').textContent;
          const dstStatus = slot.querySelector('.dst-badge').textContent;
          
          copyText += `${index + 1}. ${tzLabel}\n`;
          copyText += `   ${convertedTime}\n`;
          copyText += `   ${timeDiff} | ${dstStatus}\n\n`;
        });
        
        navigator.clipboard.writeText(copyText).then(() => {
          const btn = document.getElementById('copy-times');
          const originalText = btn.textContent;
          btn.textContent = '✓ Copied!';
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy:', err);
        });
      }
    
      // Initialize when DOM is ready
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
