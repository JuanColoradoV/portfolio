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
      // Keep the browser chrome in the same world as the page
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', isDark ? '#0E1413' : '#FAFAF8');
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
    let pendingCloseEnd = null;
    let pendingCloseTimer = null;

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
      // The caption lives on the figure; on spec figures the trigger is the
      // inner container, so climb to the figure to find it.
      const caption = el.closest('.case-image').querySelector('.case-image__caption');

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

      // A close might still be settling; cancel it so it can't kill this open.
      if (pendingCloseEnd) {
        lightbox.removeEventListener('transitionend', pendingCloseEnd);
        clearTimeout(pendingCloseTimer);
        pendingCloseEnd = null;
      }

      lightboxCaption.textContent = caption ? caption.textContent : '';
      // A dialog with an empty labelledby target has no accessible name
      if (lightboxCaption.textContent.trim()) {
        lightbox.setAttribute('aria-labelledby', 'lightbox-caption');
        lightbox.removeAttribute('aria-label');
      } else {
        lightbox.removeAttribute('aria-labelledby');
        lightbox.setAttribute('aria-label', 'Media preview');
      }
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      setInert(true);

      // Synchronous style flush instead of double-rAF: rAF callbacks never fire
      // in unfocused tabs, which left an invisible lightbox blocking the page.
      void lightbox.offsetHeight;
      lightbox.classList.add('lightbox--visible');

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
        if (pendingCloseEnd === onEnd) pendingCloseEnd = null;
      };
      pendingCloseEnd = onEnd;
      lightbox.addEventListener('transitionend', onEnd);
      // Fallback if transitionend doesn't fire
      pendingCloseTimer = setTimeout(onEnd, 500);
    }

    document.querySelectorAll('.case-image[role="button"], .case-image .case-image__container[role="button"]').forEach(el => {
      // Give every image control an accessible name from its caption (WCAG 4.1.2)
      if (!el.getAttribute('aria-label')) {
        const cap = el.closest('.case-image').querySelector('.case-image__caption');
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

  // --- Spec mode: Design ⇄ Spec annotation toggle on flagship case images ---
  const specToggles = document.querySelectorAll('.spec-toggle');
  specToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.remove('spec-toggle--pulse');
      const fig = btn.closest('.spec-figure');
      const on = fig.classList.toggle('spec-figure--on');
      btn.setAttribute('aria-pressed', String(on));
    });
  });

  // One-time discoverability pulse when the toggle first enters the viewport
  if (specToggles.length && !prefersReducedMotion.matches) {
    const pulseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('spec-toggle--pulse');
          pulseObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    specToggles.forEach(t => pulseObserver.observe(t));
  }

  // --- Pause control for the looping product demo (WCAG 2.2.2) ---
  const videoPause = document.querySelector('.video-pause');
  const demoVideo = document.querySelector('.case-image video[autoplay]');
  if (videoPause && demoVideo) {
    if (prefersReducedMotion.matches) {
      demoVideo.pause();
      videoPause.setAttribute('aria-pressed', 'true');
      videoPause.textContent = 'Play the looping demo';
    }
    videoPause.addEventListener('click', () => {
      const wasPlaying = !demoVideo.paused;
      if (wasPlaying) { demoVideo.pause(); } else { demoVideo.play(); }
      videoPause.setAttribute('aria-pressed', String(wasPlaying));
      videoPause.textContent = wasPlaying ? 'Play the looping demo' : 'Pause the looping demo';
    });
  }

  // --- Site-wide Spec mode: press S, the whole portfolio shows its work ---
  const specModeBtns = document.querySelectorAll('.spec-mode-btn');
  const specChips = [];
  let siteSpecOn = false;

  function setSiteSpec(on) {
    siteSpecOn = on;
    document.body.classList.toggle('site-spec', on);
    specModeBtns.forEach(b => b.setAttribute('aria-pressed', String(on)));
    // The flagship figure layers flip with the site
    document.querySelectorAll('.spec-figure').forEach(fig => {
      fig.classList.toggle('spec-figure--on', on);
      const t = fig.querySelector('.spec-toggle');
      if (t) {
        t.setAttribute('aria-pressed', String(on));
        t.classList.remove('spec-toggle--pulse');
      }
    });
    if (on) {
      document.querySelectorAll('[data-spec]').forEach(el => {
        const chip = document.createElement('span');
        chip.className = 'spec-chip';
        chip.textContent = el.getAttribute('data-spec');
        el.appendChild(chip);
        specChips.push(chip);
      });
    } else {
      specChips.forEach(c => c.remove());
      specChips.length = 0;
    }
  }

  specModeBtns.forEach(b => b.addEventListener('click', () => setSiteSpec(!siteSpecOn)));

  // Shift+S, not bare S: single-character shortcuts trip speech-input
  // users (WCAG 2.1.4); the modifier exempts it without an off switch.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'S' || !e.shiftKey) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    const lb = document.getElementById('lightbox');
    if (lb && !lb.hidden) return;
    if (window.matchMedia('(max-width: 899px)').matches) return;
    setSiteSpec(!siteSpecOn);
  });

  // --- Hero entrance animation ---
  // Fire as soon as we run, not on window load: on slow connections the
  // name was invisible for seconds while images finished. Double-rAF gives
  // the transition a painted first frame; the timeout covers unfocused tabs.
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    const reveal = () => heroEl.classList.add('hero--loaded');
    requestAnimationFrame(() => requestAnimationFrame(reveal));
    setTimeout(reveal, 400);
  }
})();
