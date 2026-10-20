/* ============================================
   LOADER.JS — Sticker Trail Loading Sequence
   ============================================ */

class Loader {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.loader = document.querySelector('.loader');
    this.counter = document.querySelector('.loader-counter');
    this.trail = document.querySelector('.loader-sticker-trail');
    this.count = 0;
    this.tl = null;
    this.exitTl = null;
    this.completed = false;
    this.failSafeTimer = null;
    this.preloadTimeoutMs = 1200;
    this.failSafeTimeoutMs = 6000;
    this.sessionKey = 'portfolio-loader-seen';

    this.stickerFiles = [
      'sticker-01.png', 'sticker-11.png', 'sticker-02.png',
      'sticker-12.png', 'sticker-03.png', 'sticker-17.png',
      'sticker-04.png', 'sticker-13.png', 'sticker-08.png',
      'sticker-18.png', 'sticker-05.png', 'sticker-09.png',
      'sticker-14.png', 'sticker-06.png', 'sticker-10.png',
      'sticker-15.png', 'sticker-19.png', 'sticker-07.png',
      'sticker-20.png', 'sticker-16.png',
    ];

    this.yOffsets = [-7, 5, -2, 8, -6, 3, -9, 6, -1, 9, -5, 4, -8, 7, -3, 5, -6, 8, -2, 4];
  }

  start() {
    if (!this.loader || prefersReducedMotion() || this._hasPlayedThisSession()) {
      this._complete();
      return;
    }

    this.failSafeTimer = window.setTimeout(() => this._complete(), this.failSafeTimeoutMs);
    this._preloadStickers()
      .catch(() => undefined)
      .then(() => {
        if (!this.completed) this._animate();
      });
  }

  _preloadStickers() {
    return Promise.all(this.stickerFiles.map(file => {
      return new Promise(resolve => {
        const img = new Image();
        let settled = false;
        const settle = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeoutId);
          img.onload = null;
          img.onerror = null;
          resolve();
        };
        const timeoutId = window.setTimeout(settle, this.preloadTimeoutMs);
        img.onload = settle;
        img.onerror = settle;
        img.src = `/assets/load-stickers/${file}`;
      });
    }));
  }

  _animate() {
    const ordered = [...this.stickerFiles];
    const total = ordered.length;

    // Create sticker elements positioned along a trail
    const stickerData = ordered.map((file, i) => {
      const img = document.createElement('img');
      img.src = `/assets/load-stickers/${file}`;
      img.alt = '';
      img.className = 'loader-sticker';
      img.draggable = false;

      const progress = i / (total - 1);
      const xPct = 3 + progress * 94;
      const yBase = 48;
      const yOffset = this.yOffsets[i];
      const rot = 0;

      img.style.left = `${xPct}%`;
      img.style.top = `${yBase + yOffset}%`;
      img.style.zIndex = i;

      // Initial state via GSAP
      gsap.set(img, {
        xPercent: -50,
        yPercent: -50,
        rotation: 0,
        scale: 0,
        opacity: 0,
      });

      this.trail.appendChild(img);
      return { el: img, rot };
    });

    // Build timeline
    this.tl = gsap.timeline({
      onComplete: () => this._exit(stickerData)
    });

    // Counter: 0 → 100
    this.tl.to(this, {
      count: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.counter.textContent = Math.round(this.count);
      }
    }, 0);

    // Stickers stamp in one by one
    stickerData.forEach((s, i) => {
      const delay = (i / total) * 1.5;

      this.tl.to(s.el, {
        scale: 1,
        opacity: 1,
        duration: 0.28,
        ease: 'back.out(1.7)',
      }, delay);
    });

    // Hold
    this.tl.to({}, { duration: 0.25 });
  }

  _exit(stickerData) {
    this.exitTl = gsap.timeline({
      onComplete: () => this._complete()
    });

    // Scatter stickers outward
    stickerData.forEach((s, i) => {
      this.exitTl.to(s.el, {
        y: -80 - Math.random() * 120,
        x: (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: 0.5,
        duration: 0.35,
        ease: 'power2.in',
      }, i * 0.012);
    });

    // Counter fades
    this.exitTl.to(this.counter, {
      opacity: 0,
      y: 20,
      duration: 0.25,
      ease: 'power2.in',
    }, 0);

    // Loader slides up
    this.exitTl.to(this.loader, {
      yPercent: -100,
      duration: 0.55,
      ease: 'power3.inOut',
    }, 0.18);
  }

  _hasPlayedThisSession() {
    try {
      return window.sessionStorage.getItem(this.sessionKey) === '1';
    } catch {
      return false;
    }
  }

  _rememberSession() {
    try {
      window.sessionStorage.setItem(this.sessionKey, '1');
    } catch {
      // Storage can be unavailable in private or restricted contexts.
    }
  }

  _complete() {
    if (this.completed) return;
    this.completed = true;
    window.clearTimeout(this.failSafeTimer);
    this.failSafeTimer = null;
    if (this.tl) this.tl.kill();
    if (this.exitTl) this.exitTl.kill();
    if (this.loader) this.loader.classList.add('hidden');
    this._rememberSession();
    if (this.onComplete) this.onComplete();
  }
}


