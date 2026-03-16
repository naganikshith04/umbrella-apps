// Data Storage
let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
let exercises = JSON.parse(localStorage.getItem('exercises')) || [
    { id: 1, name: 'Bench Press', category: 'Chest', type: 'Strength', muscle: 'Chest' },
    { id: 2, name: 'Squat', category: 'Legs', type: 'Strength', muscle: 'Legs' },
    { id: 3, name: 'Deadlift', category: 'Back', type: 'Strength', muscle: 'Back' },
    { id: 4, name: 'Overhead Press', category: 'Shoulders', type: 'Strength', muscle: 'Shoulders' },
    { id: 5, name: 'Pull-ups', category: 'Back', type: 'Strength', muscle: 'Back' },
    { id: 6, name: 'Dumbbell Curl', category: 'Arms', type: 'Strength', muscle: 'Biceps' },
    { id: 7, name: 'Tricep Dips', category: 'Arms', type: 'Strength', muscle: 'Triceps' },
    { id: 8, name: 'Leg Press', category: 'Legs', type: 'Strength', muscle: 'Legs' },
    { id: 9, name: 'Running', category: 'Cardio', type: 'Cardio', muscle: 'Cardio' },
    { id: 10, name: 'Cycling', category: 'Cardio', type: 'Cardio', muscle: 'Cardio' }
];

let currentView = 'dashboard';
let currentDate = new Date();
let charts = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeWorkoutForm();
    initializeExerciseLibrary();
    initializeCalendar();
    initializeExport();
    showView('dashboard');
    updateDashboard();
    saveData();
});

// Navigation
function initializeNavigation() {
    const navButtons = document.querySelectorAll('nav button, nav a');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const view = btn.textContent.toLowerCase().replace(/\s+/g, '');
            if (['dashboard', 'log', 'exercises', 'calendar', 'records'].includes(view)) {
                showView(view);
            }
        });
    });
}

function showView(view) {
    currentView = view;
    document.querySelectorAll('main > section').forEach(section => {
        section.style.display = 'none';
    });
    
    const viewElement = document.getElementById(view);
    if (viewElement) {
        viewElement.style.display = 'block';
    }

    document.querySelectorAll('nav button, nav a').forEach(btn => {
        btn.classList.remove('active');
    });

    switch(view) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'log':
            updateWorkoutLog();
            break;
        case 'exercises':
            renderExerciseLibrary();
            break;
        case 'calendar':
            renderCalendar();
            break;
        case 'records':
            updateRecords();
            break;
    }
}

// Workout Form
function initializeWorkoutForm() {
    const form = document.getElementById('workoutForm');
    const addExerciseBtn = document.getElementById('addExercise');
    const workoutDate = document.getElementById('workoutDate');
    
    if (workoutDate) {
        workoutDate.valueAsDate = new Date();
    }

    if (addExerciseBtn) {
        addExerciseBtn.addEventListener('click', addExerciseEntry);
    }

    if (form) {
        form.addEventListener('submit', handleWorkoutSubmit);
    }

    addExerciseEntry();
}

