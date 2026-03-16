// Product Data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.5,
    description: "Premium wireless headphones with noise cancellation"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.8,
    description: "Feature-rich smartwatch with fitness tracking"
  },
  {
    id: 3,
    name: "Laptop Backpack",
    category: "Accessories",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.3,
    description: "Durable backpack with laptop compartment"
  },
  {
    id: 4,
    name: "Coffee Maker",
    category: "Home",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
    rating: 4.6,
    description: "Programmable coffee maker with thermal carafe"
  },
  {
    id: 5,
    name: "Running Shoes",
    category: "Sports",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.7,
    description: "Lightweight running shoes with superior cushioning"
  },
  {
    id: 6,
    name: "Desk Lamp",
    category: "Home",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    rating: 4.4,
    description: "LED desk lamp with adjustable brightness"
  },
  {
    id: 7,
    name: "Yoga Mat",
    category: "Sports",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    rating: 4.5,
    description: "Non-slip yoga mat with carrying strap"
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    rating: 4.6,
    description: "Portable Bluetooth speaker with 360° sound"
  },
  {
    id: 9,
    name: "Sunglasses",
    category: "Accessories",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    rating: 4.2,
    description: "UV protection sunglasses with polarized lenses"
  },
  {
    id: 10,
    name: "Water Bottle",
    category: "Sports",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    rating: 4.8,
    description: "Insulated stainless steel water bottle"
  },
  {
    id: 11,
    name: "Wireless Mouse",
    category: "Electronics",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    rating: 4.4,
    description: "Ergonomic wireless mouse with precision tracking"
  },
  {
    id: 12,
    name: "Throw Pillow Set",
    category: "Home",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop",
    rating: 4.5,
    description: "Decorative throw pillows set of 4"
  }
];

// State
let cart = [];
let filteredProducts = [...products];
let currentView = 'grid';
let filters = {
  search: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 1000,
  sortBy: 'featured'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  initializeFilters();
  initializeEventListeners();
  renderProducts();
  updateCartUI();
});

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Initialize filters
function initializeFilters() {
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  
  if (minPrice) {
    minPrice.value = filters.minPrice;
  }
  if (maxPrice) {
    maxPrice.value = filters.maxPrice;
  }
}

// Initialize event listeners
function initializeEventListeners() {
  // Search
  const searchInput = document.getElementById('productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filters.search = e.target.value.toLowerCase();
      applyFilters();
    });
  }

  // Sort
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      filters.sortBy = e.target.value;
      applyFilters();
    });
  }

  // Price filters
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  
  if (minPrice) {
    minPrice.addEventListener('input', (e) => {
      filters.minPrice = parseFloat(e.target.value) || 0;
      applyFilters();
    });
  }
  
  if (maxPrice) {
    maxPrice.addEventListener('input', (e) => {
      filters.maxPrice = parseFloat(e.target.value) || 1000;
      applyFilters();
    });
  }

  // Category filters
  const categoryButtons = document.querySelectorAll('[data-category]');
  categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      filters.category = e.target.dataset.category;
      applyFilters();
    });
  });

  // View toggle
  const viewButtons = document.querySelectorAll('[data-view]');
  viewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      viewButtons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      currentView = e.target.dataset.view;
      renderProducts();
    });
  });

  // Cart sidebar
  const cartButton = document.querySelector('[data-cart-toggle]');
  const cartSidebar = document.getElementById('cartSidebar');
  const closeCart = document.querySelector('[data-close-cart]');
  
  if (cartButton) {
    cartButton.addEventListener('click', () => {
      if (cartSidebar) {
        cartSidebar.classList.add('active');
      }
    });
  }
  
  if (closeCart) {
    closeCart.addEventListener('click', () => {
      if (cartSidebar) {
        cartSidebar.classList.remove('active');
      }
    });
  }

  // Checkout button
  const checkoutButton = document.getElementById('checkoutButton');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', openCheckout);
  }

  // Checkout form
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckout);
  }

  // Close checkout modal
  const closeCheckout = document.querySelector('[data-close-checkout]');
  if (closeCheckout) {
    closeCheckout.addEventListener('click', closeCheckoutModal);
  }

  // Close modal on outside click
  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) {
        closeCheckoutModal();
      }
    });
  }
}

// Apply filters
function applyFilters() {
  filteredProducts = products.filter(product => {
    // Search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search) && 
        !product.description.toLowerCase().includes(filters.search)) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }

    // Price filter
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    return true;
  });

  // Sort products
  switch (filters.sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // Featured - keep original order
      break;
  }

  renderProducts();
  updateResultsCount();
}

// Update results count
function updateResultsCount() {
  const resultsCount = document.getElementById('resultsCount');
  if (resultsCount) {
    resultsCount.textContent = `${filteredProducts.length} products found`;
  }
}

