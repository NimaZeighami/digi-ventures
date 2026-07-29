import './plugin.css';

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toFa(value) {
    return String(value).replace(/[0-9]/g, function (d) {
      return '\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9'[d];
    });
  }

  function initMobileMenu() {
    const toggle = document.querySelector('.dv-app [data-mobile-menu-toggle]');
    const menu = document.querySelector('.dv-app [data-mobile-menu]');
    if (!toggle || !menu) return;

    function setMenuOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      menu.classList.toggle('dv-mobile-menu-hidden', !open);
      menu.classList.toggle('dv-mobile-menu-visible', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', function () {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isOpen);
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenuOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        toggle.focus();
      }
    });
  }

  function initReveal() {
    const elements = document.querySelectorAll('.dv-app .reveal');
    if (!elements.length) return;
    if (prefersReducedMotion) {
      elements.forEach(function (el) { el.classList.add('reveal-visible'); });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(function (el) { observer.observe(el); });
  }

  function initCounters() {
    const counters = document.querySelectorAll('.dv-app .stat-number[data-count]');
    if (!counters.length) return;
    if (prefersReducedMotion) {
      counters.forEach(function (el) { el.textContent = toFa(el.getAttribute('data-count')); });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10) || 0;
          const duration = 1400;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = toFa(Math.round(target * eased));
            if (progress < 1) { requestAnimationFrame(tick); }
            else { el.textContent = toFa(target); }
          }
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  function initSliders() {
    document.querySelectorAll('.dv-app [data-slider]').forEach(function (slider) {
      const track = slider.querySelector('[data-slider-track]');
      const prev = slider.querySelector('[data-slider-prev]');
      const next = slider.querySelector('[data-slider-next]');
      const dotsWrap = slider.querySelector('[data-slider-dots]');
      if (!track) return;
      const isRTL = getComputedStyle(track).direction === 'rtl';

      function pageWidth() { return track.clientWidth || 1; }
      function pageCount() { return Math.max(1, Math.round(track.scrollWidth / pageWidth())); }
      function currentPage() { return Math.round(Math.abs(track.scrollLeft) / pageWidth()); }

      let snapTimer = null;
      function goTo(index) {
        const clamped = Math.min(pageCount() - 1, Math.max(0, index));
        const x = clamped * pageWidth();
        track.style.scrollSnapType = 'none';
        track.scrollTo({ left: isRTL ? -x : x, behavior: 'smooth' });
        clearTimeout(snapTimer);
        snapTimer = setTimeout(function () { track.style.scrollSnapType = ''; update(); }, 650);
      }

      function update() {
        const cur = currentPage();
        const last = pageCount() - 1;
        if (dotsWrap) {
          Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
            dot.classList.toggle('is-active', i === cur);
          });
        }
        if (prev) prev.disabled = cur <= 0;
        if (next) next.disabled = cur >= last;
      }

      function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        const count = pageCount();
        for (let i = 0; i < count; i++) {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'slider-dot';
          dot.setAttribute('aria-label', '\u0627\u0633\u0644\u0627\u06CC\u062F ' + toFa(i + 1));
          dot.addEventListener('click', (function (idx) { return function () { goTo(idx); }; })(i));
          dotsWrap.appendChild(dot);
        }
        update();
      }

      if (next) next.addEventListener('click', function () { goTo(currentPage() + 1); });
      if (prev) prev.addEventListener('click', function () { goTo(currentPage() - 1); });

      let scrollRaf = null;
      track.addEventListener('scroll', function () {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(function () { scrollRaf = null; update(); });
      });
      let resizeTimer = null;
      window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(buildDots, 200); });
      buildDots();
    });
  }

  function initPasswordToggle() {
    document.querySelectorAll('.dv-app [data-password-toggle]').forEach(function (button) {
      const input = document.getElementById(button.getAttribute('data-password-toggle'));
      if (!input) return;
      button.addEventListener('click', function () {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        button.textContent = isPassword ? '\u067E\u0646\u0647\u0627\u0646' : '\u0646\u0645\u0627\u06CC\u0634';
      });
    });
  }

  function initInvestmentForm() {
    const form = document.querySelector('.dv-app #investment-request-form');
    const pitchDeck = document.querySelector('.dv-app #pitch_deck');
    if (!form || !pitchDeck) return;
    const allowedExtensions = ['pdf', 'ppt', 'pptx'];
    const maxSize = 20 * 1024 * 1024;

    function validatePitchDeck() {
      const file = pitchDeck.files && pitchDeck.files[0];
      pitchDeck.setCustomValidity('');
      if (!file) return;
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        pitchDeck.setCustomValidity('\u0641\u0642\u0637 \u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC PDF\u060C PPT \u0648 PPTX \u0642\u0627\u0628\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC \u0647\u0633\u062A\u0646\u062F.');
      } else if (file.size > maxSize) {
        pitchDeck.setCustomValidity('\u062D\u062C\u0645 \u0641\u0627\u06CC\u0644 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u06A9\u062B\u0631 \u06F2\u06F0 \u0645\u06AF\u0627\u0628\u0627\u06CC\u062A \u0628\u0627\u0634\u062F.');
      }
    }

    pitchDeck.addEventListener('change', validatePitchDeck);
    form.addEventListener('submit', validatePitchDeck);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initReveal();
    initCounters();
    initSliders();
    initPasswordToggle();
    initInvestmentForm();
  });
})();
