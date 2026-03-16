// Data Models
class Note {
    constructor(id, title, content, folderId, tags = [], createdAt = Date.now(), updatedAt = Date.now()) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.folderId = folderId;
        this.tags = tags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

class Folder {
    constructor(id, name, createdAt = Date.now()) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
    }
}

// App State
class AppState {
    constructor() {
        this.notes = [];
        this.folders = [];
        this.currentNoteId = null;
        this.currentFolderId = null;
        this.searchQuery = '';
        this.load();
    }

    load() {
        const notesData = localStorage.getItem('markdown_notes');
        const foldersData = localStorage.getItem('markdown_folders');
        const currentNoteId = localStorage.getItem('markdown_current_note');
        const currentFolderId = localStorage.getItem('markdown_current_folder');

        if (notesData) {
            this.notes = JSON.parse(notesData);
        }
        if (foldersData) {
            this.folders = JSON.parse(foldersData);
        }
        if (currentNoteId) {
            this.currentNoteId = currentNoteId;
        }
        if (currentFolderId) {
            this.currentFolderId = currentFolderId;
        }

        // Ensure default folder exists
        if (this.folders.length === 0) {
            const defaultFolder = new Folder('default', 'All Notes');
            this.folders.push(defaultFolder);
            this.currentFolderId = 'default';
            this.save();
        }
    }

    save() {
        localStorage.setItem('markdown_notes', JSON.stringify(this.notes));
        localStorage.setItem('markdown_folders', JSON.stringify(this.folders));
        localStorage.setItem('markdown_current_note', this.currentNoteId || '');
        localStorage.setItem('markdown_current_folder', this.currentFolderId || '');
    }

    addNote(note) {
        this.notes.push(note);
        this.save();
    }

    updateNote(id, updates) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            Object.assign(note, updates, { updatedAt: Date.now() });
            this.save();
        }
    }

    deleteNote(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        if (this.currentNoteId === id) {
            this.currentNoteId = null;
        }
        this.save();
    }

    getNote(id) {
        return this.notes.find(n => n.id === id);
    }

    addFolder(folder) {
        this.folders.push(folder);
        this.save();
    }

    deleteFolder(id) {
        if (id === 'default') return;
        this.notes = this.notes.map(note => {
            if (note.folderId === id) {
                note.folderId = 'default';
            }
            return note;
        });
        this.folders = this.folders.filter(f => f.id !== id);
        if (this.currentFolderId === id) {
            this.currentFolderId = 'default';
        }
        this.save();
    }

    getFolder(id) {
        return this.folders.find(f => f.id === id);
    }

    getFilteredNotes() {
        let filtered = this.notes;

        if (this.currentFolderId && this.currentFolderId !== 'all') {
            filtered = filtered.filter(n => n.folderId === this.currentFolderId);
        }

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(n => 
                n.title.toLowerCase().includes(query) ||
                n.content.toLowerCase().includes(query) ||
                n.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
    }
}

// App Controller
class MarkdownApp {
    constructor() {
        this.state = new AppState();
        this.editor = document.getElementById('markdownEditor');
        this.preview = document.getElementById('previewContent');
        this.titleInput = document.getElementById('noteTitleInput');
        this.tagInput = document.getElementById('tagInput');
        this.tagsDisplay = document.getElementById('tagsDisplay');
        this.notesList = document.getElementById('notesList');
        this.folderList = document.getElementById('folderList');
        this.searchInput = document.getElementById('searchInput');
        this.currentTags = [];
        this.autoSaveTimeout = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.renderFolders();
        this.renderNotes();
        
        if (this.state.currentNoteId) {
            this.loadNote(this.state.currentNoteId);
        } else {
            this.createNewNote();
        }
    }

