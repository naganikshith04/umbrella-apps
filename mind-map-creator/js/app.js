// Mind Map Data Structure
let mindMapData = {
    central: { text: 'Central Idea', color: '#4A90E2', x: 400, y: 300 },
    branches: []
};

let selectedNode = null;
let draggedNode = null;
let dragOffset = { x: 0, y: 0 };
let nodeIdCounter = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderMindMap();
    attachEventListeners();
});

// Event Listeners
function attachEventListeners() {
    // Central idea
    document.getElementById('centralIdea').addEventListener('input', (e) => {
        mindMapData.central.text = e.target.value;
        renderMindMap();
    });

    document.getElementById('updateCentral').addEventListener('click', () => {
        const text = document.getElementById('centralIdea').value.trim();
        if (text) {
            mindMapData.central.text = text;
            renderMindMap();
            saveToLocalStorage();
        }
    });

    // Add branch
    document.getElementById('addBranch').addEventListener('click', () => {
        const text = document.getElementById('branchText').value.trim();
        const color = document.getElementById('branchColor').value;
        
        if (text) {
            const angle = (mindMapData.branches.length * 60) * Math.PI / 180;
            const distance = 150;
            const branch = {
                id: nodeIdCounter++,
                text: text,
                color: color,
                x: mindMapData.central.x + Math.cos(angle) * distance,
                y: mindMapData.central.y + Math.sin(angle) * distance,
                children: []
            };
            mindMapData.branches.push(branch);
            document.getElementById('branchText').value = '';
            renderMindMap();
            saveToLocalStorage();
        }
    });

    // Add sub-branch
    document.getElementById('addSubBranch').addEventListener('click', () => {
        const text = document.getElementById('subBranchText').value.trim();
        const parentId = parseInt(document.getElementById('parentBranch').value);
        
        if (text && !isNaN(parentId)) {
            const parent = findNodeById(parentId);
            if (parent) {
                const angle = (parent.children.length * 45) * Math.PI / 180;
                const distance = 120;
                const subBranch = {
                    id: nodeIdCounter++,
                    text: text,
                    color: parent.color,
                    x: parent.x + Math.cos(angle) * distance,
                    y: parent.y + Math.sin(angle) * distance,
                    children: []
                };
                parent.children.push(subBranch);
                document.getElementById('subBranchText').value = '';
                renderMindMap();
                saveToLocalStorage();
            }
        }
    });

    // Export image
    document.getElementById('exportImage').addEventListener('click', exportAsImage);

    // Save/Load
    document.getElementById('saveMap').addEventListener('click', () => {
        saveToLocalStorage();
        alert('Mind map saved successfully!');
    });

    document.getElementById('loadMap').addEventListener('click', () => {
        loadFromLocalStorage();
        renderMindMap();
        alert('Mind map loaded successfully!');
    });

    // Clear map
    document.getElementById('clearMap').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the entire mind map?')) {
            mindMapData = {
                central: { text: 'Central Idea', color: '#4A90E2', x: 400, y: 300 },
                branches: []
            };
            nodeIdCounter = 0;
            document.getElementById('centralIdea').value = 'Central Idea';
            renderMindMap();
            saveToLocalStorage();
        }
    });

    // Edit modal
    document.getElementById('saveEdit').addEventListener('click', saveNodeEdit);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);

    // Canvas interactions
    const canvas = document.getElementById('mindmapCanvas');
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('dblclick', handleDoubleClick);
}

