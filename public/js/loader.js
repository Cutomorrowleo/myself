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
    if (prefersReducedMotion()) {
      this.loader.classList.add('hidden');
      if (this.onComplete) this.onComplete();
      return;
    }

    this._preloadStickers().then(() => this._animate());
  }

  _preloadStickers() {
    return Promise.all(this.stickerFiles.map(file => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
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
      duration: 2.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.counter.textContent = Math.round(this.count);
      }
    }, 0);

    // Stickers stamp in one by one
    stickerData.forEach((s, i) => {
      const delay = (i / total) * 2.2;

      this.tl.to(s.el, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: 'back.out(1.7)',
      }, delay);
    });

    // Hold
    this.tl.to({}, { duration: 0.5 });
  }

  _exit(stickerData) {
    const exitTl = gsap.timeline({
      onComplete: () => {
        this.loader.classList.add('hidden');
        if (this.onComplete) this.onComplete();
      }
    });

    // Scatter stickers outward
    stickerData.forEach((s, i) => {
      exitTl.to(s.el, {
        y: -80 - Math.random() * 120,
        x: (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: 0.5,
        duration: 0.45,
        ease: 'power2.in',
      }, i * 0.02);
    });

    // Counter fades
    exitTl.to(this.counter, {
      opacity: 0,
      y: 20,
      duration: 0.35,
      ease: 'power2.in',
    }, 0);

    // Loader slides up
    exitTl.to(this.loader, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power3.inOut',
    }, 0.25);
  }
}


