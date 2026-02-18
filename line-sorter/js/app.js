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


function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function initApp() {
    // This is where your specific app logic goes
    console.log('Ready to add app-specific functionality');

    // Generated app logic
    const inputText = document.getElementById('inputText');
        const outputText = document.getElementById('outputText');
        const sortBtn = document.getElementById('sortBtn');
        const clearBtn = document.getElementById('clearBtn');
        const copyBtn = document.getElementById('copyBtn');
        const statsElement = document.getElementById('stats');
        const caseSensitiveCheckbox = document.getElementById('caseSensitive');
        const removeDuplicatesCheckbox = document.getElementById('removeDuplicates');
        const removeEmptyCheckbox = document.getElementById('removeEmpty');
    
        // Sort button click handler
        sortBtn.addEventListener('click', function() {
            const text = inputText.value;
            
            if (!text.trim()) {
                outputText.value = '';
                statsElement.textContent = 'No input to sort';
                return;
            }
    
            // Get options
            const sortOrder = document.querySelector('input[name="sortOrder"]:checked').value;
            const sortType = document.querySelector('input[name="sortType"]:checked').value;
            const caseSensitive = caseSensitiveCheckbox.checked;
            const removeDuplicates = removeDuplicatesCheckbox.checked;
            const removeEmpty = removeEmptyCheckbox.checked;
    
            // Split into lines
            let lines = text.split('\n');
            const originalCount = lines.length;
    
            // Remove empty lines if option is checked
            if (removeEmpty) {
                lines = lines.filter(line => line.trim() !== '');
            }
    
            // Remove duplicates if option is checked
            if (removeDuplicates) {
                if (caseSensitive) {
                    lines = [...new Set(lines)];
                } else {
                    const seen = new Map();
                    lines = lines.filter(line => {
                        const lowerLine = line.toLowerCase();
                        if (seen.has(lowerLine)) {
                            return false;
                        }
                        seen.set(lowerLine, true);
                        return true;
                    });
                }
            }

            // Sort based on type and order
            if (sortType === 'alphabetical') {
                lines.sort((a, b) => {
                    const compareA = caseSensitive ? a : a.toLowerCase();
                    const compareB = caseSensitive ? b : b.toLowerCase();
                    return sortOrder === 'asc' ? compareA.localeCompare(compareB) : compareB.localeCompare(compareA);
                });
            } else if (sortType === 'numerical') {
                lines.sort((a, b) => {
                    const numA = parseFloat(a) || 0;
                    const numB = parseFloat(b) || 0;
                    return sortOrder === 'asc' ? numA - numB : numB - numA;
                });
            } else if (sortType === 'length') {
                lines.sort((a, b) => {
                    return sortOrder === 'asc' ? a.length - b.length : b.length - a.length;
                });
            } else if (sortType === 'random') {
                lines.sort(() => Math.random() - 0.5);
            }

            // Display results
            outputText.value = lines.join('\n');
            
            // Update stats
            const finalCount = lines.length;
            const removed = originalCount - finalCount;
            statsElement.textContent = `Sorted ${finalCount} lines` + (removed > 0 ? ` (${removed} removed)` : '');
        });

        // Clear button
        clearBtn.addEventListener('click', function() {
            inputText.value = '';
            outputText.value = '';
            statsElement.textContent = '';
        });

        // Copy button
        copyBtn.addEventListener('click', function() {
            if (!outputText.value) {
                alert('Nothing to copy!');
                return;
            }
            navigator.clipboard.writeText(outputText.value).then(() => {
                utils.showNotification('Copied to clipboard!');
            }).catch(() => {
                alert('Failed to copy');
            });
        });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
