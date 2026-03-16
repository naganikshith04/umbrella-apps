// Import required libraries
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-html';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import { saveAs } from 'file-saver';

class SnippetManager {
    constructor() {
        this.snippets = this.loadSnippets();
        this.currentSnippetId = null;
        this.editMode = false;
        this.currentFilter = { category: 'all', tag: 'all', search: '' };
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        this.elements = {
            addSnippetBtn: document.getElementById('addSnippetBtn'),
            cancelBtn: document.getElementById('cancelBtn'),
            categoryList: document.getElementById('categoryList'),
            closeModal: document.getElementById('closeModal'),
            closeViewModal: document.getElementById('closeViewModal'),
            copyCodeBtn: document.getElementById('copyCodeBtn'),
            deleteSnippetBtn: document.getElementById('deleteSnippetBtn'),
            editSnippetBtn: document.getElementById('editSnippetBtn'),
            exportAllBtn: document.getElementById('exportAllBtn'),
            exportSnippetBtn: document.getElementById('exportSnippetBtn'),
            modalTitle: document.getElementById('modalTitle'),
            searchInput: document.getElementById('searchInput'),
            snippetCategory: document.getElementById('snippetCategory'),
            snippetCode: document.getElementById('snippetCode'),
            snippetDescription: document.getElementById('snippetDescription'),
            snippetForm: document.getElementById('snippetForm'),
            snippetGrid: document.getElementById('snippetGrid'),
            snippetLanguage: document.getElementById('snippetLanguage'),
            snippetModal: document.getElementById('snippetModal'),
            snippetTags: document.getElementById('snippetTags'),
            snippetTitle: document.getElementById('snippetTitle'),
            tagCloud: document.getElementById('tagCloud'),
            totalSnippets: document.getElementById('totalSnippets'),
            viewCategory: document.getElementById('viewCategory'),
            viewCode: document.getElementById('viewCode'),
            viewDescription: document.getElementById('viewDescription'),
            viewModal: document.getElementById('viewModal'),
            viewTags: document.getElementById('viewTags'),
            viewTitle: document.getElementById('viewTitle')
        };
    }

    attachEventListeners() {
        this.elements.addSnippetBtn.addEventListener('click', () => this.openAddModal());
        this.elements.closeModal.addEventListener('click', () => this.closeAddModal());
        this.elements.closeViewModal.addEventListener('click', () => this.closeViewModalHandler());
        this.elements.cancelBtn.addEventListener('click', () => this.closeAddModal());
        this.elements.snippetForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        this.elements.exportAllBtn.addEventListener('click', () => this.exportAll());
        this.elements.copyCodeBtn.addEventListener('click', () => this.copyCode());
        this.elements.editSnippetBtn.addEventListener('click', () => this.editCurrentSnippet());
        this.elements.deleteSnippetBtn.addEventListener('click', () => this.deleteCurrentSnippet());
        this.elements.exportSnippetBtn.addEventListener('click', () => this.exportCurrentSnippet());

        this.elements.snippetModal.addEventListener('click', (e) => {
            if (e.target === this.elements.snippetModal) {
                this.closeAddModal();
            }
        });

        this.elements.viewModal.addEventListener('click', (e) => {
            if (e.target === this.elements.viewModal) {
                this.closeViewModalHandler();
            }
        });
    }

    loadSnippets() {
        const stored = localStorage.getItem('codeSnippets');
        return stored ? JSON.parse(stored) : [];
    }

    saveSnippets() {
        localStorage.setItem('codeSnippets', JSON.stringify(this.snippets));
    }

    openAddModal() {
        this.editMode = false;
        this.currentSnippetId = null;
        this.elements.modalTitle.textContent = 'Add New Snippet';
        this.elements.snippetForm.reset();
        this.elements.snippetModal.classList.add('active');
    }

    closeAddModal() {
        this.elements.snippetModal.classList.remove('active');
        this.elements.snippetForm.reset();
        this.editMode = false;
        this.currentSnippetId = null;
    }

    closeViewModalHandler() {
        this.elements.viewModal.classList.remove('active');
        this.currentSnippetId = null;
    }

