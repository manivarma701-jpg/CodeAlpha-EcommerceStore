function showToast(message) {
  const toast = document.querySelector('[data-toast]');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function productCard(product) {
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  return `
    <div class="card" data-id="${product._id}">
      <a href="product.html?id=${product._id}" class="card-media">
        ${discount > 0 ? `<span class="ribbon">${discount}% OFF</span>` : ''}
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </a>
      <div class="card-body">
        <span class="card-category">${product.category}</span>
        <a href="product.html?id=${product._id}" class="card-title">${product.name}</a>
        <span class="card-rating">★ ${product.rating.toFixed(1)}</span>
        <div class="price-row">
          <span class="price-now">₹${product.price.toLocaleString('en-IN')}</span>
          ${discount > 0 ? `<span class="price-mrp">₹${product.mrp.toLocaleString('en-IN')}</span><span class="price-off">${discount}% off</span>` : ''}
        </div>
        <button class="btn btn-primary btn-block btn-add-cart" data-add-to-cart>
          <span class="btn-label btn-label--default">Add to Cart</span>
          <span class="btn-label btn-label--added">✓ Added</span>
        </button>
      </div>
    </div>
  `;
}

async function loadHome() {
  const grid = document.getElementById('product-grid');
  const params = new URLSearchParams(window.location.search);
  const search = params.get('search') || '';
  const category = params.get('category') || 'all';

  document.getElementById('grid-heading').textContent = search
    ? `Results for "${search}"`
    : category !== 'all'
    ? category
    : 'All products';

  try {
    const [products, categories] = await Promise.all([
      apiRequest(`/products?${search ? `search=${encodeURIComponent(search)}` : ''}${category !== 'all' ? `&category=${encodeURIComponent(category)}` : ''}`),
      apiRequest('/products/categories')
    ]);

    renderChips(categories, category);

    document.getElementById('result-count').textContent = `${products.length} item${products.length === 1 ? '' : 's'}`;

    if (products.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <div class="icon">🔍</div>
        <p>No products matched your search.</p>
      </div>`;
      return;
    }

    grid.innerHTML = products.map(productCard).join('');
    grid.querySelectorAll('[data-add-to-cart]').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        Cart.addItem(products[i]);
        btn.classList.add('is-added');
        showToast(`${products[i].name} added to cart`);
        setTimeout(() => btn.classList.remove('is-added'), 1400);
      });
    });
  } catch (err) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <div class="icon">⚠️</div>
      <p>${err.message}</p>
    </div>`;
  }
}

function renderChips(categories, activeCategory) {
  const row = document.querySelector('[data-category-chips]');
  const all = ['all', ...categories];
  row.innerHTML = all
    .map(
      (cat) => `<button class="chip ${cat === activeCategory ? 'is-active' : ''}" data-category="${cat}">${cat === 'all' ? 'All' : cat}</button>`
    )
    .join('');

  row.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.category;
      window.location.href = cat === 'all' ? 'index.html' : `index.html?category=${encodeURIComponent(cat)}`;
    });
  });
}

document.addEventListener('DOMContentLoaded', loadHome);
