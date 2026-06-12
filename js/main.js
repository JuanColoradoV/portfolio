(function() {
  // --- Unhide page immediately so any later error won't leave it blank ---
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');

  // --- Legacy deep links: the case studies used to live on the home page ---
  var legacyCaseHashes = {
    '#case-epm': 'case-epm.html',
    '#case-nvidia': 'case-nvidia.html',
    '#case-solving-ai': 'case-solving-ai.html',
    '#case-yma': 'case-yma.html',
    '#case-bucket': 'case-bucket.html'
  };
  if (legacyCaseHashes[location.hash] && !document.querySelector(location.hash)) {
    location.replace(legacyCaseHashes[location.hash]);
    return;
  }

  // --- Reduced motion: pause autoplay videos ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function handleReducedMotion() {
    document.querySelectorAll('video[autoplay]').forEach(v => {
      if (prefersReducedMotion.matches) { v.pause(); } else { v.play(); }
    });
  }
  handleReducedMotion();
  prefersReducedMotion.addEventListener('change', handleReducedMotion);

  // --- Fade-in on scroll ---
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  // --- Staggered fade-in on scroll ---
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in-stagger').forEach(el => staggerObserver.observe(el));

  // --- Nav hide/show on scroll direction ---
  const nav = document.querySelector('.nav');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNav() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // --- Active nav link based on scroll position ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const stepItems = document.querySelectorAll('.section-nav__item');

  // Travelling underline indicator — additive over the scroll-spy below
  const navIndicator = document.querySelector('.nav__indicator');
  const navLinksUl = document.querySelector('.nav__links');
  if (navLinksUl) navLinksUl.classList.add('nav__links--js');
  const moveIndicator = () => {
    if (!navIndicator || !navLinksUl) return;
    const active = navLinksUl.querySelector('.nav__link--active');
    if (!active || window.matchMedia('(max-width: 768px)').matches) {
      navIndicator.style.opacity = '0';
      return;
    }
    navIndicator.style.left = active.offsetLeft + 'px';
    navIndicator.style.width = active.offsetWidth + 'px';
    navIndicator.style.opacity = '1';
  };

  const matchesSection = (href, id) => href === '#' + id;

  // Scroll-spy only applies on pages whose nav links are same-page anchors
  // (on case pages the nav points back at index.html#... and stays static).
  const hasHashNav = Array.from(navLinks).some(l => (l.getAttribute('href') || '').startsWith('#'));

  if (sections.length && hasHashNav && (navLinks.length || stepItems.length)) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const match = matchesSection(link.getAttribute('href'), id);
            link.classList.toggle('nav__link--active', match);
            if (match) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
          });
          stepItems.forEach(item => {
            const match = matchesSection(item.getAttribute('href'), id);
            item.classList.toggle('section-nav__item--active', match);
            if (match) item.setAttribute('aria-current', 'true');
            else item.removeAttribute('aria-current');
          });
          moveIndicator();
        }
      });
    }, { threshold: 0.1, rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Keep the travelling indicator correct on load, after fonts settle, and on resize
  window.addEventListener('load', moveIndicator);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);
  let navResizeT;
  window.addEventListener('resize', () => { clearTimeout(navResizeT); navResizeT = setTimeout(moveIndicator, 120); }, { passive: true });
  moveIndicator();

  // --- Close the mobile menu when a nav link is followed ---
  // Native anchor behavior stays intact: the hash updates (back button and
  // shareable URLs work) and CSS scroll-behavior handles the smooth scroll.
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function() {
      const mobileNav = document.querySelector('.nav__links');
      const navToggle = document.querySelector('.nav__toggle');
      if (mobileNav && mobileNav.classList.contains('nav__links--open')) {
        mobileNav.classList.remove('nav__links--open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- Mobile nav toggle ---
  const mobileNavToggle = document.querySelector('.nav__toggle');
  const navLinksEl = document.querySelector('.nav__links');
  mobileNavToggle.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    navLinksEl.classList.toggle('nav__links--open');
  });

  // --- Theme toggle (light/dark, persisted) ---
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const syncThemeLabel = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    };
    syncThemeLabel();
    themeToggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeLabel();
    });
  }

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxWrapper = lightbox.querySelector('.lightbox__image-wrapper');
    const lightboxCaption = lightbox.querySelector('.lightbox__caption');
    const lightboxClose = lightbox.querySelector('.lightbox__close');
    const lightboxOverlay = lightbox.querySelector('.lightbox__overlay');
    let lastFocusedElement = null;

    const setInert = (value) => {
      ['#main', '.nav', '.footer'].forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.inert = value;
      });
    };

    function openLightbox(el) {
      lastFocusedElement = document.activeElement;
      const img = el.querySelector('picture') || el.querySelector('img');
      const video = el.querySelector('video');
      const caption = el.querySelector('.case-image__caption');

      lightboxWrapper.innerHTML = '';
      if (video) {
        const clone = video.cloneNode(true);
        clone.className = '';
        clone.controls = true;
        lightboxWrapper.appendChild(clone);
      } else if (!img) {
        return;
      } else if (img.tagName === 'PICTURE') {
        const clone = img.cloneNode(true);
        const cloneImg = clone.querySelector('img');
        if (cloneImg) {
          cloneImg.removeAttribute('loading');
          cloneImg.className = '';
        }
        lightboxWrapper.appendChild(clone);
      } else {
        const clone = img.cloneNode(true);
        clone.removeAttribute('loading');
        clone.className = '';
        lightboxWrapper.appendChild(clone);
      }

      lightboxCaption.textContent = caption ? caption.textContent : '';
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      setInert(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lightbox.classList.add('lightbox--visible');
        });
      });

      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('lightbox--visible');
      const onEnd = () => {
        lightbox.hidden = true;
        document.body.classList.remove('lightbox-open');
        setInert(false);
        lightboxWrapper.innerHTML = '';
        if (lastFocusedElement) lastFocusedElement.focus();
        lightbox.removeEventListener('transitionend', onEnd);
      };
      lightbox.addEventListener('transitionend', onEnd);
      // Fallback if transitionend doesn't fire
      setTimeout(onEnd, 500);
    }

    document.querySelectorAll('.case-image').forEach(el => {
      // Give every image control an accessible name from its caption (WCAG 4.1.2)
      if (!el.getAttribute('aria-label')) {
        const cap = el.querySelector('.case-image__caption');
        el.setAttribute('aria-label', cap ? 'View larger: ' + cap.textContent.trim() : 'View larger image');
      }
      el.addEventListener('click', () => openLightbox(el));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(el);
        }
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') { closeLightbox(); return; }
      // Focus trap: keep Tab within the lightbox
      if (e.key === 'Tab') {
        const focusable = lightbox.querySelectorAll('button, [href], video[controls], [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // --- Hero entrance animation ---
  window.addEventListener('load', () => {
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('hero--loaded');
  });
})();
