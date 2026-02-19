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
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const results = document.getElementById('results');
    const sentenceCount = document.getElementById('sentenceCount');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const avgWords = document.getElementById('avgWords');
    const readabilityGrade = document.getElementById('readabilityGrade');
    const readingEase = document.getElementById('readingEase');
    
    // Function to count sentences
    function countSentences(text) {
        if (!text.trim()) return 0;
        // Match sentences ending with . ! ? including those with quotes
        const sentences = text.match(/[^.!?]+[.!?]+/g);
        return sentences ? sentences.length : 0;
    }
    
    // Function to count words
    function countWords(text) {
        if (!text.trim()) return 0;
        const words = text.trim().split(/\s+/);
        return words.filter(word => word.length > 0).length;
    }
    
    // Function to count syllables in a word (approximation)
    function countSyllables(word) {
        word = word.toLowerCase().trim();
        if (word.length <= 3) return 1;
        
        // Remove non-alphabetic characters
        word = word.replace(/[^a-z]/g, '');
        
        // Count vowel groups
        const vowelGroups = word.match(/[aeiouy]+/g);
        let syllables = vowelGroups ? vowelGroups.length : 1;
        
        // Adjust for silent 'e'
        if (word.endsWith('e')) {
            syllables--;
        }
        
        // Adjust for special cases
        if (word.endsWith('le') && word.length > 2 && !/[aeiouy]/.test(word[word.length - 3])) {
            syllables++;
        }
        
        // Ensure at least 1 syllable
        return syllables < 1 ? 1 : syllables;
    }
    
    // Function to count total syllables in text
    function countTotalSyllables(text) {
        if (!text.trim()) return 0;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        return words.reduce((total, word) => total + countSyllables(word), 0);
    }
    
    // Function to calculate Flesch Reading Ease score
    function calculateFleschReadingEase(totalWords, totalSentences, totalSyllables) {
        if (totalWords === 0 || totalSentences === 0) return 0;
        
        const avgWordsPerSentence = totalWords / totalSentences;
        const avgSyllablesPerWord = totalSyllables / totalWords;
        
        const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        return Math.max(0, Math.min(100, score)); // Clamp between 0 and 100
    }
    
    // Function to calculate Flesch-Kincaid Grade Level
    function calculateFleschKincaidGrade(totalWords, totalSentences, totalSyllables) {
        if (totalWords === 0 || totalSentences === 0) return 0;
        
        const avgWordsPerSentence = totalWords / totalSentences;
        const avgSyllablesPerWord = totalSyllables / totalWords;
        
        const grade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;
        return Math.max(0, grade); // Ensure non-negative
    }
    
    // Function to get reading ease interpretation
    function getReadingEaseInterpretation(score) {
        if (score >= 90) return `${score.toFixed(1)} (Very Easy)`;
        if (score >= 80) return `${score.toFixed(1)} (Easy)`;
        if (score >= 70) return `${score.toFixed(1)} (Fairly Easy)`;
        if (score >= 60) return `${score.toFixed(1)} (Standard)`;
        if (score >= 50) return `${score.toFixed(1)} (Fairly Difficult)`;
        if (score >= 30) return `${score.toFixed(1)} (Difficult)`;
        return `${score.toFixed(1)} (Very Difficult)`;
    }
    
    // Function to analyze text
    function analyzeText() {
        const text = textInput.value;
        
        if (!text.trim()) {
            alert('Please enter some text to analyze.');
            return;
        }
        
        // Count sentences, words, and characters
        const sentences = countSentences(text);
        const words = countWords(text);
        const characters = text.length;
        const syllables = countTotalSyllables(text);
        
        // Calculate average words per sentence
        const average = sentences > 0 ? (words / sentences).toFixed(2) : 0;
        
        // Calculate readability metrics
        const fleschReadingEase = calculateFleschReadingEase(words, sentences, syllables);
        const fleschKincaidGrade = calculateFleschKincaidGrade(words, sentences, syllables);
        
        // Update results
        sentenceCount.textContent = sentences;
        wordCount.textContent = words;
        charCount.textContent = characters;
        avgWords.textContent = average;
        
        // Update readability grade level
        if (words > 0 && sentences > 0) {
            readabilityGrade.textContent = `Grade ${fleschKincaidGrade.toFixed(1)}`;
            readingEase.textContent = getReadingEaseInterpretation(fleschReadingEase);
        } else {
            readabilityGrade.textContent = 'N/A';
            readingEase.textContent = 'N/A';
        }
        
        // Show results with animation
        results.classList.add('show');
    }
    
    // Function to clear text and results
    function clearText() {
        textInput.value = '';
        results.classList.remove('show');
        sentenceCount.textContent = '0';
        wordCount.textContent = '0';
        charCount.textContent = '0';
        avgWords.textContent = '0';
        readabilityGrade.textContent = 'N/A';
        readingEase.textContent = 'N/A';
        textInput.focus();
    }
    
    // Event listeners
    analyzeBtn.addEventListener('click', analyzeText);
    clearBtn.addEventListener('click', clearText);
    
    // Allow Enter key to analyze (Ctrl+Enter or Cmd+Enter)
    textInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            analyzeText();
        }
    });
    
    // Auto-focus on text input when page loads
    window.addEventListener('load', () => {
        textInput.focus();
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
