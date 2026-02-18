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
    
      let selectedFile = null;
      let ffmpeg = null;
      let ffmpegLoaded = false;
      let videoMetadata = null;
    
      const elements = {
        fileInput: document.getElementById('fileInput'),
        fileInfo: document.getElementById('fileInfo'),
        optionsSection: document.getElementById('optionsSection'),
        audioTrackSelect: document.getElementById('audioTrackSelect'),
        resolutionSelect: document.getElementById('resolutionSelect'),
        bitrateSelect: document.getElementById('bitrateSelect'),
        audioBitrateSelect: document.getElementById('audioBitrateSelect'),
        progressSection: document.getElementById('progressSection'),
        progressBar: document.getElementById('progressBar'),
        progressText: document.getElementById('progressText'),
        convertBtn: document.getElementById('convertBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
        resetBtn: document.getElementById('resetBtn'),
        errorMessage: document.getElementById('errorMessage')
      };
    
      // Initialize FFmpeg
      async function loadFFmpeg() {
        try {
          const { createFFmpeg, fetchFile } = FFmpeg;
          ffmpeg = createFFmpeg({
            log: true,
            progress: ({ ratio }) => {
              const percentage = Math.round(ratio * 100);
              elements.progressBar.style.width = percentage + '%';
              elements.progressText.textContent = `Converting: ${percentage}%`;
            }
          });
          
          elements.progressText.textContent = 'Loading FFmpeg...';
          await ffmpeg.load();
          ffmpegLoaded = true;
          elements.progressText.textContent = 'FFmpeg loaded successfully';
        } catch (error) {
          showError('Failed to load FFmpeg: ' + error.message);
        }
      }
    
      // Extract video metadata including audio tracks
      async function extractMetadata(file) {
        try {
          const video = document.createElement('video');
          video.preload = 'metadata';
          
          return new Promise((resolve, reject) => {
            video.onloadedmetadata = async function() {
              const metadata = {
                duration: video.duration,
                width: video.videoWidth,
                height: video.videoHeight,
                audioTracks: []
              };
    
              // Try to get audio tracks using Web APIs
              if (video.audioTracks && video.audioTracks.length > 0) {
                for (let i = 0; i < video.audioTracks.length; i++) {
                  const track = video.audioTracks[i];
                  metadata.audioTracks.push({
                    index: i,
                    label: track.label || `Audio Track ${i + 1}`,
                    language: track.language || 'unknown',
                    enabled: track.enabled
                  });
                }
              } else {
                // Default to single audio track if Web API doesn't provide info
                metadata.audioTracks.push({
                  index: 0,
                  label: 'Audio Track 1',
                  language: 'unknown',
                  enabled: true
                });
              }
    
              URL.revokeObjectURL(video.src);
              resolve(metadata);
            };
    
            video.onerror = function() {
              URL.revokeObjectURL(video.src);
              reject(new Error('Failed to load video metadata'));
            };
    
            video.src = URL.createObjectURL(file);
          });
        } catch (error) {
          throw new Error('Failed to extract metadata: ' + error.message);
        }
      }
    
      // Populate audio track dropdown
      function populateAudioTracks(tracks) {
        elements.audioTrackSelect.innerHTML = '';
        
        if (tracks.length === 0) {
          const option = document.createElement('option');
          option.value = '0';
          option.textContent = 'No Audio';
          elements.audioTrackSelect.appendChild(option);
        } else {
          tracks.forEach((track, index) => {
            const option = document.createElement('option');
            option.value = track.index;
            option.textContent = `${track.label}${track.language !== 'unknown' ? ' (' + track.language + ')' : ''}`;
            if (track.enabled) {
              option.selected = true;
            }
            elements.audioTrackSelect.appendChild(option);
          });
        }
      }
    
      // Handle file selection
      elements.fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;
    
        if (!file.name.toLowerCase().endsWith('.mov')) {
          showError('Please select a valid MOV file');
          return;
        }
    
        selectedFile = file;
        const fileSize = (file.size / (1024 * 1024)).toFixed(2);
        
        elements.fileInfo.innerHTML = `
          <div class="file-details">
            <strong>Selected file:</strong> ${file.name}<br>
            <strong>Size:</strong> ${fileSize} MB<br>
            <span class="loading-metadata">Analyzing file...</span>
          </div>
        `;
    
        try {
          // Extract metadata
          videoMetadata = await extractMetadata(file);
          
          // Update file info with metadata
          elements.fileInfo.innerHTML = `
            <div class="file-details">
              <strong>Selected file:</strong> ${file.name}<br>
              <strong>Size:</strong> ${fileSize} MB<br>
              <strong>Resolution:</strong> ${videoMetadata.width}x${videoMetadata.height}<br>
              <strong>Duration:</strong> ${formatDuration(videoMetadata.duration)}<br>
              <strong>Audio Tracks:</strong> ${videoMetadata.audioTracks.length}
            </div>
          `;
    
          // Populate audio tracks
          populateAudioTracks(videoMetadata.audioTracks);
    
          // Show options section
          elements.optionsSection.style.display = 'block';
          elements.convertBtn.disabled = false;
          elements.errorMessage.style.display = 'none';
    
          // Load FFmpeg if not already loaded
          if (!ffmpegLoaded) {
            await loadFFmpeg();
          }
        } catch (error) {
          showError('Error analyzing file: ' + error.message);
        }
      });
    
      // Format duration helper
      function formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      }
    
      // Drag and drop functionality
      const fileLabel = document.querySelector('.file-label');
      
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileLabel.addEventListener(eventName, preventDefaults, false);
      });
    
      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }
    
      ['dragenter', 'dragover'].forEach(eventName => {
        fileLabel.addEventListener(eventName, () => {
          fileLabel.classList.add('drag-over');
        }, false);
      });
    
      ['dragleave', 'drop'].forEach(eventName => {
        fileLabel.addEventListener(eventName, () => {
          fileLabel.classList.remove('drag-over');
        }, false);
      });
    
      fileLabel.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        elements.fileInput.files = files;
        elements.fileInput.dispatchEvent(new Event('change'));
      }, false);
    
      // Convert button handler
      elements.convertBtn.addEventListener('click', async function() {
        if (!selectedFile || !ffmpegLoaded) return;
    
        try {
          elements.convertBtn.disabled = true;
          elements.progressSection.style.display = 'block';
          elements.errorMessage.style.display = 'none';
          elements.progressBar.style.width = '0%';
          elements.progressText.textContent = 'Preparing conversion...';
    
          // Get selected options
          const audioTrack = elements.audioTrackSelect.value;
          const resolution = elements.resolutionSelect.value;
          const videoBitrate = elements.bitrateSelect.value;
          const audioBitrate = elements.audioBitrateSelect.value;
    
          // Write input file to FFmpeg filesystem
          ffmpeg.FS('writeFile', 'input.mov', await FFmpeg.fetchFile(selectedFile));
    
          // Build FFmpeg command
          const args = ['-i', 'input.mov'];
    
          // Audio track selection
          args.push('-map', '0:v:0'); // Map first video stream
          args.push('-map', `0:a:${audioTrack}`); // Map selected audio stream
    
          // Resolution scaling
          if (resolution !== 'original') {
            const [width, height] = resolution.split('x');
            args.push('-vf', `scale=${width}:${height}`);
          }
    
          // Video bitrate
          if (videoBitrate !== 'auto') {
            args.push('-b:v', `${videoBitrate}k`);
          }
    
          // Audio bitrate
          args.push('-b:a', `${audioBitrate}k`);
    
          // Codec settings
          args.push('-c:v', 'libx264');
          args.push('-c:a', 'aac');
          args.push('-preset', 'medium');
          args.push('-movflags', '+faststart');
    
          // Output file
          args.push('output.mp4');
    
          elements.progressText.textContent = 'Converting...';
    
          // Run FFmpeg conversion
          await ffmpeg.run(...args);
    
          // Read output file
          const data = ffmpeg.FS('readFile', 'output.mp4');
          const blob = new Blob([data.buffer], { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
    
          // Setup download
          elements.downloadBtn.onclick = function() {
            const a = document.createElement('a');
            a.href = url;
            a.download = selectedFile.name.replace(/\.mov$/i, '.mp4');
            a.click();
          };
    
          elements.progressBar.style.width = '100%';
          elements.progressText.textContent = 'Conversion complete!';
          elements.downloadBtn.style.display = 'inline-block';
          elements.resetBtn.style.display = 'inline-block';
    
          // Cleanup FFmpeg filesystem
          try {
            ffmpeg.FS('unlink', 'input.mov');
            ffmpeg.FS('unlink', 'output.mp4');
          } catch (e) {
            console.warn('Cleanup warning:', e);
          }
    
        } catch (error) {
          showError('Conversion failed: ' + error.message);
          elements.convertBtn.disabled = false;
        }
      });
    
      // Reset button handler
      elements.resetBtn.addEventListener('click', function() {
        selectedFile = null;
        videoMetadata = null;
        elements.fileInput.value = '';
        elements.fileInfo.innerHTML = '';
        elements.optionsSection.style.display = 'none';
        elements.progressSection.style.display = 'none';
        elements.progressBar.style.width = '0%';
        elements.convertBtn.disabled = true;
        elements.downloadBtn.style.display = 'none';
        elements.resetBtn.style.display = 'none';
        elements.errorMessage.style.display = 'none';
      });
    
      // Error display helper
      function showError(message) {
        elements.errorMessage.textContent = message;
        elements.errorMessage.style.display = 'block';
        elements.progressSection.style.display = 'none';
      }
    
      // Initialize
      console.log('MOV to MP4 Converter initialized');
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