// Render Mind Map
function renderMindMap() {
    const canvas = document.getElementById('mindmapCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    drawConnections(ctx);
    
    // Draw central node
    drawNode(ctx, mindMapData.central, true);
    
    // Draw branches
    mindMapData.branches.forEach(branch => {
        drawBranch(ctx, branch);
    });
    
    // Update parent branch dropdown
    updateParentBranchDropdown();
}

function drawConnections(ctx) {
    // Connect central to branches
    mindMapData.branches.forEach(branch => {
        drawLine(ctx, mindMapData.central.x, mindMapData.central.y, branch.x, branch.y, branch.color);
        
        // Connect branch to sub-branches
        drawSubConnections(ctx, branch);
    });
}

function drawSubConnections(ctx, parent) {
    parent.children.forEach(child => {
        drawLine(ctx, parent.x, parent.y, child.x, child.y, child.color);
        drawSubConnections(ctx, child);
    });
}

function drawLine(ctx, x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawNode(ctx, node, isCentral = false) {
    const radius = isCentral ? 60 : 40;
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = '#fff';
    ctx.font = isCentral ? 'bold 14px Arial' : '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const words = node.text.split(' ');
    const maxWidth = radius * 1.6;
    let lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine);
    
    const lineHeight = isCentral ? 16 : 14;
    const startY = node.y - ((lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, i) => {
        ctx.fillText(line, node.x, startY + i * lineHeight);
    });
}

function drawBranch(ctx, branch) {
    drawNode(ctx, branch);
    branch.children.forEach(child => {
        drawBranch(ctx, child);
    });
}

// Mouse Handlers
function handleMouseDown(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const node = getNodeAtPosition(x, y);
    if (node) {
        draggedNode = node;
        dragOffset.x = x - node.x;
        dragOffset.y = y - node.y;
    }
}

function handleMouseMove(e) {
    if (draggedNode) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        draggedNode.x = x - dragOffset.x;
        draggedNode.y = y - dragOffset.y;
        
        renderMindMap();
    }
}

function handleMouseUp(e) {
    if (draggedNode) {
        saveToLocalStorage();
        draggedNode = null;
    }
}

function handleDoubleClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const node = getNodeAtPosition(x, y);
    if (node) {
        openEditModal(node);
    }
}

// Helper Functions
function getNodeAtPosition(x, y) {
    // Check central node
    const centralRadius = 60;
    if (Math.hypot(x - mindMapData.central.x, y - mindMapData.central.y) < centralRadius) {
        return mindMapData.central;
    }
    
    // Check branches
    for (let branch of mindMapData.branches) {
        const node = checkBranchNode(branch, x, y);
        if (node) return node;
    }
    
    return null;
}

function checkBranchNode(branch, x, y) {
    const radius = 40;
    if (Math.hypot(x - branch.x, y - branch.y) < radius) {
        return branch;
    }
    
    for (let child of branch.children) {
        const node = checkBranchNode(child, x, y);
        if (node) return node;
    }
    
    return null;
}

function findNodeById(id) {
    for (let branch of mindMapData.branches) {
        if (branch.id === id) return branch;
        const found = findInChildren(branch.children, id);
        if (found) return found;
    }
    return null;
}

function findInChildren(children, id) {
    for (let child of children) {
        if (child.id === id) return child;
        const found = findInChildren(child.children, id);
        if (found) return found;
    }
    return null;
}

function updateParentBranchDropdown() {
    const select = document.getElementById('parentBranch');
    select.innerHTML = '<option value="">Select Parent Branch</option>';
    
    function addOptions(branch, prefix = '') {
        const option = document.createElement('option');
        option.value = branch.id;
        option.textContent = prefix + branch.text;
        select.appendChild(option);
        
        branch.children.forEach(child => {
            addOptions(child, prefix + '  ');
        });
    }
    
    mindMapData.branches.forEach(branch => {
        addOptions(branch);
    });
}

// Edit Modal
function openEditModal(node) {
    selectedNode = node;
    document.getElementById('editNodeText').value = node.text;
    document.getElementById('editNodeColor').value = node.color;
    document.getElementById('editModal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    selectedNode = null;
}

function saveNodeEdit() {
    if (selectedNode) {
        const text = document.getElementById('editNodeText').value.trim();
        const color = document.getElementById('editNodeColor').value;
        
        if (text) {
            selectedNode.text = text;
            selectedNode.color = color;
            
            if (selectedNode === mindMapData.central) {
                document.getElementById('centralIdea').value = text;
            }
            
            renderMindMap();
            saveToLocalStorage();
        }
    }
    closeEditModal();
}

// Export as Image
async function exportAsImage() {
    try {
        const canvas = document.getElementById('mindmapCanvas');
        const dataUrl = canvas.toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        saveAs(blob, 'mindmap.png');
    } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export image. Please try again.');
    }
}

// Local Storage
function saveToLocalStorage() {
    try {
        localStorage.setItem('mindMapData', JSON.stringify(mindMapData));
        localStorage.setItem('nodeIdCounter', nodeIdCounter.toString());
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('mindMapData');
        const savedCounter = localStorage.getItem('nodeIdCounter');
        
        if (saved) {
            mindMapData = JSON.parse(saved);
            document.getElementById('centralIdea').value = mindMapData.central.text;
        }
        
        if (savedCounter) {
            nodeIdCounter = parseInt(savedCounter);
        }
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
    }
}