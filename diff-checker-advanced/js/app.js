// Advanced Diff Checker JavaScript

// Diff algorithm implementation
class DiffChecker {
  constructor() {
    this.text1 = '';
    this.text2 = '';
    this.language = 'javascript';
    this.diffResult = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadFromLocalStorage();
  }

  setupEventListeners() {
    // Text inputs
    document.getElementById('text1-input').addEventListener('input', (e) => {
      this.text1 = e.target.value;
      this.saveToLocalStorage();
    });

    document.getElementById('text2-input').addEventListener('input', (e) => {
      this.text2 = e.target.value;
      this.saveToLocalStorage();
    });

    // File inputs
    document.getElementById('file1-input').addEventListener('change', (e) => {
      this.handleFileUpload(e, 'text1-input');
    });

    document.getElementById('file2-input').addEventListener('change', (e) => {
      this.handleFileUpload(e, 'text2-input');
    });

    // Drag and drop
    this.setupDragAndDrop('drop-zone-1', 'text1-input');
    this.setupDragAndDrop('drop-zone-2', 'text2-input');

    // Language select
    document.getElementById('language-select').addEventListener('change', (e) => {
      this.language = e.target.value;
      this.saveToLocalStorage();
      if (this.diffResult) {
        this.renderDiff();
      }
    });

    // Buttons
    document.getElementById('compare-btn').addEventListener('click', () => {
      this.compare();
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
      this.clear();
    });

    document.getElementById('export-btn').addEventListener('click', () => {
      this.exportDiff();
    });
  }

