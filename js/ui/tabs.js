// ui/tabs.js
import { dom } from './dom.js';

const ACTIVE_CLASS = 'active';

function applyActiveState(buttons, panes, targetId) {
  buttons.forEach(btn => btn.classList.toggle(ACTIVE_CLASS, btn.dataset.tab === targetId));
  panes.forEach(pane => pane.classList.toggle(ACTIVE_CLASS, pane.id === targetId));
}

export function initTabs() {
  const buttons = Array.from(dom.tabButtons || []);
  const panes = Array.from(dom.tabPanes || []);

  const defaultTarget =
    buttons.find(btn => btn.classList.contains(ACTIVE_CLASS))?.dataset.tab ||
    panes.find(p => p.classList.contains(ACTIVE_CLASS))?.id ||
    buttons[0]?.dataset.tab;

  if (defaultTarget) applyActiveState(buttons, panes, defaultTarget);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => activate(btn.dataset.tab));
  });

  function activate(targetId) {
    if (!targetId) return;
    applyActiveState(buttons, panes, targetId);
  }

  function setVisible(visible) {
    dom.tabs?.classList.toggle('hidden', !visible);
  }

  return { activate, setVisible };
}
