(() => {
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.page-progress span');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const mobileMenuQuery = window.matchMedia('(max-width: 820px)');

  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${Math.min(100, value)}%`;
  };

  const isMenuOpen = () => Boolean(nav?.classList.contains('open'));

  const syncMenuAccessibility = () => {
    if (!nav) return;
    const shouldBeInert = mobileMenuQuery.matches && !isMenuOpen();
    nav.inert = shouldBeInert;
    nav.setAttribute('aria-hidden', shouldBeInert ? 'true' : 'false');
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!nav || !menuButton) return;
    const wasOpen = isMenuOpen();
    nav.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
    syncMenuAccessibility();
    if (wasOpen && restoreFocus) menuButton.focus({ preventScroll: true });
  };

  const openMenu = () => {
    if (!nav || !menuButton) return;
    nav.classList.add('open');
    menuButton.classList.add('open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Fechar menu');
    document.body.classList.add('menu-open');
    syncMenuAccessibility();
    window.setTimeout(() => nav.querySelector('a')?.focus({ preventScroll: true }), 30);
  };

  const toggleMenu = () => {
    if (isMenuOpen()) closeMenu();
    else openMenu();
  };

  const trapMenuFocus = event => {
    if (event.key !== 'Tab' || !isMenuOpen() || !nav || !menuButton) return;
    const focusable = [menuButton, ...nav.querySelectorAll('a[href]')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  menuButton?.addEventListener('click', toggleMenu);
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isMenuOpen()) closeMenu();
    trapMenuFocus(event);
  });
  mobileMenuQuery.addEventListener('change', () => {
    if (!mobileMenuQuery.matches) closeMenu({ restoreFocus: false });
    syncMenuAccessibility();
  });
  syncMenuAccessibility();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const wrapWords = (element, startDelay, step) => {
    if (!element) return startDelay;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: node => node.nodeValue?.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    let delay = startDelay;
    textNodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }

        const wrapper = document.createElement('span');
        const word = document.createElement('span');
        wrapper.className = 'word-wrap';
        wrapper.setAttribute('aria-hidden', 'true');
        word.className = 'word';
        word.textContent = part;
        word.style.setProperty('--word-delay', `${delay}ms`);
        wrapper.append(word);
        fragment.append(wrapper);
        delay += step;
      });
      node.replaceWith(fragment);
    });
    return delay;
  };

  const setupHeroAnimation = () => {
    const hero = document.querySelector('[data-hero]');
    if (!hero || reducedMotion) return;

    const title = hero.querySelector('#hero-title');
    const lead = hero.querySelector('.hero-lead');
    const icon = hero.querySelector('.hero-tech-icon');
    const badge = hero.querySelector('.hero-badge');
    const facts = hero.querySelector('.hero-facts');
    const actions = hero.querySelector('.hero-actions');
    const scrollCue = hero.querySelector('.scroll-cue');

    icon?.style.setProperty('--hero-delay', '150ms');
    badge?.style.setProperty('--hero-delay', '250ms');

    const titleStart = 420;
    const titleStep = 66;
    const titleEnd = wrapWords(title, titleStart, titleStep);
    const leadStart = Math.max(titleStart + 500, titleEnd + 390);
    const leadEnd = wrapWords(lead, leadStart, 32);

    facts?.style.setProperty('--hero-delay', `${leadEnd + 420}ms`);
    actions?.style.setProperty('--hero-delay', `${leadEnd + 570}ms`);
    scrollCue?.style.setProperty('--hero-delay', `${leadEnd + 820}ms`);

    requestAnimationFrame(() => hero.classList.add('hero-animate'));
  };

  setupHeroAnimation();

  const reveals = [...document.querySelectorAll('.reveal')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    reveals.forEach(el => observer.observe(el));
  }

  const counters = [...document.querySelectorAll('[data-count]')];
  const animateCounter = el => {
    const end = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    if (reducedMotion) { el.textContent = `${end}${suffix}`; return; }
    const start = performance.now();
    const duration = 1300;
    const frame = now => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(end * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .7 });
    counters.forEach(el => counterObserver.observe(el));
  } else counters.forEach(animateCounter);

  const dialog = document.querySelector('[data-lightbox]');
  const dialogImage = dialog?.querySelector('img');
  const caption = dialog?.querySelector('figcaption');
  document.querySelectorAll('[data-gallery] button').forEach(button => {
    button.addEventListener('click', () => {
      if (!dialog || !dialogImage) return;
      dialogImage.src = button.dataset.full || '';
      dialogImage.alt = button.dataset.alt || '';
      if (caption) caption.textContent = button.dataset.alt || '';
      dialog.showModal();
    });
  });
  dialog?.querySelector('.lightbox-close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
