// Product catalog data
const products = [
  { id: 1, name: 'Wireless Mouse', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Mechanical Keyboard', price: 89.99, category: 'Electronics' },
  { id: 3, name: 'USB-C Hub', price: 45.50, category: 'Electronics' },
  { id: 4, name: 'Laptop Stand', price: 34.99, category: 'Accessories' },
  { id: 5, name: 'Webcam HD', price: 69.99, category: 'Electronics' },
  { id: 6, name: 'Desk Lamp', price: 24.99, category: 'Accessories' }
];

// Order state
let orderItems = [];
let customerInfo = {};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  renderProductCatalog();
  loadFromLocalStorage();
  attachEventListeners();
  updateOrderSummary();
});

// Render product catalog
function renderProductCatalog() {
  const catalog = document.getElementById('productCatalog');
  catalog.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <h3>${product.name}</h3>
      <p class="product-category">${product.category}</p>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <div class="product-actions">
        <input type="number" min="0" value="0" class="quantity-input" data-product-id="${product.id}">
        <button class="add-to-order-btn" data-product-id="${product.id}">Add to Order</button>
      </div>
    `;
    catalog.appendChild(productCard);
  });

  // Attach event listeners to add buttons
  document.querySelectorAll('.add-to-order-btn').forEach(btn => {
    btn.addEventListener('click', handleAddToOrder);
  });
}

// Handle add to order
function handleAddToOrder(e) {
  const productId = parseInt(e.target.dataset.productId);
  const quantityInput = document.querySelector(`input[data-product-id="${productId}"]`);
  const quantity = parseInt(quantityInput.value);

  if (quantity <= 0) {
    alert('Please enter a valid quantity');
    return;
  }

  const product = products.find(p => p.id === productId);
  const existingItem = orderItems.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    orderItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity
    });
  }

  quantityInput.value = 0;
  updateOrderSummary();
  saveToLocalStorage();
}

// Update order summary
function updateOrderSummary() {
  const orderItemsList = document.getElementById('orderItemsList');
  orderItemsList.innerHTML = '';

  if (orderItems.length === 0) {
    orderItemsList.innerHTML = '<p class="empty-order">No items in order</p>';
  } else {
    orderItems.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'order-item';
      itemElement.innerHTML = `
        <div class="order-item-info">
          <strong>${item.name}</strong>
          <span>$${item.price.toFixed(2)} × ${item.quantity}</span>
        </div>
        <div class="order-item-actions">
          <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
          <button class="remove-item-btn" data-product-id="${item.id}">Remove</button>
        </div>
      `;
      orderItemsList.appendChild(itemElement);
    });

    // Attach remove event listeners
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', handleRemoveItem);
    });
  }

  calculateTotals();
}

// Handle remove item
function handleRemoveItem(e) {
  const productId = parseInt(e.target.dataset.productId);
  orderItems = orderItems.filter(item => item.id !== productId);
  updateOrderSummary();
  saveToLocalStorage();
}

// Calculate totals
function calculateTotals() {
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
  const shippingCost = parseFloat(document.getElementById('shippingCost').value) || 0;
  
  const taxAmount = subtotal * (taxRate / 100);
  const grandTotal = subtotal + taxAmount + shippingCost;

  document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('taxAmount').textContent = `$${taxAmount.toFixed(2)}`;
  document.getElementById('grandTotal').textContent = `$${grandTotal.toFixed(2)}`;
}

// Attach event listeners
function attachEventListeners() {
  // Tax rate and shipping cost changes
  document.getElementById('taxRate').addEventListener('input', calculateTotals);
  document.getElementById('shippingCost').addEventListener('input', calculateTotals);

  // Customer form
  document.getElementById('customerForm').addEventListener('submit', handleCustomerFormSubmit);

  // Clear order button
  document.getElementById('clearOrderBtn').addEventListener('click', handleClearOrder);

  // Generate PDF button
  document.getElementById('generatePdfBtn').addEventListener('click', handleGeneratePDF);
}

// Handle customer form submit
function handleCustomerFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('customerName').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();

  if (!name || !email) {
    alert('Please fill in at least name and email');
    return;
  }

  if (!validateEmail(email)) {
    alert('Please enter a valid email address');
    return;
  }

  customerInfo = { name, email, phone, address };
  saveToLocalStorage();
  alert('Customer information saved!');
  updatePDFPreview();
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Handle clear order
function handleClearOrder() {
  if (confirm('Are you sure you want to clear the entire order?')) {
    orderItems = [];
    updateOrderSummary();
    saveToLocalStorage();
  }
}

// Update PDF preview
function updatePDFPreview() {
  const pdfContent = document.getElementById('pdfContent');
  const pdfPreview = document.getElementById('pdfPreview');
  
  // Customer details
  const pdfCustomerDetails = document.getElementById('pdfCustomerDetails');
  if (customerInfo.name) {
    pdfCustomerDetails.innerHTML = `
      <p><strong>Name:</strong> ${customerInfo.name}</p>
      <p><strong>Email:</strong> ${customerInfo.email}</p>
      ${customerInfo.phone ? `<p><strong>Phone:</strong> ${customerInfo.phone}</p>` : ''}
      ${customerInfo.address ? `<p><strong>Address:</strong> ${customerInfo.address}</p>` : ''}
    `;
  }

  // Order date
  const pdfOrderDate = document.getElementById('pdfOrderDate');
  pdfOrderDate.textContent = new Date().toLocaleDateString();

  // Order items
  const pdfOrderItems = document.getElementById('pdfOrderItems');
  pdfOrderItems.innerHTML = '';
  
  if (orderItems.length > 0) {
    orderItems.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
      `;
      pdfOrderItems.appendChild(row);
    });

    // Totals
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const shippingCost = parseFloat(document.getElementById('shippingCost').value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const grandTotal = subtotal + taxAmount + shippingCost;

    const pdfTotals = document.getElementById('pdfTotals');
    pdfTotals.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
        <td>$${subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="3" style="text-align: right;"><strong>Tax (${taxRate}%):</strong></td>
        <td>$${taxAmount.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="3" style="text-align: right;"><strong>Shipping:</strong></td>
        <td>$${shippingCost.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="3" style="text-align: right;"><strong>Grand Total:</strong></td>
        <td><strong>$${grandTotal.toFixed(2)}</strong></td>
      </tr>
    `;

    // Order notes
    const orderNotes = document.getElementById('orderNotes').value.trim();
    if (orderNotes) {
      const notesElement = document.createElement('div');
      notesElement.className = 'pdf-notes';
      notesElement.innerHTML = `<p><strong>Notes:</strong> ${orderNotes}</p>`;
      pdfContent.appendChild(notesElement);
    }

    pdfPreview.style.display = 'block';
  }
}

// Handle generate PDF
function handleGeneratePDF() {
  if (orderItems.length === 0) {
    alert('Please add items to the order first');
    return;
  }

  if (!customerInfo.name) {
    alert('Please fill in customer information first');
    return;
  }

  updatePDFPreview();

  const element = document.getElementById('pdfContent');
  const opt = {
    margin: 10,
    filename: `order_${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}

// Save to localStorage
function saveToLocalStorage() {
  const data = {
    orderItems,
    customerInfo,
    taxRate: document.getElementById('taxRate').value,
    shippingCost: document.getElementById('shippingCost').value,
    orderNotes: document.getElementById('orderNotes').value
  };
  localStorage.setItem('orderFormData', JSON.stringify(data));
}

// Load from localStorage
function loadFromLocalStorage() {
  const data = localStorage.getItem('orderFormData');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      orderItems = parsed.orderItems || [];
      customerInfo = parsed.customerInfo || {};
      
      if (parsed.taxRate) document.getElementById('taxRate').value = parsed.taxRate;
      if (parsed.shippingCost) document.getElementById('shippingCost').value = parsed.shippingCost;
      if (parsed.orderNotes) document.getElementById('orderNotes').value = parsed.orderNotes;
      
      if (customerInfo.name) {
        document.getElementById('customerName').value = customerInfo.name;
        document.getElementById('customerEmail').value = customerInfo.email;
        document.getElementById('customerPhone').value = customerInfo.phone || '';
        document.getElementById('customerAddress').value = customerInfo.address || '';
      }
      
      updateOrderSummary();
      updatePDFPreview();
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }
}

// Auto-save on order notes change
document.addEventListener('DOMContentLoaded', () => {
  const orderNotesField = document.getElementById('orderNotes');
  if (orderNotesField) {
    orderNotesField.addEventListener('input', () => {
      saveToLocalStorage();
      updatePDFPreview();
    });
  }
});