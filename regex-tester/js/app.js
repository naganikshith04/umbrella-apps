// Regex Tester Pro - Complete Implementation

class RegexTesterPro {
    constructor() {
        this.testStrings = [];
        this.currentMatches = [];
        this.commonPatterns = {
            'Email': { pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
            'URL': { pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', flags: 'gi' },
            'Phone (US)': { pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', flags: 'g' },
            'Date (YYYY-MM-DD)': { pattern: '\\d{4}-\\d{2}-\\d{2}', flags: 'g' },
            'Date (MM/DD/YYYY)': { pattern: '\\d{2}/\\d{2}/\\d{4}', flags: 'g' },
            'Time (24h)': { pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9]', flags: 'g' },
            'IP Address': { pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: 'g' },
            'Hex Color': { pattern: '#[0-9A-Fa-f]{6}\\b|#[0-9A-Fa-f]{3}\\b', flags: 'g' },
            'Username': { pattern: '[a-zA-Z0-9_-]{3,16}', flags: 'g' },
            'Password (Strong)': { pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}', flags: '' },
            'Credit Card': { pattern: '\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}', flags: 'g' },
            'Postal Code (US)': { pattern: '\\d{5}(-\\d{4})?', flags: 'g' },
            'HTML Tag': { pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)', flags: 'gi' },
            'Number (Integer)': { pattern: '-?\\d+', flags: 'g' },
            'Number (Decimal)': { pattern: '-?\\d+\\.\\d+', flags: 'g' },
            'Word': { pattern: '\\b\\w+\\b', flags: 'g' },
            'Whitespace': { pattern: '\\s+', flags: 'g' },
            'UUID': { pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}', flags: 'g' }
        };
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.loadFromLocalStorage();
        this.attachEventListeners();
        this.createCommonPatternsLibrary();
        this.addInitialTestString();
    }

    cacheElements() {
        this.elements = {
            regexPattern: document.getElementById('regex-pattern'),
            flagG: document.getElementById('flag-g'),
            flagI: document.getElementById('flag-i'),
            flagM: document.getElementById('flag-m'),
            flagS: document.getElementById('flag-s'),
            testStringsContainer: document.getElementById('test-strings-container'),
            addStringBtn: document.getElementById('add-string-btn'),
            resultsContainer: document.getElementById('results-container'),
            matchesTable: document.getElementById('matches-table'),
            matchesTbody: document.getElementById('matches-tbody'),
            totalMatches: document.getElementById('total-matches'),
            stringsTested: document.getElementById('strings-tested'),
            stringsMatched: document.getElementById('strings-matched'),
            explanationContainer: document.getElementById('explanation-container'),
            exportTxtBtn: document.getElementById('export-txt-btn'),
            exportJsonBtn: document.getElementById('export-json-btn')
        };
    }

    attachEventListeners() {
        this.elements.regexPattern.addEventListener('input', () => this.handleRegexChange());
        this.elements.flagG.addEventListener('change', () => this.handleRegexChange());
        this.elements.flagI.addEventListener('change', () => this.handleRegexChange());
        this.elements.flagM.addEventListener('change', () => this.handleRegexChange());
        this.elements.flagS.addEventListener('change', () => this.handleRegexChange());
        this.elements.addStringBtn.addEventListener('click', () => this.addTestString());
        this.elements.exportTxtBtn.addEventListener('click', () => this.exportAsTxt());
        this.elements.exportJsonBtn.addEventListener('click', () => this.exportAsJson());
    }

    addInitialTestString() {
        if (this.testStrings.length === 0) {
            this.addTestString('Enter your test string here...');
        }
    }

    addTestString(defaultValue = '') {
        const stringId = Date.now();
        const stringWrapper = document.createElement('div');
        stringWrapper.className = 'test-string-wrapper';
        stringWrapper.dataset.stringId = stringId;

        stringWrapper.innerHTML = `
            <div class="test-string-header">
                <span class="test-string-label">Test String ${this.testStrings.length + 1}</span>
                <button class="remove-string-btn" title="Remove this test string">×</button>
            </div>
            <textarea class="test-string-input" placeholder="Enter test string...">${defaultValue}</textarea>
            <div class="test-string-result"></div>
        `;

        this.elements.testStringsContainer.appendChild(stringWrapper);

        const textarea = stringWrapper.querySelector('.test-string-input');
        const removeBtn = stringWrapper.querySelector('.remove-string-btn');

        textarea.addEventListener('input', () => this.handleTestStringChange());
        removeBtn.addEventListener('click', () => this.removeTestString(stringId));

        this.testStrings.push({ id: stringId, value: defaultValue });
        this.handleRegexChange();
    }

    removeTestString(stringId) {
        const wrapper = this.elements.testStringsContainer.querySelector(`[data-string-id="${stringId}"]`);
        if (wrapper) {
            wrapper.remove();
            this.testStrings = this.testStrings.filter(s => s.id !== stringId);
            this.updateStringLabels();
            this.handleRegexChange();
        }
    }

    updateStringLabels() {
        const wrappers = this.elements.testStringsContainer.querySelectorAll('.test-string-wrapper');
        wrappers.forEach((wrapper, index) => {
            const label = wrapper.querySelector('.test-string-label');
            label.textContent = `Test String ${index + 1}`;
        });
    }

    handleTestStringChange() {
        this.syncTestStrings();
        this.testRegex();
    }

    syncTestStrings() {
        const wrappers = this.elements.testStringsContainer.querySelectorAll('.test-string-wrapper');
        wrappers.forEach(wrapper => {
            const stringId = parseInt(wrapper.dataset.stringId);
            const textarea = wrapper.querySelector('.test-string-input');
            const stringObj = this.testStrings.find(s => s.id === stringId);
            if (stringObj) {
                stringObj.value = textarea.value;
            }
        });
    }

    handleRegexChange() {
        this.saveToLocalStorage();
        this.testRegex();
        this.explainRegex();
    }

    getFlags() {
        let flags = '';
        if (this.elements.flagG.checked) flags += 'g';
        if (this.elements.flagI.checked) flags += 'i';
        if (this.elements.flagM.checked) flags += 'm';
        if (this.elements.flagS.checked) flags += 's';
        return flags;
    }

    testRegex() {
        const pattern = this.elements.regexPattern.value;
        
        if (!pattern) {
            this.clearResults();
            return;
        }

        try {
            const flags = this.getFlags();
            const regex = new RegExp(pattern, flags);
            
            this.currentMatches = [];
            let totalMatches = 0;
            let stringsWithMatches = 0;

            this.syncTestStrings();

            this.testStrings.forEach(testString => {
                const wrapper = this.elements.testStringsContainer.querySelector(`[data-string-id="${testString.id}"]`);
                const resultDiv = wrapper.querySelector('.test-string-result');
                
                const matches = [];
                let match;
                
                if (flags.includes('g')) {
                    const globalRegex = new RegExp(pattern, flags);
                    while ((match = globalRegex.exec(testString.value)) !== null) {
                        matches.push({
                            text: match[0],
                            index: match.index,
                            groups: match.slice(1)
                        });
                        if (match[0].length === 0) break;
                    }
                } else {
                    match = regex.exec(testString.value);
                    if (match) {
                        matches.push({
                            text: match[0],
                            index: match.index,
                            groups: match.slice(1)
                        });
                    }
                }

                if (matches.length > 0) {
                    stringsWithMatches++;
                    totalMatches += matches.length;
                    this.highlightMatches(testString.value, matches, resultDiv);
                    
                    matches.forEach(m => {
                        this.currentMatches.push({
                            stringId: testString.id,
                            match: m.text,
                            index: m.index,
                            groups: m.groups
                        });
                    });
                } else {
                    resultDiv.innerHTML = '<span class="no-match">No matches found</span>';
                }
            });

            this.updateStats(totalMatches, this.testStrings.length, stringsWithMatches);
            this.displayMatchesTable();
            this.elements.resultsContainer.style.display = 'block';

        } catch (error) {
            this.showError(error.message);
        }
    }

    highlightMatches(text, matches, container) {
        if (matches.length === 0) {
            container.textContent = text;
            return;
        }

        let html = '';
        let lastIndex = 0;

        matches.forEach(match => {
            html += this.escapeHtml(text.substring(lastIndex, match.index));
            html += `<span class="highlight">${this.escapeHtml(match.text)}</span>`;
            lastIndex = match.index + match.text.length;
        });

        html += this.escapeHtml(text.substring(lastIndex));
        container.innerHTML = html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    displayMatchesTable() {
        this.elements.matchesTbody.innerHTML = '';

        if (this.currentMatches.length === 0) {
            this.elements.matchesTable.style.display = 'none';
            return;
        }

        this.elements.matchesTable.style.display = 'table';

        this.currentMatches.forEach((match, index) => {
            const row = document.createElement('tr');
            
            const stringIndex = this.testStrings.findIndex(s => s.id === match.stringId) + 1;
            
            let groupsHtml = match.groups.length > 0 
                ? match.groups.map((g, i) => `<div class="group-item"><strong>Group ${i + 1}:</strong> ${this.escapeHtml(g || '')}</div>`).join('')
                : '<span class="no-groups">No groups</span>';

            row.innerHTML = `
                <td>${index + 1}</td>
                <td><code>${this.escapeHtml(match.match)}</code></td>
                <td>String ${stringIndex}</td>
                <td>${match.index}</td>
                <td class="groups-cell">${groupsHtml}</td>
            `;

            this.elements.matchesTbody.appendChild(row);
        });
    }

    updateStats(totalMatches, stringsTested, stringsMatched) {
        this.elements.totalMatches.textContent = totalMatches;
        this.elements.stringsTested.textContent = stringsTested;
        this.elements.stringsMatched.textContent = stringsMatched;
    }

    clearResults() {
        this.elements.resultsContainer.style.display = 'none';
        this.currentMatches = [];
        
        const resultDivs = this.elements.testStringsContainer.querySelectorAll('.test-string-result');
        resultDivs.forEach(div => div.innerHTML = '');
        
        this.elements.matchesTbody.innerHTML = '';
        this.updateStats(0, 0, 0);
    }

    showError(message) {
        this.clearResults();
        
        const resultDivs = this.elements.testStringsContainer.querySelectorAll('.test-string-result');
        resultDivs.forEach(div => {
            div.innerHTML = `<span class="error-message">Invalid regex: ${this.escapeHtml(message)}</span>`;
        });
    }

    explainRegex() {
        const pattern = this.elements.regexPattern.value;
        
        if (!pattern) {
            this.elements.explanationContainer.innerHTML = '<p class="explanation-empty">Enter a regex pattern to see its explanation</p>';
            return;
        }

        const explanations = [];

        // Character classes
        if (pattern.includes('\\d')) explanations.push('<strong>\\d</strong> - Matches any digit (0-9)');
        if (pattern.includes('\\D')) explanations.push('<strong>\\D</strong> - Matches any non-digit');
        if (pattern.includes('\\w')) explanations.push('<strong>\\w</strong> - Matches any word character (a-z, A-Z, 0-9, _)');
        if (pattern.includes('\\W')) explanations.push('<strong>\\W</strong> - Matches any non-word character');
        if (pattern.includes('\\s')) explanations.push('<strong>\\s</strong> - Matches any whitespace character');
        if (pattern.includes('\\S')) explanations.push('<strong>\\S</strong> - Matches any non-whitespace character');
        if (pattern.includes('.')) explanations.push('<strong>.</strong> - Matches any character except newline');

        // Anchors
        if (pattern.includes('^')) explanations.push('<strong>^</strong> - Matches the start of a line');
        if (pattern.includes('$')) explanations.push('<strong>$</strong> - Matches the end of a line');
        if (pattern.includes('\\b')) explanations.push('<strong>\\b</strong> - Matches a word boundary');
        if (pattern.includes('\\B')) explanations.push('<strong>\\B</strong> - Matches a non-word boundary');

        // Quantifiers
        if (pattern.includes('*')) explanations.push('<strong>*</strong> - Matches 0 or more times');
        if (pattern.includes('+')) explanations.push('<strong>+</strong> - Matches 1 or more times');
        if (pattern.includes('?')) explanations.push('<strong>?</strong> - Matches 0 or 1 time (optional)');
        if (pattern.match(/\{(\d+)\}/)) explanations.push('<strong>{n}</strong> - Matches exactly n times');
        if (pattern.match(/\{(\d+),\}/)) explanations.push('<strong>{n,}</strong> - Matches n or more times');
        if (pattern.match(/\{(\d+),(\d+)\}/)) explanations.push('<strong>{n,m}</strong> - Matches between n and m times');

        // Groups
        if (pattern.includes('(')) explanations.push('<strong>( )</strong> - Capturing group');
        if (pattern.includes('(?:')) explanations.push('<strong>(?:)</strong> - Non-capturing group');
        if (pattern.includes('(?=')) explanations.push('<strong>(?=)</strong> - Positive lookahead');
        if (pattern.includes('(?!')) explanations.push('<strong>(?!)</strong> - Negative lookahead');
        if (pattern.includes('(?<=')) explanations.push('<strong>(?<=)</strong> - Positive lookbehind');
        if (pattern.includes('(?<!')) explanations.push('<strong>(?<!)</strong> - Negative lookbehind');

        // Character sets
        if (pattern.includes('[')) explanations.push('<strong>[ ]</strong> - Character set (matches any character inside)');
        if (pattern.includes('[^')) explanations.push('<strong>[^]</strong> - Negated character set');

        // Alternation
        if (pattern.includes('|')) explanations.push('<strong>|</strong> - Alternation (OR)');

        // Flags
        const flags = this.getFlags();
        if (flags.includes('g')) explanations.push('<strong>g flag</strong> - Global search (find all matches)');
        if (flags.includes('i')) explanations.push('<strong>i flag</strong> - Case-insensitive search');
        if (flags.includes('m')) explanations.push('<strong>m flag</strong> - Multi-line search');
        if (flags.includes('s')) explanations.push('<strong>s flag</strong> - Dot matches newline');

        if (explanations.length === 0) {
            this.elements.explanationContainer.innerHTML = '<p class="explanation-empty">No special regex syntax detected</p>';
        } else {
            this.elements.explanationContainer.innerHTML = `
                <div class="explanation-title">Pattern Explanation:</div>
                <ul class="explanation-list">
                    ${explanations.map(exp => `<li>${exp}</li>`).join('')}
                </ul>
            `;
        }
    }

    createCommonPatternsLibrary() {
        const libraryContainer = document.querySelector('.patterns-library');
        if (!libraryContainer) return;

        libraryContainer.innerHTML = '<h3>Common Patterns</h3>';

        const grid = document.createElement('div');
        grid.className = 'patterns-grid';

        Object.entries(this.commonPatterns).forEach(([name, data]) => {
            const button = document.createElement('button');
            button.className = 'pattern-btn';
            button.textContent = name;
            button.title = `Click to use: ${data.pattern}`;
            
            button.addEventListener('click', () => {
                this.elements.regexPattern.value = data.pattern;
                
                this.elements.flagG.checked = data.flags.includes('g');
                this.elements.flagI.checked = data.flags.includes('i');
                this.elements.flagM.checked = data.flags.includes('m');
                this.elements.flagS.checked = data.flags.includes('s');
                
                this.handleRegexChange();
            });

            grid.appendChild(button);
        });

        libraryContainer.appendChild(grid);
    }

    exportAsTxt() {
        const pattern = this.elements.regexPattern.value;
        const flags = this.getFlags();
        
        let content = `Regex Pattern: /${pattern}/${flags}\n`;
        content += `Date: ${new Date().toLocaleString()}\n`;
        content += `\n${'='.repeat(50)}\n\n`;
        
        content += `Statistics:\n`;
        content += `- Total Matches: ${this.elements.totalMatches.textContent}\n`;
        content += `- Strings Tested: ${this.elements.stringsTested.textContent}\n`;
        content += `- Strings Matched: ${this.elements.stringsMatched.textContent}\n\n`;
        
        content += `${'='.repeat(50)}\n\n`;
        
        if (this.currentMatches.length > 0) {
            content += `Matches:\n\n`;
            
            this.currentMatches.forEach((match, index) => {
                const stringIndex = this.testStrings.findIndex(s => s.id === match.stringId) + 1;
                content += `Match #${index + 1}:\n`;
                content += `  Text: ${match.match}\n`;
                content += `  String: ${stringIndex}\n`;
                content += `  Position: ${match.index}\n`;
                if (match.groups.length > 0) {
                    content += `  Groups:\n`;
                    match.groups.forEach((group, i) => {
                        content += `    Group ${i + 1}: ${group || '(empty)'}\n`;
                    });
                }
                content += `\n`;
            });
        }
        
        content += `${'='.repeat(50)}\n\n`;
        content += `Test Strings:\n\n`;
        
        this.testStrings.forEach((testString, index) => {
            content += `String ${index + 1}:\n${testString.value}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `regex-test-${Date.now()}.txt`);
    }

    exportAsJson() {
        const pattern = this.elements.regexPattern.value;
        const flags = this.getFlags();
        
        const data = {
            regex: {
                pattern: pattern,
                flags: flags,
                fullPattern: `/${pattern}/${flags}`
            },
            timestamp: new Date().toISOString(),
            statistics: {
                totalMatches: parseInt(this.elements.totalMatches.textContent),
                stringsTested: parseInt(this.elements.stringsTested.textContent),
                stringsMatched: parseInt(this.elements.stringsMatched.textContent)
            },
            testStrings: this.testStrings.map((ts, index) => ({
                id: index + 1,
                value: ts.value
            })),
            matches: this.currentMatches.map((match, index) => {
                const stringIndex = this.testStrings.findIndex(s => s.id === match.stringId) + 1;
                return {
                    id: index + 1,
                    text: match.match,
                    stringId: stringIndex,
                    position: match.index,
                    groups: match.groups
                };
            })
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        saveAs(blob, `regex-test-${Date.now()}.json`);
    }

    saveToLocalStorage() {
        try {
            const data = {
                pattern: this.elements.regexPattern.value,
                flags: {
                    g: this.elements.flagG.checked,
                    i: this.elements.flagI.checked,
                    m: this.elements.flagM.checked,
                    s: this.elements.flagS.checked
                },
                testStrings: this.testStrings
            };
            localStorage.setItem('regexTesterPro', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('regexTesterPro');
            if (saved) {
                const data = JSON.parse(saved);
                
                this.elements.regexPattern.value = data.pattern || '';
                this.elements.flagG.checked = data.flags?.g || false;
                this.elements.flagI.checked = data.flags?.i || false;
                this.elements.flagM.checked = data.flags?.m || false;
                this.elements.flagS.checked = data.flags?.s || false;
                
                if (data.testStrings && data.testStrings.length > 0) {
                    data.testStrings.forEach(ts => {
                        this.addTestString(ts.value);
                    });
                }
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
    }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new RegexTesterPro();
    });
} else {
    new RegexTesterPro();
}