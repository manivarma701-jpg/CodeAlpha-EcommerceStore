// Wires up the shared header: auth state, logout, search box.
function initNav() {
  const authArea = document.querySelector('[data-auth-area]');
  if (authArea) {
    const user = Auth.getUser();
    if (user) {
      authArea.innerHTML = `
        <span class="nav-greeting">Hi, ${user.name.split(' ')[0]}</span>
        <a href="orders.html" class="nav-link">Orders</a>
        <button class="nav-link nav-link--btn" data-logout>Logout</button>
      `;
      authArea.querySelector('[data-logout]').addEventListener('click', () => {
        Auth.clearSession();
        window.location.href = 'index.html';
      });
    } else {
      authArea.innerHTML = `<a href="login.html" class="nav-link nav-link--pill">Login</a>`;
    }
  }

  const searchForm = document.querySelector('[data-search-form]');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchForm.querySelector('input').value.trim();
      window.location.href = `index.html?search=${encodeURIComponent(q)}`;
    });
  }

  Cart.updateBadge();
}

document.addEventListener('DOMContentLoaded', initNav);
