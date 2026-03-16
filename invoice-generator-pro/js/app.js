```javascript
// Invoice Generator Pro - Complete Implementation

class InvoiceGenerator {
    constructor() {
        this.items = [];
        this.logo = null;
        this.currentTemplate = 'modern';
        this.currency = '$';
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadFromLocalStorage();
        this.generateInvoiceNumber();
        this.setDefaultDates();
        this.updatePreview();
    }

    attachEventListeners() {
        // Company details
        document.getElementById('companyName').addEventListener('input', () => this.updatePreview());
        document.getElementById('companyEmail').addEventListener('input', () => this.updatePreview());
        document.getElementById('companyPhone').addEventListener('input', () => this.updatePreview());
        document.getElementById('companyAddress').addEventListener('input', () => this.updatePreview());

        // Client details
        document.getElementById('clientName').addEventListener('input', () => this.updatePreview());
        document.getElementById('clientEmail').addEventListener('input', () => this.updatePreview());
        document.getElementById('clientAddress').addEventListener('input', () => this.updatePreview());

        // Invoice details
        document.getElementById('invoiceNumber').addEventListener('input', () => this.updatePreview());
        document.getElementById('invoiceDate').addEventListener('change', () => this.updatePreview());
        document.getElementById('dueDate').addEventListener('change', () => this.updatePreview());
        document.getElementById('invoiceNotes').addEventListener('input', () => this.updatePreview());

        // Currency
        document.getElementById('currency').addEventListener('change', (e) => {
            this.currency = e.target.value;
            this.updatePreview();
        });

        // Tax and discount
        document.getElementById('taxRate').addEventListener('input', () => this.calculateTotals());
        document.getElementById('discountRate').addEventListener('input', () => this.calculateTotals());
        document.getElementById('taxPercent').addEventListener('change', (e) => {
            document.getElementById('taxRate').value = e.target.checked ? '10' : '0';
            this.calculateTotals();
        });
        document.getElementById('discountPercent').addEventListener('change', (e) => {
            document.getElementById('discountRate').value = e.target.checked ? '0' : '0';
            this.calculateTotals();
        });

        // Add item
        document.getElementById('addItem').addEventListener('click', () => this.addItem());

        // Logo upload
        document.getElementById('logoUpload').addEventListener('click', () => {
            document.getElementById('logoInput').click();
        });
        document.getElementById('logoInput').addEventListener('change', (e) => this.handleLogoUpload(e));

        // Template selection
        document.getElementById('templateSelect').addEventListener('change', (e) => {
            this.currentTemplate = e.target.value;
            this.updatePreview();
        });

        // Save and load drafts
        document.getElementById('saveDraft').addEventListener('click', () => this.saveDraft());
        document.getElementById('loadDraft').addEventListener('click', () => this.loadDraft());

        // Export PDF
        document.getElementById('exportPDF').addEventListener('click', () => this.exportToPDF());
    }

    generateInvoiceNumber() {
        const num = 'INV-' + Date.now().toString().slice(-8);
        document.getElementById('invoiceNumber').value = num;
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        const dueDateStr = dueDate.toISOString().split('T')[0];

        document.getElementById('invoiceDate').value = today;
        document.getElementById('dueDate').value = dueDateStr;
    }

    addItem() {
        const item = {
            id: Date.now(),
            description: 'New Item',
            quantity: 1,
            price: 0
        };
        this.items.push(item);
        this.renderItems();
        this.calculateTotals();
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.renderItems();
        this.calculateTotals();
    }

    updateItem(id, field, value) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            if (field === 'quantity' || field === 'price') {
                item[field] = parseFloat(value) || 0;
            } else {
                item[field] = value;
            }
            this.calculateTotals();
            this.updatePreview();
        }
    }

    renderItems() {
        const tbody = document.getElementById('itemsTableBody');
        tbody.innerHTML = '';

        this.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" value="${item.description}" class="item-description" data-id="${item.id}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></td>
                <td><input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></td>
                <td><input type="number" value="${item.price}" min="0" step="0.01" class="item-price" data-id="${item.id}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></td>
                <td style="text-align: right; padding: 8px;">${this.currency}${(item.quantity * item.price).toFixed(2)}</td>
                <td style="text-align: center;"><button class="remove-item" data-id="${item.id}" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Remove</button></td>
            `;
            tbody.appendChild(row);
        });

        // Attach event listeners to new inputs
        tbody.querySelectorAll('.item-description').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateItem(parseInt(e.target.dataset.id), 'description', e.target.value);
            });
        });

        tbody.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateItem(parseInt(e.target.dataset.id), 'quantity', e.target.value);
            });
        });

        tbody.querySelectorAll('.item-price').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateItem(parseInt(e.target.dataset.id), 'price', e.target.value);
            });
        });

        tbody.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.removeItem(parseInt(e.target.dataset.id));
            });
        });
    }

    calculateTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        const discountRate = parseFloat(document.getElementById('discountRate').value) || 0;

        const discountAmount = subtotal * (discountRate / 100);
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * (taxRate / 100);
        const total = taxableAmount + taxAmount;

        document.getElementById('subtotal').textContent = this.currency + subtotal.toFixed(2);
        document.getElementById('discountAmount').textContent = this.currency + discountAmount.toFixed(2);
        document.getElementById('taxAmount').textContent = this.currency + taxAmount.toFixed(2);
        document.getElementById('totalAmount').textContent = this.currency + total.toFixed(2);

        this.updatePreview();
    }

    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.logo = e.target.result;
                const logoDisplay = document.getElementById('logoDisplay');
                logoDisplay.innerHTML = `<img src="${this.logo}" alt="Logo" style="max-width: 150px; max-height: 80px;">`;
                this.updatePreview();
            };
            reader.readAsDataURL(file);
        }
    }

    updatePreview() {
        const preview = document.getElementById('invoicePreview');
        const data = this.collectData();

        const templateHTML = this.generateTemplate(data);
        preview.innerHTML = templateHTML;
    }

    collectData() {
        return {
            companyName: document.getElementById('companyName').value,
            companyEmail: document.getElementById('companyEmail').value,
            companyPhone: document.getElementById('companyPhone').value,
            companyAddress: document.getElementById('companyAddress').value,
            clientName: document.getElementById('clientName').value,
            clientEmail: document.getElementById('clientEmail').value,
            clientAddress: document.getElementById('clientAddress').value,
            invoiceNumber: document.getElementById('invoiceNumber').value,
            invoiceDate: document.getElementById('invoiceDate').value,
            dueDate: document.getElementById('dueDate').value,
            notes: document.getElementById('invoiceNotes').value,
            items: this.items,
            subtotal: document.getElementById('subtotal').textContent,
            discountAmount: document.getElementById('discountAmount').textContent,
            taxAmount: document.getElementById('taxAmount').textContent,
            totalAmount: document.getElementById('totalAmount').textContent,
            logo: this.logo,
            currency: this.currency
        };
    }

    generateTemplate(data) {
        switch (this.currentTemplate) {
            case 'modern':
                return this.modernTemplate(data);
            case 'classic':
                return this.classicTemplate(data);
            case 'minimal':
                return this.minimalTemplate(data);
            case 'corporate':
                return this.corporateTemplate(data);
            default:
                return this.modernTemplate(data);
        }
    }

    modernTemplate(data) {
        return `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 3px solid #4CAF50; padding-bottom: 20px;">
                    <div>
                        ${data.logo ? `<img src="${data.logo}" alt="Logo" style="max-width: 150px; max-height: 80px; margin-bottom: 10px;">` : ''}
                        <h1 style="margin: 0; color: #333; font-size: 32px;">INVOICE</h1>
                    </div>
                    <div style="text-align: right;">
                        <h2 style="margin: 0 0 10px 0; color: #4CAF50; font-size: 24px;">${data.companyName}</h2>
                        <p style="margin: 5px 0; color: #666;">${data.companyEmail}</p>
                        <p style="margin: 5px 0; color: #666;">${data.companyPhone}</p>
                        <p style="margin: 5px 0; color: #666; white-space: pre-line;">${data.companyAddress}</p>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <div style="flex: 1;">
                        <h3 style="color: #4CAF50; margin-bottom: 10px;">Bill To:</h3>
                        <p style="margin: 5px 0; font-weight: bold; color: #333;">${data.clientName}</p>
                        <p style="margin: 5px 0; color: #666;">${data.clientEmail}</p>
                        <p style="margin: 5px 0; color: #666; white-space: pre-line;">${data.clientAddress}</p>
                    </div>
                    <div style="flex: 1; text-align: right;">
                        <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${data.invoiceNumber}</p>
                        <p style="margin: 5px 0;"><strong>Date:</strong> ${data.invoiceDate}</p>
                        <p style="margin: 5px 0;"><strong>Due Date:</strong> ${data.dueDate}</p>
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background: #4CAF50; color: white;">
                            <th style="padding: 12px; text-align: left; border: none;">Description</th>
                            <th style="padding: 12px; text-align: center; border: none;">Quantity</th>
                            <th style="padding: 12px; text-align: right; border: none;">Price</th>
                            <th style="padding: 12px; text-align: right; border: none;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.items.map((item, index) => `
                            <tr style="border-bottom: 1px solid #eee; ${index % 2 === 0 ? 'background: #f9f9f9;' : ''}">
                                <td style="padding: 12px;">${item.description}</td>
                                <td style="padding: 12px; text-align: center;">${item.quantity}</td>
                                <td style="padding: 12px; text-align: right;">${data.currency}${item.price.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right;">${data.currency}${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
                    <div style="width: 300px;">
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Subtotal:</span>
                            <span>${data.subtotal}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Discount:</span>
                            <span>${data.discountAmount}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Tax:</span>
                            <span>${data.taxAmount}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 20px; font-weight: bold; color: #4CAF50; border-top: 2px solid #4CAF50;">
                            <span>Total:</span>
                            <span>${data.totalAmount}</span>
                        </div>
                    </div>
                </div>

                ${data.notes ? `
                    <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-left: 4px solid #4CAF50;">
                        <h4 style="margin: 0 0 10px 0; color: #333;">Notes:</h4>
                        <p style="margin: 0; color: #666; white-space: pre-line;">${data.notes}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    classicTemplate(data) {
        return `
            <div style="font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white; border: 2px solid #333;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
                    ${data.logo ? `<img src="${data.logo}" alt="Logo" style="max-width: 150px; max-height: 80px; margin-bottom: 15px;">` : ''}
                    <h1 style="margin: 10px 0; color: #333; font-size: 36px; letter-spacing: 2px;">INVOICE</h1>
                    <p style="margin: 5px 0; color: #666; font-size: 14px;">${data.companyName}</p>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <div>
                        <p style="margin: 5px 0; color: #666;"><strong>From:</strong></p>
                        <p style="margin: 5px 0;">${data.companyName}</p>
                        <p style="margin: 5px 0; color: #666;">${data.companyEmail}</p>
                        <p style="margin: 5px 0; color: #666;">${data.companyPhone}</p>
                        <p style="margin: 5px 0; color: #666; white-space: pre-line;">${data.companyAddress}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 5px 0; color: #666;"><strong>To:</strong></p>
                        <p style="margin: 5px 0;">${data.clientName}</p>
                        <p style="margin: 5px 0; color: #666;">${data.clientEmail}</p>
                        <p style="margin: 5px 0; color: #666; white-space: pre-line;">${data.clientAddress}</p>
                    </div>
                </div>

                <div style="margin-bottom: 30px; text-align: center; padding: 15px; background: #f5f5f5; border: 1px solid #ddd;">
                    <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${data.invoiceDate} | <strong>Due Date:</strong> ${data.dueDate}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #333;">
                    <thead>
                        <tr style="background: #333; color: white;">
                            <th style="padding: 12px; text-align: left; border: 1px solid #333;">Description</th>
                            <th style="padding: 12px; text-align: center; border: 1px solid #333;">Qty</th>
                            <th style="padding: 12px; text-align: right; border: 1px solid #333;">Price</th>
                            <th style="padding: 12px; text-align: right; border: 1px solid #333;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.items.map(item => `
                            <tr>
                                <td style="padding: 12px; border: 1px solid #ddd;">${item.description}</td>
                                <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">${data.currency}${item.price.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">${data.currency}${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 300px; border: 1px solid #333; padding: 15px;">
                        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                            <span>Subtotal:</span>
                            <span>${data.subtotal}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                            <span>Discount:</span>
                            <span>${data.discountAmount}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                            <span>Tax:</span>
                            <span>${data.taxAmount}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 18px; font-weight: bold; border-top: 2px solid #333; margin-top: 10px;">
                            <span>TOTAL:</span>
                            <span>${data.totalAmount}</span>
                        </div>
                    </div>
                </div>

                ${data.notes ? `
                    <div style="margin-top: 30px; padding: 15px; border: 1px solid #ddd;">
                        <h4 style="margin: 0 0 10px 0;">Notes:</h4>
                        <p style="margin: 0; white-space: pre-line;">${data.notes}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    minimalTemplate(data) {
        return `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 60px 40px; background: white;">
                <div style="margin-bottom: 60px;">
                    ${data.logo ? `<img src="${data.logo}" alt="Logo" style="max-width: 120px; max-height: 60px; margin-bottom: 20px;">` : ''}
                    <h1 style="margin: 0; color: #000; font-size: 48px; font-weight: 300;">Invoice</h1>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 60px;">
                    <div>
                        <p style="margin: 0 0 15px 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">From</p>
                        <p style="margin: 5px 0; font-weight: 600;">${data.companyName}</p>
                        <p style="margin: 5px 0; color: #666; font-size: 14px;">${data.companyEmail}</p>
                        <p style="margin: 5px 0; color: #666; font-size: 14px;">${data.companyPhone}</p>
                        <p style="margin: 5px 0; color: #666; font-size: 14px; white-space: pre-line;">${data.companyAddress}</p>
                    </div>
                    <div>
                        <p style="margin: 0 0 15px 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">To</p>
                        <p style="margin: 5px 0; font-weight: 600;">${data.clientName}</p>
                        <p style="margin: 5px 0; color: #666; font-size: 14px;">${data.clientEmail}</p>
                        <p style="margin: 5px 0; color: #666; font-size: 14px; white-space: pre-line;">${data.clientAddress}</p>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 60px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <div>
                        <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase;">Invoice Number</p>
                        <p style="margin: 5px 0; font-weight: 600;">${data.invoiceNumber}</p>
                    </div>
                    <div>
                        <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase;">Date</p>
                        <p style="margin: 5px 0; font-weight: 600;">${data.invoiceDate}</p>
                    </div>
                    <div>
                        <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase;">Due Date</p>
                        <p style="margin: 5px 0; font-weight: 600;">${data.dueDate}</p>
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
                    <thead>
                        <tr style="border-bottom: 2px solid #000;">
                            <th style="padding: 15px 0; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Description</th>
                            <th style="padding: 15px 0; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Qty</th>
                            <th style="padding: 15px 0; text-align: right; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Price</th>
                            <th style="padding: 15px 0; text-align: right; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.items.map(item => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 20px 0;">${item.description}</td>
                                <td style="padding: 20px 0; text-align: center; color: #666;">${item.quantity}</td>
                                <td style="padding: 20px 0; text-align: right; color: #666;">${data.currency}${item.price.toFixed(2)}</td>
                                <td style="padding: 20px 0; text-align: right; font-weight: 600;">${data.currency}${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 300px;">
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; color: #666;">
                            <span>Subtotal</span>
                            <span>${data.subtotal}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; color: #666;">
                            <span>Discount</span>
                            <span>${data.discountAmount}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; color: #666;">
                            <span>Tax</span>
                            <span>${data.taxAmount}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 20px 0; font-size: 24px; font-weight: 600; border-top: 2px solid #000; margin-top: 10px;">
                            <span>Total</span>
                            <span>${data.totalAmount}</span>
                        </div>
                    </div>
                </div>

                ${data.notes ? `
                    <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="margin: 0 0 10px 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Notes</p>
                        <p style="margin: 0; color: #666; white-space: pre-line;">${data.notes}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    corporateTemplate(data) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; margin: -40px -40px 40px -40px;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            ${data.logo ? `<img src="${data.logo}" alt="Logo" style="max-width: 150px; max-height: 80px; margin-bottom: 20px; filter: brightness(0) invert(1);">` : ''}
                            <h1 style="margin: 0; font-size: 42px; font-weight: 700;">INVOICE</h1>
                        </div>
                        <div style="text-align: right;">
                            <h2 style="margin: 0 0 10px 0; font-size: 24px;">${data.companyName}</h2>
                            <p style="margin: 5px 0; opacity: 0.9;">${data.company