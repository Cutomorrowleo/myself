/* ============================================
   CHAI-PANEL.JS — Chai Recipe Side Panel Toggle
   ============================================ */

(function () {
  'use strict';

  const panel = document.getElementById('chaiPanel');
  const backdrop = document.getElementById('chaiBackdrop');
  const closeBtn = document.getElementById('chaiClose');
  const notebook = document.getElementById('chaiNotebook');

  if (!panel) return;
  let triggerEl = null;
  let backgroundState = null;
  let previousOverflow = '';

  function getFocusable() {
    return Array.from(panel.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => {
      const style = window.getComputedStyle(el);
      return !el.hidden && style.display !== 'none' && style.visibility !== 'hidden';
    });
  }

  function isolatePanel() {
    backgroundState = Array.from(document.body.children)
      .filter(el => el instanceof HTMLElement && !['SCRIPT', 'STYLE'].includes(el.tagName))
      .map(el => ({ el, inert: el.inert, ariaHidden: el.getAttribute('aria-hidden') }));

    backgroundState.forEach(({ el }) => {
      const isPanel = el === panel;
      el.inert = !isPanel;
      if (!isPanel) el.setAttribute('aria-hidden', 'true');
    });
    panel.inert = false;
  }

  function restorePage() {
    if (!backgroundState) return;
    backgroundState.forEach(({ el, inert, ariaHidden }) => {
      el.inert = inert;
      if (ariaHidden === null) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', ariaHidden);
    });
    backgroundState = null;
  }

  function handlePanelKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const activeIndex = focusable.indexOf(document.activeElement);
      if (activeIndex === -1 || (event.shiftKey && activeIndex === 0) || (!event.shiftKey && activeIndex === focusable.length - 1)) {
        event.preventDefault();
        (event.shiftKey ? focusable[focusable.length - 1] : focusable[0]).focus();
      }
    }
  }

  function open(sourceEl = null) {
    if (panel.classList.contains('open')) return;
    triggerEl = sourceEl instanceof HTMLElement
      ? sourceEl
      : (document.activeElement instanceof HTMLElement && document.activeElement !== document.body
          ? document.activeElement
          : document.getElementById('illust-chai'));
    previousOverflow = document.body.style.overflow;
    isolatePanel();
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handlePanelKeydown);

    // Scroll notebook to top on each open
    if (notebook) notebook.scrollTop = 0;

    requestAnimationFrame(() => {
      const title = document.getElementById('chaiPanelTitle');
      (title || closeBtn || panel).focus();
    });
  }

  function close() {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousOverflow;
    document.removeEventListener('keydown', handlePanelKeydown);
    restorePage();
    requestAnimationFrame(() => {
      if (triggerEl instanceof HTMLElement && triggerEl.isConnected) triggerEl.focus();
      triggerEl = null;
    });
  }

  if (backdrop) backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Expose globally for sticker click handler
  window.__chaiPanel = { open, close };
})();


