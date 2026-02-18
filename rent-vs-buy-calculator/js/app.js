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
    document.getElementById('calculateBtn').addEventListener('click', calculate);
    
    function calculate() {
        // Get input values
        const homePrice = parseFloat(document.getElementById('homePrice').value);
        const downPaymentPercent = parseFloat(document.getElementById('downPayment').value);
        const interestRate = parseFloat(document.getElementById('interestRate').value);
        const loanTerm = parseFloat(document.getElementById('loanTerm').value);
        const propertyTax = parseFloat(document.getElementById('propertyTax').value);
        const homeInsurance = parseFloat(document.getElementById('homeInsurance').value);
        const hoa = parseFloat(document.getElementById('hoa').value);
        const maintenancePercent = parseFloat(document.getElementById('maintenance').value);
        const homeAppreciation = parseFloat(document.getElementById('homeAppreciation').value);
        const monthlyRent = parseFloat(document.getElementById('monthlyRent').value);
        const rentersInsurance = parseFloat(document.getElementById('rentersInsurance').value);
        const rentIncrease = parseFloat(document.getElementById('rentIncrease').value);
        const investmentReturn = parseFloat(document.getElementById('investmentReturn').value);
        const timeHorizon = parseFloat(document.getElementById('timeHorizon').value);
    
        // Calculate buying costs
        const downPaymentAmount = homePrice * (downPaymentPercent / 100);
        const loanAmount = homePrice - downPaymentAmount;
        const monthlyInterestRate = (interestRate / 100) / 12;
        const numberOfPayments = loanTerm * 12;
        
        // Monthly mortgage payment (Principal + Interest)
        const monthlyPayment = loanAmount * 
            (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
        // Total monthly cost (first year)
        const monthlyPropertyTax = propertyTax / 12;
        const monthlyHomeInsurance = homeInsurance / 12;
        const monthlyMaintenance = (homePrice * (maintenancePercent / 100)) / 12;
        const totalMonthlyCost = monthlyPayment + monthlyPropertyTax + monthlyHomeInsurance + hoa + monthlyMaintenance;
    
        // Calculate total buying costs over time horizon
        let totalBuyingCost = downPaymentAmount;
        let currentHomeValue = homePrice;
        let remainingBalance = loanAmount;
        
        for (let year = 1; year <= timeHorizon; year++) {
            for (let month = 1; month <= 12; month++) {
                // Add monthly costs
                totalBuyingCost += monthlyPayment + monthlyPropertyTax + monthlyHomeInsurance + hoa + monthlyMaintenance;
                
                // Calculate principal paid this month
                const interestPayment = remainingBalance * monthlyInterestRate;
                const principalPayment = monthlyPayment - interestPayment;
                remainingBalance -= principalPayment;
            }
            // Appreciate home value
            currentHomeValue *= (1 + homeAppreciation / 100);
        }
    
        // Calculate home equity
        const homeEquity = currentHomeValue - Math.max(0, remainingBalance);
        const netBuyingCost = totalBuyingCost - homeEquity;
    
        // Calculate renting costs
        let totalRentCost = rentersInsurance * timeHorizon;
        let currentRent = monthlyRent;
        
        for (let year = 1; year <= timeHorizon; year++) {
            for (let month = 1; month <= 12; month++) {
                totalRentCost += currentRent;
            }
            currentRent *= (1 + rentIncrease / 100);
        }
    
        // Calculate investment value if down payment was invested
        const investmentValue = downPaymentAmount * Math.pow(1 + investmentReturn / 100, timeHorizon);
        const netRentingCost = totalRentCost - investmentValue;
    
        // Calculate break-even point
        const breakeven = calculateBreakeven(
            homePrice, downPaymentPercent, interestRate, loanTerm,
            propertyTax, homeInsurance, hoa, maintenancePercent, homeAppreciation,
            monthlyRent, rentersInsurance, rentIncrease, investmentReturn
        );
    
        // Display results
        document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
        document.getElementById('totalMonthlyCost').textContent = formatCurrency(totalMonthlyCost);
        document.getElementById('downPaymentAmount').textContent = formatCurrency(downPaymentAmount);
        document.getElementById('totalBuyingCost').textContent = formatCurrency(totalBuyingCost);
        document.getElementById('homeEquity').textContent = formatCurrency(homeEquity);
        document.getElementById('netBuyingCost').textContent = formatCurrency(netBuyingCost);
        
        document.getElementById('monthlyRentDisplay').textContent = formatCurrency(monthlyRent);
        document.getElementById('totalRentCost').textContent = formatCurrency(totalRentCost);
        document.getElementById('investmentValue').textContent = formatCurrency(investmentValue);
        document.getElementById('netRentingCost').textContent = formatCurrency(netRentingCost);
    
        // Display recommendation
        const savings = netRentingCost - netBuyingCost;
        let recommendation = '';
        
        if (savings > 0) {
            recommendation = `<strong>Buying is better!</strong> Over ${timeHorizon} years, you would save approximately <strong>${formatCurrency(savings)}</strong> by buying instead of renting. Building equity through homeownership appears to be the more financially advantageous option in this scenario.`;
        } else {
            recommendation = `<strong>Renting is better!</strong> Over ${timeHorizon} years, you would save approximately <strong>${formatCurrency(Math.abs(savings))}</strong> by renting instead of buying. The flexibility and investment opportunities from renting appear more beneficial in this scenario.`;
        }
        
        document.getElementById('recommendation').innerHTML = recommendation;
    
        // Display break-even analysis
        if (breakeven.found) {
            document.getElementById('breakevenYear').textContent = `Year ${breakeven.year}`;
            document.getElementById('breakevenMonth').textContent = `Month ${breakeven.month}`;
            
            const totalMonths = (breakeven.year - 1) * 12 + breakeven.month;
            const breakevenMessage = `The break-even point occurs after <strong>${totalMonths} months</strong> (${breakeven.year} years and ${breakeven.month} months). This is when the net cost of buying equals the net cost of renting. After this point, ${savings > 0 ? 'buying becomes increasingly more advantageous' : 'renting remains more cost-effective'}.`;
            document.getElementById('breakevenMessage').innerHTML = breakevenMessage;
        } else {
            document.getElementById('breakevenYear').textContent = 'Not found';
            document.getElementById('breakevenMonth').textContent = 'N/A';
            
            const breakevenMessage = `No break-even point was found within a 30-year period. This means that ${savings > 0 ? 'buying is consistently more cost-effective than renting throughout the entire period' : 'renting remains more cost-effective than buying throughout the entire period'}.`;
            document.getElementById('breakevenMessage').innerHTML = breakevenMessage;
        }
    
        // Show results
        document.getElementById('results').classList.remove('hidden');
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    function calculateBreakeven(
        homePrice, downPaymentPercent, interestRate, loanTerm,
        propertyTax, homeInsurance, hoa, maintenancePercent, homeAppreciation,
        monthlyRent, rentersInsurance, rentIncrease, investmentReturn
    ) {
        const downPaymentAmount = homePrice * (downPaymentPercent / 100);
        const loanAmount = homePrice - downPaymentAmount;
        const monthlyInterestRate = (interestRate / 100) / 12;
        const numberOfPayments = loanTerm * 12;
        
        const monthlyPayment = loanAmount * 
            (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
        const monthlyPropertyTax = propertyTax / 12;
        const monthlyHomeInsurance = homeInsurance / 12;
        const monthlyMaintenance = (homePrice * (maintenancePercent / 100)) / 12;
    
        let buyingCost = downPaymentAmount;
        let rentingCost = 0;
        let currentHomeValue = homePrice;
        let remainingBalance = loanAmount;
        let currentRent = monthlyRent;
        let investmentValue = downPaymentAmount;
    
        // Search for break-even point up to 30 years
        for (let year = 1; year <= 30; year++) {
            for (let month = 1; month <= 12; month++) {
                // Update buying costs
                buyingCost += monthlyPayment + monthlyPropertyTax + monthlyHomeInsurance + hoa + monthlyMaintenance;
                
                const interestPayment = remainingBalance * monthlyInterestRate;
                const principalPayment = monthlyPayment - interestPayment;
                remainingBalance = Math.max(0, remainingBalance - principalPayment);
    
                // Update renting costs
                rentingCost += currentRent;
    
                // Update investment value monthly
                investmentValue *= Math.pow(1 + investmentReturn / 100, 1/12);
    
                // Check for break-even
                const currentHomeEquity = currentHomeValue - remainingBalance;
                const netBuying = buyingCost - currentHomeEquity;
                const netRenting = rentingCost - investmentValue;
    
                // If costs cross over, we found break-even
                if (month === 12) {
                    currentHomeValue *= (1 + homeAppreciation / 100);
                    currentRent *= (1 + rentIncrease / 100);
                    rentingCost += rentersInsurance;
                }
    
                // Check if break-even occurred
                if (Math.abs(netBuying - netRenting) < 1000 || 
                    (year > 1 && ((netBuying < netRenting && buyingCost - currentHomeEquity > rentingCost - investmentValue) ||
                                  (netBuying > netRenting && buyingCost - currentHomeEquity < rentingCost - investmentValue)))) {
                    return {
                        found: true,
                        year: year,
                        month: month,
                        netBuying: netBuying,
                        netRenting: netRenting
                    };
                }
            }
        }
    
        return { found: false };
    }
    
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    // Auto-calculate on input change
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (!document.getElementById('results').classList.contains('hidden')) {
                calculate();
            }
        });
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
