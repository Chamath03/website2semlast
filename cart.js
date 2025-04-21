// cart.js

// Utility to get and set cart in localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add event listeners on "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.order-card');
            const productName = card.querySelector('h3').textContent.trim();
            const priceText = card.previousElementSibling.querySelector('.details p:last-child').textContent;
            const price = parseInt(priceText.replace(/[^\d]/g, ''));

            let cart = getCart();
            const index = cart.findIndex(item => item.name === productName);

            if (index > -1) {
                cart[index].quantity += 1;
            } else {
                cart.push({ name: productName, price: price, quantity: 1 });
            }

            saveCart(cart);
            updateCartCount();
            alert(`${productName} added to cart!`);
        });
    });

    updateCartCount();
});

// Update cart item count in icon
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountSpan = document.querySelector('.cartcount');
    if (cartCountSpan) cartCountSpan.textContent = count;
}

// For cart.html
function renderCartTable() {
    const cart = getCart();
    const tbody = document.querySelector('tbody');
    const summary = document.querySelector('.summary h3');
    tbody.innerHTML = '';

    let grandTotal = 0;

    cart.forEach((item, idx) => {
        const total = item.price * item.quantity;
        grandTotal += total;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price} LKR</td>
            <td class="quantity">
                <button class="minus" data-index="${idx}">-</button>
                <span>${item.quantity}</span>
                <button class="plus" data-index="${idx}">+</button>
            </td>
            <td>${total} LKR</td>
        `;
        tbody.appendChild(row);
    });

    summary.textContent = `Total: ${grandTotal} LKR`;

    attachQuantityEvents();
}

// Attach plus/minus events
function attachQuantityEvents() {
    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            let cart = getCart();
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1); // remove item
            }
            saveCart(cart);
            renderCartTable();
            updateCartCount();
        });
    });

    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            let cart = getCart();
            cart[index].quantity++;
            saveCart(cart);
            renderCartTable();
            updateCartCount();
        });
    });
}

// Auto-render cart page
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', renderCartTable);
}


// Clear Cart functionality
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function () {
                if (confirm('Are you sure you want to clear the cart?')) {
                    localStorage.removeItem('cart');
                    renderCartTable();
                    updateCartCount();
                }
            });
        }
    });
}


// Handle checkout redirection
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const cart = getCart();
                localStorage.setItem('orderSummary', JSON.stringify(cart));
                window.location.href = 'payment.html';
            });
        }
    });
}


// Favourites: Save and Apply
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        const saveFavBtn = document.getElementById('save-favourite');
        const applyFavBtn = document.getElementById('apply-favourite');

        if (saveFavBtn) {
            saveFavBtn.addEventListener('click', () => {
                const cart = getCart();
                localStorage.setItem('favouriteCart', JSON.stringify(cart));
                alert("Favourite cart saved!");
            });
        }

        if (applyFavBtn) {
            applyFavBtn.addEventListener('click', () => {
                const favourite = JSON.parse(localStorage.getItem('favouriteCart')) || [];
                localStorage.setItem('cart', JSON.stringify(favourite));
                renderCartTable();
                updateCartCount();
                alert("Favourite cart applied!");
            });
        }
    });
}