// Render products
function renderProducts() {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  productGrid.className = currentView === 'grid' ? 'product-grid' : 'product-list';
  
  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '<div class="no-results">No products found</div>';
    return;
  }

  productGrid.innerHTML = filteredProducts.map(product => `
    <div class="product-card ${currentView === 'list' ? 'list-view' : ''}" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="quick-add" onclick="addToCart(${product.id})">
          <span>Quick Add</span>
        </button>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-rating">
          ${renderStars(product.rating)}
          <span class="rating-value">${product.rating}</span>
        </div>
        <div class="product-footer">
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Render star rating
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '★';
  }
  if (hasHalfStar) {
    stars += '☆';
  }
  while (stars.length < 5) {
    stars += '☆';
  }
  
  return `<span class="stars">${stars}</span>`;
}

// Add to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  showNotification(`${product.name} added to cart`);
  
  // Open cart sidebar
  const cartSidebar = document.getElementById('cartSidebar');
  if (cartSidebar) {
    cartSidebar.classList.add('active');
  }
}

// Update cart UI
function updateCartUI() {
  updateCartCount();
  updateCartItems();
  updateCartTotal();
}

// Update cart count
function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Update cart items
function updateCartItems() {
  const cartItems = document.getElementById('cartItems');
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-cart-item-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})">&times;</button>
    </div>
  `).join('');
}

// Update cart total
function updateCartTotal() {
  const cartTotal = document.getElementById('cartTotal');
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  if (cartTotal) {
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartUI();
  }
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
  showNotification('Item removed from cart');
}

// Open checkout
function openCheckout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty');
    return;
  }

  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) {
    checkoutModal.classList.add('active');
    updateOrderSummary();
  }
}

// Close checkout modal
function closeCheckoutModal() {
  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) {
    checkoutModal.classList.remove('active');
  }
}

// Update order summary
function updateOrderSummary() {
  const orderSummary = document.getElementById('orderSummary');
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutTax = document.getElementById('checkoutTax');
  const checkoutGrandTotal = document.getElementById('checkoutGrandTotal');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  if (orderSummary) {
    orderSummary.innerHTML = cart.map(item => `
      <div class="order-item">
        <span>${item.name} x ${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
  }

  if (checkoutSubtotal) {
    checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  }

  if (checkoutTax) {
    checkoutTax.textContent = `$${tax.toFixed(2)}`;
  }

  if (checkoutGrandTotal) {
    checkoutGrandTotal.textContent = `$${total.toFixed(2)}`;
  }
}

// Handle checkout
function handleCheckout(e) {
  e.preventDefault();

  // Get form values
  const firstName = document.getElementById('firstName')?.value.trim();
  const lastName = document.getElementById('lastName')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const address = document.getElementById('address')?.value.trim();
  const city = document.getElementById('city')?.value.trim();
  const zipCode = document.getElementById('zipCode')?.value.trim();
  const cardNumber = document.getElementById('cardNumber')?.value.trim();
  const expiryDate = document.getElementById('expiryDate')?.value.trim();
  const cvv = document.getElementById('cvv')?.value.trim();

  // Validate form
  if (!firstName || !lastName || !email || !address || !city || !zipCode) {
    showNotification('Please fill in all shipping information', 'error');
    return;
  }

  if (!validateEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }

  if (!cardNumber || !expiryDate || !cvv) {
    showNotification('Please fill in all payment information', 'error');
    return;
  }

  if (!validateCardNumber(cardNumber)) {
    showNotification('Please enter a valid card number', 'error');
    return;
  }

  if (!validateExpiryDate(expiryDate)) {
    showNotification('Please enter a valid expiry date (MM/YY)', 'error');
    return;
  }

  if (!validateCVV(cvv)) {
    showNotification('Please enter a valid CVV', 'error');
    return;
  }

  // Process order
  processOrder({
    firstName,
    lastName,
    email,
    address,
    city,
    zipCode,
    cardNumber: maskCardNumber(cardNumber),
    items: cart,
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1
  });
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate card number
function validateCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
}

// Validate expiry date
function validateExpiryDate(expiryDate) {
  const re = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!re.test(expiryDate)) return false;

  const [month, year] = expiryDate.split('/').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
}

// Validate CVV
function validateCVV(cvv) {
  return /^\d{3,4}$/.test(cvv);
}

// Mask card number
function maskCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\s/g, '');
  return '**** **** **** ' + cleaned.slice(-4);
}

// Process order
function processOrder(orderData) {
  // Simulate processing
  showNotification('Processing your order...');

  setTimeout(() => {
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
      ...orderData,
      orderNumber: generateOrderNumber(),
      date: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();

    // Close modals
    closeCheckoutModal();
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
      cartSidebar.classList.remove('active');
    }

    // Show success message
    showNotification('Order placed successfully! Thank you for your purchase.', 'success');

    // Reset form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.reset();
    }
  }, 1500);
}

// Generate order number
function generateOrderNumber() {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Show notification
function showNotification(message, type = 'success') {
  const toast = document.getElementById('notificationToast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `notification-toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Format card number input
document.addEventListener('DOMContentLoaded', () => {
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s/g, '');
      value = value.replace(/(\d{4})/g, '$1 ').trim();
      e.target.value = value;
    });
  }

  const expiryDateInput = document.getElementById('expiryDate');
  if (expiryDateInput) {
    expiryDateInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }
});

// Export cart (bonus feature)
function exportCart() {
  if (cart.length === 0) {
    showNotification('Cart is empty', 'error');
    return;
  }

  const cartData = {
    items: cart,
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(cartData, null, 2)], { type: 'application/json' });
  
  if (typeof saveAs === 'function') {
    saveAs(blob, `cart-${Date.now()}.json`);
    showNotification('Cart exported successfully');
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cart-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Cart exported successfully');
  }
}

// Make functions globally accessible
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.exportCart = exportCart;