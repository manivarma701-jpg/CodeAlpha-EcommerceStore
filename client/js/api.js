// Small fetch wrapper shared by every page.
const Auth = {
  getToken: () => localStorage.getItem('ca_token'),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('ca_user') || 'null');
    } catch {
      return null;
    }
  },
  setSession: (token, user) => {
    localStorage.setItem('ca_token', token);
    localStorage.setItem('ca_user', JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem('ca_token');
    localStorage.removeItem('ca_user');
  },
  isLoggedIn: () => !!localStorage.getItem('ca_token')
};

async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = Auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (networkErr) {
    throw new Error(
      'Could not reach the server. Is the backend running, and does config.js point to the right API_BASE_URL?'
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // no JSON body, that's fine for some responses
  }

  if (!response.ok) {
    throw new Error((data && data.message) || `Request failed (${response.status})`);
  }
  return data;
}

// ---- Cart helpers (localStorage-backed guest cart) ----
const Cart = {
  KEY: 'ca_cart',
  getItems() {
    try {
      return JSON.parse(localStorage.getItem(Cart.KEY) || '[]');
    } catch {
      return [];
    }
  },
  saveItems(items) {
    localStorage.setItem(Cart.KEY, JSON.stringify(items));
    Cart.updateBadge();
  },
  addItem(product, quantity = 1) {
    const items = Cart.getItems();
    const existing = items.find((i) => i.productId === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity
      });
    }
    Cart.saveItems(items);
  },
  setQuantity(productId, quantity) {
    let items = Cart.getItems();
    if (quantity <= 0) {
      items = items.filter((i) => i.productId !== productId);
    } else {
      const item = items.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
    }
    Cart.saveItems(items);
  },
  removeItem(productId) {
    const items = Cart.getItems().filter((i) => i.productId !== productId);
    Cart.saveItems(items);
  },
  clear() {
    Cart.saveItems([]);
  },
  totalCount() {
    return Cart.getItems().reduce((sum, i) => sum + i.quantity, 0);
  },
  totalPrice() {
    return Cart.getItems().reduce((sum, i) => sum + i.quantity * i.price, 0);
  },
  updateBadge() {
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      const count = Cart.totalCount();
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
