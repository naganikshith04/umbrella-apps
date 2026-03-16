// Import libraries
import Prism from 'prismjs';
import { saveAs } from 'file-saver';

// Markdown parser
class MarkdownParser {
  constructor() {
    this.rules = [
      // Headers
      { pattern: /^### (.*$)/gim, replacement: '<h3>$1</h3>' },
      { pattern: /^## (.*$)/gim, replacement: '<h2>$1</h2>' },
      { pattern: /^# (.*$)/gim, replacement: '<h1>$1</h1>' },
      
      // Bold
      { pattern: /\*\*\*(.+?)\*\*\*/g, replacement: '<strong><em>$1</em></strong>' },
      { pattern: /\*\*(.+?)\*\*/g, replacement: '<strong>$1</strong>' },
      { pattern: /__(.+?)__/g, replacement: '<strong>$1</strong>' },
      
      // Italic
      { pattern: /\*(.+?)\*/g, replacement: '<em>$1</em>' },
      { pattern: /_(.+?)_/g, replacement: '<em>$1</em>' },
      
      // Strikethrough
      { pattern: /~~(.+?)~~/g, replacement: '<del>$1</del>' },
      
      // Code blocks
      { pattern: /