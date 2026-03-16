// Receipt Generator JavaScript

class ReceiptGenerator {
    constructor() {
        this.items = [];
        this.initializeElements();
        this.attachEventListeners();
        this.loadFromLocalStorage();
        this.updatePreview();
    }

    initializeElements() {
        this.businessName = document.getElementById('business-name');
        this.businessAddress = document.getElementById('business-address');
        this.businessPhone = document.getElementById('business-phone');
        this.businessEmail = document.getElementById('business-email');
        this.customerName = document.getElementById('customer-name');
        this.customerAddress = document.getElementById('customer-address');
        this.customerPhone = document.getElementById('customer-phone');
        this.customerEmail = document.getElementById('customer-email');
        this.receiptNumber = document.getElementById('receipt-number');
        this.receiptDate = document.getElementById('receipt-date');
        this.paymentMethod = document.getElementById('payment-method');
        this.receiptNotes = document.getElementById('receipt-notes');
        this.itemsContainer = document.getElementById('items-container');
        this.addItemBtn = document.getElementById('add-item-btn');
        this.previewBtn = document.getElementById('preview-btn');
        this.exportPdfBtn = document.getElementById('export-pdf-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.receiptPreview = document.getElementById('receipt-preview');
        this.previewItemsBody = document.getElementById('preview-items-body');
        this.templateChoice = document.getElementById('template-choice');

        // Set default date
        if (this.receiptDate) {
            this.receiptDate.valueAsDate = new Date();
        }

        // Generate default receipt number
        if (this.receiptNumber && !this.receiptNumber.value) {
            this.receiptNumber.value = this.generateReceiptNumber();
        }
    }

    attachEventListeners() {
        // Add item button
        if (this.addItemBtn) {
            this.addItemBtn.addEventListener('click', () => this.addItemRow());
        }

        // Preview button
        if (this.previewBtn) {
            this.previewBtn.addEventListener('click', () => this.showPreview());
        }

        // Export PDF button
        if (this.exportPdfBtn) {
            this.exportPdfBtn.addEventListener('click', () => this.exportToPDF());
        }

        // Clear button
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }

        // Real-time updates for all inputs
        const allInputs = [
            this.businessName, this.businessAddress, this.businessPhone, this.businessEmail,
            this.customerName, this.customerAddress, this.customerPhone, this.customerEmail,
            this.receiptNumber, this.receiptDate, this.paymentMethod, this.receiptNotes
        ];

        allInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    this.saveToLocalStorage();
                    this.updatePreview();
                });
            }
        });

        // Template change
        if (this.templateChoice) {
            this.templateChoice.addEventListener('change', () => {
                this.updatePreview();
                this.saveToLocalStorage();
            });
        }

        // Add initial item row
        if (this.itemsContainer && this.itemsContainer.children.length === 0) {
            this.addItemRow();
        }
    }

    generateReceiptNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `RCP-${year}-${random}`;
    }

    addItemRow() {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <input type="text" class="item-description" placeholder="Item description" />
            <input type="number" class="item-quantity" placeholder="Qty" min="1" value="1" />
            <input type="number" class="item-price" placeholder="Price" min="0" step="0.01" value="0" />
            <span class="item-total">$0.00</span>
            <button type="button" class="remove-item-btn">Remove</button>
        `;

        if (this.itemsContainer) {
            this.itemsContainer.appendChild(itemRow);
        }

        const removeBtn = itemRow.querySelector('.remove-item-btn');
        const quantityInput = itemRow.querySelector('.item-quantity');
        const priceInput = itemRow.querySelector('.item-price');
        const descriptionInput = itemRow.querySelector('.item-description');

        removeBtn.addEventListener('click', () => {
            itemRow.remove();
            this.updatePreview();
            this.saveToLocalStorage();
        });

        [quantityInput, priceInput, descriptionInput].forEach(input => {
            input.addEventListener('input', () => {
                this.updateItemTotal(itemRow);
                this.updatePreview();
                this.saveToLocalStorage();
            });
        });

        this.updateItemTotal(itemRow);
    }

    updateItemTotal(itemRow) {
        const quantity = parseFloat(itemRow.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(itemRow.querySelector('.item-price').value) || 0;
        const total = quantity * price;
        const totalSpan = itemRow.querySelector('.item-total');
        if (totalSpan) {
            totalSpan.textContent = `$${total.toFixed(2)}`;
        }
    }

    getItems() {
        const items = [];
        if (this.itemsContainer) {
            const itemRows = this.itemsContainer.querySelectorAll('.item-row');
            itemRows.forEach(row => {
                const description = row.querySelector('.item-description').value;
                const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
                const price = parseFloat(row.querySelector('.item-price').value) || 0;
                const total = quantity * price;

                if (description || quantity > 0 || price > 0) {
                    items.push({ description, quantity, price, total });
                }
            });
        }
        return items;
    }

    calculateTotal() {
        const items = this.getItems();
        return items.reduce((sum, item) => sum + item.total, 0);
    }

    validateInputs() {
        const errors = [];

        if (!this.businessName?.value.trim()) {
            errors.push('Business name is required');
        }

        if (!this.receiptNumber?.value.trim()) {
            errors.push('Receipt number is required');
        }

        if (!this.receiptDate?.value) {
            errors.push('Receipt date is required');
        }

        const items = this.getItems();
        if (items.length === 0) {
            errors.push('At least one item is required');
        }

        return errors;
    }

    showPreview() {
        const errors = this.validateInputs();
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }

        this.updatePreview();
        if (this.receiptPreview) {
            this.receiptPreview.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updatePreview() {
        if (!this.receiptPreview) return;

        const template = this.templateChoice?.value || 'modern';
        const items = this.getItems();
        const total = this.calculateTotal();

        // Apply template class
        this.receiptPreview.className = `receipt-template template-${template}`;

        // Generate preview HTML
        this.receiptPreview.innerHTML = `
            <div class="receipt-content">
                <div class="receipt-header">
                    <h2>${this.escapeHtml(this.businessName?.value || 'Business Name')}</h2>
                    ${this.businessAddress?.value ? `<p>${this.escapeHtml(this.businessAddress.value)}</p>` : ''}
                    ${this.businessPhone?.value ? `<p>Phone: ${this.escapeHtml(this.businessPhone.value)}</p>` : ''}
                    ${this.businessEmail?.value ? `<p>Email: ${this.escapeHtml(this.businessEmail.value)}</p>` : ''}
                </div>

                <div class="receipt-info">
                    <div class="receipt-meta">
                        <p><strong>Receipt #:</strong> ${this.escapeHtml(this.receiptNumber?.value || 'N/A')}</p>
                        <p><strong>Date:</strong> ${this.formatDate(this.receiptDate?.value)}</p>
                        <p><strong>Payment Method:</strong> ${this.escapeHtml(this.paymentMethod?.value || 'N/A')}</p>
                    </div>
                    ${this.customerName?.value ? `
                    <div class="customer-info">
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> ${this.escapeHtml(this.customerName.value)}</p>
                        ${this.customerAddress?.value ? `<p><strong>Address:</strong> ${this.escapeHtml(this.customerAddress.value)}</p>` : ''}
                        ${this.customerPhone?.value ? `<p><strong>Phone:</strong> ${this.escapeHtml(this.customerPhone.value)}</p>` : ''}
                        ${this.customerEmail?.value ? `<p><strong>Email:</strong> ${this.escapeHtml(this.customerEmail.value)}</p>` : ''}
                    </div>
                    ` : ''}
                </div>

                <div class="receipt-items">
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td>${this.escapeHtml(item.description)}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.price.toFixed(2)}</td>
                                    <td>$${item.total.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3"><strong>Total</strong></td>
                                <td><strong>$${total.toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                ${this.receiptNotes?.value ? `
                <div class="receipt-notes">
                    <h3>Notes</h3>
                    <p>${this.escapeHtml(this.receiptNotes.value)}</p>
                </div>
                ` : ''}

                <div class="receipt-footer">
                    <p>Thank you for your business!</p>
                </div>
            </div>
        `;
    }

    formatDate(dateString) {
        if (!dateString) return new Date().toLocaleDateString();
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    async exportToPDF() {
        const errors = this.validateInputs();
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }

        try {
            this.updatePreview();

            if (typeof html2pdf === 'undefined') {
                throw new Error('html2pdf library not loaded');
            }

            const element = this.receiptPreview;
            const receiptNum = this.receiptNumber?.value || 'receipt';
            const filename = `receipt_${receiptNum.replace(/[^a-z0-9]/gi, '_')}.pdf`;

            const opt = {
                margin: 10,
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Error exporting to PDF. Please try again.');
        }
    }

    saveToLocalStorage() {
        try {
            const data = {
                businessName: this.businessName?.value || '',
                businessAddress: this.businessAddress?.value || '',
                businessPhone: this.businessPhone?.value || '',
                businessEmail: this.businessEmail?.value || '',
                customerName: this.customerName?.value || '',
                customerAddress: this.customerAddress?.value || '',
                customerPhone: this.customerPhone?.value || '',
                customerEmail: this.customerEmail?.value || '',
                receiptNumber: this.receiptNumber?.value || '',
                receiptDate: this.receiptDate?.value || '',
                paymentMethod: this.paymentMethod?.value || '',
                receiptNotes: this.receiptNotes?.value || '',
                template: this.templateChoice?.value || 'modern',
                items: this.getItems()
            };
            localStorage.setItem('receiptGeneratorData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('receiptGeneratorData');
            if (saved) {
                const data = JSON.parse(saved);
                
                if (this.businessName) this.businessName.value = data.businessName || '';
                if (this.businessAddress) this.businessAddress.value = data.businessAddress || '';
                if (this.businessPhone) this.businessPhone.value = data.businessPhone || '';
                if (this.businessEmail) this.businessEmail.value = data.businessEmail || '';
                if (this.customerName) this.customerName.value = data.customerName || '';
                if (this.customerAddress) this.customerAddress.value = data.customerAddress || '';
                if (this.customerPhone) this.customerPhone.value = data.customerPhone || '';
                if (this.customerEmail) this.customerEmail.value = data.customerEmail || '';
                if (this.receiptNumber) this.receiptNumber.value = data.receiptNumber || this.generateReceiptNumber();
                if (this.receiptDate) this.receiptDate.value = data.receiptDate || new Date().toISOString().split('T')[0];
                if (this.paymentMethod) this.paymentMethod.value = data.paymentMethod || '';
                if (this.receiptNotes) this.receiptNotes.value = data.receiptNotes || '';
                if (this.templateChoice) this.templateChoice.value = data.template || 'modern';

                // Load items
                if (data.items && data.items.length > 0 && this.itemsContainer) {
                    this.itemsContainer.innerHTML = '';
                    data.items.forEach(item => {
                        this.addItemRow();
                        const lastRow = this.itemsContainer.lastElementChild;
                        if (lastRow) {
                            lastRow.querySelector('.item-description').value = item.description || '';
                            lastRow.querySelector('.item-quantity').value = item.quantity || 1;
                            lastRow.querySelector('.item-price').value = item.price || 0;
                            this.updateItemTotal(lastRow);
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    clearAll() {
        if (!confirm('Are you sure you want to clear all data?')) {
            return;
        }

        // Clear all inputs
        if (this.businessName) this.businessName.value = '';
        if (this.businessAddress) this.businessAddress.value = '';
        if (this.businessPhone) this.businessPhone.value = '';
        if (this.businessEmail) this.businessEmail.value = '';
        if (this.customerName) this.customerName.value = '';
        if (this.customerAddress) this.customerAddress.value = '';
        if (this.customerPhone) this.customerPhone.value = '';
        if (this.customerEmail) this.customerEmail.value = '';
        if (this.receiptNumber) this.receiptNumber.value = this.generateReceiptNumber();
        if (this.receiptDate) this.receiptDate.valueAsDate = new Date();
        if (this.paymentMethod) this.paymentMethod.value = '';
        if (this.receiptNotes) this.receiptNotes.value = '';
        if (this.templateChoice) this.templateChoice.value = 'modern';

        // Clear items
        if (this.itemsContainer) {
            this.itemsContainer.innerHTML = '';
            this.addItemRow();
        }

        // Clear preview
        if (this.receiptPreview) {
            this.receiptPreview.innerHTML = '<p style="text-align: center; color: #666;">Preview will appear here</p>';
        }

        // Clear localStorage
        localStorage.removeItem('receiptGeneratorData');
    }
}

// Initialize the receipt generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReceiptGenerator();
});