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
            if (num <= 0) {
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
    initApp();
});

// Character sets for password generation
const CHARACTER_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Generate random password
function generatePassword(length, options) {
    let charset = '';
    let password = '';
    
    // Build character set based on options
    if (options.uppercase) charset += CHARACTER_SETS.uppercase;
    if (options.lowercase) charset += CHARACTER_SETS.lowercase;
    if (options.numbers) charset += CHARACTER_SETS.numbers;
    if (options.symbols) charset += CHARACTER_SETS.symbols;
    
    // If no options selected, use lowercase by default
    if (charset === '') {
        charset = CHARACTER_SETS.lowercase;
    }
    
    // Generate password using crypto.getRandomValues for better randomness
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }
    
    return password;
}

// Calculate password strength
function calculatePasswordStrength(password, options) {
    let strength = 0;
    const length = password.length;
    
    // Length scoring
    if (length >= 8) strength += 20;
    if (length >= 12) strength += 20;
    if (length >= 16) strength += 20;
    
    // Character variety scoring
    if (options.uppercase) strength += 10;
    if (options.lowercase) strength += 10;
    if (options.numbers) strength += 10;
    if (options.symbols) strength += 10;
    
    // Determine strength level
    if (strength <= 30) {
        return { level: 'weak', text: 'Weak', color: '#ef4444' };
    } else if (strength <= 60) {
        return { level: 'medium', text: 'Medium', color: '#f59e0b' };
    } else {
        return { level: 'strong', text: 'Strong', color: '#10b981' };
    }
}

// Update strength indicator
function updateStrengthIndicator(password, options) {
    const strengthIndicator = document.getElementById('strengthIndicator');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthIndicator || !strengthText) return;
    
    const strength = calculatePasswordStrength(password, options);
    
    strengthIndicator.style.width = password.length > 0 ? 
        (strength.level === 'weak' ? '33%' : strength.level === 'medium' ? '66%' : '100%') : '0%';
    strengthIndicator.style.backgroundColor = strength.color;
    strengthText.textContent = password.length > 0 ? strength.text : '';
    strengthText.style.color = strength.color;
}

// Main app initialization function
function initApp() {
    console.log('Password Generator ready');

    // Get DOM elements
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    const uppercaseCheck = document.getElementById('uppercase');
    const lowercaseCheck = document.getElementById('lowercase');
    const numbersCheck = document.getElementById('numbers');
    const symbolsCheck = document.getElementById('symbols');
    const generateBtn = document.getElementById('generateBtn');
    const passwordOutput = document.getElementById('passwordOutput');
    const copyBtn = document.getElementById('copyBtn');

    // Check if elements exist
    if (!lengthSlider || !generateBtn || !passwordOutput) {
        console.error('Required elements not found');
        return;
    }

    // Update length value display
    if (lengthSlider && lengthValue) {
        lengthSlider.addEventListener('input', function() {
            lengthValue.textContent = this.value;
        });
    }

    // Generate password function
    function handleGeneratePassword() {
        const length = parseInt(lengthSlider.value);
        const options = {
            uppercase: uppercaseCheck ? uppercaseCheck.checked : false,
            lowercase: lowercaseCheck ? lowercaseCheck.checked : true,
            numbers: numbersCheck ? numbersCheck.checked : false,
            symbols: symbolsCheck ? symbolsCheck.checked : false
        };

        // Ensure at least one option is selected
        if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
            utils.showNotification('Please select at least one character type', 'error');
            return;
        }

        const password = generatePassword(length, options);
        passwordOutput.value = password;
        
        // Update strength indicator
        updateStrengthIndicator(password, options);
        
        // Enable copy button
        if (copyBtn) {
            copyBtn.disabled = false;
        }
    }

    // Copy to clipboard function
    function handleCopyPassword() {
        const password = passwordOutput.value;
        
        if (!password) {
            utils.showNotification('No password to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(password).then(() => {
            utils.showNotification('Password copied to clipboard!');
            
            // Visual feedback on copy button
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy:', err);
            utils.showNotification('Failed to copy password', 'error');
        });
    }

    // Event listeners
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGeneratePassword);
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopyPassword);
    }

    // Generate initial password on load
    handleGeneratePassword();

    // Update strength when checkboxes change
    const checkboxes = [uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck];
    checkboxes.forEach(checkbox => {
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (passwordOutput.value) {
                    handleGeneratePassword();
                }
            });
        }
    });

    // Update password when length changes
    if (lengthSlider) {
        lengthSlider.addEventListener('change', function() {
            if (passwordOutput.value) {
                handleGeneratePassword();
            }
        });
    }

    // Allow copying with keyboard shortcut (Ctrl+C when focused on output)
    if (passwordOutput) {
        passwordOutput.addEventListener('focus', function() {
            this.select();
        });
        
        passwordOutput.addEventListener('click', function() {
            this.select();
        });
    }
}

// Export utils for use in other scripts (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
