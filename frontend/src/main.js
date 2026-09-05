/**
 * DigiVentures — minimal vanilla JS
 * Mobile menu + IntersectionObserver reveal animations
 */

import './styles.css';
import lottie from 'lottie-web';

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
    const elements = document.querySelectorAll('.reveal, .reveal-fade');
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

  /* ── Hero Lottie animation (M12 orbit visual) ──
     Renders hero-animation.json as inline SVG at 0.5x speed, autoplaying
     when scrolled into view. Falls back to a single static frame when the
     user prefers reduced motion. The JSON path is read from a <link> tag so
     ReferencePages::replace_urls() rewrites /assets/images/... to the plugin
     URL at render time — no PHP change required. */
  function initHeroLottie() {
    const srcLink = document.getElementById('hero-lottie-src');
    const container = document.getElementById('hero-lottie');
    if (!srcLink || !container || !srcLink.href) return;

    const animation = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      path: srcLink.href,
    });

    animation.setSpeed(0.5);

    if (prefersReducedMotion) {
      animation.goToAndStop(0, true);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        if (entries[0] && entries[0].isIntersecting) {
          animation.play();
          obs.unobserve(container);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(container);
  }

  /* ── 3D flip cards: tap-to-flip for touch devices ──
     Hover and :focus-within already flip via CSS; this mirrors the same
     state through .is-flipped so touch users can reach the back face. */
  function initFlipCards() {
    document.querySelectorAll('.m12-flip-card').forEach(function (card) {
      card.addEventListener('click', function (event) {
        // Let real links on the back face navigate normally.
        if (event.target.closest('a')) return;
        card.classList.toggle('is-flipped');
      });
    });
  }

  /* ── Investment request form validation ── */
  function initInvestmentForm() {
    const form = document.getElementById('investment-request-form');
    const pitchDeck = document.getElementById('pitch_deck');
    if (!form || !pitchDeck) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    const allowedExtensions = ['pdf', 'ppt', 'pptx'];
    const maxSize = 20 * 1024 * 1024;

    function validatePitchDeck() {
      const file = pitchDeck.files && pitchDeck.files[0];
      pitchDeck.setCustomValidity('');
      if (!file) return;

      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension) || (file.type && !allowedTypes.includes(file.type))) {
        pitchDeck.setCustomValidity('فقط فایل‌های PDF، PPT و PPTX قابل بارگذاری هستند.');
      } else if (file.size > maxSize) {
        pitchDeck.setCustomValidity('حجم فایل باید حداکثر ۲۰ مگابایت باشد.');
      }
    }

    pitchDeck.addEventListener('change', validatePitchDeck);
    form.addEventListener('submit', validatePitchDeck);
  }

  /* ── Authentication forms ──
     The static frontend is wired to conventional API routes. The receiving
     application must implement these routes and the email provider. */
  function initAuthForms() {
    document.querySelectorAll('[data-password-toggle]').forEach(function (button) {
      const input = document.getElementById(button.getAttribute('data-password-toggle'));
      if (!input) return;

      button.addEventListener('click', function () {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        button.textContent = isPassword ? 'پنهان' : 'نمایش';
        button.setAttribute('aria-label', isPassword ? 'پنهان کردن گذرواژه' : 'نمایش گذرواژه');
      });
    });

    document.querySelectorAll('[data-auth-form]').forEach(function (form) {
      const feedback = form.querySelector('[data-auth-feedback]');
      const submit = form.querySelector('[type="submit"]');
      const password = form.querySelector('[data-password]');
      const confirmation = form.querySelector('[data-password-confirmation]');

      function showFeedback(message, type) {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.className = 'auth-feedback is-visible ' + (type === 'success' ? 'is-success' : 'is-error');
        feedback.focus();
      }

      if (password && confirmation) {
        function validateConfirmation() {
          confirmation.setCustomValidity(
            confirmation.value && confirmation.value !== password.value ? 'گذرواژه‌ها با هم یکسان نیستند.' : ''
          );
        }
        password.addEventListener('input', validateConfirmation);
        confirmation.addEventListener('input', validateConfirmation);
      }

      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const endpoint = form.getAttribute('data-endpoint');
        if (!endpoint) return;
        const originalLabel = submit ? submit.textContent : '';
        if (submit) {
          submit.disabled = true;
          submit.textContent = 'در حال ارسال…';
        }

        const values = Object.fromEntries(new FormData(form).entries());
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            credentials: 'include',
            body: JSON.stringify(values),
          });
          const payload = await response.json().catch(function () { return {}; });
          if (!response.ok) throw new Error(payload.message || 'امکان انجام درخواست وجود ندارد.');
          showFeedback(payload.message || form.getAttribute('data-success-message') || 'درخواست شما با موفقیت ثبت شد.', 'success');
          if (payload.redirect) window.location.assign(payload.redirect);
        } catch (error) {
          showFeedback(error.message || 'ارتباط با سرویس احراز هویت برقرار نشد. لطفاً دوباره تلاش کنید.', 'error');
        } finally {
          if (submit) {
            submit.disabled = false;
            submit.textContent = originalLabel;
          }
        }
      });
    });
  }

  /* ── Smooth In-Page Scrolling with Custom Easing ── */
  function initSmoothScroll() {
    const HEADER_OFFSET = 84; // 76px sticky header + 8px clearance

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function smoothScrollTo(targetY) {
      if (prefersReducedMotion) {
        window.scrollTo(0, targetY);
        return;
      }

      const startY = window.pageYOffset || document.documentElement.scrollTop;
      const difference = targetY - startY;
      if (Math.abs(difference) < 4) return;

      const startTime = performance.now();
      const duration = Math.min(850, Math.max(500, Math.abs(difference) * 0.35));

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);

        window.scrollTo(0, startY + difference * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }

    function scrollToHash(hash, updateHistory) {
      if (!hash || hash === '#' || hash === '#!') return;
      const targetId = hash.replace(/^#/, '');
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const elementRect = targetElement.getBoundingClientRect();
      const absoluteTop = elementRect.top + (window.pageYOffset || document.documentElement.scrollTop);
      const targetY = Math.max(0, absoluteTop - HEADER_OFFSET);

      smoothScrollTo(targetY);

      if (updateHistory && window.history && window.history.pushState) {
        window.history.pushState(null, '', hash);
      }
    }

    // Intercept clicks on anchor tags
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (!link) return;

      const rawHref = link.getAttribute('href');
      if (!rawHref) return;

      let targetHash = null;

      try {
        const targetUrl = new URL(link.href, window.location.href);
        const currentCleanPath = window.location.pathname.replace(/\/$/, '') || '/';
        const targetCleanPath = targetUrl.pathname.replace(/\/$/, '') || '/';
        const isSamePage = (targetUrl.origin === window.location.origin) &&
          (targetCleanPath === currentCleanPath ||
           (currentCleanPath === '/' && targetCleanPath === '/index.html') ||
           (currentCleanPath === '/index.html' && targetCleanPath === '/'));

        if (isSamePage && targetUrl.hash && targetUrl.hash.length > 1) {
          targetHash = targetUrl.hash;
        }
      } catch (err) {
        if (rawHref.startsWith('#') && rawHref.length > 1) {
          targetHash = rawHref;
        }
      }

      if (targetHash) {
        const targetEl = document.getElementById(targetHash.replace(/^#/, ''));
        if (targetEl) {
          e.preventDefault();
          scrollToHash(targetHash, true);
        }
      }
    });

    // Handle initial hash on page load if coming from another page (e.g. /about.html -> /#team)
    if (window.location.hash) {
      setTimeout(function () {
        scrollToHash(window.location.hash, false);
      }, 150);
    }
  }

  /* ── Active Section Scroll-Spy ── */
  function initScrollSpy() {
    const navLinks = document.querySelectorAll('.header-primary-nav a[href*="#"]');
    if (!navLinks.length) return;

    const sectionIds = Array.from(navLinks).map(function (link) {
      const href = link.getAttribute('href');
      return href.includes('#') ? href.split('#')[1] : '';
    }).filter(Boolean);

    const sections = sectionIds.map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);

    if (!sections.length) return;

    let ticking = false;
    function updateActiveNav() {
      const triggerY = (window.pageYOffset || document.documentElement.scrollTop) + 120;
      let currentId = '';

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= triggerY) {
          currentId = section.getAttribute('id');
          break;
        }
      }

      navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        const linkHash = href.includes('#') ? href.split('#')[1] : '';
        link.classList.toggle('is-active', Boolean(currentId && linkHash === currentId));
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateActiveNav);
        ticking = true;
      }
    }, { passive: true });

    updateActiveNav();
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initReveal();
    initCounters();
    initSliders();
    initHeroLottie();
    initInvestmentForm();
    initAuthForms();
    initSmoothScroll();
    initScrollSpy();
  });
})();

