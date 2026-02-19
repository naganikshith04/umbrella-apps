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
    // Get DOM elements
    const colorInput = document.getElementById('colorInput');
    const hexInput = document.getElementById('hexInput');
    const colorDisplay = document.getElementById('colorDisplay');
    const redSlider = document.getElementById('redSlider');
    const greenSlider = document.getElementById('greenSlider');
    const blueSlider = document.getElementById('blueSlider');
    const redValue = document.getElementById('redValue');
    const greenValue = document.getElementById('greenValue');
    const blueValue = document.getElementById('blueValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');
    const copyBtn = document.getElementById('copyBtn');
    const saveColorBtn = document.getElementById('saveColorBtn');
    const savedColorsList = document.getElementById('savedColorsList');
    
    // Initialize saved colors from localStorage
    let savedColors = JSON.parse(localStorage.getItem('savedColors')) || [];
    
    // Convert hex to RGB
    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
    
    // Convert RGB to hex
    function rgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    // Convert RGB to HSL
    function rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    }
    
    // Update all displays
    function updateColor(r, g, b) {
      const hex = rgbToHex(r, g, b);
      const hsl = rgbToHsl(r, g, b);
      
      colorDisplay.style.backgroundColor = hex;
      colorInput.value = hex;
      hexInput.value = hex;
      
      redSlider.value = r;
      greenSlider.value = g;
      blueSlider.value = b;
      
      redValue.textContent = r;
      greenValue.textContent = g;
      blueValue.textContent = b;
      
      rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
      hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    
    // Event listeners for color input
    colorInput.addEventListener('input', (e) => {
      const rgb = hexToRgb(e.target.value);
      if (rgb) {
        updateColor(rgb.r, rgb.g, rgb.b);
      }
    });
    
    // Event listeners for hex input
    hexInput.addEventListener('input', (e) => {
      let value = e.target.value;
      if (!value.startsWith('#')) {
        value = '#' + value;
      }
      
      if (/^#[0-9A-F]{6}$/i.test(value)) {
        const rgb = hexToRgb(value);
        if (rgb) {
          updateColor(rgb.r, rgb.g, rgb.b);
        }
      }
    });
    
    // Event listeners for RGB sliders
    redSlider.addEventListener('input', () => {
      updateColor(
        parseInt(redSlider.value),
        parseInt(greenSlider.value),
        parseInt(blueSlider.value)
      );
    });
    
    greenSlider.addEventListener('input', () => {
      updateColor(
        parseInt(redSlider.value),
        parseInt(greenSlider.value),
        parseInt(blueSlider.value)
      );
    });
    
    blueSlider.addEventListener('input', () => {
      updateColor(
        parseInt(redSlider.value),
        parseInt(greenSlider.value),
        parseInt(blueSlider.value)
      );
    });
    
    // Copy hex code to clipboard
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(hexInput.value).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      });
    });
    
    // Save color
    saveColorBtn.addEventListener('click', () => {
      const currentColor = hexInput.value;
      if (!savedColors.includes(currentColor)) {
        savedColors.push(currentColor);
        localStorage.setItem('savedColors', JSON.stringify(savedColors));
        renderSavedColors();
      }
    });
    
    // Render saved colors
    function renderSavedColors() {
      savedColorsList.innerHTML = '';
      savedColors.forEach((color, index) => {
        const colorItem = document.createElement('div');
        colorItem.className = 'saved-color-item';
        colorItem.style.backgroundColor = color;
        colorItem.title = color;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          savedColors.splice(index, 1);
          localStorage.setItem('savedColors', JSON.stringify(savedColors));
          renderSavedColors();
        };
        
        colorItem.appendChild(deleteBtn);
        
        colorItem.addEventListener('click', () => {
          const rgb = hexToRgb(color);
          if (rgb) {
            updateColor(rgb.r, rgb.g, rgb.b);
          }
        });
        
        savedColorsList.appendChild(colorItem);
      });
    }
    
    // Initialize
    updateColor(52, 152, 219);
    renderSavedColors();
    
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
