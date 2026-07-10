function renderCart() {
  const root = document.getElementById('cart-root');
  const items = Cart.getItems();

  if (items.length === 0) {
    root.innerHTML = `
      <div class="panel" style="grid-column:1/-1;">
        <div class="empty-state">
          <div class="icon">🛒</div>
          <p>Your cart is empty.</p>
          <a href="index.html" class="btn btn-primary" style="margin-top:14px;">Continue shopping</a>
        </div>
      </div>
    `;
    return;
  }

  const linesHtml = items
    .map(
      (item) => `
      <div class="cart-line" data-id="${item.productId}">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <div class="name">${item.name}</div>
          <div class="unit-price">₹${item.price.toLocaleString('en-IN')} each</div>
          <div class="qty-control" style="margin-top:8px;">
            <button data-decrease>−</button>
            <span>${item.quantity}</span>
            <button data-increase>+</button>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
          <button class="btn-danger-text" data-remove>Remove</button>
        </div>
      </div>
    `
    )
    .join('');

  const subtotal = Cart.totalPrice();
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  root.innerHTML = `
    <div class="panel">${linesHtml}</div>
    <div class="panel">
      <h3 style="margin-bottom:16px;">Order Summary</h3>
      <div class="summary-row"><span>Subtotal (${Cart.totalCount()} items)</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping}</span></div>
      <div class="summary-row total"><span>Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
      <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top:16px;">Proceed to Checkout</a>
      <a href="index.html" class="btn btn-outline btn-block" style="margin-top:10px;">Continue shopping</a>
    </div>
  `;

  root.querySelectorAll('[data-increase]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const line = btn.closest('.cart-line');
      const id = line.dataset.id;
      const item = Cart.getItems().find((i) => i.productId === id);
      Cart.setQuantity(id, item.quantity + 1);
      renderCart();
    })
  );
  root.querySelectorAll('[data-decrease]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const line = btn.closest('.cart-line');
      const id = line.dataset.id;
      const item = Cart.getItems().find((i) => i.productId === id);
      Cart.setQuantity(id, item.quantity - 1);
      renderCart();
    })
  );
  root.querySelectorAll('[data-remove]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const line = btn.closest('.cart-line');
      Cart.removeItem(line.dataset.id);
      renderCart();
      showToast('Item removed from cart');
    })
  );
}

document.addEventListener('DOMContentLoaded', renderCart);
