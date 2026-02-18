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
    
      let countdownInterval = null;
      let birthDate = null;
    
      // Set max date to today
      document.getElementById('birthdate').max = new Date().toISOString().split('T')[0];
    
      // Calculate button event
      document.getElementById('calculateBtn').addEventListener('click', calculateAge);
    
      // Share button event
      document.getElementById('shareBtn').addEventListener('click', openShareModal);
    
      // Modal close events
      document.querySelector('.close-modal').addEventListener('click', closeShareModal);
      document.getElementById('shareModal').addEventListener('click', function(e) {
        if (e.target.id === 'shareModal') {
          closeShareModal();
        }
      });
    
      // Share action events
      document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
      document.getElementById('shareTwitter').addEventListener('click', shareOnTwitter);
      document.getElementById('shareFacebook').addEventListener('click', shareOnFacebook);
    
      function calculateAge() {
        const birthdateInput = document.getElementById('birthdate').value;
        
        if (!birthdateInput) {
          alert('Please enter your birth date');
          return;
        }
    
        birthDate = new Date(birthdateInput);
        const today = new Date();
    
        if (birthDate > today) {
          alert('Birth date cannot be in the future');
          return;
        }
    
        // Calculate age
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();
    
        if (days < 0) {
          months--;
          const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          days += prevMonth.getDate();
        }
    
        if (months < 0) {
          years--;
          months += 12;
        }
    
        // Display age
        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
    
        // Calculate totals
        const diffTime = Math.abs(today - birthDate);
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
        const totalMinutes = Math.floor(diffTime / (1000 * 60));
        const totalSeconds = Math.floor(diffTime / 1000);
    
        document.getElementById('totalDays').textContent = totalDays.toLocaleString();
        document.getElementById('totalHours').textContent = totalHours.toLocaleString();
        document.getElementById('totalMinutes').textContent = totalMinutes.toLocaleString();
        document.getElementById('totalSeconds').textContent = totalSeconds.toLocaleString();
    
        // Display milestones
        displayMilestones(years, totalDays);
    
        // Start countdown timer
        startBirthdayCountdown();
    
        // Show results
        document.getElementById('results').style.display = 'block';
      }
    
      function startBirthdayCountdown() {
        // Clear existing interval
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
    
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
      }
    
      function updateCountdown() {
        const today = new Date();
        let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
        // If birthday has passed this year, set to next year
        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1);
        }
    
        // Calculate difference
        const diff = nextBirthday - today;
    
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
        document.getElementById('countdownMonths').textContent = months;
        document.getElementById('countdownDays').textContent = days;
        document.getElementById('countdownHours').textContent = hours;
        document.getElementById('countdownMinutes').textContent = minutes;
        document.getElementById('countdownSeconds').textContent = seconds;
    
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('nextBirthdayDate').textContent = 
          `Your next birthday is on ${nextBirthday.toLocaleDateString('en-US', options)}`;
      }
    
      function displayMilestones(years, totalDays) {
        const milestonesContainer = document.getElementById('milestones');
        const milestones = [];
    
        // Age milestones
        if (years >= 18) milestones.push({ icon: '🎓', text: 'You are an adult!' });
        if (years >= 21) milestones.push({ icon: '🍾', text: 'You can legally drink (in most countries)!' });
        if (years >= 30) milestones.push({ icon: '💼', text: 'Welcome to your 30s!' });
        if (years >= 40) milestones.push({ icon: '🌟', text: 'Fabulous 40s!' });
        if (years >= 50) milestones.push({ icon: '👑', text: 'Golden 50s!' });
        if (years >= 60) milestones.push({ icon: '💎', text: 'Diamond 60s!' });
    
        // Days milestones
        if (totalDays >= 1000) milestones.push({ icon: '🎯', text: `You've lived ${Math.floor(totalDays / 1000)}k+ days!` });
        if (totalDays >= 10000) milestones.push({ icon: '🏆', text: 'Over 10,000 days of life!' });
    
        // Special milestones
        if (totalDays % 365 < 7) milestones.push({ icon: '🎂', text: 'Your birthday is coming soon!' });
        if (years % 10 === 0 && years > 0) milestones.push({ icon: '🎊', text: `Milestone decade: ${years} years!` });
    
        if (milestones.length === 0) {
          milestones.push({ icon: '✨', text: 'Every day is a milestone!' });
        }
    
        milestonesContainer.innerHTML = milestones.map(m => 
          `<div class="milestone-item">
            <span class="milestone-icon">${m.icon}</span>
            <span class="milestone-text">${m.text}</span>
          </div>`
        ).join('');
      }
    
      function openShareModal() {
        const years = document.getElementById('years').textContent;
        const months = document.getElementById('months').textContent;
        const days = document.getElementById('days').textContent;
        const totalDays = document.getElementById('totalDays').textContent;
    
        const shareText = `🎂 My Age Stats:\n\n` +
          `📅 ${years} years, ${months} months, ${days} days\n` +
          `⏱️ ${totalDays} total days lived\n\n` +
          `Calculate your age too! 🎉`;
    
        document.getElementById('shareText').textContent = shareText;
        document.getElementById('shareModal').style.display = 'flex';
      }
    
      function closeShareModal() {
        document.getElementById('shareModal').style.display = 'none';
        document.getElementById('copySuccess').style.display = 'none';
      }
    
      function copyToClipboard() {
        const shareText = document.getElementById('shareText').textContent;
        
        navigator.clipboard.writeText(shareText).then(() => {
          const successMsg = document.getElementById('copySuccess');
          successMsg.style.display = 'block';
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 2000);
        }).catch(err => {
          alert('Failed to copy to clipboard');
        });
      }
    
      function shareOnTwitter() {
        const shareText = document.getElementById('shareText').textContent;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=550,height=420');
      }
    
      function shareOnFacebook() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank', 'width=550,height=420');
      }
    
      // Cleanup on page unload
      window.addEventListener('beforeunload', function() {
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
      });
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