    handleSubmit(e) {
        e.preventDefault();

        const title = this.elements.snippetTitle.value.trim();
        const description = this.elements.snippetDescription.value.trim();
        const code = this.elements.snippetCode.value.trim();
        const language = this.elements.snippetLanguage.value;
        const category = this.elements.snippetCategory.value;
        const tagsInput = this.elements.snippetTags.value.trim();

        if (!title || !code) {
            alert('Title and code are required!');
            return;
        }

        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        const snippet = {
            id: this.editMode ? this.currentSnippetId : Date.now(),
            title,
            description,
            code,
            language,
            category,
            tags,
            createdAt: this.editMode ? this.snippets.find(s => s.id === this.currentSnippetId).createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.editMode) {
            const index = this.snippets.findIndex(s => s.id === this.currentSnippetId);
            this.snippets[index] = snippet;
        } else {
            this.snippets.unshift(snippet);
        }

        this.saveSnippets();
        this.closeAddModal();
        this.render();
    }

    handleSearch(e) {
        this.currentFilter.search = e.target.value.toLowerCase().trim();
        this.renderSnippets();
    }

    filterSnippets() {
        return this.snippets.filter(snippet => {
            const matchesSearch = !this.currentFilter.search || 
                snippet.title.toLowerCase().includes(this.currentFilter.search) ||
                snippet.description.toLowerCase().includes(this.currentFilter.search) ||
                snippet.code.toLowerCase().includes(this.currentFilter.search) ||
                snippet.tags.some(tag => tag.toLowerCase().includes(this.currentFilter.search));

            const matchesCategory = this.currentFilter.category === 'all' || 
                snippet.category === this.currentFilter.category;

            const matchesTag = this.currentFilter.tag === 'all' || 
                snippet.tags.includes(this.currentFilter.tag);

            return matchesSearch && matchesCategory && matchesTag;
        });
    }

