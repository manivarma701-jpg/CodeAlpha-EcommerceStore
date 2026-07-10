function showFormError(message) {
  const box = document.querySelector('[data-error]');
  if (!box) return;
  box.textContent = message;
  box.classList.add('is-visible');
}

function hideFormError() {
  const box = document.querySelector('[data-error]');
  if (box) box.classList.remove('is-visible');
}

function redirectAfterAuth() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next');
  window.location.href = next || 'index.html';
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
  const autofillBtn = document.getElementById('autofill-btn');
  if (autofillBtn) {
    autofillBtn.addEventListener('click', () => {
      document.getElementById('email').value = 'admin@codealpha.com';
      document.getElementById('password').value = 'admin123';
    });
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFormError();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } });
      Auth.setSession(data.token, data.user);
      redirectAfterAuth();
    } catch (err) {
      showFormError(err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Log In';
    }
  });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFormError();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    try {
      const data = await apiRequest('/auth/register', { method: 'POST', body: { name, email, password } });
      Auth.setSession(data.token, data.user);
      redirectAfterAuth();
    } catch (err) {
      showFormError(err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });
}