function addExerciseEntry() {
    const container = document.getElementById('exerciseEntries');
    if (!container) return;

    const entry = document.createElement('div');
    entry.className = 'exercise-entry';
    entry.innerHTML = `
        <select class="exercise-select" required>
            <option value="">Select Exercise</option>
            ${exercises.map(ex => `<option value="${ex.id}">${ex.name}</option>`).join('')}
        </select>
        <input type="number" class="sets" placeholder="Sets" min="1" required>
        <input type="number" class="reps" placeholder="Reps" min="1" required>
        <input type="number" class="weight" placeholder="Weight (kg)" min="0" step="0.5">
        <button type="button" class="remove-exercise" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(entry);
}

function handleWorkoutSubmit(e) {
    e.preventDefault();
    
    const workoutName = document.getElementById('workoutName').value.trim();
    const workoutDate = document.getElementById('workoutDate').value;
    const entries = document.querySelectorAll('.exercise-entry');
    
    if (entries.length === 0) {
        showToast('Please add at least one exercise', 'error');
        return;
    }

    const exercisesList = [];
    let valid = true;

    entries.forEach(entry => {
        const exerciseId = parseInt(entry.querySelector('.exercise-select').value);
        const sets = parseInt(entry.querySelector('.sets').value);
        const reps = parseInt(entry.querySelector('.reps').value);
        const weight = parseFloat(entry.querySelector('.weight').value) || 0;

        if (!exerciseId || !sets || !reps) {
            valid = false;
            return;
        }

        const exercise = exercises.find(ex => ex.id === exerciseId);
        exercisesList.push({
            exerciseId,
            exerciseName: exercise.name,
            sets,
            reps,
            weight,
            volume: sets * reps * weight
        });
    });

    if (!valid) {
        showToast('Please fill all exercise fields', 'error');
        return;
    }

    const workout = {
        id: Date.now(),
        name: workoutName || 'Workout',
        date: workoutDate,
        exercises: exercisesList,
        totalVolume: exercisesList.reduce((sum, ex) => sum + ex.volume, 0)
    };

    workouts.unshift(workout);
    saveData();
    
    e.target.reset();
    document.getElementById('exerciseEntries').innerHTML = '';
    addExerciseEntry();
    document.getElementById('workoutDate').valueAsDate = new Date();
    
    showToast('Workout logged successfully!', 'success');
    updateDashboard();
    updateWorkoutLog();
}

// Exercise Library
function initializeExerciseLibrary() {
    const searchInput = document.getElementById('exerciseSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderExerciseLibrary(e.target.value);
        });
    }
}

function renderExerciseLibrary(searchTerm = '') {
    const grid = document.getElementById('exerciseGrid');
    if (!grid) return;

    const filtered = exercises.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.muscle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    grid.innerHTML = filtered.map(exercise => `
        <div class="exercise-card" onclick="showExerciseDetails(${exercise.id})">
            <h3>${exercise.name}</h3>
            <div class="exercise-meta">
                <span class="badge">${exercise.category}</span>
                <span class="badge">${exercise.muscle}</span>
            </div>
        </div>
    `).join('');
}

function showExerciseDetails(exerciseId) {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const modal = document.getElementById('exerciseModal');
    const modalName = document.getElementById('modalExerciseName');
    const modalDetails = document.getElementById('modalExerciseDetails');

    if (!modal || !modalName || !modalDetails) return;

    modalName.textContent = exercise.name;

    const exerciseWorkouts = workouts.flatMap(w => 
        w.exercises
            .filter(ex => ex.exerciseId === exerciseId)
            .map(ex => ({ ...ex, date: w.date }))
    );

    const maxWeight = exerciseWorkouts.length > 0 
        ? Math.max(...exerciseWorkouts.map(ex => ex.weight))
        : 0;
    
    const totalVolume = exerciseWorkouts.reduce((sum, ex) => sum + ex.volume, 0);
    const totalSets = exerciseWorkouts.reduce((sum, ex) => sum + ex.sets, 0);

    modalDetails.innerHTML = `
        <p><strong>Category:</strong> ${exercise.category}</p>
        <p><strong>Muscle Group:</strong> ${exercise.muscle}</p>
        <p><strong>Type:</strong> ${exercise.type}</p>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${maxWeight}</div>
                <div class="stat-label">Max Weight (kg)</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalSets}</div>
                <div class="stat-label">Total Sets</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalVolume.toFixed(0)}</div>
                <div class="stat-label">Total Volume</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${exerciseWorkouts.length}</div>
                <div class="stat-label">Times Performed</div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';

    renderExerciseProgressChart(exerciseWorkouts);

    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = 'none';
    }

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function renderExerciseProgressChart(exerciseWorkouts) {
    const canvas = document.getElementById('exerciseProgressChart');
    if (!canvas) return;

    if (charts.exerciseProgress) {
        charts.exerciseProgress.destroy();
    }

    const sortedWorkouts = [...exerciseWorkouts].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );

    const ctx = canvas.getContext('2d');
    charts.exerciseProgress = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedWorkouts.map(w => new Date(w.date).toLocaleDateString()),
            datasets: [{
                label: 'Max Weight (kg)',
                data: sortedWorkouts.map(w => w.weight),
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Dashboard
function updateDashboard() {
    updateDashboardStats();
    renderProgressChart();
    renderMuscleChart();
}

function updateDashboardStats() {
    const totalWorkoutsEl = document.getElementById('totalWorkouts');
    const weekWorkoutsEl = document.getElementById('weekWorkouts');
    const totalVolumeEl = document.getElementById('totalVolume');
    const totalRecordsEl = document.getElementById('totalRecords');

    if (totalWorkoutsEl) {
        totalWorkoutsEl.textContent = workouts.length;
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekWorkouts = workouts.filter(w => new Date(w.date) >= weekAgo);
    
    if (weekWorkoutsEl) {
        weekWorkoutsEl.textContent = weekWorkouts.length;
    }

    const totalVolume = workouts.reduce((sum, w) => sum + w.totalVolume, 0);
    if (totalVolumeEl) {
        totalVolumeEl.textContent = totalVolume.toFixed(0);
    }

    const records = calculatePersonalRecords();
    if (totalRecordsEl) {
        totalRecordsEl.textContent = records.length;
    }
}

function renderProgressChart() {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;

    if (charts.progress) {
        charts.progress.destroy();
    }

    const last30Days = [...workouts]
        .filter(w => {
            const workoutDate = new Date(w.date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return workoutDate >= thirtyDaysAgo;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const ctx = canvas.getContext('2d');
    charts.progress = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last30Days.map(w => new Date(w.date).toLocaleDateString()),
            datasets: [{
                label: 'Total Volume (kg)',
                data: last30Days.map(w => w.totalVolume),
                backgroundColor: '#4f46e5',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderMuscleChart() {
    const canvas = document.getElementById('muscleChart');
    if (!canvas) return;

    if (charts.muscle) {
        charts.muscle.destroy();
    }

    const muscleGroups = {};
    workouts.forEach(workout => {
        workout.exercises.forEach(ex => {
            const exercise = exercises.find(e => e.id === ex.exerciseId);
            if (exercise) {
                muscleGroups[exercise.muscle] = (muscleGroups[exercise.muscle] || 0) + ex.sets;
            }
        });
    });

    const ctx = canvas.getContext('2d');
    charts.muscle = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(muscleGroups),
            datasets: [{
                data: Object.values(muscleGroups),
                backgroundColor: [
                    '#4f46e5',
                    '#06b6d4',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#ec4899'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Workout Log
function updateWorkoutLog() {
    const container = document.getElementById('workoutDetails');
    if (!container) return;

    if (workouts.length === 0) {
        container.innerHTML = '<p class="empty-state">No workouts logged yet. Start by logging your first workout!</p>';
        return;
    }

    container.innerHTML = workouts.map(workout => `
        <div class="workout-card">
            <div class="workout-header">
                <div>
                    <h3>${workout.name}</h3>
                    <p class="workout-date">${new Date(workout.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                </div>
                <button class="delete-workout" onclick="deleteWorkout(${workout.id})" title="Delete workout">×</button>
            </div>
            <div class="workout-exercises">
                ${workout.exercises.map(ex => `
                    <div class="exercise-item">
                        <span class="exercise-name">${ex.exerciseName}</span>
                        <span class="exercise-details">${ex.sets} × ${ex.reps}${ex.weight > 0 ? ` @ ${ex.weight}kg` : ''}</span>
                        <span class="exercise-volume">Vol: ${ex.volume.toFixed(0)}kg</span>
                    </div>
                `).join('')}
            </div>
            <div class="workout-summary">
                <strong>Total Volume:</strong> ${workout.totalVolume.toFixed(0)} kg
            </div>
        </div>
    `).join('');
}

function deleteWorkout(workoutId) {
    if (!confirm('Are you sure you want to delete this workout?')) return;
    
    workouts = workouts.filter(w => w.id !== workoutId);
    saveData();
    updateWorkoutLog();
    updateDashboard();
    showToast('Workout deleted', 'success');
}

// Calendar
function initializeCalendar() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
}

function renderCalendar() {
    const currentMonthEl = document.getElementById('currentMonth');
    const calendarGrid = document.getElementById('calendarGrid');

    if (!currentMonthEl || !calendarGrid) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    currentMonthEl.textContent = new Date(year, month).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = '';
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day-name">${day}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayWorkouts = workouts.filter(w => w.date === dateStr);
        const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${dayWorkouts.length > 0 ? 'has-workout' : ''}" 
                 onclick="showCalendarDayDetails('${dateStr}')">
                <div class="day-number">${day}</div>
                ${dayWorkouts.length > 0 ? `<div class="workout-indicator">${dayWorkouts.length}</div>` : ''}
            </div>
        `;
    }

    calendarGrid.innerHTML = html;
}

function showCalendarDayDetails(dateStr) {
    const dayWorkouts = workouts.filter(w => w.date === dateStr);
    
    if (dayWorkouts.length === 0) {
        showToast('No workouts on this day', 'info');
        return;
    }

    const date = new Date(dateStr);
    const details = dayWorkouts.map(w => `
        <div class="workout-summary-card">
            <h4>${w.name}</h4>
            <p>${w.exercises.length} exercises</p>
            <p>Total Volume: ${w.totalVolume.toFixed(0)} kg</p>
        </div>
    `).join('');

    showToast(`
        <div style="text-align: left;">
            <strong>${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
            ${details}
        </div>
    `, 'info', 5000);
}

// Personal Records
function updateRecords() {
    const table = document.getElementById('recordsTable');
    if (!table) return;

    const records = calculatePersonalRecords();

    if (records.length === 0) {
        table.innerHTML = '<tr><td colspan="4" class="empty-state">No personal records yet. Keep training!</td></tr>';
        return;
    }

    table.innerHTML = records.map(record => `
        <tr>
            <td>${record.exerciseName}</td>
            <td>${record.weight} kg</td>
            <td>${record.reps} reps</td>
            <td>${new Date(record.date).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

function calculatePersonalRecords() {
    const recordsMap = new Map();

    workouts.forEach(workout => {
        workout.exercises.forEach(ex => {
            const key = ex.exerciseId;
            const existing = recordsMap.get(key);

            if (!existing || ex.weight > existing.weight || 
                (ex.weight === existing.weight && ex.reps > existing.reps)) {
                recordsMap.set(key, {
                    exerciseId: ex.exerciseId,
                    exerciseName: ex.exerciseName,
                    weight: ex.weight,
                    reps: ex.reps,
                    date: workout.date
                });
            }
        });
    });

    return Array.from(recordsMap.values()).sort((a, b) => b.weight - a.weight);
}

// Export
function initializeExport() {
    const exportBtn = document.getElementById('exportData');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportWorkoutData);
    }
}

function exportWorkoutData() {
    if (workouts.length === 0) {
        showToast('No workout data to export', 'error');
        return;
    }

    const data = {
        workouts,
        exercises,
        exportDate: new Date().toISOString(),
        totalWorkouts: workouts.length,
        records: calculatePersonalRecords()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const filename = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
    
    if (typeof saveAs !== 'undefined') {
        saveAs(blob, filename);
    } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    showToast('Workout data exported successfully!', 'success');
}

// Utilities
function saveData() {
    localStorage.setItem('workouts', JSON.stringify(workouts));
    localStorage.setItem('exercises', JSON.stringify(exercises));
}

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.innerHTML = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}