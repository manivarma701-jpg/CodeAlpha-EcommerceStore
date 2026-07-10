async function loadProduct() {
  const root = document.getElementById('pd-root');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    root.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>No product specified.</p></div>`;
    return;
  }

  try {
    const product = await apiRequest(`/products/${id}`);
    document.title = `${product.name} — CodeAlpha Store`;

    const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
    const lowStock = product.stock > 0 && product.stock <= 5;

    root.innerHTML = `
      <div class="pd-grid">
        <div class="pd-media"><img src="${product.image}" alt="${product.name}" /></div>
        <div>
          <span class="pd-category">${product.category}</span>
          <h1 class="pd-title">${product.name}</h1>
          <span class="card-rating">★ ${product.rating.toFixed(1)} rating</span>
          <div class="pd-price-row">
            <span class="pd-price-now">₹${product.price.toLocaleString('en-IN')}</span>
            ${discount > 0 ? `<span class="price-mrp">₹${product.mrp.toLocaleString('en-IN')}</span><span class="price-off">${discount}% off</span>` : ''}
          </div>
          <p class="pd-desc">${product.description}</p>
          <div class="pd-actions">
            <button class="btn btn-primary btn-add-cart" id="pd-add-btn" ${product.stock === 0 ? 'disabled' : ''}>
              <span class="btn-label btn-label--default">${product.stock === 0 ? 'Out of stock' : 'Add to Cart'}</span>
              <span class="btn-label btn-label--added">✓ Added</span>
            </button>
            <a href="cart.html" class="btn btn-dark">Go to Cart</a>
          </div>
          <p class="pd-stock ${lowStock ? 'low' : ''}">
            ${product.stock === 0 ? 'Currently out of stock' : lowStock ? `Only ${product.stock} left — order soon!` : 'In stock'}
          </p>
        </div>
      </div>
    `;

    const btn = document.getElementById('pd-add-btn');
    if (btn && product.stock > 0) {
      btn.addEventListener('click', () => {
        Cart.addItem(product);
        btn.classList.add('is-added');
        showToast(`${product.name} added to cart`);
        setTimeout(() => btn.classList.remove('is-added'), 1400);
      });
    }
  } catch (err) {
    root.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

document.addEventListener('DOMContentLoaded', loadProduct);
