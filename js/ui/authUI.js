// ui/authUI.js
import { dom } from './dom.js';

function setStatus(el, message, isError = false) {
  if (!el) return;
  el.textContent = message || '';
  el.classList.toggle('error', isError);
}

function setFormDisabled(formEl, disabled) {
  if (!formEl) return;
  formEl.querySelectorAll('input, button').forEach(el => { el.disabled = disabled; });
}

function toggleAuthForm(mode) {
  const toLogin = mode === 'login';
  dom.loginForm?.classList.toggle('hidden', !toLogin);
  dom.registerForm?.classList.toggle('hidden', toLogin);
  dom.authArea?.classList.toggle('auth-area--logged-in', false);
}

export const authUI = {
  bind({ onLoginSubmit, onRegisterSubmit, onLogout }) {
    dom.showRegister?.addEventListener('click', () => toggleAuthForm('register'));
    dom.showLogin?.addEventListener('click', () => toggleAuthForm('login'));

    dom.loginForm?.addEventListener('submit', event => {
      event.preventDefault();
      onLoginSubmit?.(event, { setStatus, setFormDisabled });
    });

    dom.registerForm?.addEventListener('submit', event => {
      event.preventDefault();
      onRegisterSubmit?.(event, { setStatus, setFormDisabled });
    });

    dom.logoutBtn?.addEventListener('click', onLogout);
  },

  renderUser(user) {
    const isLoggedIn = Boolean(user);
    dom.authArea?.classList.toggle('auth-area--logged-in', isLoggedIn);
    dom.welcomeBox?.classList.toggle('hidden', !isLoggedIn);
    dom.welcomeArea?.classList.toggle('hidden', !isLoggedIn);
    dom.loginForm?.classList.toggle('hidden', isLoggedIn);
    dom.registerForm?.classList.toggle('hidden', true);

    if (isLoggedIn) {
      dom.headerWelcomeName.textContent = user.name || 'Coach';
      dom.headerWelcomeEmail.textContent = user.email;
      dom.welcomeName.textContent = user.name || 'Coach';
      dom.welcomeEmail.textContent = user.email;
    } else {
      setStatus(dom.loginStatus, '');
      setStatus(dom.registerStatus, '');
      dom.loginForm?.reset();
      dom.registerForm?.reset();
    }
  },

  setStatus,
  setFormDisabled,
  toggleAuthForm,
};
