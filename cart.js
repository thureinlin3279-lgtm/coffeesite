// Cart management functions
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'block' : 'none';
  }
}

function addToCart(name, price) {
  let cart = getCart();
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ 
      name, 
      price: parseFloat(price), 
      quantity: 1,
      id: Date.now() // Simple ID generation
    });
  }
  
  saveCart(cart);
  showCartNotification(`${name} added to cart!`);
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  if (document.getElementById('cartTable')) {
    displayCart();
  }
}

function updateQuantity(id, newQuantity) {
  let cart = getCart();
  const item = cart.find(item => item.id === id);
  
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      item.quantity = newQuantity;
      saveCart(cart);
      if (document.getElementById('cartTable')) {
        displayCart();
      }
    }
  }
}

function clearCart() {
  localStorage.removeItem('cart');
  updateCartBadge();
  if (document.getElementById('cartTable')) {
    displayCart();
  }
}

function displayCart() {
  const cart = getCart();
  const tbody = document.querySelector('#cartTable tbody');
  const grandTotalElement = document.getElementById('grandTotal');
  
  if (!tbody) return;
  
  tbody.innerHTML = '';
  let grandTotal = 0;
  
  if (cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
    grandTotalElement.textContent = 'Total: $0.00';
    return;
  }
  
  cart.forEach((item) => {
    const total = item.price * item.quantity;
    grandTotal += total;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="item-name">${item.name}</div>
      </td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
      </td>
      <td>$${total.toFixed(2)}</td>
      <td>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </td>
    `;
    tbody.appendChild(row);
  });
  
  grandTotalElement.textContent = `Total: $${grandTotal.toFixed(2)}`;
  
  // Update checkout button
  const checkoutBtn = document.getElementById('checkoutButton');
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

function showCartNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--gradient-primary);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: var(--shadow-medium);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function proceedToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemsList = cart.map(item => `${item.name} x${item.quantity}`).join('\n');
  
  if (confirm(`Order Summary:\n\n${itemsList}\n\nTotal: $${total.toFixed(2)}\n\nProceed to checkout?`)) {
    // Simulate checkout process
    const checkoutBtn = document.getElementById('checkoutButton');
    if (checkoutBtn) {
      checkoutBtn.innerHTML = '<span class="loading"></span> Processing...';
      checkoutBtn.disabled = true;
    }
    
    setTimeout(() => {
      alert('Order placed successfully! You will receive a confirmation email shortly.');
      clearCart();
      window.location.href = 'index.html';
    }, 2000);
  }
}

// Enhanced event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart badge
  updateCartBadge();
  
  // Add to Cart functionality
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const name = button.dataset.name;
      const price = button.dataset.price;
      
      if (!name || !price) {
        console.error('Missing product data');
        return;
      }
      
      // Add loading state
      const originalText = button.textContent;
      button.innerHTML = '<span class="loading"></span> Adding...';
      button.disabled = true;
      
      setTimeout(() => {
        addToCart(name, price);
        button.textContent = originalText;
        button.disabled = false;
      }, 500);
    });
  });
  
  // Display cart if on cart page
  if (document.getElementById('cartTable')) {
    displayCart();
  }
  
  // Checkout button
  const checkoutButton = document.getElementById('checkoutButton');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', proceedToCheckout);
  }
  
  // Clear cart button (if exists)
  const clearCartButton = document.getElementById('clearCartButton');
  if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your cart?')) {
        clearCart();
      }
    });
  }
});

// Export functions for global use
window.CartManager = {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCart,
  displayCart,
  proceedToCheckout
};