    setupEventListeners() {
        // Editor events
        this.editor.addEventListener('input', () => {
            this.updatePreview();
            this.autoSave();
        });

        this.titleInput.addEventListener('input', () => {
            this.autoSave();
        });

        // Tag input
        this.tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.tagInput.value.trim()) {
                e.preventDefault();
                this.addTag(this.tagInput.value.trim());
                this.tagInput.value = '';
            }
        });

        // New note button
        document.getElementById('newNoteBtn').addEventListener('click', () => {
            this.createNewNote();
        });

        // Delete note button
        document.getElementById('deleteNoteBtn').addEventListener('click', () => {
            this.deleteCurrentNote();
        });

        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.state.searchQuery = e.target.value;
            this.renderNotes();
        });

        // Folder modal
        document.getElementById('addFolderBtn').addEventListener('click', () => {
            this.openFolderModal();
        });

        document.getElementById('closeFolderModal').addEventListener('click', () => {
            this.closeFolderModal();
        });

        document.getElementById('cancelFolderBtn').addEventListener('click', () => {
            this.closeFolderModal();
        });

        document.getElementById('confirmFolderBtn').addEventListener('click', () => {
            this.createFolder();
        });

        // Shortcuts modal
        document.getElementById('shortcutsBtn').addEventListener('click', () => {
            this.openShortcutsModal();
        });

        document.getElementById('closeShortcutsModal').addEventListener('click', () => {
            this.closeShortcutsModal();
        });

        // Markdown formatting buttons
        document.getElementById('boldBtn').addEventListener('click', () => {
            this.insertMarkdown('**', '**', 'bold text');
        });

        document.getElementById('italicBtn').addEventListener('click', () => {
            this.insertMarkdown('*', '*', 'italic text');
        });

        document.getElementById('headingBtn').addEventListener('click', () => {
            this.insertMarkdown('## ', '', 'Heading');
        });

        document.getElementById('linkBtn').addEventListener('click', () => {
            this.insertMarkdown('[', '](url)', 'link text');
        });

        document.getElementById('codeBtn').addEventListener('click', () => {
            this.insertMarkdown('`', '`', 'code');
        });

        // Export buttons
        document.getElementById('exportHtmlBtn').addEventListener('click', () => {
            this.exportToHTML();
        });

        document.getElementById('exportPdfBtn').addEventListener('click', () => {
            this.exportToPDF();
        });

        // Modal click outside
        document.getElementById('folderModal').addEventListener('click', (e) => {
            if (e.target.id === 'folderModal') {
                this.closeFolderModal();
            }
        });

        document.getElementById('shortcutsModal').addEventListener('click', (e) => {
            if (e.target.id === 'shortcutsModal') {
                this.closeShortcutsModal();
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S: Save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveCurrentNote();
                this.showToast('Note saved!');
            }

            // Ctrl/Cmd + N: New note
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.createNewNote();
            }

            // Ctrl/Cmd + F: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                this.searchInput.focus();
            }

            // Ctrl/Cmd + B: Bold
            if ((e.ctrlKey || e.metaKey) && e.key === 'b' && document.activeElement === this.editor) {
                e.preventDefault();
                this.insertMarkdown('**', '**', 'bold text');
            }

            // Ctrl/Cmd + I: Italic
            if ((e.ctrlKey || e.metaKey) && e.key === 'i' && document.activeElement === this.editor) {
                e.preventDefault();
                this.insertMarkdown('*', '*', 'italic text');
            }

            // Ctrl/Cmd + K: Link
            if ((e.ctrlKey || e.metaKey) && e.key === 'k' && document.activeElement === this.editor) {
                e.preventDefault();
                this.insertMarkdown('[', '](url)', 'link text');
            }

            // Ctrl/Cmd + /: Show shortcuts
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.openShortcutsModal();
            }
        });
    }

    createNewNote() {
        const noteId = 'note_' + Date.now();
        const folderId = this.state.currentFolderId || 'default';
        const note = new Note(noteId, 'Untitled Note', '', folderId);
        
        this.state.addNote(note);
        this.state.currentNoteId = noteId;
        this.state.save();
        
        this.loadNote(noteId);
        this.renderNotes();
        this.titleInput.focus();
        this.titleInput.select();
    }

    loadNote(noteId) {
        const note = this.state.getNote(noteId);
        if (!note) return;

        this.state.currentNoteId = noteId;
        this.state.save();

        this.titleInput.value = note.title;
        this.editor.value = note.content;
        this.currentTags = [...note.tags];
        
        this.updatePreview();
        this.renderTags();
        this.renderNotes();
    }

    saveCurrentNote() {
        if (!this.state.currentNoteId) return;

        const title = this.titleInput.value.trim() || 'Untitled Note';
        const content = this.editor.value;

        this.state.updateNote(this.state.currentNoteId, {
            title,
            content,
            tags: this.currentTags
        });

        this.renderNotes();
    }

    autoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveCurrentNote();
        }, 1000);
    }

    deleteCurrentNote() {
        if (!this.state.currentNoteId) return;

        if (confirm('Are you sure you want to delete this note?')) {
            this.state.deleteNote(this.state.currentNoteId);
            this.renderNotes();
            
            const remainingNotes = this.state.getFilteredNotes();
            if (remainingNotes.length > 0) {
                this.loadNote(remainingNotes[0].id);
            } else {
                this.createNewNote();
            }
            
            this.showToast('Note deleted');
        }
    }

    updatePreview() {
        const markdown = this.editor.value;
        const html = marked.parse(markdown);
        this.preview.innerHTML = html;
        
        // Highlight code blocks
        this.preview.querySelectorAll('pre code').forEach((block) => {
            Prism.highlightElement(block);
        });
    }

    addTag(tag) {
        if (!this.currentTags.includes(tag)) {
            this.currentTags.push(tag);
            this.renderTags();
            this.autoSave();
        }
    }

    removeTag(tag) {
        this.currentTags = this.currentTags.filter(t => t !== tag);
        this.renderTags();
        this.autoSave();
    }

    renderTags() {
        this.tagsDisplay.innerHTML = '';
        
        this.currentTags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag';
            tagEl.innerHTML = `
                ${this.escapeHtml(tag)}
                <button class="tag-remove" data-tag="${this.escapeHtml(tag)}">&times;</button>
            `;
            
            tagEl.querySelector('.tag-remove').addEventListener('click', () => {
                this.removeTag(tag);
            });
            
            this.tagsDisplay.appendChild(tagEl);
        });
    }

    renderNotes() {
        this.notesList.innerHTML = '';
        const notes = this.state.getFilteredNotes();

        if (notes.length === 0) {
            this.notesList.innerHTML = '<div class="empty-state">No notes found</div>';
            return;
        }

        notes.forEach(note => {
            const noteEl = document.createElement('div');
            noteEl.className = 'note-item' + (note.id === this.state.currentNoteId ? ' active' : '');
            noteEl.dataset.noteId = note.id;
            
            const preview = note.content.substring(0, 100).replace(/[#*`\[\]]/g, '');
            const date = new Date(note.updatedAt).toLocaleDateString();
            
            noteEl.innerHTML = `
                <div class="note-item-title">${this.escapeHtml(note.title)}</div>
                <div class="note-item-preview">${this.escapeHtml(preview)}${preview.length >= 100 ? '...' : ''}</div>
                <div class="note-item-meta">
                    ${note.tags.map(tag => `<span class="note-tag">${this.escapeHtml(tag)}</span>`).join('')}
                    <span class="note-date">${date}</span>
                </div>
            `;
            
            noteEl.addEventListener('click', () => {
                this.loadNote(note.id);
            });
            
            this.notesList.appendChild(noteEl);
        });
    }

    renderFolders() {
        this.folderList.innerHTML = '';

        // All notes folder
        const allFolder = document.createElement('div');
        allFolder.className = 'folder-item' + (this.state.currentFolderId === 'all' ? ' active' : '');
        allFolder.innerHTML = `
            <span class="folder-icon">📁</span>
            <span class="folder-name">All Notes</span>
            <span class="folder-count">${this.state.notes.length}</span>
        `;
        allFolder.addEventListener('click', () => {
            this.selectFolder('all');
        });
        this.folderList.appendChild(allFolder);

        // User folders
        this.state.folders.forEach(folder => {
            const count = this.state.notes.filter(n => n.folderId === folder.id).length;
            const folderEl = document.createElement('div');
            folderEl.className = 'folder-item' + (folder.id === this.state.currentFolderId ? ' active' : '');
            folderEl.dataset.folderId = folder.id;
            
            folderEl.innerHTML = `
                <span class="folder-icon">📁</span>
                <span class="folder-name">${this.escapeHtml(folder.name)}</span>
                <span class="folder-count">${count}</span>
                ${folder.id !== 'default' ? '<button class="folder-delete">×</button>' : ''}
            `;
            
            folderEl.addEventListener('click', (e) => {
                if (!e.target.classList.contains('folder-delete')) {
                    this.selectFolder(folder.id);
                }
            });

            const deleteBtn = folderEl.querySelector('.folder-delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteFolder(folder.id);
                });
            }
            
            this.folderList.appendChild(folderEl);
        });
    }

    selectFolder(folderId) {
        this.state.currentFolderId = folderId;
        this.state.save();
        this.renderFolders();
        this.renderNotes();
    }

    openFolderModal() {
        document.getElementById('folderModal').classList.add('active');
        document.getElementById('folderNameInput').value = '';
        document.getElementById('folderNameInput').focus();
    }

    closeFolderModal() {
        document.getElementById('folderModal').classList.remove('active');
    }

    createFolder() {
        const name = document.getElementById('folderNameInput').value.trim();
        
        if (!name) {
            this.showToast('Please enter a folder name', 'error');
            return;
        }

        if (this.state.folders.some(f => f.name.toLowerCase() === name.toLowerCase())) {
            this.showToast('Folder already exists', 'error');
            return;
        }

        const folderId = 'folder_' + Date.now();
        const folder = new Folder(folderId, name);
        
        this.state.addFolder(folder);
        this.renderFolders();
        this.closeFolderModal();
        this.showToast('Folder created');
    }

    deleteFolder(folderId) {
        if (confirm('Delete this folder? Notes will be moved to "All Notes".')) {
            this.state.deleteFolder(folderId);
            this.renderFolders();
            this.renderNotes();
            this.showToast('Folder deleted');
        }
    }

    openShortcutsModal() {
        document.getElementById('shortcutsModal').classList.add('active');
    }

    closeShortcutsModal() {
        document.getElementById('shortcutsModal').classList.remove('active');
    }

    insertMarkdown(before, after, placeholder) {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const text = this.editor.value;
        const selectedText = text.substring(start, end) || placeholder;
        
        const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
        this.editor.value = newText;
        
        const newCursorPos = start + before.length + selectedText.length;
        this.editor.setSelectionRange(newCursorPos, newCursorPos);
        this.editor.focus();
        
        this.updatePreview();
        this.autoSave();
    }

    exportToHTML() {
        if (!this.state.currentNoteId) return;

        const note = this.state.getNote(this.state.currentNoteId);
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(note.title)}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; }
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
        }
        pre {
            background: #f4f4f4;
            padding: 1rem;
            border-radius: 5px;
            overflow-x: auto;
        }
        pre code { background: none; padding: 0; }
        blockquote {
            border-left: 4px solid #ddd;
            margin-left: 0;
            padding-left: 1rem;
            color: #666;
        }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    <h1>${this.escapeHtml(note.title)}</h1>
    ${marked.parse(note.content)}
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Exported to HTML');
    }

    exportToPDF() {
        if (!this.state.currentNoteId) return;

        const note = this.state.getNote(this.state.currentNoteId);
        const element = document.createElement('div');
        element.innerHTML = `
            <h1>${this.escapeHtml(note.title)}</h1>
            ${marked.parse(note.content)}
        `;
        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        element.style.lineHeight = '1.6';

        const opt = {
            margin: 10,
            filename: `${note.title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            this.showToast('Exported to PDF');
        }).catch(() => {
            this.showToast('Export failed', 'error');
        });
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast show ' + type;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MarkdownApp();
    });
} else {
    new MarkdownApp();
}