// Data Structure
let budgets = JSON.parse(localStorage.getItem('budgets')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Salary',
    'Freelance',
    'Investment',
    'Other'
];

// Chart instances
let categoryChart = null;
let trendChart = null;
let comparisonChart = null;

// DOM Elements
const elements = {
    dashboard: document.getElementById('dashboard'),
    transactions: document.getElementById('transactions'),
    reports: document.getElementById('reports'),
    modalOverlay: document.getElementById('modalOverlay'),
    transactionForm: document.getElementById('transactionForm'),
    budgetForm: document.getElementById('budgetForm'),
    transactionTableBody: document.getElementById('transactionTableBody'),
    budgetList: document.getElementById('budgetList'),
    totalIncome: document.getElementById('totalIncome'),
    totalExpenses: document.getElementById('totalExpenses'),
    balance: document.getElementById('balance'),
    budgetLeft: document.getElementById('budgetLeft'),
    addTransactionBtn: document.getElementById('addTransactionBtn'),
    addBudgetBtn: document.getElementById('addBudgetBtn'),
    closeModal: document.getElementById('closeModal'),
    closeBudgetModal: document.getElementById('closeBudgetModal'),
    cancelTransaction: document.getElementById('cancelTransaction'),
    cancelBudget: document.getElementById('cancelBudget'),
    exportCSV: document.getElementById('exportCSV'),
    exportJSON: document.getElementById('exportJSON'),
    importCSV: document.getElementById('importCSV'),
    filterType: document.getElementById('filterType'),
    filterCategory: document.getElementById('filterCategory'),
    filterDateFrom: document.getElementById('filterDateFrom'),
    filterDateTo: document.getElementById('filterDateTo'),
    clearFilters: document.getElementById('clearFilters'),
    reportSummary: document.getElementById('reportSummary'),
    categoryPieChart: document.getElementById('categoryPieChart'),
    trendLineChart: document.getElementById('trendLineChart'),
    comparisonBarChart: document.getElementById('comparisonBarChart')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    updateDashboard();
    renderTransactions();
    renderBudgets();
    populateCategorySelects();
});

function initializeApp() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            showSection(target);
        });
    });
}

function showSection(section) {
    elements.dashboard.style.display = 'none';
    elements.transactions.style.display = 'none';
    elements.reports.style.display = 'none';

    if (section === 'dashboard') {
        elements.dashboard.style.display = 'block';
        updateDashboard();
    } else if (section === 'transactions') {
        elements.transactions.style.display = 'block';
        renderTransactions();
    } else if (section === 'reports') {
        elements.reports.style.display = 'block';
        generateReports();
    }
}

function setupEventListeners() {
    elements.addTransactionBtn.addEventListener('click', () => openTransactionModal());
    elements.addBudgetBtn.addEventListener('click', () => openBudgetModal());
    elements.closeModal.addEventListener('click', closeTransactionModal);
    elements.closeBudgetModal.addEventListener('click', closeBudgetModal);
    elements.cancelTransaction.addEventListener('click', closeTransactionModal);
    elements.cancelBudget.addEventListener('click', closeBudgetModal);
    
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) {
            closeTransactionModal();
            closeBudgetModal();
        }
    });

    elements.transactionForm.addEventListener('submit', handleTransactionSubmit);
    elements.budgetForm.addEventListener('submit', handleBudgetSubmit);

    elements.exportCSV.addEventListener('click', exportToCSV);
    elements.exportJSON.addEventListener('click', exportToJSON);
    elements.importCSV.addEventListener('change', importFromCSV);

    elements.filterType.addEventListener('change', applyFilters);
    elements.filterCategory.addEventListener('change', applyFilters);
    elements.filterDateFrom.addEventListener('change', applyFilters);
    elements.filterDateTo.addEventListener('change', applyFilters);
    elements.clearFilters.addEventListener('click', clearFilters);
}

