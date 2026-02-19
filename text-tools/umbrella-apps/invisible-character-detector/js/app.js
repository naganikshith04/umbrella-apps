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
    const invisibleChars = {
      '\u0000': { name: 'NULL', category: 'Control' },
      '\u0009': { name: 'TAB', category: 'Whitespace' },
      '\u000A': { name: 'LINE FEED', category: 'Whitespace' },
      '\u000B': { name: 'VERTICAL TAB', category: 'Whitespace' },
      '\u000C': { name: 'FORM FEED', category: 'Whitespace' },
      '\u000D': { name: 'CARRIAGE RETURN', category: 'Whitespace' },
      '\u0020': { name: 'SPACE', category: 'Whitespace' },
      '\u00A0': { name: 'NO-BREAK SPACE', category: 'Whitespace' },
      '\u00AD': { name: 'SOFT HYPHEN', category: 'Format' },
      '\u034F': { name: 'COMBINING GRAPHEME JOINER', category: 'Format' },
      '\u061C': { name: 'ARABIC LETTER MARK', category: 'Format' },
      '\u115F': { name: 'HANGUL CHOSEONG FILLER', category: 'Format' },
      '\u1160': { name: 'HANGUL JUNGSEONG FILLER', category: 'Format' },
      '\u17B4': { name: 'KHMER VOWEL INHERENT AQ', category: 'Format' },
      '\u17B5': { name: 'KHMER VOWEL INHERENT AA', category: 'Format' },
      '\u180E': { name: 'MONGOLIAN VOWEL SEPARATOR', category: 'Format' },
      '\u2000': { name: 'EN QUAD', category: 'Whitespace' },
      '\u2001': { name: 'EM QUAD', category: 'Whitespace' },
      '\u2002': { name: 'EN SPACE', category: 'Whitespace' },
      '\u2003': { name: 'EM SPACE', category: 'Whitespace' },
      '\u2004': { name: 'THREE-PER-EM SPACE', category: 'Whitespace' },
      '\u2005': { name: 'FOUR-PER-EM SPACE', category: 'Whitespace' },
      '\u2006': { name: 'SIX-PER-EM SPACE', category: 'Whitespace' },
      '\u2007': { name: 'FIGURE SPACE', category: 'Whitespace' },
      '\u2008': { name: 'PUNCTUATION SPACE', category: 'Whitespace' },
      '\u2009': { name: 'THIN SPACE', category: 'Whitespace' },
      '\u200A': { name: 'HAIR SPACE', category: 'Whitespace' },
      '\u200B': { name: 'ZERO WIDTH SPACE', category: 'Format' },
      '\u200C': { name: 'ZERO WIDTH NON-JOINER', category: 'Format' },
      '\u200D': { name: 'ZERO WIDTH JOINER', category: 'Format' },
      '\u200E': { name: 'LEFT-TO-RIGHT MARK', category: 'Format' },
      '\u200F': { name: 'RIGHT-TO-LEFT MARK', category: 'Format' },
      '\u202F': { name: 'NARROW NO-BREAK SPACE', category: 'Whitespace' },
      '\u205F': { name: 'MEDIUM MATHEMATICAL SPACE', category: 'Whitespace' },
      '\u2060': { name: 'WORD JOINER', category: 'Format' },
      '\u2061': { name: 'FUNCTION APPLICATION', category: 'Format' },
      '\u2062': { name: 'INVISIBLE TIMES', category: 'Format' },
      '\u2063': { name: 'INVISIBLE SEPARATOR', category: 'Format' },
      '\u2064': { name: 'INVISIBLE PLUS', category: 'Format' },
      '\u206A': { name: 'INHIBIT SYMMETRIC SWAPPING', category: 'Format' },
      '\u206B': { name: 'ACTIVATE SYMMETRIC SWAPPING', category: 'Format' },
      '\u206C': { name: 'INHIBIT ARABIC FORM SHAPING', category: 'Format' },
      '\u206D': { name: 'ACTIVATE ARABIC FORM SHAPING', category: 'Format' },
      '\u206E': { name: 'NATIONAL DIGIT SHAPES', category: 'Format' },
      '\u206F': { name: 'NOMINAL DIGIT SHAPES', category: 'Format' },
      '\u3000': { name: 'IDEOGRAPHIC SPACE', category: 'Whitespace' },
      '\u2028': { name: 'LINE SEPARATOR', category: 'Whitespace' },
      '\u2029': { name: 'PARAGRAPH SEPARATOR', category: 'Whitespace' },
      '\uFEFF': { name: 'ZERO WIDTH NO-BREAK SPACE (BOM)', category: 'Format' },
      '\uFFA0': { name: 'HALFWIDTH HANGUL FILLER', category: 'Format' }
    };
    
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const results = document.getElementById('results');
    const totalCharsEl = document.getElementById('totalChars');
    const invisibleCharsEl = document.getElementById('invisibleChars');
    const visibleCharsEl = document.getElementById('visibleChars');
    const detectedTypesEl = document.getElementById('detectedTypes');
    const highlightedTextEl = document.getElementById('highlightedText');
    const characterListEl = document.getElementById('characterList');
    
    analyzeBtn.addEventListener('click', analyzeText);
    clearBtn.addEventListener('click', clearAll);
    
    textInput.addEventListener('input', () => {
      if (textInput.value.trim() === '') {
        results.classList.add('hidden');
      }
    });
    
    function analyzeText() {
      const text = textInput.value;
      
      if (text === '') {
        alert('Please enter some text to analyze.');
        return;
      }
      
      let invisibleCount = 0;
      let visibleCount = 0;
      const detectedChars = {};
      const charBreakdown = [];
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charCode = char.charCodeAt(0);
        
        if (invisibleChars[char]) {
          invisibleCount++;
          if (!detectedChars[char]) {
            detectedChars[char] = 0;
          }
          detectedChars[char]++;
          
          charBreakdown.push({
            position: i,
            char: char,
            info: invisibleChars[char],
            code: charCode,
            isInvisible: true
          });
        } else {
          visibleCount++;
          charBreakdown.push({
            position: i,
            char: char,
            code: charCode,
            isInvisible: false
          });
        }
      }
      
      displayResults(text.length, invisibleCount, visibleCount, detectedChars, text, charBreakdown);
    }
    
    function displayResults(total, invisible, visible, detected, originalText, breakdown) {
      totalCharsEl.textContent = total;
      invisibleCharsEl.textContent = invisible;
      visibleCharsEl.textContent = visible;
      
      // Display detected types
      if (Object.keys(detected).length > 0) {
        let typesHTML = '<h3>Detected Invisible Characters:</h3><ul class="detected-list">';
        for (const [char, count] of Object.entries(detected)) {
          const info = invisibleChars[char];
          const hexCode = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
          typesHTML += `
            <li>
              <strong>${info.name}</strong> (U+${hexCode})
              <span class="badge">${count} occurrence${count > 1 ? 's' : ''}</span>
              <span class="category-badge ${info.category.toLowerCase()}">${info.category}</span>
            </li>
          `;
        }
        typesHTML += '</ul>';
        detectedTypesEl.innerHTML = typesHTML;
      } else {
        detectedTypesEl.innerHTML = '<p class="no-invisible">✅ No invisible characters detected!</p>';
      }
      
      // Display highlighted text
      let highlightedHTML = '';
      for (let i = 0; i < originalText.length; i++) {
        const char = originalText[i];
        if (invisibleChars[char]) {
          const info = invisibleChars[char];
          const hexCode = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
          highlightedHTML += `<span class="invisible-char" title="${info.name} (U+${hexCode})">[${info.name}]</span>`;
        } else {
          highlightedHTML += escapeHtml(char);
        }
      }
      highlightedTextEl.innerHTML = highlightedHTML || '<em>Empty text</em>';
      
      // Display character breakdown
      let breakdownHTML = '<div class="breakdown-grid">';
      breakdown.forEach((item, index) => {
        const hexCode = item.code.toString(16).toUpperCase().padStart(4, '0');
        if (item.isInvisible) {
          breakdownHTML += `
            <div class="char-item invisible">
              <div class="char-display">[${item.info.name}]</div>
              <div class="char-info">
                <div>Position: ${item.position}</div>
                <div>U+${hexCode}</div>
                <div class="category-badge ${item.info.category.toLowerCase()}">${item.info.category}</div>
              </div>
            </div>
          `;
        } else {
          const displayChar = item.char === '\n' ? '↵' : item.char === '\t' ? '→' : item.char;
          breakdownHTML += `
            <div class="char-item visible">
              <div class="char-display">${escapeHtml(displayChar)}</div>
              <div class="char-info">
                <div>Position: ${item.position}</div>
                <div>U+${hexCode}</div>
              </div>
            </div>
          `;
        }
      });
      breakdownHTML += '</div>';
      characterListEl.innerHTML = breakdownHTML;
      
      results.classList.remove('hidden');
    }
    
    function clearAll() {
      textInput.value = '';
      results.classList.add('hidden');
      textInput.focus();
    }
    
    function escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    }
    
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
