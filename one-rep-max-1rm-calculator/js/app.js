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
    // One Rep Max Calculator - Complete Implementation
    
    // State management
    let currentResult = null;
    let progressHistory = [];
    
    // Load progress history from localStorage on page load
    document.addEventListener('DOMContentLoaded', () => {
        loadProgressHistory();
        renderProgressHistory();
    });
    
    // Calculator form submission
    document.getElementById('calculatorForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const weight = parseFloat(document.getElementById('weight').value);
        const reps = parseInt(document.getElementById('reps').value);
        const unit = document.getElementById('unit').value;
        const exercise = document.getElementById('exercise').value || 'Unknown Exercise';
        
        // Calculate 1RM using Epley formula
        const oneRepMax = calculateOneRepMax(weight, reps);
        
        // Store current result
        currentResult = {
            oneRepMax,
            weight,
            reps,
            unit,
            exercise,
            timestamp: new Date().toISOString()
        };
        
        // Display results
        displayResults(currentResult);
        
        // Display rep range recommendations
        displayRepRangeRecommendations(currentResult);
        
        // Enable save button
        document.getElementById('saveProgress').disabled = false;
    });
    
    // Calculate 1RM using Epley formula
    function calculateOneRepMax(weight, reps) {
        if (reps === 1) {
            return weight;
        }
        // Epley Formula: 1RM = weight × (1 + reps/30)
        return weight * (1 + reps / 30);
    }
    
    // Display calculation results
    function displayResults(result) {
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        
        resultsContent.innerHTML = `
            <div class="results-content">
                <div class="result-label">Your Estimated One Rep Max</div>
                <div class="result-value">${result.oneRepMax.toFixed(1)} ${result.unit}</div>
                <div class="result-label">For ${result.exercise}</div>
                <div class="formula-info">
                    <strong>Calculation:</strong> Based on lifting ${result.weight} ${result.unit} for ${result.reps} rep${result.reps > 1 ? 's' : ''}<br>
                    <small>Formula used: Epley Formula (1RM = weight × (1 + reps/30))</small>
                </div>
            </div>
        `;
        
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Display rep range recommendations for different training goals
    function displayRepRangeRecommendations(result) {
        const repRangeSection = document.getElementById('repRangeSection');
        const repRangeContent = document.getElementById('repRangeContent');
        
        const oneRM = result.oneRepMax;
        const unit = result.unit;
        
        // Training zones based on percentage of 1RM
        const trainingZones = [
            {
                goal: 'Strength',
                icon: '🏋️',
                percentage: '85-95%',
                minPercent: 0.85,
                maxPercent: 0.95,
                reps: '1-5 reps',
                description: 'Build maximum strength',
                class: 'strength'
            },
            {
                goal: 'Power',
                icon: '⚡',
                percentage: '75-85%',
                minPercent: 0.75,
                maxPercent: 0.85,
                reps: '3-5 reps',
                description: 'Develop explosive power',
                class: 'strength'
            },
            {
                goal: 'Hypertrophy',
                icon: '💪',
                percentage: '67-85%',
                minPercent: 0.67,
                maxPercent: 0.85,
                reps: '6-12 reps',
                description: 'Build muscle mass',
                class: 'hypertrophy'
            },
            {
                goal: 'Endurance',
                icon: '🔄',
                percentage: '50-67%',
                minPercent: 0.50,
                maxPercent: 0.67,
                reps: '12-20+ reps',
                description: 'Improve muscular endurance',
                class: 'endurance'
            }
        ];
        
        repRangeContent.innerHTML = trainingZones.map(zone => {
            const minWeight = (oneRM * zone.minPercent).toFixed(1);
            const maxWeight = (oneRM * zone.maxPercent).toFixed(1);
            
            return `
                <div class="rep-range-card ${zone.class}">
                    <div class="goal-icon">${zone.icon}</div>
                    <h3>${zone.goal}</h3>
                    <div class="percentage">${zone.percentage} of 1RM</div>
                    <div class="weight-value">${minWeight} - ${maxWeight} ${unit}</div>
                    <div class="rep-info">
                        <strong>${zone.reps}</strong><br>
                        ${zone.description}
                    </div>
                </div>
            `;
        }).join('');
        
        repRangeSection.style.display = 'block';
    }
    
    // Save progress button handler
    document.getElementById('saveProgress').addEventListener('click', () => {
        if (currentResult) {
            progressHistory.unshift(currentResult);
            saveProgressHistory();
            renderProgressHistory();
            
            // Disable save button after saving
            document.getElementById('saveProgress').disabled = true;
            
            // Show success feedback
            const btn = document.getElementById('saveProgress');
            const originalText = btn.textContent;
            btn.textContent = '✓ Saved!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    });
    
    // Clear history button handler
    document.getElementById('clearHistory').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all progress history?')) {
            progressHistory = [];
            saveProgressHistory();
            renderProgressHistory();
        }
    });
    
    // Render progress history
    function renderProgressHistory() {
        const progressHistoryDiv = document.getElementById('progressHistory');
        const progressComparisonDiv = document.getElementById('progressComparison');
        
        if (progressHistory.length === 0) {
            progressHistoryDiv.innerHTML = '<div class="empty-state">No progress history yet. Complete a calculation and save it to track your progress!</div>';
            progressComparisonDiv.style.display = 'none';
            return;
        }
        
        // Render history items
        progressHistoryDiv.innerHTML = progressHistory.map((item, index) => {
            const date = new Date(item.timestamp);
            const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return `
                <div class="progress-item">
                    <div class="progress-item-info">
                        <div class="progress-item-exercise">${item.exercise}</div>
                        <div class="progress-item-details">
                            1RM: <strong>${item.oneRepMax.toFixed(1)} ${item.unit}</strong> 
                            (${item.weight} ${item.unit} × ${item.reps} rep${item.reps > 1 ? 's' : ''})
                        </div>
                        <div class="progress-item-date">${dateStr}</div>
                    </div>
                    <button class="progress-item-delete" onclick="deleteProgressItem(${index})">Delete</button>
                </div>
            `;
        }).join('');
        
        // Render progress comparison
        renderProgressComparison();
    }
    
    // Render progress comparison analytics
    function renderProgressComparison() {
        const progressComparisonDiv = document.getElementById('progressComparison');
        
        if (progressHistory.length < 2) {
            progressComparisonDiv.style.display = 'none';
            return;
        }
        
        progressComparisonDiv.style.display = 'block';
        
        // Group by exercise
        const exerciseGroups = {};
        progressHistory.forEach(item => {
            if (!exerciseGroups[item.exercise]) {
                exerciseGroups[item.exercise] = [];
            }
            exerciseGroups[item.exercise].push(item);
        });
        
        // Calculate statistics
        const stats = {
            totalWorkouts: progressHistory.length,
            uniqueExercises: Object.keys(exerciseGroups).length,
            averageOneRM: (progressHistory.reduce((sum, item) => sum + item.oneRepMax, 0) / progressHistory.length).toFixed(1)
        };
        
        // Find best lifts per exercise
        const bestLifts = Object.entries(exerciseGroups).map(([exercise, items]) => {
            const sorted = items.sort((a, b) => b.oneRepMax - a.oneRepMax);
            return {
                exercise,
                best: sorted[0],
                improvement: items.length > 1 ? sorted[0].oneRepMax - sorted[sorted.length - 1].oneRepMax : 0
            };
        });
        
        // Calculate overall improvement
        const latestOneRM = progressHistory[0].oneRepMax;
        const oldestOneRM = progressHistory[progressHistory.length - 1].oneRepMax;
        const overallImprovement = latestOneRM - oldestOneRM;
        const improvementPercent = ((overallImprovement / oldestOneRM) * 100).toFixed(1);
        
        let comparisonHTML = `
            <h3>📈 Progress Analysis</h3>
            
            <div class="comparison-grid">
                <div class="comparison-stat">
                    <div class="comparison-stat-label">Total Workouts</div>
                    <div class="comparison-stat-value">${stats.totalWorkouts}</div>
                </div>
                <div class="comparison-stat">
                    <div class="comparison-stat-label">Exercises Tracked</div>
                    <div class="comparison-stat-value">${stats.uniqueExercises}</div>
                </div>
                <div class="comparison-stat">
                    <div class="comparison-stat-label">Average 1RM</div>
                    <div class="comparison-stat-value">${stats.averageOneRM}</div>
                    <div class="comparison-stat-unit">${progressHistory[0].unit}</div>
                </div>
            </div>
        `;
        
        // Show improvement badge
        if (progressHistory[0].exercise === progressHistory[progressHistory.length - 1].exercise) {
            let badgeClass = 'neutral';
            let badgeText = 'No change';
            
            if (overallImprovement > 0) {
                badgeClass = 'positive';
                badgeText = `↑ ${overallImprovement.toFixed(1)} ${progressHistory[0].unit} improvement (+${improvementPercent}%)`;
            } else if (overallImprovement < 0) {
                badgeClass = 'negative';
                badgeText = `↓ ${Math.abs(overallImprovement).toFixed(1)} ${progressHistory[0].unit} decrease (${improvementPercent}%)`;
            }
            
            comparisonHTML += `
                <div class="improvement-badge ${badgeClass}">
                    ${badgeText}
                </div>
            `;
        }
        
        // Show best lifts chart
        if (bestLifts.length > 0) {
            const maxOneRM = Math.max(...bestLifts.map(lift => lift.best.oneRepMax));
            
            comparisonHTML += `
                <div class="comparison-chart">
                    <h4>Best Lifts by Exercise</h4>
                    <div class="chart-bars">
                        ${bestLifts.map(lift => {
                            const percentage = (lift.best.oneRepMax / maxOneRM) * 100;
                            return `
                                <div class="chart-bar-item">
                                    <div class="chart-bar-label">${lift.exercise}</div>
                                    <div class="chart-bar-container">
                                        <div class="chart-bar-fill" style="width: ${percentage}%">
                                            ${lift.best.oneRepMax.toFixed(1)} ${lift.best.unit}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        progressComparisonDiv.innerHTML = comparisonHTML;
    }
    
    // Delete progress item
    function deleteProgressItem(index) {
        if (confirm('Are you sure you want to delete this entry?')) {
            progressHistory.splice(index, 1);
            saveProgressHistory();
            renderProgressHistory();
        }
    }
    
    // Save progress history to localStorage
    function saveProgressHistory() {
        localStorage.setItem('oneRMProgressHistory', JSON.stringify(progressHistory));
    }
    
    // Load progress history from localStorage
    function loadProgressHistory() {
        const saved = localStorage.getItem('oneRMProgressHistory');
        if (saved) {
            try {
                progressHistory = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading progress history:', e);
                progressHistory = [];
            }
        }
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