function openTransactionModal(transaction = null) {
    document.getElementById('modalTitle').textContent = transaction ? 'Edit Transaction' : 'Add Transaction';
    
    if (transaction) {
        document.getElementById('transactionType').value = transaction.type;
        document.getElementById('transactionAmount').value = transaction.amount;
        document.getElementById('transactionCategory').value = transaction.category;
        document.getElementById('transactionDate').value = transaction.date;
        document.getElementById('transactionDescription').value = transaction.description;
        elements.transactionForm.dataset.editId = transaction.id;
    } else {
        elements.transactionForm.reset();
        document.getElementById('transactionDate').valueAsDate = new Date();
        delete elements.transactionForm.dataset.editId;
    }
    
    document.getElementById('transactionModal').style.display = 'block';
    elements.modalOverlay.style.display = 'block';
}

function closeTransactionModal() {
    document.getElementById('transactionModal').style.display = 'none';
    elements.modalOverlay.style.display = 'none';
    elements.transactionForm.reset();
    delete elements.transactionForm.dataset.editId;
}

function openBudgetModal(budget = null) {
    if (budget) {
        document.getElementById('budgetCategory').value = budget.category;
        document.getElementById('budgetAmount').value = budget.amount;
        elements.budgetForm.dataset.editId = budget.id;
    } else {
        elements.budgetForm.reset();
        delete elements.budgetForm.dataset.editId;
    }
    
    document.getElementById('budgetModal').style.display = 'block';
    elements.modalOverlay.style.display = 'block';
}

function closeBudgetModal() {
    document.getElementById('budgetModal').style.display = 'none';
    elements.modalOverlay.style.display = 'none';
    elements.budgetForm.reset();
    delete elements.budgetForm.dataset.editId;
}

function handleTransactionSubmit(e) {
    e.preventDefault();
    
    const type = document.getElementById('transactionType').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const category = document.getElementById('transactionCategory').value;
    const date = document.getElementById('transactionDate').value;
    const description = document.getElementById('transactionDescription').value;

    if (!type || !amount || amount <= 0 || !category || !date) {
        alert('Please fill in all required fields with valid values');
        return;
    }

    const transaction = {
        id: elements.transactionForm.dataset.editId || Date.now().toString(),
        type,
        amount,
        category,
        date,
        description
    };

    if (elements.transactionForm.dataset.editId) {
        const index = transactions.findIndex(t => t.id === transaction.id);
        transactions[index] = transaction;
    } else {
        transactions.unshift(transaction);
    }

    saveTransactions();
    closeTransactionModal();
    updateDashboard();
    renderTransactions();
}

function handleBudgetSubmit(e) {
    e.preventDefault();
    
    const category = document.getElementById('budgetCategory').value;
    const amount = parseFloat(document.getElementById('budgetAmount').value);

    if (!category || !amount || amount <= 0) {
        alert('Please fill in all fields with valid values');
        return;
    }

    const budget = {
        id: elements.budgetForm.dataset.editId || Date.now().toString(),
        category,
        amount
    };

    if (elements.budgetForm.dataset.editId) {
        const index = budgets.findIndex(b => b.id === budget.id);
        budgets[index] = budget;
    } else {
        const existing = budgets.find(b => b.category === category);
        if (existing) {
            if (confirm(`Budget for ${category} already exists. Update it?`)) {
                existing.amount = amount;
            } else {
                return;
            }
        } else {
            budgets.push(budget);
        }
    }

    saveBudgets();
    closeBudgetModal();
    updateDashboard();
    renderBudgets();
}

