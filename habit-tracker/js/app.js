// Habit Tracker Application
class HabitTracker {
    constructor() {
        this.habits = JSON.parse(localStorage.getItem('habits')) || [];
        this.currentDate = new Date();
        this.chart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderHabits();
        this.renderCalendar();
        this.updateStatistics();
        this.initChart();
    }

    setupEventListeners() {
        document.getElementById('addHabitBtn').addEventListener('click', () => this.addHabit());
        document.getElementById('habitInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addHabit();
        });
        document.getElementById('prevMonthBtn').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonthBtn').addEventListener('click', () => this.changeMonth(1));
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
    }

    addHabit() {
        const input = document.getElementById('habitInput');
        const habitName = input.value.trim();

        if (!habitName) {
            alert('Please enter a habit name');
            return;
        }

        const habit = {
            id: Date.now().toString(),
            name: habitName,
            createdAt: new Date().toISOString(),
            completions: {}
        };

        this.habits.push(habit);
        this.saveHabits();
        this.renderHabits();
        this.updateStatistics();
        this.updateChart();
        input.value = '';
    }

    deleteHabit(habitId) {
        if (confirm('Are you sure you want to delete this habit?')) {
            this.habits = this.habits.filter(h => h.id !== habitId);
            this.saveHabits();
            this.renderHabits();
            this.updateStatistics();
            this.updateChart();
        }
    }

    toggleCompletion(habitId, date) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        const dateKey = this.formatDateKey(date);
        
        if (habit.completions[dateKey]) {
            delete habit.completions[dateKey];
        } else {
            habit.completions[dateKey] = true;
        }

        this.saveHabits();
        this.renderHabits();
        this.renderCalendar();
        this.updateStatistics();
        this.updateChart();
    }

    renderHabits() {
        const container = document.getElementById('habitsContainer');
        const template = document.getElementById('habitCardTemplate');
        
        container.innerHTML = '';

        this.habits.forEach(habit => {
            const card = template.content.cloneNode(true);
            const habitCard = card.querySelector('.habit-card');
            
            habitCard.dataset.habitId = habit.id;
            
            const nameElement = card.querySelector('.habit-name');
            if (nameElement) nameElement.textContent = habit.name;

            const todayKey = this.formatDateKey(new Date());
            const isCompletedToday = habit.completions[todayKey] || false;
            
            const checkBtn = card.querySelector('.check-btn');
            if (checkBtn) {
                checkBtn.classList.toggle('completed', isCompletedToday);
                checkBtn.addEventListener('click', () => {
                    this.toggleCompletion(habit.id, new Date());
                });
            }

            const streak = this.calculateStreak(habit);
            const streakElement = card.querySelector('.streak-count');
            if (streakElement) streakElement.textContent = streak;

            const deleteBtn = card.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteHabit(habit.id));
            }

            container.appendChild(card);
        });
    }

    renderCalendar() {
        const container = document.getElementById('calendarContainer');
        const template = document.getElementById('calendarDayTemplate');
        
        container.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        document.getElementById('currentMonth').textContent = 
            this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        // Add empty cells for days before month starts
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            container.appendChild(emptyDay);
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = this.formatDateKey(date);
            
            const dayElement = template.content.cloneNode(true);
            const dayDiv = dayElement.querySelector('.calendar-day');
            
            const dayNumber = dayElement.querySelector('.day-number');
            if (dayNumber) dayNumber.textContent = day;

            // Check if today
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                dayDiv.classList.add('today');
            }

            // Count completions for this day
            let completionsCount = 0;
            this.habits.forEach(habit => {
                if (habit.completions[dateKey]) {
                    completionsCount++;
                }
            });

            if (completionsCount > 0) {
                dayDiv.classList.add('has-completions');
                const indicator = dayElement.querySelector('.completion-indicator');
                if (indicator) {
                    indicator.textContent = completionsCount;
                }
            }

            dayDiv.addEventListener('click', () => {
                this.showDayDetails(date);
            });

            container.appendChild(dayElement);
        }
    }

    showDayDetails(date) {
        const dateKey = this.formatDateKey(date);
        const dateStr = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        let message = `Habits for ${dateStr}:\n\n`;
        
        this.habits.forEach(habit => {
            const status = habit.completions[dateKey] ? '✓' : '✗';
            message += `${status} ${habit.name}\n`;
        });

        alert(message);
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
    }

    calculateStreak(habit) {
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateKey = this.formatDateKey(checkDate);

            if (habit.completions[dateKey]) {
                streak++;
            } else if (i > 0) {
                break;
            } else {
                break;
            }
        }

        return streak;
    }

    calculateLongestStreak(habit) {
        const dates = Object.keys(habit.completions).sort();
        if (dates.length === 0) return 0;

        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(dates[i - 1]);
            const currDate = new Date(dates[i]);
            const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }

        return maxStreak;
    }

    updateStatistics() {
        const totalHabits = this.habits.length;
        document.getElementById('totalHabits').textContent = totalHabits;

        const todayKey = this.formatDateKey(new Date());
        let completedToday = 0;
        let longestStreak = 0;

        this.habits.forEach(habit => {
            if (habit.completions[todayKey]) {
                completedToday++;
            }
            const habitLongestStreak = this.calculateLongestStreak(habit);
            longestStreak = Math.max(longestStreak, habitLongestStreak);
        });

        document.getElementById('completedToday').textContent = completedToday;
        document.getElementById('longestStreak').textContent = longestStreak;

        const completionRate = totalHabits > 0 
            ? Math.round((completedToday / totalHabits) * 100) 
            : 0;
        document.getElementById('completionRate').textContent = `${completionRate}%`;
    }

    initChart() {
        const ctx = document.getElementById('habitChart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });

        this.updateChart();
    }

    updateChart() {
        if (!this.chart) return;

        const days = 30;
        const labels = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }

        const datasets = this.habits.map((habit, index) => {
            const data = [];
            const colors = [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
            ];

            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateKey = this.formatDateKey(date);
                data.push(habit.completions[dateKey] ? 1 : 0);
            }

            return {
                label: habit.name,
                data: data,
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '33',
                tension: 0.1,
                fill: false
            };
        });

        this.chart.data.labels = labels;
        this.chart.data.datasets = datasets;
        this.chart.update();
    }

    exportData() {
        const exportData = {
            exportDate: new Date().toISOString(),
            habits: this.habits.map(habit => ({
                name: habit.name,
                createdAt: habit.createdAt,
                completions: Object.keys(habit.completions).map(date => ({
                    date: date,
                    completed: true
                })),
                currentStreak: this.calculateStreak(habit),
                longestStreak: this.calculateLongestStreak(habit),
                totalCompletions: Object.keys(habit.completions).length
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        const filename = `habit-tracker-${new Date().toISOString().split('T')[0]}.json`;
        saveAs(blob, filename);
    }

    formatDateKey(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0];
    }

    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HabitTracker();
});