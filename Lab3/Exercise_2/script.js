// Products data with categories
const products = [
    { id: 1, name: 'JavaScript Book', price: 29.99, category: 'books', img: '📚' },
    { id: 2, name: 'Python Course', price: 49.99, category: 'courses', img: '🐍' },
    { id: 3, name: 'Web Design Kit', price: 79.99, category: 'design', img: '🎨' },
    { id: 4, name: 'Coffee Mug', price: 12.99, category: 'accessories', img: '☕' },
    { id: 5, name: 'Notebook', price: 8.99, category: 'books', img: '📝' },
    { id: 6, name: 'Mouse Pad', price: 19.99, category: 'accessories', img: '🖱️' }
];

let cart = [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartContent = document.getElementById('cartContent');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const discountEl = document.getElementById('discount');
const finalTotalEl = document.getElementById('finalTotal');
const discountDetailsEl = document.getElementById('discountDetails');
const couponInput = document.getElementById('couponInput');
const applyCouponBtn = document.getElementById('applyCoupon');
const couponMessage = document.getElementById('couponMessage');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartDisplay();
    applyCouponBtn.addEventListener('click', applyCoupon);
    couponInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') applyCoupon();
    });
});

// Render products
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-img">${product.img}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartDisplay();
    updateProductButtons();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateProductButtons();
}

// Update cart display
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = `${totalItems} items`;
    
    if (cart.length === 0) {
        cartContent.innerHTML = '<div class="empty-cart">Your cart is empty. Start shopping!</div>';
        updateTotals(0, 0, 0);
        return;
    }
    
    cartContent.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${cart.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>
                            <div class="quantity-controls">
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="qty-display">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </td>
                        <td>$${ (item.price * item.quantity).toFixed(2) }</td>
                        <td><button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    const { subtotal, discount, finalTotal } = calculateTotals();
    updateTotals(subtotal, discount, finalTotal);
}

// Calculate intelligent discounts
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    let discountDetails = [];
    
    // Quantity discount: 10% for 5+ items total, 15% for 10+
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity >= 10) {
        discount += subtotal * 0.15;
        discountDetails.push('15% Bulk (10+ items)');
    } else if (totalQuantity >= 5) {
        discount += subtotal * 0.10;
        discountDetails.push('10% Bulk (5+ items)');
    }
    
    // Category discount: 20% off books
    const booksSubtotal = cart
        .filter(item => item.category === 'books')
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (booksSubtotal > 0) {
        const booksDiscount = booksSubtotal * 0.20;
        discount += booksDiscount;
        discountDetails.push('20% Books');
    }
    
    // Time-based discount: 15% morning discount (before 12 PM)
    const hour = new Date().getHours();
    if (hour < 12) {
        const morningDiscount = subtotal * 0.15;
        discount += morningDiscount;
        discountDetails.push('15% Morning');
    }
    
    const finalTotal = Math.max(0, subtotal - discount);
    return { subtotal, discount: Math.round(discount * 100) / 100, finalTotal: Math.round(finalTotal * 100) / 100, details: discountDetails };
}

// Update totals display
function updateTotals(subtotal, discount, finalTotal) {
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    discountEl.innerHTML = `$${discount.toFixed(2)} <span id="discountDetails">${discount > 0 ? '🎉' : ''}</span>`;
    finalTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
    
    // Update discount details
    const details = calculateTotals().details;
    discountDetailsEl.innerHTML = details.length > 0 ? `(${details.join(', ')})` : '';
}

// Update product buttons
function updateProductButtons() {
    products.forEach(product => {
        const card = document.querySelector(`[data-id="${product.id}"]`);
        const btn = card.querySelector('.add-btn');
        const item = cart.find(item => item.id === product.id);
        if (item) {
            card.classList.add('added');
            btn.textContent = 'In Cart';
            btn.disabled = true;
        } else {
            card.classList.remove('added');
            btn.textContent = 'Add to Cart';
            btn.disabled = false;
        }
    });
}

// Coupon validation and extra discount
function applyCoupon() {
    const code = couponInput.value.trim().toUpperCase();
    couponMessage.innerHTML = '';
    
    let extraDiscount = 0;
    let couponValid = false;
    
    // Validate coupon codes using string methods
    if (code === 'SAVE10') {
        extraDiscount = 10;
        couponValid = true;
    } else if (code === 'BULK20' && cart.reduce((sum, item) => sum + item.quantity, 0) >= 3) {
        extraDiscount = 20;
        couponValid = true;
    } else if (code === 'MORNING15' && new Date().getHours() < 12) {
        extraDiscount = 15;
        couponValid = true;
    }
    
    if (couponValid) {
        couponMessage.innerHTML = `<div class="coupon-success">✅ Coupon applied! $${extraDiscount} OFF</div>`;
        couponInput.value = '';
        updateCartDisplay(); // Recalculate with coupon
    } else {
        couponMessage.innerHTML = `<div class="coupon-error">❌ Invalid coupon or conditions not met</div>`;
    }
    
    setTimeout(() => {
        couponMessage.innerHTML = '';
    }, 3000);
}
