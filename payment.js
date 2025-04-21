

document.addEventListener('DOMContentLoaded', function () {
    // Render order summary
    const orderItems = JSON.parse(localStorage.getItem('orderSummary')) || [];
    const tbody = document.getElementById('order-items');
    const tfootCell = document.querySelector('tfoot td:last-child');
    tbody.innerHTML = ''; // Clear any placeholder rows

    let grandTotal = 0;

    orderItems.forEach(item => {
        const row = document.createElement('tr');
        const total = item.price * item.quantity;
        grandTotal += total;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${total} LKR</td>
        `;
        tbody.appendChild(row);
    });

    if (tfootCell) {
        tfootCell.innerHTML = `<strong>${grandTotal} LKR</strong>`;
    }

    // Set default delivery date to 2 days from today
    const deliveryInput = document.getElementById('deliveryDate');
    if (deliveryInput) {
        const today = new Date();
        today.setDate(today.getDate() + 2);
        const minDate = today.toISOString().split('T')[0];
        deliveryInput.value = minDate;
        deliveryInput.min = minDate;
    }
});

// Handle order submission confirmation
document.getElementById('order-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent real submission for now

    const deliveryDate = document.getElementById('deliveryDate')?.value || 'N/A';

    // Show a confirmation popup
    alert(`Your order has been placed successfully!
Estimated Delivery: ${deliveryDate}
Thank you for shopping with GamePulse.`);

    // Clear the cart
    localStorage.removeItem('cart');
    localStorage.removeItem('orderSummary');

    // Redirect
    window.location.href = 'index.html';
});
