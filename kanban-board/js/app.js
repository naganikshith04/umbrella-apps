// State management
let state = {
  columns: [],
  tasks: []
};

// Load state from localStorage
function loadState() {
  const savedState = localStorage.getItem('kanbanState');
  if (savedState) {
    state = JSON.parse(savedState);
  } else {
    // Default columns
    state.columns = [
      { id: generateId(), name: 'To Do' },
      { id: generateId(), name: 'In Progress' },
      { id: generateId(), name: 'Done' }
    ];
    state.tasks = [];
    saveState();
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem('kanbanState', JSON.stringify(state));
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Render the board
function renderBoard() {
  const board = document.getElementById('kanbanBoard');
  board.innerHTML = '';

  state.columns.forEach(column => {
    const columnElement = createColumnElement(column);
    board.appendChild(columnElement);
  });

  attachDragAndDropListeners();
}

// Create column element
function createColumnElement(column) {
  const template = document.getElementById('columnTemplate');
  const columnElement = template.content.cloneNode(true);
  const columnDiv = columnElement.querySelector('.kanban-column');
  
  columnDiv.dataset.columnId = column.id;
  columnDiv.querySelector('.column-title').textContent = column.name;
  
  const tasksContainer = columnDiv.querySelector('.tasks-container');
  const columnTasks = state.tasks.filter(task => task.columnId === column.id);
  
  columnTasks.forEach(task => {
    const taskElement = createTaskElement(task);
    tasksContainer.appendChild(taskElement);
  });

  // Add task button
  const addTaskBtn = columnDiv.querySelector('.add-task-btn');
  addTaskBtn.addEventListener('click', () => openTaskModal(column.id));

  // Delete column button
  const deleteColumnBtn = columnDiv.querySelector('.delete-column-btn');
  deleteColumnBtn.addEventListener('click', () => deleteColumn(column.id));

  return columnElement;
}

// Create task element
function createTaskElement(task) {
  const template = document.getElementById('taskTemplate');
  const taskElement = template.content.cloneNode(true);
  const taskCard = taskElement.querySelector('.task-card');
  
  taskCard.dataset.taskId = task.id;
  taskCard.draggable = true;
  
  taskCard.querySelector('.task-title').textContent = task.title;
  taskCard.querySelector('.task-description').textContent = task.description || '';
  
  const dueDateElement = taskCard.querySelector('.task-due-date');
  if (task.dueDate) {
    const date = new Date(task.dueDate);
    dueDateElement.textContent = `Due: ${date.toLocaleDateString()}`;
    
    // Check if overdue
    if (date < new Date() && task.columnId !== state.columns[state.columns.length - 1]?.id) {
      taskCard.classList.add('overdue');
    }
  } else {
    dueDateElement.textContent = '';
  }

  // Edit task on click
  taskCard.addEventListener('click', () => openEditTaskModal(task.id));

  return taskElement;
}

// Open column modal
function openColumnModal() {
  const modal = document.getElementById('columnModal');
  document.getElementById('columnName').value = '';
  modal.style.display = 'flex';
}

// Close column modal
function closeColumnModal() {
  const modal = document.getElementById('columnModal');
  modal.style.display = 'none';
}

// Save column
function saveColumn() {
  const columnName = document.getElementById('columnName').value.trim();
  
  if (!columnName) {
    alert('Please enter a column name');
    return;
  }

  const newColumn = {
    id: generateId(),
    name: columnName
  };

  state.columns.push(newColumn);
  saveState();
  renderBoard();
  closeColumnModal();
}

// Delete column
function deleteColumn(columnId) {
  if (!confirm('Are you sure you want to delete this column? All tasks in it will be deleted.')) {
    return;
  }

  state.columns = state.columns.filter(col => col.id !== columnId);
  state.tasks = state.tasks.filter(task => task.columnId !== columnId);
  saveState();
  renderBoard();
}

// Open task modal
function openTaskModal(columnId) {
  const modal = document.getElementById('taskModal');
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskDueDate').value = '';
  document.getElementById('taskColumnId').value = columnId;
  modal.style.display = 'flex';
}

// Close task modal
function closeTaskModal() {
  const modal = document.getElementById('taskModal');
  modal.style.display = 'none';
}

// Save task
function saveTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();
  const dueDate = document.getElementById('taskDueDate').value;
  const columnId = document.getElementById('taskColumnId').value;

  if (!title) {
    alert('Please enter a task title');
    return;
  }

  const newTask = {
    id: generateId(),
    title,
    description,
    dueDate,
    columnId
  };

  state.tasks.push(newTask);
  saveState();
  renderBoard();
  closeTaskModal();
}

// Open edit task modal
function openEditTaskModal(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  const modal = document.getElementById('editTaskModal');
  document.getElementById('editTaskId').value = task.id;
  document.getElementById('editTaskTitle').value = task.title;
  document.getElementById('editTaskDescription').value = task.description || '';
  document.getElementById('editTaskDueDate').value = task.dueDate || '';
  document.getElementById('editTaskColumnId').value = task.columnId;

  modal.style.display = 'flex';
}

// Close edit task modal
function closeEditTaskModal() {
  const modal = document.getElementById('editTaskModal');
  modal.style.display = 'none';
}

// Update task
function updateTask() {
  const taskId = document.getElementById('editTaskId').value;
  const title = document.getElementById('editTaskTitle').value.trim();
  const description = document.getElementById('editTaskDescription').value.trim();
  const dueDate = document.getElementById('editTaskDueDate').value;
  const columnId = document.getElementById('editTaskColumnId').value;

  if (!title) {
    alert('Please enter a task title');
    return;
  }

  const taskIndex = state.tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    state.tasks[taskIndex] = {
      ...state.tasks[taskIndex],
      title,
      description,
      dueDate,
      columnId
    };
    saveState();
    renderBoard();
    closeEditTaskModal();
  }
}