function renderTransactions(filteredTransactions = null) {
    const transactionsToRender = filteredTransactions || transactions;
    elements.transactionTableBody.innerHTML = '';

    transactionsToRender.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td><span class="badge badge-${transaction.type}">${transaction.type}</span></td>
            <td>${transaction.category}</td>
            <td>${transaction.description || '-'}</td>
            <td class="${transaction.type === 'income' ? 'income' : 'expense'}">
                ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
            </td>
            <td>
                <button class="btn-icon" onclick="editTransaction('${transaction.id}')" title="Edit">✏️</button>
                <button class="btn-icon" onclick="deleteTransaction('${transaction.id}')" title="Delete">🗑️</button>
            </td>
        `;
        elements.transactionTableBody.appendChild(row);
    });
}

function renderBudgets() {
    elements.budgetList.innerHTML = '';

    budgets.forEach(budget => {
        const spent = calculateSpentByCategory(budget.category);
        const percentage = (spent / budget.amount) * 100;
        const remaining = budget.amount - spent;

        const budgetCard = document.createElement('div');
        budgetCard.className = 'budget-card';
        budgetCard.innerHTML = `
            <div class="budget-header">
                <h3>${budget.category}</h3>
                <div>
                    <button class="btn-icon" onclick="editBudget('${budget.id}')" title="Edit">✏️</button>
                    <button class="btn-icon" onclick="deleteBudget('${budget.id}')" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="budget-amount">
                <span class="spent">$${spent.toFixed(2)}</span> / $${budget.amount.toFixed(2)}
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${percentage > 100 ? 'over-budget' : ''}" style="width: ${Math.min(percentage, 100)}%"></div>
            </div>
            <div class="budget-info">
                <span>${percentage.toFixed(1)}% used</span>
                <span class="${remaining < 0 ? 'over-budget' : ''}">
                    ${remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
                </span>
            </div>
        `;
        elements.budgetList.appendChild(budgetCard);
    });

    if (budgets.length === 0) {
        elements.budgetList.innerHTML = '<p style="text-align: center; color: #666;">No budgets set. Click "Add Budget" to create one.</p>';
    }
}

function updateDashboard() {
    const totalIncome = calculateTotal('income');
    const totalExpenses = calculateTotal('expense');
    const balance = totalIncome - totalExpenses;
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const budgetLeft = totalBudget - totalExpenses;

    elements.totalIncome.textContent = `$${totalIncome.toFixed(2)}`;
    elements.totalExpenses.textContent = `$${totalExpenses.toFixed(2)}`;
    elements.balance.textContent = `$${balance.toFixed(2)}`;
    elements.balance.className = balance >= 0 ? 'income' : 'expense';
    
    if (elements.budgetLeft) {
        elements.budgetLeft.textContent = `$${budgetLeft.toFixed(2)}`;
        elements.budgetLeft.className = budgetLeft >= 0 ? 'income' : 'expense';
    }

    renderRecentTransactions();
}

function renderRecentTransactions() {
    const recentList = document.getElementById('recentTransactions');
    if (!recentList) return;

    recentList.innerHTML = '';
    const recent = transactions.slice(0, 5);

    recent.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <div>
                <strong>${transaction.category}</strong>
                <small>${formatDate(transaction.date)}</small>
            </div>
            <span class="${transaction.type === 'income' ? 'income' : 'expense'}">
                ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
            </span>
        `;
        recentList.appendChild(item);
    });

    if (recent.length === 0) {
        recentList.innerHTML = '<p style="text-align: center; color: #666;">No transactions yet</p>';
    }
}

function calculateTotal(type) {
    return transactions
        .filter(t => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0);
}

function calculateSpentByCategory(category) {
    return transactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        openTransactionModal(transaction);
    }
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        updateDashboard();
        renderTransactions();
    }
}

function editBudget(id) {
    const budget = budgets.find(b => b.id === id);
    if (budget) {
        openBudgetModal(budget);
    }
}

function deleteBudget(id) {
    if (confirm('Are you sure you want to delete this budget?')) {
        budgets = budgets.filter(b => b.id !== id);
        saveBudgets();
        updateDashboard();
        renderBudgets();
    }
}

function populateCategorySelects() {
    const selects = [
        document.getElementById('transactionCategory'),
        document.getElementById('budgetCategory'),
        document.getElementById('filterCategory')
    ];

    selects.forEach(select => {
        if (!select) return;
        
        const currentValue = select.value;
        const isFilter = select.id === 'filterCategory';
        
        select.innerHTML = isFilter ? '<option value="">All Categories</option>' : '<option value="">Select Category</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });

        if (currentValue) {
            select.value = currentValue;
        }
    });
}

function applyFilters() {
    const type = elements.filterType.value;
    const category = elements.filterCategory.value;
    const dateFrom = elements.filterDateFrom.value;
    const dateTo = elements.filterDateTo.value;

    let filtered = [...transactions];

    if (type) {
        filtered = filtered.filter(t => t.type === type);
    }

    if (category) {
        filtered = filtered.filter(t => t.category === category);
    }

    if (dateFrom) {
        filtered = filtered.filter(t => t.date >= dateFrom);
    }

    if (dateTo) {
        filtered = filtered.filter(t => t.date <= dateTo);
    }

    renderTransactions(filtered);
}