  setupDragAndDrop(dropZoneId, textInputId) {
    const dropZone = document.getElementById(dropZoneId);
    const textInput = document.getElementById(textInputId);

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('drag-over');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.readFile(files[0], textInputId);
      }
    });
  }

  handleFileUpload(event, textInputId) {
    const file = event.target.files[0];
    if (file) {
      this.readFile(file, textInputId);
    }
  }

  readFile(file, textInputId) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const textInput = document.getElementById(textInputId);
      textInput.value = content;
      
      if (textInputId === 'text1-input') {
        this.text1 = content;
      } else {
        this.text2 = content;
      }
      
      this.saveToLocalStorage();
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  }

  compare() {
    this.text1 = document.getElementById('text1-input').value;
    this.text2 = document.getElementById('text2-input').value;

    if (!this.text1 && !this.text2) {
      alert('Please enter or upload text in both fields.');
      return;
    }

    const lines1 = this.text1.split('\n');
    const lines2 = this.text2.split('\n');

    this.diffResult = this.computeDiff(lines1, lines2);
    this.renderDiff();
    this.updateStats();
    
    // Show diff section
    document.getElementById('diff-section').style.display = 'block';
    document.getElementById('diff-section').scrollIntoView({ behavior: 'smooth' });
  }

  computeDiff(lines1, lines2) {
    const lcs = this.longestCommonSubsequence(lines1, lines2);
    const diff = [];
    
    let i = 0, j = 0, lcsIndex = 0;
    
    while (i < lines1.length || j < lines2.length) {
      if (lcsIndex < lcs.length && i < lines1.length && lines1[i] === lcs[lcsIndex]) {
        // Unchanged line
        diff.push({
          type: 'unchanged',
          leftLine: i + 1,
          rightLine: j + 1,
          leftContent: lines1[i],
          rightContent: lines1[i]
        });
        i++;
        j++;
        lcsIndex++;
      } else if (i < lines1.length && (lcsIndex >= lcs.length || lines1[i] !== lcs[lcsIndex])) {
        // Check if this line exists in text2
        const foundInText2 = j < lines2.length && lines2[j] === lines1[i];
        
        if (foundInText2) {
          diff.push({
            type: 'unchanged',
            leftLine: i + 1,
            rightLine: j + 1,
            leftContent: lines1[i],
            rightContent: lines2[j]
          });
          i++;
          j++;
          if (lcsIndex < lcs.length && lines1[i - 1] === lcs[lcsIndex]) {
            lcsIndex++;
          }
        } else {
          // Removed line
          diff.push({
            type: 'removed',
            leftLine: i + 1,
            rightLine: null,
            leftContent: lines1[i],
            rightContent: ''
          });
          i++;
        }
      } else if (j < lines2.length) {
        // Added line
        diff.push({
          type: 'added',
          leftLine: null,
          rightLine: j + 1,
          leftContent: '',
          rightContent: lines2[j]
        });
        j++;
      }
    }
    
    return diff;
  }

  longestCommonSubsequence(arr1, arr2) {
    const m = arr1.length;
    const n = arr2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (arr1[i - 1] === arr2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    // Backtrack to find the LCS
    const lcs = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (arr1[i - 1] === arr2[j - 1]) {
        lcs.unshift(arr1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    
    return lcs;
  }

  renderDiff() {
    const leftDiv = document.getElementById('diff-left');
    const rightDiv = document.getElementById('diff-right');
    
    leftDiv.innerHTML = '';
    rightDiv.innerHTML = '';
    
    this.diffResult.forEach((line, index) => {
      const leftLineDiv = document.createElement('div');
      const rightLineDiv = document.createElement('div');
      
      leftLineDiv.className = 'diff-line';
      rightLineDiv.className = 'diff-line';
      
      if (line.type === 'removed') {
        leftLineDiv.classList.add('removed');
        rightLineDiv.classList.add('empty');
        
        leftLineDiv.innerHTML = `
          <span class="line-number">${line.leftLine}</span>
          <span class="line-content">${this.highlightSyntax(this.escapeHtml(line.leftContent))}</span>
        `;
        rightLineDiv.innerHTML = `
          <span class="line-number"></span>
          <span class="line-content"></span>
        `;
      } else if (line.type === 'added') {
        leftLineDiv.classList.add('empty');
        rightLineDiv.classList.add('added');
        
        leftLineDiv.innerHTML = `
          <span class="line-number"></span>
          <span class="line-content"></span>
        `;
        rightLineDiv.innerHTML = `
          <span class="line-number">${line.rightLine}</span>
          <span class="line-content">${this.highlightSyntax(this.escapeHtml(line.rightContent))}</span>
        `;
      } else {
        leftLineDiv.classList.add('unchanged');
        rightLineDiv.classList.add('unchanged');
        
        leftLineDiv.innerHTML = `
          <span class="line-number">${line.leftLine}</span>
          <span class="line-content">${this.highlightSyntax(this.escapeHtml(line.leftContent))}</span>
        `;
        rightLineDiv.innerHTML = `
          <span class="line-number">${line.rightLine}</span>
          <span class="line-content">${this.highlightSyntax(this.escapeHtml(line.rightContent))}</span>
        `;
      }
      
      leftDiv.appendChild(leftLineDiv);
      rightDiv.appendChild(rightLineDiv);
    });
    
    // Sync scrolling
    this.syncScroll();
  }

  syncScroll() {
    const leftDiv = document.getElementById('diff-left');
    const rightDiv = document.getElementById('diff-right');
    
    let isSyncing = false;
    
    leftDiv.addEventListener('scroll', () => {
      if (!isSyncing) {
        isSyncing = true;
        rightDiv.scrollTop = leftDiv.scrollTop;
        rightDiv.scrollLeft = leftDiv.scrollLeft;
        setTimeout(() => { isSyncing = false; }, 10);
      }
    });
    
    rightDiv.addEventListener('scroll', () => {
      if (!isSyncing) {
        isSyncing = true;
        leftDiv.scrollTop = rightDiv.scrollTop;
        leftDiv.scrollLeft = rightDiv.scrollLeft;
        setTimeout(() => { isSyncing = false; }, 10);
      }
    });
  }

  highlightSyntax(code) {
    if (!code || code.trim() === '') {
      return code;
    }
    
    try {
      if (this.language !== 'plaintext' && typeof Prism !== 'undefined' && Prism.languages[this.language]) {
        return Prism.highlight(code, Prism.languages[this.language], this.language);
      }
    } catch (e) {
      console.error('Syntax highlighting error:', e);
    }
    
    return code;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  updateStats() {
    const added = this.diffResult.filter(line => line.type === 'added').length;
    const removed = this.diffResult.filter(line => line.type === 'removed').length;
    const unchanged = this.diffResult.filter(line => line.type === 'unchanged').length;
    
    document.getElementById('added-lines').textContent = added;
    document.getElementById('removed-lines').textContent = removed;
    document.getElementById('unchanged-lines').textContent = unchanged;
  }

  clear() {
    document.getElementById('text1-input').value = '';
    document.getElementById('text2-input').value = '';
    document.getElementById('file1-input').value = '';
    document.getElementById('file2-input').value = '';
    
    this.text1 = '';
    this.text2 = '';
    this.diffResult = null;
    
    document.getElementById('diff-left').innerHTML = '';
    document.getElementById('diff-right').innerHTML = '';
    document.getElementById('diff-section').style.display = 'none';
    
    document.getElementById('added-lines').textContent = '0';
    document.getElementById('removed-lines').textContent = '0';
    document.getElementById('unchanged-lines').textContent = '0';
    
    localStorage.removeItem('diffChecker_text1');
    localStorage.removeItem('diffChecker_text2');
    localStorage.removeItem('diffChecker_language');
  }

  exportDiff() {
    if (!this.diffResult) {
      alert('Please compare texts first before exporting.');
      return;
    }
    
    const added = this.diffResult.filter(line => line.type === 'added').length;
    const removed = this.diffResult.filter(line => line.type === 'removed').length;
    const unchanged = this.diffResult.filter(line => line.type === 'unchanged').length;
    
    let report = '='.repeat(80) + '\n';
    report += 'DIFF REPORT\n';
    report += '='.repeat(80) + '\n\n';
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `Language: ${this.language}\n\n`;
    report += `Statistics:\n`;
    report += `  Added lines: ${added}\n`;
    report += `  Removed lines: ${removed}\n`;
    report += `  Unchanged lines: ${unchanged}\n`;
    report += `  Total lines: ${this.diffResult.length}\n\n`;
    report += '='.repeat(80) + '\n\n';
    
    this.diffResult.forEach((line) => {
      if (line.type === 'removed') {
        report += `- [Line ${line.leftLine}] ${line.leftContent}\n`;
      } else if (line.type === 'added') {
        report += `+ [Line ${line.rightLine}] ${line.rightContent}\n`;
      } else {
        report += `  [Line ${line.leftLine}/${line.rightLine}] ${line.leftContent}\n`;
      }
    });
    
    report += '\n' + '='.repeat(80) + '\n';
    report += 'END OF REPORT\n';
    report += '='.repeat(80) + '\n';
    
    // Export using FileSaver if available, otherwise use fallback
    if (typeof saveAs !== 'undefined') {
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `diff-report-${Date.now()}.txt`);
    } else {
      // Fallback method
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diff-report-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem('diffChecker_text1', this.text1);
      localStorage.setItem('diffChecker_text2', this.text2);
      localStorage.setItem('diffChecker_language', this.language);
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }

  loadFromLocalStorage() {
    try {
      const text1 = localStorage.getItem('diffChecker_text1');
      const text2 = localStorage.getItem('diffChecker_text2');
      const language = localStorage.getItem('diffChecker_language');
      
      if (text1) {
        document.getElementById('text1-input').value = text1;
        this.text1 = text1;
      }
      
      if (text2) {
        document.getElementById('text2-input').value = text2;
        this.text2 = text2;
      }
      
      if (language) {
        document.getElementById('language-select').value = language;
        this.language = language;
      }
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }
}

// Initialize the diff checker when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DiffChecker();
  });
} else {
  new DiffChecker();
}