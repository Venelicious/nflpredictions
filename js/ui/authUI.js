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

function openRegisterModal() {
  if (!dom.registerModal) return;
  dom.registerModal.classList.remove('hidden');
  dom.registerModal.setAttribute('aria-hidden', 'false');
  setStatus(dom.registerStatus, '');
  dom.registerForm?.reset();
  dom.registerName?.focus();
}

function closeRegisterModal() {
  if (!dom.registerModal) return;
  dom.registerModal.classList.add('hidden');
  dom.registerModal.setAttribute('aria-hidden', 'true');
}

export const authUI = {
  bind({ onLoginSubmit, onRegisterSubmit, onLogout }) {
    dom.showRegister?.addEventListener('click', () => openRegisterModal());
    dom.showLogin?.addEventListener('click', () => {
      closeRegisterModal();
      dom.loginEmail?.focus();
    });
    dom.closeRegisterModal?.addEventListener('click', closeRegisterModal);
    dom.registerModalBackdrop?.addEventListener('click', closeRegisterModal);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeRegisterModal();
    });

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
    closeRegisterModal();

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
  openRegisterModal,
  closeRegisterModal,
};
