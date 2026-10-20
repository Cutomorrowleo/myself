/* ============================================
   RESUME-PANEL.JS — Side Panel Toggle
   ============================================ */

(function () {
  'use strict';

  const avatar = document.getElementById('profileAvatar');
  const panel = document.getElementById('resumePanel');
  const backdrop = document.getElementById('resumeBackdrop');
  const closeBtn = document.getElementById('resumeClose');

  if (!avatar || !panel) return;

  // Get custom cursor element
  const customCursor = document.querySelector('.custom-cursor');
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
      closePanel();
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

  function openPanel() {
    if (panel.classList.contains('open')) return;
    previousOverflow = document.body.style.overflow;
    isolatePanel();
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handlePanelKeydown);

    // Hide custom cursor and restore default
    if (customCursor) customCursor.style.display = 'none';
    document.body.classList.remove('has-custom-cursor');

    // Trap focus inside panel
    requestAnimationFrame(() => {
      const title = document.getElementById('resumePanelTitle');
      (title || closeBtn || panel).focus();
    });
  }

  function closePanel() {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousOverflow;
    document.removeEventListener('keydown', handlePanelKeydown);
    restorePage();

    // Restore custom cursor
    if (customCursor && !('ontouchstart' in window)) {
      customCursor.style.display = '';
      document.body.classList.add('has-custom-cursor');
    }

    avatar.focus();
  }

  avatar.addEventListener('click', openPanel);
  backdrop.addEventListener('click', closePanel);
  closeBtn.addEventListener('click', closePanel);
})();