// Delete task
function deleteTask() {
  const taskId = document.getElementById('editTaskId').value;
  
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }

  state.tasks = state.tasks.filter(t => t.id !== taskId);
  saveState();
  renderBoard();
  closeEditTaskModal();
}

// Clear all data
function clearBoard() {
  if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    return;
  }

  state = {
    columns: [
      { id: generateId(), name: 'To Do' },
      { id: generateId(), name: 'In Progress' },
      { id: generateId(), name: 'Done' }
    ],
    tasks: []
  };
  saveState();
  renderBoard();
}

// Export board
function exportBoard() {
  const exportData = {
    exportDate: new Date().toISOString(),
    columns: state.columns,
    tasks: state.tasks
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const filename = `kanban-board-${new Date().toISOString().split('T')[0]}.json`;
  
  if (typeof saveAs === 'function') {
    saveAs(blob, filename);
  } else {
    // Fallback if file-saver is not available
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Drag and drop functionality
let draggedTask = null;

function attachDragAndDropListeners() {
  const taskCards = document.querySelectorAll('.task-card');
  const tasksContainers = document.querySelectorAll('.tasks-container');

  taskCards.forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  });

  tasksContainers.forEach(container => {
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);
    container.addEventListener('dragenter', handleDragEnter);
    container.addEventListener('dragleave', handleDragLeave);
  });
}

function handleDragStart(e) {
  draggedTask = e.target;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  
  // Remove all drag-over classes
  document.querySelectorAll('.tasks-container').forEach(container => {
    container.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  if (e.target.classList.contains('tasks-container')) {
    e.target.classList.add('drag-over');
  }
}

function handleDragLeave(e) {
  if (e.target.classList.contains('tasks-container')) {
    e.target.classList.remove('drag-over');
  }
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  e.preventDefault();

  const container = e.target.closest('.tasks-container');
  if (!container || !draggedTask) return;

  const column = container.closest('.kanban-column');
  const newColumnId = column.dataset.columnId;
  const taskId = draggedTask.dataset.taskId;

  // Update task column
  const taskIndex = state.tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    state.tasks[taskIndex].columnId = newColumnId;
    saveState();
    renderBoard();
  }

  container.classList.remove('drag-over');
  return false;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderBoard();

  // Column modal
  document.getElementById('addColumnBtn').addEventListener('click', openColumnModal);
  document.getElementById('closeColumnModal').addEventListener('click', closeColumnModal);
  document.getElementById('cancelColumnBtn').addEventListener('click', closeColumnModal);
  document.getElementById('saveColumnBtn').addEventListener('click', saveColumn);

  // Task modal
  document.getElementById('closeTaskModal').addEventListener('click', closeTaskModal);
  document.getElementById('cancelTaskBtn').addEventListener('click', closeTaskModal);
  document.getElementById('saveTaskBtn').addEventListener('click', saveTask);

  // Edit task modal
  document.getElementById('closeEditTaskModal').addEventListener('click', closeEditTaskModal);
  document.getElementById('cancelEditTaskBtn').addEventListener('click', closeEditTaskModal);
  document.getElementById('updateTaskBtn').addEventListener('click', updateTask);
  document.getElementById('deleteTaskBtn').addEventListener('click', deleteTask);

  // Other buttons
  document.getElementById('exportBtn').addEventListener('click', exportBoard);
  document.getElementById('clearBtn').addEventListener('click', clearBoard);

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    const columnModal = document.getElementById('columnModal');
    const taskModal = document.getElementById('taskModal');
    const editTaskModal = document.getElementById('editTaskModal');

    if (e.target === columnModal) {
      closeColumnModal();
    }
    if (e.target === taskModal) {
      closeTaskModal();
    }
    if (e.target === editTaskModal) {
      closeEditTaskModal();
    }
  });
});