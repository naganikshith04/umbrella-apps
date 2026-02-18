// Base JavaScript Template
// Add your app-specific logic here

// Utility Functions
const utils = {
    // Format numbers with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Copy text to clipboard
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    },
    
    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    // Validate input
    validateInput(value, type = 'text') {
        if (!value || value.trim() === '') {
            return { valid: false, message: 'This field is required' };
        }
        
        if (type === 'number') {
            const num = parseFloat(value);
            if (isNaN(num)) {
                return { valid: false, message: 'Please enter a valid number' };
            }
            if (num < 0) {
                return { valid: false, message: 'Please enter a positive number' };
            }
        }
        
        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return { valid: false, message: 'Please enter a valid email' };
            }
        }
        
        return { valid: true };
    }
};

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    
    // Add your app initialization code here
    initApp();
});

// Main app initialization function
function initApp() {
    // This is where your specific app logic goes
    console.log('Ready to add app-specific functionality');

    // Generated app logic
    // HTML to PDF Converter - Main Script
    
    class HTMLToPDFConverter {
        constructor() {
            this.htmlInput = document.getElementById('htmlInput');
            this.convertBtn = document.getElementById('convertBtn');
            this.previewBtn = document.getElementById('previewBtn');
            this.previewSection = document.getElementById('previewSection');
            this.previewFrame = document.getElementById('previewFrame');
            this.statusMessage = document.getElementById('statusMessage');
            this.enableHeaderFooter = document.getElementById('enableHeaderFooter');
            this.headerFooterOptions = document.getElementById('headerFooterOptions');
            this.jsRendering = document.getElementById('jsRendering');
            
            this.initializeEventListeners();
        }
    
        initializeEventListeners() {
            this.convertBtn.addEventListener('click', () => this.convertToPDF());
            this.previewBtn.addEventListener('click', () => this.showPreview());
            this.enableHeaderFooter.addEventListener('change', (e) => this.toggleHeaderFooter(e));
        }
    
        toggleHeaderFooter(e) {
            if (e.target.checked) {
                this.headerFooterOptions.style.display = 'block';
            } else {
                this.headerFooterOptions.style.display = 'none';
            }
        }
    
        async processHTMLWithJS(htmlContent) {
            return new Promise((resolve) => {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
    
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(htmlContent);
                iframeDoc.close();
    
                // Wait for scripts to execute and DOM to be ready
                setTimeout(() => {
                    const processedHTML = iframeDoc.documentElement.outerHTML;
                    document.body.removeChild(iframe);
                    resolve(processedHTML);
                }, 1000); // Wait 1 second for JS execution
            });
        }
    
        sanitizeHTML(html) {
            // Remove DOCTYPE declarations
            html = html.replace(/<!DOCTYPE[^>]*>/gi, '');
            
            // Extract content from body if full HTML document is provided
            const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
            if (bodyMatch) {
                html = bodyMatch[1];
            }
            
            // Remove html tags
            html = html.replace(/<\/?html[^>]*>/gi, '');
            
            // Remove head section entirely
            html = html.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
            
            // Remove body tags but keep content
            html = html.replace(/<\/?body[^>]*>/gi, '');
            
            return html.trim();
        }
    
        extractAndRemoveStyles(html) {
            const styles = [];
            const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
            let match;
            
            while ((match = styleRegex.exec(html)) !== null) {
                styles.push(match[1]);
            }
            
            // Remove inline style tags
            html = html.replace(styleRegex, '');
            
            return { html, styles };
        }
    
        getHeaderFooterHTML(text, align, fontSize, pageNum, totalPages) {
            if (!text) return '';
            
            const date = new Date().toLocaleDateString();
            const processedText = text
                .replace(/{page}/g, pageNum)
                .replace(/{total}/g, totalPages)
                .replace(/{date}/g, date);
            
            return `
                <div style="text-align: ${align}; font-size: ${fontSize}px; padding: 5px 10px; font-family: Arial, sans-serif;">
                    ${processedText}
                </div>
            `;
        }
    
        buildPDFContent() {
            let htmlContent = this.htmlInput.value.trim();
            
            if (!htmlContent) {
                this.showStatus('Please enter HTML content', 'error');
                return null;
            }
    
            // Sanitize HTML to remove document-level elements
            htmlContent = this.sanitizeHTML(htmlContent);
            
            // Extract and remove inline styles
            const { html: cleanHTML, styles } = this.extractAndRemoveStyles(htmlContent);
            
            // Get options
            const pageSize = document.getElementById('pageSize').value;
            const orientation = document.getElementById('orientation').value;
            const margin = document.getElementById('margin').value;
            const enableHeaderFooter = this.enableHeaderFooter.checked;
            
            // Build complete HTML with external styles
            let fullHTML = '<!DOCTYPE html><html><head><meta charset="UTF-8">';
            
            // Add extracted styles as external reference (simulated)
            if (styles.length > 0) {
                fullHTML += '<style>' + styles.join('\n') + '</style>';
            }
            
            fullHTML += '</head><body>';
            
            // Add header if enabled
            if (enableHeaderFooter) {
                const headerText = document.getElementById('headerText').value;
                const headerAlign = document.getElementById('headerAlign').value;
                const headerFontSize = document.getElementById('headerFontSize').value;
                
                if (headerText) {
                    fullHTML += this.getHeaderFooterHTML(headerText, headerAlign, headerFontSize, 1, 1);
                }
            }
            
            fullHTML += cleanHTML;
            
            // Add footer if enabled
            if (enableHeaderFooter) {
                const footerText = document.getElementById('footerText').value;
                const footerAlign = document.getElementById('footerAlign').value;
                const footerFontSize = document.getElementById('footerFontSize').value;
                
                if (footerText) {
                    fullHTML += this.getHeaderFooterHTML(footerText, footerAlign, footerFontSize, 1, 1);
                }
            }
            
            fullHTML += '</body></html>';
            
            return {
                html: fullHTML,
                pageSize,
                orientation,
                margin,
                enableHeaderFooter
            };
        }
    
        async showPreview() {
            const pdfContent = this.buildPDFContent();
            if (!pdfContent) return;
    
            let htmlToPreview = pdfContent.html;
    
            // Apply JavaScript rendering if enabled
            if (this.jsRendering.checked) {
                this.showStatus('Processing JavaScript...', 'info');
                htmlToPreview = await this.processHTMLWithJS(htmlToPreview);
            }
    
            this.previewFrame.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '500px';
            iframe.style.border = '1px solid #ccc';
            
            this.previewFrame.appendChild(iframe);
            
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(htmlToPreview);
            iframeDoc.close();
            
            this.previewSection.style.display = 'block';
            this.showStatus('Preview generated successfully', 'success');
        }
    
        async convertToPDF() {
            const pdfContent = this.buildPDFContent();
            if (!pdfContent) return;
    
            this.showStatus('Converting to PDF...', 'info');
            this.convertBtn.disabled = true;
    
            try {
                let htmlToConvert = pdfContent.html;
    
                // Apply JavaScript rendering if enabled
                if (this.jsRendering.checked) {
                    this.showStatus('Processing JavaScript before PDF generation...', 'info');
                    htmlToConvert = await this.processHTMLWithJS(htmlToConvert);
                }
    
                // Simulate PDF generation (in real app, this would call a backend API)
                await this.simulatePDFGeneration(htmlToConvert, pdfContent);
                
                this.showStatus('PDF generated successfully!', 'success');
            } catch (error) {
                this.showStatus('Error generating PDF: ' + error.message, 'error');
            } finally {
                this.convertBtn.disabled = false;
            }
        }
    
        async simulatePDFGeneration(html, options) {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In a real application, you would send this to a backend service
            // For demonstration, we'll create a downloadable HTML file
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted-document.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('PDF Options:', options);
            console.log('JavaScript Rendering:', this.jsRendering.checked);
        }
    
        showStatus(message, type) {
            this.statusMessage.textContent = message;
            this.statusMessage.className = 'status-message ' + type;
            this.statusMessage.style.display = 'block';
            
            if (type === 'success' || type === 'error') {
                setTimeout(() => {
                    this.statusMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
    
    // Initialize the converter when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        new HTMLToPDFConverter();
    });
    
    // Example: Add event listeners to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add button click handlers here
        });
    });
}

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
