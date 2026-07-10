function renderCheckout() {
  const root = document.getElementById('checkout-root');

  // Checkout is restricted to logged-in users
  if (!Auth.isLoggedIn()) {
    window.location.href = 'login.html?next=checkout.html';
    return;
  }

  const items = Cart.getItems();
  if (items.length === 0) {
    root.innerHTML = `
      <div class="panel" style="grid-column:1/-1;">
        <div class="empty-state">
          <div class="icon">🛒</div>
          <p>Your cart is empty, so there's nothing to check out.</p>
          <a href="index.html" class="btn btn-primary" style="margin-top:14px;">Continue shopping</a>
        </div>
      </div>
    `;
    return;
  }

  const user = Auth.getUser();
  const subtotal = Cart.totalPrice();
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  root.innerHTML = `
    <div class="panel">
      <h3 style="margin-bottom:16px;">Shipping Address</h3>
      <div class="form-error" data-error></div>
      <form id="checkout-form">
        <div class="field">
          <label for="fullName">Full name</label>
          <input type="text" id="fullName" value="${user ? user.name : ''}" required />
        </div>
        <div class="field">
          <label for="phone">Phone number</label>
          <input type="tel" id="phone" pattern="[0-9]{10}" placeholder="10-digit mobile number" required />
        </div>
        <div class="field">
          <label for="addressLine">Address</label>
          <textarea id="addressLine" rows="2" required></textarea>
        </div>
        <div class="field-row">
          <div class="field">
            <label for="city">City</label>
            <input type="text" id="city" required />
          </div>
          <div class="field">
            <label for="state">State</label>
            <input type="text" id="state" required />
          </div>
        </div>
        <div class="field">
          <label for="pincode">Pincode</label>
          <input type="text" id="pincode" pattern="[0-9]{6}" placeholder="6-digit pincode" required />
        </div>
        <button type="submit" class="btn btn-primary btn-block" id="place-order-btn">Place Order · ₹${total.toLocaleString('en-IN')}</button>
      </form>
    </div>
    <div class="panel">
      <h3 style="margin-bottom:16px;">Order Summary</h3>
      ${items
        .map(
          (i) => `<div class="mini-line"><img src="${i.image}" alt="${i.name}" /><div><div>${i.name}</div><div class="unit-price">Qty ${i.quantity} × ₹${i.price.toLocaleString('en-IN')}</div></div></div>`
        )
        .join('')}
      <div class="summary-row" style="margin-top:14px;"><span>Subtotal</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping}</span></div>
      <div class="summary-row total"><span>Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
    </div>
  `;

  document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.querySelector('[data-error]');
    errorBox.classList.remove('is-visible');

    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.textContent = 'Placing order...';

    const shippingAddress = {
      fullName: document.getElementById('fullName').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      addressLine: document.getElementById('addressLine').value.trim(),
      city: document.getElementById('city').value.trim(),
      state: document.getElementById('state').value.trim(),
      pincode: document.getElementById('pincode').value.trim()
    };

    const orderItems = Cart.getItems().map((i) => ({ productId: i.productId, quantity: i.quantity }));

    try {
      const order = await apiRequest('/orders', {
        method: 'POST',
        auth: true,
        body: { items: orderItems, shippingAddress }
      });
      Cart.clear();
      window.location.href = `order-confirmation.html?id=${order._id}`;
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.classList.add('is-visible');
      btn.disabled = false;
      btn.textContent = `Place Order · ₹${total.toLocaleString('en-IN')}`;
    }
  });
}

document.addEventListener('DOMContentLoaded', renderCheckout);
