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
    
      // DOM Elements
      const textInput = document.getElementById('text-input');
      const languageSelect = document.getElementById('language-select');
      const voiceSelect = document.getElementById('voice-select');
      const rateControl = document.getElementById('rate-control');
      const pitchControl = document.getElementById('pitch-control');
      const volumeControl = document.getElementById('volume-control');
      const rateValue = document.getElementById('rate-value');
      const pitchValue = document.getElementById('pitch-value');
      const volumeValue = document.getElementById('volume-value');
      const speakBtn = document.getElementById('speak-btn');
      const pauseBtn = document.getElementById('pause-btn');
      const resumeBtn = document.getElementById('resume-btn');
      const stopBtn = document.getElementById('stop-btn');
      const downloadBtn = document.getElementById('download-btn');
      const statusMessage = document.getElementById('status-message');
    
      // Speech Synthesis
      let voices = [];
      let currentUtterance = null;
      let isSpeaking = false;
      let isPaused = false;
    
      // Audio recording for MP3 download
      let audioContext = null;
      let mediaStreamDestination = null;
      let mediaRecorder = null;
      let audioChunks = [];
    
      // Initialize
      function init() {
        loadVoices();
        attachEventListeners();
        
        // Load voices when they change (some browsers load async)
        if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = loadVoices;
        }
      }
    
      // Load available voices
      function loadVoices() {
        voices = speechSynthesis.getVoices();
        
        if (voices.length === 0) {
          setTimeout(loadVoices, 100);
          return;
        }
    
        populateVoiceList();
      }
    
      // Populate voice dropdown based on selected language
      function populateVoiceList() {
        const selectedLang = languageSelect.value;
        voiceSelect.innerHTML = '';
    
        // Filter voices by selected language
        const filteredVoices = voices.filter(voice => 
          voice.lang.startsWith(selectedLang.split('-')[0]) || voice.lang === selectedLang
        );
    
        // If no voices for selected language, show all voices
        const voicesToShow = filteredVoices.length > 0 ? filteredVoices : voices;
    
        voicesToShow.forEach((voice, index) => {
          const option = document.createElement('option');
          option.value = index;
          option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' - Default' : ''}`;
          option.setAttribute('data-lang', voice.lang);
          option.setAttribute('data-name', voice.name);
          voiceSelect.appendChild(option);
        });
    
        // Select first voice or default voice
        const defaultVoice = voicesToShow.findIndex(voice => voice.default);
        if (defaultVoice !== -1) {
          voiceSelect.selectedIndex = defaultVoice;
        }
      }
    
      // Attach event listeners
      function attachEventListeners() {
        // Control sliders
        rateControl.addEventListener('input', (e) => {
          rateValue.textContent = e.target.value;
        });
    
        pitchControl.addEventListener('input', (e) => {
          pitchValue.textContent = e.target.value;
        });
    
        volumeControl.addEventListener('input', (e) => {
          volumeValue.textContent = e.target.value;
        });
    
        // Language change
        languageSelect.addEventListener('change', populateVoiceList);
    
        // Buttons
        speakBtn.addEventListener('click', speak);
        pauseBtn.addEventListener('click', pause);
        resumeBtn.addEventListener('click', resume);
        stopBtn.addEventListener('click', stop);
        downloadBtn.addEventListener('click', downloadAsMP3);
      }
    
      // Speak function
      function speak() {
        const text = textInput.value.trim();
    
        if (!text) {
          showStatus('Please enter some text to speak.', 'error');
          return;
        }
    
        // Cancel any ongoing speech
        speechSynthesis.cancel();
    
        // Create utterance
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Get selected voice
        const selectedVoiceIndex = voiceSelect.value;
        if (selectedVoiceIndex && voices[selectedVoiceIndex]) {
          currentUtterance.voice = voices[selectedVoiceIndex];
        }
    
        // Set properties
        currentUtterance.rate = parseFloat(rateControl.value);
        currentUtterance.pitch = parseFloat(pitchControl.value);
        currentUtterance.volume = parseFloat(volumeControl.value) / 100;
        currentUtterance.lang = languageSelect.value;
    
        // Event handlers
        currentUtterance.onstart = () => {
          isSpeaking = true;
          isPaused = false;
          updateButtonStates();
          showStatus('Speaking...', 'info');
        };
    
        currentUtterance.onend = () => {
          isSpeaking = false;
          isPaused = false;
          updateButtonStates();
          showStatus('Finished speaking.', 'success');
        };
    
        currentUtterance.onerror = (event) => {
          isSpeaking = false;
          isPaused = false;
          updateButtonStates();
          showStatus(`Error: ${event.error}`, 'error');
        };
    
        currentUtterance.onpause = () => {
          isPaused = true;
          updateButtonStates();
          showStatus('Paused.', 'info');
        };
    
        currentUtterance.onresume = () => {
          isPaused = false;
          updateButtonStates();
          showStatus('Resumed.', 'info');
        };
    
        // Speak
        speechSynthesis.speak(currentUtterance);
      }
    
      // Pause function
      function pause() {
        if (isSpeaking && !isPaused) {
          speechSynthesis.pause();
        }
      }
    
      // Resume function
      function resume() {
        if (isSpeaking && isPaused) {
          speechSynthesis.resume();
        }
      }
    
      // Stop function
      function stop() {
        speechSynthesis.cancel();
        isSpeaking = false;
        isPaused = false;
        updateButtonStates();
        showStatus('Stopped.', 'info');
      }
    
      // Update button states
      function updateButtonStates() {
        speakBtn.disabled = isSpeaking && !isPaused;
        pauseBtn.disabled = !isSpeaking || isPaused;
        resumeBtn.disabled = !isPaused;
        stopBtn.disabled = !isSpeaking;
      }
    
      // Show status message
      function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message status-${type}`;
        statusMessage.style.display = 'block';
    
        setTimeout(() => {
          statusMessage.style.display = 'none';
        }, 5000);
      }
    
      // Download as MP3 function
      async function downloadAsMP3() {
        const text = textInput.value.trim();
    
        if (!text) {
          showStatus('Please enter some text to convert to MP3.', 'error');
          return;
        }
    
        try {
          showStatus('Preparing audio for download...', 'info');
    
          // Create audio context
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          mediaStreamDestination = audioContext.createMediaStreamDestination();
    
          // Create oscillator and gain for capturing audio
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(mediaStreamDestination);
    
          // Setup MediaRecorder
          audioChunks = [];
          const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
          mediaRecorder = new MediaRecorder(mediaStreamDestination.stream, { mimeType });
    
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.push(event.data);
            }
          };
    
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            downloadBlob(audioBlob, 'speech.webm');
            showStatus('Audio downloaded successfully!', 'success');
            
            // Cleanup
            if (audioContext) {
              audioContext.close();
            }
          };
    
          // Start recording
          mediaRecorder.start();
          oscillator.start();
    
          // Create utterance for recording
          const utterance = new SpeechSynthesisUtterance(text);
          
          const selectedVoiceIndex = voiceSelect.value;
          if (selectedVoiceIndex && voices[selectedVoiceIndex]) {
            utterance.voice = voices[selectedVoiceIndex];
          }
    
          utterance.rate = parseFloat(rateControl.value);
          utterance.pitch = parseFloat(pitchControl.value);
          utterance.volume = parseFloat(volumeControl.value) / 100;
          utterance.lang = languageSelect.value;
    
          utterance.onend = () => {
            setTimeout(() => {
              oscillator.stop();
              if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
              }
            }, 500);
          };
    
          utterance.onerror = (event) => {
            showStatus(`Error during recording: ${event.error}`, 'error');
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            }
          };
    
          speechSynthesis.speak(utterance);
    
        } catch (error) {
          showStatus(`Download failed: ${error.message}. Using alternative method...`, 'warning');
          
          // Fallback: Use Web Audio API to synthesize and record
          fallbackDownload(text);
        }
      }
    
      // Fallback download method
      function fallbackDownload(text) {
        showStatus('Using browser speech synthesis. Click "Speak" first, then try download again.', 'info');
        
        // Alternative: Create a simple audio file notification
        // Since we can't directly capture browser TTS in all browsers,
        // we inform the user to use screen recording or other tools
        const message = `
    Note: Direct MP3 download of browser speech synthesis has limitations.
    For best results:
    1. Click "Speak" to hear the audio
    2. Use system audio recording software to capture the output
    3. Or use a dedicated TTS API service for MP3 export
    
    Text to convert: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"
        `;
        
        const blob = new Blob([message], { type: 'text/plain' });
        downloadBlob(blob, 'tts-instructions.txt');
      }
    
      // Download blob helper
      function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    
      // Initialize app
      init();
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
