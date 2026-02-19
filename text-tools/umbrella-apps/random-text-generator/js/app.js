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
    const textType = document.getElementById('textType');
    const quantity = document.getElementById('quantity');
    const coherentParagraphs = document.getElementById('coherentParagraphs');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const result = document.getElementById('result');
    
    // Word banks for generating text
    const commonWords = [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
      'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
      'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
      'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
      'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me'
    ];
    
    const nouns = [
      'time', 'person', 'year', 'way', 'day', 'thing', 'man', 'world', 'life', 'hand',
      'part', 'child', 'eye', 'woman', 'place', 'work', 'week', 'case', 'point', 'government',
      'company', 'number', 'group', 'problem', 'fact', 'system', 'program', 'question', 'night', 'home',
      'water', 'room', 'mother', 'area', 'money', 'story', 'student', 'country', 'book', 'job'
    ];
    
    const verbs = [
      'is', 'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'do',
      'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
      'make', 'go', 'take', 'come', 'see', 'know', 'get', 'give', 'find', 'think',
      'tell', 'become', 'leave', 'feel', 'put', 'bring', 'begin', 'keep', 'hold', 'write'
    ];
    
    const adjectives = [
      'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other', 'old',
      'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important',
      'few', 'public', 'bad', 'same', 'able', 'possible', 'best', 'better', 'sure', 'clear'
    ];
    
    // Coherent paragraph templates and topics
    const paragraphTopics = [
      {
        topic: 'technology',
        sentences: [
          'Technology has revolutionized the way we live and work.',
          'Modern devices have become an integral part of our daily routines.',
          'Innovation continues to drive progress in various industries.',
          'Digital transformation is reshaping traditional business models.',
          'The future promises even more exciting technological advances.'
        ]
      },
      {
        topic: 'nature',
        sentences: [
          'Nature provides us with countless wonders to explore and appreciate.',
          'The natural world is filled with diverse ecosystems and species.',
          'Environmental conservation has become increasingly important.',
          'Many people find peace and tranquility in natural settings.',
          'Understanding nature helps us protect our planet for future generations.'
        ]
      },
      {
        topic: 'education',
        sentences: [
          'Education plays a crucial role in personal and societal development.',
          'Learning new skills opens doors to countless opportunities.',
          'Modern educational methods continue to evolve and improve.',
          'Access to quality education remains a global priority.',
          'Knowledge empowers individuals to make informed decisions.'
        ]
      },
      {
        topic: 'health',
        sentences: [
          'Maintaining good health requires consistent effort and dedication.',
          'Regular exercise and proper nutrition are fundamental to wellbeing.',
          'Mental health is just as important as physical health.',
          'Preventive care can help avoid many serious health issues.',
          'A balanced lifestyle contributes to overall quality of life.'
        ]
      },
      {
        topic: 'community',
        sentences: [
          'Strong communities are built on trust and mutual support.',
          'People working together can achieve remarkable things.',
          'Social connections contribute significantly to happiness and wellbeing.',
          'Community involvement creates a sense of belonging and purpose.',
          'Collaboration leads to innovative solutions for common challenges.'
        ]
      }
    ];
    
    // Toggle coherent paragraphs checkbox visibility
    textType.addEventListener('change', function() {
      const coherentGroup = coherentParagraphs.parentElement.parentElement;
      if (this.value === 'paragraphs') {
        coherentGroup.style.display = 'flex';
      } else {
        coherentGroup.style.display = 'none';
        coherentParagraphs.checked = false;
      }
    });
    
    // Initialize visibility
    coherentParagraphs.parentElement.parentElement.style.display = 'none';
    
    function getRandomElement(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
    
    function generateRandomWord() {
      const allWords = [...commonWords, ...nouns, ...verbs, ...adjectives];
      return getRandomElement(allWords);
    }
    
    function generateRandomSentence() {
      const wordCount = Math.floor(Math.random() * 10) + 5; // 5-14 words
      let sentence = '';
      
      for (let i = 0; i < wordCount; i++) {
        if (i === 0) {
          const word = generateRandomWord();
          sentence += word.charAt(0).toUpperCase() + word.slice(1);
        } else {
          sentence += ' ' + generateRandomWord();
        }
      }
      
      sentence += '.';
      return sentence;
    }
    
    function generateCoherentParagraph() {
      const topic = getRandomElement(paragraphTopics);
      const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-5 sentences
      let paragraph = '';
      
      // Shuffle and select sentences from the topic
      const shuffled = [...topic.sentences].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, sentenceCount);
      
      paragraph = selected.join(' ');
      return paragraph;
    }
    
    function generateRandomParagraph() {
      const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
      let paragraph = '';
      
      for (let i = 0; i < sentenceCount; i++) {
        paragraph += generateRandomSentence();
        if (i < sentenceCount - 1) {
          paragraph += ' ';
        }
      }
      
      return paragraph;
    }
    
    function generateText() {
      const type = textType.value;
      const count = parseInt(quantity.value);
      const useCoherent = coherentParagraphs.checked;
      let output = '';
      
      if (count < 1 || count > 100) {
        result.textContent = 'Please enter a quantity between 1 and 100.';
        return;
      }
      
      switch (type) {
        case 'words':
          const words = [];
          for (let i = 0; i < count; i++) {
            words.push(generateRandomWord());
          }
          output = words.join(' ');
          break;
          
        case 'sentences':
          const sentences = [];
          for (let i = 0; i < count; i++) {
            sentences.push(generateRandomSentence());
          }
          output = sentences.join(' ');
          break;
          
        case 'paragraphs':
          const paragraphs = [];
          for (let i = 0; i < count; i++) {
            if (useCoherent) {
              paragraphs.push(generateCoherentParagraph());
            } else {
              paragraphs.push(generateRandomParagraph());
            }
          }
          output = paragraphs.join('\n\n');
          break;
      }
      
      result.textContent = output;
    }
    
    function copyToClipboard() {
      const text = result.textContent;
      
      if (!text || text === 'Your generated text will appear here...') {
        alert('No text to copy! Generate some text first.');
        return;
      }
      
      navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }).catch(err => {
        alert('Failed to copy text: ' + err);
      });
    }
    
    generateBtn.addEventListener('click', generateText);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Generate initial text
    generateText();
    
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
