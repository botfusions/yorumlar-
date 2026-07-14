/* ==========================================================================
   Botfusions Insights — app.js
   Sticky header · mobile nav · search overlay · newsletter validation ·
   scroll reveal (reduced-motion safe) · in-page nav · footer year
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Sticky header shadow ---- */
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile nav drawer ---- */
  var menuBtn = document.querySelector('.menu-btn');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuBtn && mobileNav) {
    var setMenu = function (open) {
      mobileNav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', function () {
      setMenu(!mobileNav.classList.contains('is-open'));
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ---- Search overlay ---- */
  var searchBtns = document.querySelectorAll('[data-search-open]');
  var overlay = document.querySelector('.search-overlay');
  if (overlay) {
    var searchInput = overlay.querySelector('input');
    var openSearch = function () {
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (searchInput) setTimeout(function () { searchInput.focus(); }, 60);
    };
    var closeSearch = function () {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    searchBtns.forEach(function (b) { b.addEventListener('click', openSearch); });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.closest('[data-search-close]')) closeSearch();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeSearch();
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        e.preventDefault(); openSearch();
      }
    });
  }

  /* ---- Newsletter validation ---- */
  document.querySelectorAll('form[data-newsletter]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var note = form.querySelector('[data-newsletter-note]');
      var email = (input && input.value || '').trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!input) return;
      if (!valid) {
        input.style.borderColor = 'var(--danger)';
        if (note) { note.textContent = 'Geçerli bir e-posta gir.'; note.style.color = 'var(--danger)'; }
        input.focus();
        return;
      }
      input.value = '';
      input.style.borderColor = '';
      if (note) { note.textContent = 'Kaydoldun. İlk bülten yakında gelir.'; note.style.color = 'var(--ok)'; }
    });
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- Smooth in-page nav + active section highlight ---- */
  var navLinks = document.querySelectorAll('.nav a[href^="#"]');
  var sections = [];
  navLinks.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var sec = document.getElementById(id);
    if (sec) sections.push({ link: a, sec: sec });
  });
  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          sections.forEach(function (s) { s.link.removeAttribute('aria-current'); });
          var match = sections.find(function (s) { return s.sec === entry.target; });
          if (match) match.link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s.sec); });
  }

  /* ---- Footer year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = '2026';
  });
})();