function clearFilters() {
    elements.filterType.value = '';
    elements.filterCategory.value = '';
    elements.filterDateFrom.value = '';
    elements.filterDateTo.value = '';
    renderTransactions();
}

function generateReports() {
    generateSummary();
    generateCategoryPieChart();
    generateTrendLineChart();
    generateComparisonBarChart();
}

function generateSummary() {
    const totalIncome = calculateTotal('income');
    const totalExpenses = calculateTotal('expense');
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

    const categoryBreakdown = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

    const topCategory = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];

    elements.reportSummary.innerHTML = `
        <div class="summary-grid">
            <div class="summary-card">
                <h3>Total Income</h3>
                <p class="income">$${totalIncome.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Total Expenses</h3>
                <p class="expense">$${totalExpenses.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Net Balance</h3>
                <p class="${balance >= 0 ? 'income' : 'expense'}">$${balance.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Savings Rate</h3>
                <p>${savingsRate.toFixed(1)}%</p>
            </div>
            <div class="summary-card">
                <h3>Top Spending Category</h3>
                <p>${topCategory ? `${topCategory[0]} ($${topCategory[1].toFixed(2)})` : 'N/A'}</p>
            </div>
            <div class="summary-card">
                <h3>Total Transactions</h3>
                <p>${transactions.length}</p>
            </div>
        </div>
    `;
}

function generateCategoryPieChart() {
    const categoryData = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);

    if (categoryChart) {
        categoryChart.destroy();
    }

    const ctx = elements.categoryPieChart.getContext('2d');
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6384',
                    '#C9CBCF',
                    '#4BC0C0',
                    '#FF6384',
                    '#36A2EB'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function generateTrendLineChart() {
    const monthlyData = {};
    
    transactions.forEach(t => {
        const month = t.date.substring(0, 7);
        if (!monthlyData[month]) {
            monthlyData[month] = { income: 0, expense: 0 };
        }
        monthlyData[month][t.type] += t.amount;
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const incomeData = sortedMonths.map(m => monthlyData[m].income);
    const expenseData = sortedMonths.map(m => monthlyData[m].expense);

    if (trendChart) {
        trendChart.destroy();
    }

    const ctx = elements.trendLineChart.getContext('2d');
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedMonths.map(m => formatMonth(m)),
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

function generateComparisonBarChart() {
    const categorySpending = {};
    const categoryBudgets = {};

    transactions.filter(t => t.type === 'expense').forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

    budgets.forEach(b => {
        categoryBudgets[b.category] = b.amount;
    });

    const allCategories = [...new Set([...Object.keys(categorySpending), ...Object.keys(categoryBudgets)])];
    const spendingData = allCategories.map(c => categorySpending[c] || 0);
    const budgetData = allCategories.map(c => categoryBudgets[c] || 0);

    if (comparisonChart) {
        comparisonChart.destroy();
    }

    const ctx = elements.comparisonBarChart.getContext('2d');
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allCategories,
            datasets: [
                {
                    label: 'Spent',
                    data: spendingData,
                    backgroundColor: '#ef4444'
                },
                {
                    label: 'Budget',
                    data: budgetData,
                    backgroundColor: '#3b82f6'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

function exportToCSV() {
    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `transactions_${new Date().toISOString().split('T')[0]}.csv`);
}

function exportToJSON() {
    const data = {
        transactions,
        budgets,
        categories,
        exportDate: new Date().toISOString()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `finance_data_${new Date().toISOString().split('T')[0]}.json`);
}

function importFromCSV(e) {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
        header: true,
        complete: function(results) {
            const imported = results.data.filter(row => row.type && row.amount && row.category && row.date);
            
            imported.forEach(row => {
                transactions.push({
                    id: Date.now().toString() + Math.random(),
                    type: row.type,
                    amount: parseFloat(row.amount),
                    category: row.category,
                    date: row.date,
                    description: row.description || ''
                });
            });

            saveTransactions();
            updateDashboard();
            renderTransactions();
            alert(`Imported ${imported.length} transactions successfully!`);
        },
        error: function(error) {
            alert('Error importing CSV: ' + error.message);
        }
    });

    e.target.value = '';
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatMonth(monthString) {
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function saveBudgets() {
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

window.editTransaction = editTransaction;
window.deleteTransaction = deleteTransaction;
window.editBudget = editBudget;
window.deleteBudget = deleteBudget;