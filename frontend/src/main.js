/**
 * DigiVentures — minimal vanilla JS
 * Mobile menu + IntersectionObserver reveal animations
 */

import './styles.css';

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Mobile menu ── */
  function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-menu-open');
    const iconClose = document.getElementById('icon-menu-close');

    if (!toggle || !menu) return;

    function setMenuOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      menu.classList.toggle('mobile-menu-hidden', !open);
      menu.classList.toggle('mobile-menu-visible', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle('hidden', open);
        iconClose.classList.toggle('hidden', !open);
      }
    }

    toggle.addEventListener('click', function () {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isOpen);
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        toggle.focus();
      }
    });
  }

  /* ── Scroll reveal ── */
  function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach(function (el) {
        el.classList.add('reveal-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Stat counters ── */
  function toFa(value) {
    return String(value).replace(/[0-9]/g, function (d) {
      return '۰۱۲۳۴۵۶۷۸۹'[d];
    });
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = toFa(Math.round(target * eased));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = toFa(target);
      }
    }

    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    if (prefersReducedMotion) {
      counters.forEach(function (el) {
        el.textContent = toFa(el.getAttribute('data-count'));
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Sliders (CSS scroll-snap + vanilla JS) ── */
  function initSliders() {
    document.querySelectorAll('[data-slider]').forEach(function (slider) {
      const track = slider.querySelector('[data-slider-track]');
      const prev = slider.querySelector('[data-slider-prev]');
      const next = slider.querySelector('[data-slider-next]');
      const dotsWrap = slider.querySelector('[data-slider-dots]');
      if (!track) return;

      const isRTL = getComputedStyle(track).direction === 'rtl';

      function pageWidth() {
        return track.clientWidth || 1;
      }

      function pageCount() {
        return Math.max(1, Math.round(track.scrollWidth / pageWidth()));
      }

      function currentPage() {
        return Math.round(Math.abs(track.scrollLeft) / pageWidth());
      }

      let snapTimer = null;
      function goTo(index) {
        const clamped = Math.min(pageCount() - 1, Math.max(0, index));
        const x = clamped * pageWidth();
        // Temporarily disable snap so programmatic scroll isn't blocked (esp. RTL).
        track.style.scrollSnapType = 'none';
        track.scrollTo({ left: isRTL ? -x : x, behavior: 'smooth' });
        clearTimeout(snapTimer);
        snapTimer = setTimeout(function () {
          track.style.scrollSnapType = '';
          update();
        }, 650);
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
          dot.setAttribute('aria-label', 'اسلاید ' + toFa(i + 1));
          dot.addEventListener('click', (function (idx) {
            return function () {
              goTo(idx);
            };
          })(i));
          dotsWrap.appendChild(dot);
        }
        update();
      }

      if (next) next.addEventListener('click', function () { goTo(currentPage() + 1); });
      if (prev) prev.addEventListener('click', function () { goTo(currentPage() - 1); });

      let scrollRaf = null;
      track.addEventListener('scroll', function () {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(function () {
          scrollRaf = null;
          update();
        });
      });

      let resizeTimer = null;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildDots, 200);
      });

      buildDots();
    });
  }

  /* ── Hero load animation ── */
  function initHeroAnimation() {
    if (prefersReducedMotion) return;

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.classList.add('animate-fade-up');
    }
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initReveal();
    initCounters();
    initSliders();
    initHeroAnimation();
  });
})();
