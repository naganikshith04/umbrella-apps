```javascript
// Project Management Tool - Complete Implementation

class ProjectManager {
    constructor() {
        this.projects = JSON.parse(localStorage.getItem('projects')) || [];
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentProject = null;
        this.currentView = 'kanban';
        this.filters = { priority: 'all', assignee: 'all' };
        this.sortBy = 'date';
        this.init();
    }

    init() {
        this.loadProjects();
        this.setupEventListeners();
        this.setupDragAndDrop();
        if (this.projects.length > 0) {
            this.selectProject(this.projects[0].id);
        }
        this.updateStatistics();
    }

    setupEventListeners() {
        // Project Management
        document.getElementById('add-project').addEventListener('click', () => {
            this.openProjectModal();
        });

        document.getElementById('project-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });

        document.getElementById('cancel-project').addEventListener('click', () => {
            this.closeProjectModal();
        });

        document.getElementById('close-project-modal').addEventListener('click', () => {
            this.closeProjectModal();
        });

        // Task Management
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        document.getElementById('cancel-task').addEventListener('click', () => {
            this.closeTaskModal();
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeTaskModal();
        });

        // View Switching
        document.getElementById('kanban-view').addEventListener('click', () => {
            this.switchView('kanban');
        });

        document.getElementById('list-view').addEventListener('click', () => {
            this.switchView('list');
        });

        document.getElementById('analytics-view').addEventListener('click', () => {
            this.switchView('analytics');
        });

        // Filtering and Sorting
        document.getElementById('filter-priority').addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.applyFiltersAndSort();
        });

        document.getElementById('filter-assignee').addEventListener('change', (e) => {
            this.filters.assignee = e.target.value;
            this.applyFiltersAndSort();
        });

        document.getElementById('sort-tasks').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFiltersAndSort();
        });

        // Export
        document.getElementById('export-json').addEventListener('click', () => {
            this.exportJSON();
        });

        document.getElementById('export-csv').addEventListener('click', () => {
            this.exportCSV();
        });

        // Modal click outside
        document.getElementById('project-modal').addEventListener('click', (e) => {
            if (e.target.id === 'project-modal') {
                this.closeProjectModal();
            }
        });

        document.getElementById('task-modal').addEventListener('click', (e) => {
            if (e.target.id === 'task-modal') {
                this.closeTaskModal();
            }
        });
    }

    setupDragAndDrop() {
        const columns = ['todo', 'in-progress', 'review', 'done'];
        columns.forEach(status => {
            const column = document.querySelector(`[data-status="${status}"]`);
            if (column) {
                new Sortable(column, {
                    group: 'tasks',
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-drag',
                    onEnd: (evt) => {
                        const taskId = evt.item.dataset.taskId;
                        const newStatus = evt.to.dataset.status;
                        this.updateTaskStatus(taskId, newStatus);
                    }
                });
            }
        });
    }

    // Project Methods
    openProjectModal(project = null) {
        const modal = document.getElementById('project-modal');
        const form = document.getElementById('project-form');
        
        if (project) {
            document.getElementById('project-name').value = project.name;
            document.getElementById('project-description').value = project.description;
            form.dataset.projectId = project.id;
        } else {
            form.reset();
            delete form.dataset.projectId;
        }
        
        modal.classList.add('active');
    }

    closeProjectModal() {
        const modal = document.getElementById('project-modal');
        modal.classList.remove('active');
        document.getElementById('project-form').reset();
    }

    saveProject() {
        const form = document.getElementById('project-form');
        const name = document.getElementById('project-name').value.trim();
        const description = document.getElementById('project-description').value.trim();

        if (!name) {
            alert('Project name is required');
            return;
        }

        if (form.dataset.projectId) {
            // Update existing project
            const project = this.projects.find(p => p.id === form.dataset.projectId);
            if (project) {
                project.name = name;
                project.description = description;
            }
        } else {
            // Create new project
            const project = {
                id: this.generateId(),
                name,
                description,
                createdAt: new Date().toISOString()
            };
            this.projects.push(project);
            this.selectProject(project.id);
        }

        this.saveToLocalStorage();
        this.loadProjects();
        this.closeProjectModal();
    }

    deleteProject(projectId) {
        if (!confirm('Are you sure you want to delete this project? All tasks will be deleted.')) {
            return;
        }

        this.projects = this.projects.filter(p => p.id !== projectId);
        this.tasks = this.tasks.filter(t => t.projectId !== projectId);

        if (this.currentProject === projectId) {
            this.currentProject = this.projects.length > 0 ? this.projects[0].id : null;
        }

        this.saveToLocalStorage();
        this.loadProjects();
        
        if (this.currentProject) {
            this.selectProject(this.currentProject);
        } else {
            this.renderKanbanBoard();
        }
    }

    selectProject(projectId) {
        this.currentProject = projectId;
        
        // Update active state
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-project-id="${projectId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        this.updateAssigneeFilter();
        this.applyFiltersAndSort();
        this.updateStatistics();
    }

    loadProjects() {
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = '';

        this.projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.dataset.projectId = project.id;
            
            if (project.id === this.currentProject) {
                projectItem.classList.add('active');
            }

            projectItem.innerHTML = `
                <div class="project-info" data-project-id="${project.id}">
                    <h3>${this.escapeHtml(project.name)}</h3>
                    <p>${this.escapeHtml(project.description)}</p>
                </div>
                <div class="project-actions">
                    <button class="btn-icon edit-project" data-project-id="${project.id}" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete-project" data-project-id="${project.id}" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;

            projectList.appendChild(projectItem);
        });

        // Add event listeners
        document.querySelectorAll('.project-info').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectProject(e.currentTarget.dataset.projectId);
            });
        });

        document.querySelectorAll('.edit-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const project = this.projects.find(p => p.id === e.currentTarget.dataset.projectId);
                this.openProjectModal(project);
            });
        });

        document.querySelectorAll('.delete-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteProject(e.currentTarget.dataset.projectId);
            });
        });
    }

    // Task Methods
    openTaskModal(task = null) {
        const modal = document.getElementById('task-modal');
        const form = document.getElementById('task-form');

        if (!this.currentProject) {
            alert('Please select or create a project first');
            return;
        }

        if (task) {
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description;
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-status').value = task.status;
            document.getElementById('task-assignee').value = task.assignee;
            document.getElementById('task-due-date').value = task.dueDate;
            form.dataset.taskId = task.id;
        } else {
            form.reset();
            delete form.dataset.taskId;
        }

        modal.classList.add('active');
    }

    closeTaskModal() {
        const modal = document.getElementById('task-modal');
        modal.classList.remove('active');
        document.getElementById('task-form').reset();
    }

    saveTask() {
        const form = document.getElementById('task-form');
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const priority = document.getElementById('task-priority').value;
        const status = document.getElementById('task-status').value;
        const assignee = document.getElementById('task-assignee').value.trim();
        const dueDate = document.getElementById('task-due-date').value;

        if (!title) {
            alert('Task title is required');
            return;
        }

        if (!this.currentProject) {
            alert('Please select a project first');
            return;
        }

        if (form.dataset.taskId) {
            // Update existing task
            const task = this.tasks.find(t => t.id === form.dataset.taskId);
            if (task) {
                task.title = title;
                task.description = description;
                task.priority = priority;
                task.status = status;
                task.assignee = assignee;
                task.dueDate = dueDate;
                task.updatedAt = new Date().toISOString();
            }
        } else {
            // Create new task
            const task = {
                id: this.generateId(),
                projectId: this.currentProject,
                title,
                description,
                priority,
                status,
                assignee,
                dueDate,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.tasks.push(task);
        }

        this.saveToLocalStorage();
        this.updateAssigneeFilter();
        this.applyFiltersAndSort();
        this.updateStatistics();
        this.closeTaskModal();
    }

    deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveToLocalStorage();
        this.updateAssigneeFilter();
        this.applyFiltersAndSort();
        this.updateStatistics();
    }

    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            task.updatedAt = new Date().toISOString();
            this.saveToLocalStorage();
            this.updateStatistics();
        }
    }

    // View Methods
    switchView(view) {
        this.currentView = view;

        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${view}-view`).classList.add('active');

        // Show/hide views
        document.querySelectorAll('.view-container').forEach(container => {
            container.classList.remove('active');
        });

        if (view === 'kanban') {
            document.getElementById('kanban-board').classList.add('active');
            this.renderKanbanBoard();
        } else if (view === 'list') {
            document.getElementById('list-container').classList.add('active');
            this.renderListView();
        } else if (view === 'analytics') {
            document.getElementById('analytics-container').classList.add('active');
            this.renderAnalytics();
        }
    }

    renderKanbanBoard() {
        const statuses = [
            { key: 'todo', label: 'To Do' },
            { key: 'in-progress', label: 'In Progress' },
            { key: 'review', label: 'Review' },
            { key: 'done', label: 'Done' }
        ];

        const tasks = this.getFilteredAndSortedTasks();

        statuses.forEach(({ key }) => {
            const column = document.querySelector(`[data-status="${key}"]`);
            if (column) {
                column.innerHTML = '';
                
                const statusTasks = tasks.filter(t => t.status === key);
                statusTasks.forEach(task => {
                    const taskCard = this.createTaskCard(task);
                    column.appendChild(taskCard);
                });
            }
        });

        // Setup add task buttons
        document.querySelectorAll('.add-task-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });

        document.querySelectorAll('.add-task-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.openTaskModal();
            });
        });
    }

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.dataset.taskId = task.id;

        const priorityClass = `priority-${task.priority}`;
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

        card.innerHTML = `
            <div class="task-card-header">
                <span class="task-priority ${priorityClass}">${task.priority}</span>
                <div class="task-actions">
                    <button class="btn-icon edit-task" data-task-id="${task.id}" title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete-task" data-task-id="${task.id}" title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <h4 class="task-title">${this.escapeHtml(task.title)}</h4>
            ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
            <div class="task-meta">
                ${task.assignee ? `<span class="task-assignee">👤 ${this.escapeHtml(task.assignee)}</span>` : ''}
                ${task.dueDate ? `<span class="task-due-date ${isOverdue ? 'overdue' : ''}">📅 ${this.formatDate(task.dueDate)}</span>` : ''}
            </div>
        `;

        // Add event listeners
        card.querySelector('.edit-task').addEventListener('click', (e) => {
            e.stopPropagation();
            this.openTaskModal(task);
        });

        card.querySelector('.delete-task').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteTask(task.id);
        });

        return card;
    }

    renderListView() {
        const tbody = document.getElementById('task-table-body');
        tbody.innerHTML = '';

        const tasks = this.getFilteredAndSortedTasks();

        tasks.forEach(task => {
            const row = document.createElement('tr');
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

            row.innerHTML = `
                <td>${this.escapeHtml(task.title)}</td>
                <td><span class="priority-badge priority-${task.priority}">${task.priority}</span></td>
                <td><span class="status-badge status-${task.status}">${this.formatStatus(task.status)}</span></td>
                <td>${task.assignee ? this.escapeHtml(task.assignee) : '-'}</td>
                <td class="${isOverdue ? 'overdue' : ''}">${task.dueDate ? this.formatDate(task.dueDate) : '-'}</td>
                <td>
                    <button class="btn-icon edit-task" data-task-id="${task.id}" title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete-task" data-task-id="${task.id}" title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </td>
            `;

            tbody.appendChild(row);
        });

        // Add event listeners
        document.querySelectorAll('.edit-task').forEach(btn => {
            btn.addEventListener('click', () => {
                const task = this.tasks.find(t => t.id === btn.dataset.taskId);
                this.openTaskModal(task);
            });
        });

        document.querySelectorAll('.delete-task').forEach(btn => {
            btn.addEventListener('click', () => {
                this.deleteTask(btn.dataset.taskId);
            });
        });
    }

    renderAnalytics() {
        const tasks = this.getCurrentProjectTasks();

        // Status Chart
        const statusData = {
            'todo': tasks.filter(t => t.status === 'todo').length,
            'in-progress': tasks.filter(t => t.status === 'in-progress').length,
            'review': tasks.filter(t => t.status === 'review').length,
            'done': tasks.filter(t => t.status === 'done').length
        };

        const statusCtx = document.getElementById('status-chart');
        if (statusCtx) {
            if (this.statusChart) {
                this.statusChart.destroy();
            }

            this.statusChart = new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['To Do', 'In Progress', 'Review', 'Done'],
                    datasets: [{
                        data: [statusData['todo'], statusData['in-progress'], statusData['review'], statusData['done']],
                        backgroundColor: ['#64748b', '#3b82f6', '#f59e0b', '#10b981'],
                        borderWidth: 0
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

        // Priority Chart
        const priorityData = {
            'low': tasks.filter(t => t.priority === 'low').length,
            'medium': tasks.filter(t => t.priority === 'medium').length,
            'high': tasks.filter(t => t.priority === 'high').length
        };

        const priorityCtx = document.getElementById('priority-chart');
        if (priorityCtx) {
            if (this.priorityChart) {
                this.priorityChart.destroy();
            }

            this.priorityChart = new Chart(priorityCtx, {
                type: 'bar',
                data: {
                    labels: ['Low', 'Medium', 'High'],
                    datasets: [{
                        label: 'Tasks by Priority',
                        data: [priorityData['low'], priorityData['medium'], priorityData['high']],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                        borderWidth: 0
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
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    }

    // Filter and Sort Methods
    applyFiltersAndSort() {
        if (this.currentView === 'kanban') {
            this.renderKanbanBoard();
        } else if (this.currentView === 'list') {
            this.renderListView();
        }
    }

    getFilteredAndSortedTasks() {
        let tasks = this.getCurrentProjectTasks();

        // Apply filters
        if (this.filters.priority !== 'all') {
            tasks = tasks.filter(t => t.priority === this.filters.priority);
        }

        if (this.filters.assignee !== 'all') {
            tasks = tasks.filter(t => t.assignee === this.filters.assignee);
        }

        // Apply sorting
        tasks.sort((a, b) => {
            switch (this.sortBy) {
                case 'date':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'due-date':
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return tasks;
    }

    getCurrentProjectTasks() {
        if (!this.currentProject) return [];
        return this.tasks.filter(t => t.projectId === this.currentProject);
    }

    updateAssigneeFilter() {
        const assigneeFilter = document.getElementById('filter-assignee');
        const tasks = this.getCurrentProjectTasks();
        const assignees = [...new Set(tasks.map(t => t.assignee).filter(a => a))];

        const currentValue = assigneeFilter.value;
        assigneeFilter.innerHTML = '<option value="all">All Assignees</option>';
        
        assignees.forEach(assignee => {
            const option = document.createElement('option');
            option.value = assignee;
            option.textContent = assignee;
            assigneeFilter.appendChild(option);
        });

        if (assignees.includes(currentValue)) {
            assigneeFilter.value = currentValue;
        }
    }

    // Statistics Methods
    updateStatistics() {
        const tasks = this.getCurrentProjectTasks();

        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'done').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress' || t.status === 'review').length;
        const overdue = tasks.filter(t => {
            return t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done';
        }).length;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-completed').textContent = completed;
        document.getElementById('stat-progress').textContent = inProgress;
        document.getElementById('stat-overdue').textContent = overdue;
    }

    // Export Methods
    exportJSON() {
        const data = {
            projects: this.projects,
            tasks: this.tasks,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportCSV() {
        const tasks = this.getCurrentProjectTasks();
        
        if (tasks.length === 0) {
            alert('No tasks to export');
            return;
        }

        const headers = ['Title', 'Description', 'Priority', 'Status', 'Assignee', 'Due Date', 'Created At'];
        const rows = tasks.map(task => [
            task.title,
            task.description,
            task.priority,
            task.status,
            task.assignee || '',
            task.dueDate || '',
            task.createdAt
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const projectName = this.projects.find(p => p.id === this.currentProject)?.name || 'tasks';
        a.download = `${projectName}-${new Date().toISOString().split('T')[0]}.csv`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Utility Methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveToLocalStorage() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en