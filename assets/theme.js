/* ============================================================
   TRESSES — Theme JavaScript
   Animations: parallax, text reveal, magnetic, tilt, counters,
   scroll progress, floating blobs, stagger, cursor glow
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- SCROLL PROGRESS BAR ---- */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ---- PARALLAX ---- */
  function initParallax() {
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length || prefersReducedMotion) return;
    function tick() {
      els.forEach(el => {
        const wrap = el.closest('[data-parallax-wrap]');
        const rect = (wrap || el).getBoundingClientRect();
        const speed = parseFloat(el.dataset.parallax) || 0.25;
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${offset}px) scale(1.3)`;
      });
    }
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  /* ---- HEADER SCROLL ---- */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ---- HERO TEXT STAGGER ---- */
  function initHeroEntrance() {
    if (prefersReducedMotion) return;
    const targets = document.querySelectorAll('.hero__content > *');
    targets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.8s ease ${0.2 + i * 0.18}s, transform 0.8s ease ${0.2 + i * 0.18}s`;
    });
    requestAnimationFrame(() => {
      targets.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }

  /* ---- FADE-UP (IntersectionObserver) ---- */
  function initFadeUp() {
    const els = document.querySelectorAll('.fade-up');
    if (!els.length) return;
    if (prefersReducedMotion || !window.IntersectionObserver) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => obs.observe(el));
  }

  /* ---- STAGGERED GRID ---- */
  function initGridStagger() {
    if (prefersReducedMotion) return;
    const grids = document.querySelectorAll('.collection-grid, .ingredients-grid, .testimonials-grid');
    if (!window.IntersectionObserver) return;
    grids.forEach(grid => {
      const items = grid.children;
      Array.from(items).forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(40px)';
        item.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
      });
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            Array.from(items).forEach(item => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(grid);
    });
  }

  /* ---- SECTION TITLE REVEAL ---- */
  function initTitleReveal() {
    if (prefersReducedMotion || !window.IntersectionObserver) return;
    document.querySelectorAll('.section-header h2, .split-section__content h2').forEach(t => {
      t.classList.add('title-reveal');
    });
  }

  /* ---- DIVIDER LINE DRAW ---- */
  function initDividerDraw() {
    if (prefersReducedMotion || !window.IntersectionObserver) return;
    const dividers = document.querySelectorAll('.divider');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('drawn');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 1 });
    dividers.forEach(d => { d.classList.add('divider-animated'); obs.observe(d); });
  }

  /* ---- 3D CARD TILT ---- */
  function initCardTilt() {
    if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateY(-6px) scale(1.01)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ---- MAGNETIC BUTTONS ---- */
  function initMagneticButtons() {
    if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.btn--primary, .btn--rose').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
        btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }

  /* ---- ANIMATED COUNTERS ---- */
  function initCounters() {
    if (!window.IntersectionObserver) return;
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.counterSuffix || '';
        const duration = 1800;
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  }

  /* ---- FLOATING BLOBS ---- */
  function initFloatingBlobs() {
    if (prefersReducedMotion) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const blobs = [
      { size: 340, x: 75, y: 20, delay: 0,   color: 'rgba(235,191,204,0.18)', duration: 8 },
      { size: 220, x: 85, y: 60, delay: 2,   color: 'rgba(196,149,106,0.12)', duration: 10 },
      { size: 180, x: 65, y: 75, delay: 1.5, color: 'rgba(235,191,204,0.10)', duration: 7 },
    ];
    blobs.forEach(b => {
      const el = document.createElement('div');
      el.className = 'hero-blob';
      el.style.cssText = `
        position: absolute;
        width: ${b.size}px;
        height: ${b.size}px;
        left: ${b.x}%;
        top: ${b.y}%;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, ${b.color} 0%, transparent 70%);
        border-radius: 50%;
        animation: blobFloat ${b.duration}s ease-in-out ${b.delay}s infinite alternate;
        pointer-events: none;
        z-index: 1;
      `;
      hero.appendChild(el);
    });
  }

  /* ---- CURSOR GLOW ---- */
  function initCursorGlow() {
    if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return;
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(196,149,106,0.08) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.12s ease, top 0.12s ease;
      left: -999px; top: -999px;
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

  /* ---- IMAGE CLIP REVEAL ---- */
  function initImageReveal() {
    if (prefersReducedMotion || !window.IntersectionObserver) return;
    const images = document.querySelectorAll('.split-section__visual img');
    images.forEach(img => {
      img.style.clipPath = 'inset(0 100% 0 0)';
      img.style.transition = 'clip-path 1.1s cubic-bezier(0.77,0,0.18,1)';
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.clipPath = 'inset(0 0% 0 0)';
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      obs.observe(img);
    });
  }

  /* ---- MOBILE NAV ---- */
  function initMobileNav() {
    const openBtn  = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.mobile-close-btn');
    const nav      = document.querySelector('.mobile-nav');
    if (!openBtn || !nav) return;
    function open()  { nav.classList.add('open');    document.body.style.overflow = 'hidden'; }
    function close() { nav.classList.remove('open'); document.body.style.overflow = ''; }
    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ---- PRODUCT GALLERY ---- */
  function initProductGallery() {
    const mainImg = document.querySelector('.product-gallery__main img');
    const thumbs  = document.querySelectorAll('.product-gallery__thumb');
    if (!mainImg || !thumbs.length) return;
    mainImg.style.transition = 'opacity 0.2s ease';
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.querySelector('img')?.src;
        if (src) {
          mainImg.style.opacity = '0';
          setTimeout(() => { mainImg.src = src; mainImg.style.opacity = '1'; }, 200);
        }
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }

  /* ---- QUANTITY SELECTOR ---- */
  function initQtySelector() {
    document.querySelectorAll('.qty-selector').forEach(wrap => {
      const input    = wrap.querySelector('.qty-input');
      const minusBtn = wrap.querySelector('[data-qty="minus"]');
      const plusBtn  = wrap.querySelector('[data-qty="plus"]');
      if (!input) return;
      if (minusBtn) minusBtn.addEventListener('click', () => { const v = parseInt(input.value, 10); if (v > 1) input.value = v - 1; });
      if (plusBtn)  plusBtn.addEventListener('click',  () => { input.value = parseInt(input.value, 10) + 1; });
    });
  }

  /* ---- ADD TO CART ---- */
  function initAddToCart() {
    document.querySelectorAll('.add-to-cart-btn, .product-card__quick-add').forEach(btn => {
      btn.addEventListener('click', async function (e) {
        e.preventDefault();
        const variantId = this.dataset.variantId;
        if (!variantId) return;
        const qty = parseInt(document.querySelector('.qty-input')?.value, 10) || 1;
        this.disabled = true;
        const orig = this.textContent;
        this.textContent = 'Adding…';
        try {
          const r = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: variantId, quantity: qty }),
          });
          if (!r.ok) throw new Error();
          await updateCartCount();
          this.textContent = 'Added ✓';
          setTimeout(() => { this.textContent = orig; this.disabled = false; }, 2000);
        } catch {
          this.textContent = 'Try again';
          this.disabled = false;
        }
      });
    });
  }

  async function updateCartCount() {
    try {
      const r    = await fetch('/cart.js');
      const cart = await r.json();
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.item_count;
        el.style.display = cart.item_count > 0 ? 'flex' : 'none';
      });
    } catch { /* silent */ }
  }

  /* ---- VARIANT SELECTION ---- */
  function initVariants() {
    document.querySelectorAll('.variant-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.variant-options')?.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const addBtn = document.querySelector('.add-to-cart-btn');
        if (addBtn && btn.dataset.variantId) addBtn.dataset.variantId = btn.dataset.variantId;
        if (btn.dataset.price) {
          const el = document.querySelector('.product-info__price');
          if (el) el.textContent = btn.dataset.price;
        }
      });
    });
  }

  /* ---- FILTER PILLS ---- */
  function initFilterPills() {
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        pill.closest('.filter-pills')?.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  /* ---- MARQUEE PAUSE ON HOVER ---- */
  function initMarqueePause() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;
    track.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    track.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  }

  /* ---- BUTTON RIPPLE ---- */
  function initButtonRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.cssText = `
          position:absolute; border-radius:50%; pointer-events:none;
          width:${size}px; height:${size}px;
          left:${e.clientX - rect.left - size/2}px;
          top:${e.clientY - rect.top - size/2}px;
          background:rgba(255,255,255,0.25);
          animation: ripple 0.6s linear;
        `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* ---- CART QTY UPDATE ---- */
  function initCartQtyUpdate() {
    document.querySelectorAll('.cart-item .qty-selector').forEach(wrap => {
      const input = wrap.querySelector('.qty-input');
      const key   = wrap.dataset.lineKey;
      if (!input || !key) return;
      let timer;
      input.addEventListener('change', () => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          try {
            await fetch('/cart/change.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: key, quantity: parseInt(input.value, 10) }),
            });
            await updateCartCount();
          } catch { /* silent */ }
        }, 500);
      });
    });
  }

  function initAll() {
    initScrollProgress();
    initParallax();
    initHeaderScroll();
    initHeroEntrance();
    initFloatingBlobs();
    initFadeUp();
    initGridStagger();
    initTitleReveal();
    initDividerDraw();
    initCardTilt();
    initMagneticButtons();
    initCounters();
    initCursorGlow();
    initImageReveal();
    initMobileNav();
    initProductGallery();
    initQtySelector();
    initAddToCart();
    initVariants();
    initFilterPills();
    initMarqueePause();
    initButtonRipple();
    initCartQtyUpdate();
    updateCartCount();
  }

  /* ---- BOOT ---- */
  document.addEventListener('DOMContentLoaded', initAll);

  /* Re-init when Shopify theme editor reloads a section */
  document.addEventListener('shopify:section:load', () => {
    initParallax();
    initFloatingBlobs();
    initFadeUp();
    initGridStagger();
    initCardTilt();
    initMagneticButtons();
    initCounters();
    initImageReveal();
    initDividerDraw();
    initMarqueePause();
    initButtonRipple();
    initTitleReveal();
  });
})();