    renderSnippets() {
        const filtered = this.filterSnippets();
        
        if (filtered.length === 0) {
            this.elements.snippetGrid.innerHTML = `
                <div class="empty-state">
                    <p>No snippets found. ${this.snippets.length === 0 ? 'Add your first snippet!' : 'Try adjusting your filters.'}</p>
                </div>
            `;
            return;
        }

        this.elements.snippetGrid.innerHTML = filtered.map(snippet => `
            <div class="snippet-card" data-id="${snippet.id}">
                <div class="snippet-header">
                    <h3 class="snippet-title">${this.escapeHtml(snippet.title)}</h3>
                    <span class="snippet-language">${this.escapeHtml(snippet.language)}</span>
                </div>
                ${snippet.description ? `<p class="snippet-description">${this.escapeHtml(snippet.description)}</p>` : ''}
                <div class="snippet-code-preview">
                    <pre><code class="language-${snippet.language}">${this.escapeHtml(snippet.code.substring(0, 150))}${snippet.code.length > 150 ? '...' : ''}</code></pre>
                </div>
                <div class="snippet-meta">
                    <span class="snippet-category">${this.escapeHtml(snippet.category)}</span>
                    ${snippet.tags.length > 0 ? `
                        <div class="snippet-tags">
                            ${snippet.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="snippet-actions">
                    <button class="btn-icon view-btn" data-id="${snippet.id}" title="View">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 3C4.5 3 1.7 5.6 1 8c.7 2.4 3.5 5 7 5s6.3-2.6 7-5c-.7-2.4-3.5-5-7-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
                            <circle cx="8" cy="8" r="1.5"/>
                        </svg>
                    </button>
                    <button class="btn-icon edit-btn" data-id="${snippet.id}" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M12.854 1.146a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.708-.708l10-10a.5.5 0 0 1 .708 0z"/>
                            <path d="M11.5 1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h1.293L1 13.293V12a.5.5 0 0 1 1 0v2.5a.5.5 0 0 1-.5.5H1a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v1.293L11.793 3H11a.5.5 0 0 1 0-1h2z"/>
                        </svg>
                    </button>
                    <button class="btn-icon delete-btn" data-id="${snippet.id}" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        this.elements.snippetGrid.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.viewSnippet(id);
            });
        });

        this.elements.snippetGrid.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.editSnippet(id);
            });
        });

        this.elements.snippetGrid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.deleteSnippet(id);
            });
        });

        Prism.highlightAll();
    }

    viewSnippet(id) {
        const snippet = this.snippets.find(s => s.id === id);
        if (!snippet) return;

        this.currentSnippetId = id;
        this.elements.viewTitle.textContent = snippet.title;
        this.elements.viewDescription.textContent = snippet.description || 'No description';
        this.elements.viewCategory.textContent = snippet.category;
        
        const highlightedCode = Prism.highlight(snippet.code, Prism.languages[snippet.language] || Prism.languages.plaintext, snippet.language);
        this.elements.viewCode.innerHTML = `<pre><code class="language-${snippet.language}">${highlightedCode}</code></pre>`;
        
        if (snippet.tags.length > 0) {
            this.elements.viewTags.innerHTML = snippet.tags.map(tag => 
                `<span class="tag">${this.escapeHtml(tag)}</span>`
            ).join('');
        } else {
            this.elements.viewTags.innerHTML = '<span class="no-tags">No tags</span>';
        }

        this.elements.viewModal.classList.add('active');
    }

    editSnippet(id) {
        const snippet = this.snippets.find(s => s.id === id);
        if (!snippet) return;

        this.editMode = true;
        this.currentSnippetId = id;
        this.elements.modalTitle.textContent = 'Edit Snippet';
        this.elements.snippetTitle.value = snippet.title;
        this.elements.snippetDescription.value = snippet.description;
        this.elements.snippetCode.value = snippet.code;
        this.elements.snippetLanguage.value = snippet.language;
        this.elements.snippetCategory.value = snippet.category;
        this.elements.snippetTags.value = snippet.tags.join(', ');
        this.elements.snippetModal.classList.add('active');
    }

    deleteSnippet(id) {
        if (!confirm('Are you sure you want to delete this snippet?')) return;

        this.snippets = this.snippets.filter(s => s.id !== id);
        this.saveSnippets();
        this.render();
    }

    editCurrentSnippet() {
        this.closeViewModalHandler();
        this.editSnippet(this.currentSnippetId);
    }

    deleteCurrentSnippet() {
        if (!confirm('Are you sure you want to delete this snippet?')) return;
        
        this.snippets = this.snippets.filter(s => s.id !== this.currentSnippetId);
        this.saveSnippets();
        this.closeViewModalHandler();
        this.render();
    }

    copyCode() {
        const snippet = this.snippets.find(s => s.id === this.currentSnippetId);
        if (!snippet) return;

        navigator.clipboard.writeText(snippet.code).then(() => {
            const btn = this.elements.copyCodeBtn;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg> Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            alert('Failed to copy code');
            console.error(err);
        });
    }

    exportCurrentSnippet() {
        const snippet = this.snippets.find(s => s.id === this.currentSnippetId);
        if (!snippet) return;

        this.exportSnippets([snippet], `${snippet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
    }

    exportAll() {
        if (this.snippets.length === 0) {
            alert('No snippets to export!');
            return;
        }

        this.exportSnippets(this.snippets, 'all_snippets.json');
    }

    exportSnippets(snippets, filename) {
        const data = JSON.stringify(snippets, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        saveAs(blob, filename);
    }

    renderCategories() {
        const categories = ['all', ...new Set(this.snippets.map(s => s.category))];
        
        this.elements.categoryList.innerHTML = categories.map(cat => `
            <button class="category-btn ${this.currentFilter.category === cat ? 'active' : ''}" data-category="${cat}">
                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                ${cat !== 'all' ? `<span class="count">${this.snippets.filter(s => s.category === cat).length}</span>` : ''}
            </button>
        `).join('');

        this.elements.categoryList.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter.category = e.currentTarget.dataset.category;
                this.renderCategories();
                this.renderSnippets();
            });
        });
    }

    renderTagCloud() {
        const tagCount = {};
        this.snippets.forEach(snippet => {
            snippet.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        });

        const tags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);

        if (tags.length === 0) {
            this.elements.tagCloud.innerHTML = '<p class="no-tags">No tags yet</p>';
            return;
        }

        this.elements.tagCloud.innerHTML = `
            <button class="tag-cloud-item ${this.currentFilter.tag === 'all' ? 'active' : ''}" data-tag="all">
                All Tags
            </button>
            ${tags.map(([tag, count]) => `
                <button class="tag-cloud-item ${this.currentFilter.tag === tag ? 'active' : ''}" data-tag="${tag}">
                    ${this.escapeHtml(tag)} <span class="count">${count}</span>
                </button>
            `).join('')}
        `;

        this.elements.tagCloud.querySelectorAll('.tag-cloud-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter.tag = e.currentTarget.dataset.tag;
                this.renderTagCloud();
                this.renderSnippets();
            });
        });
    }

    updateStats() {
        this.elements.totalSnippets.textContent = this.snippets.length;
    }

    render() {
        this.renderSnippets();
        this.renderCategories();
        this.renderTagCloud();
        this.updateStats();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SnippetManager();
});