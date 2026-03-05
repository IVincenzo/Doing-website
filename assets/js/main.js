(function () {
  const siteHeader = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = siteHeader ? siteHeader.querySelector('.site-nav') : null;

  if (siteHeader && navToggle && siteNav) {
    const closeMobileMenu = () => {
      siteHeader.classList.remove('is-menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = siteHeader.classList.toggle('is-menu-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 700) closeMobileMenu();
      });
    });

    document.addEventListener('click', (event) => {
      if (window.innerWidth > 700) return;
      const clickedInsideHeader = siteHeader.contains(event.target);
      if (!clickedInsideHeader) closeMobileMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 700) closeMobileMenu();
    });
  }

  const localAnchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  localAnchors.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const header = document.querySelector('.site-header');
      const headerOffset = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
      const scrollTop = Math.max(0, targetTop - headerOffset + 8);
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
      history.replaceState(null, '', targetId);
    });
  });

  const faqItems = Array.from(document.querySelectorAll('.faq-item'));

  if (faqItems.length) {
    const closeItem = (item) => {
      item.classList.remove('is-open');
      const button = item.querySelector('.faq-trigger');
      const panel = item.querySelector('.faq-panel');
      if (button) button.setAttribute('aria-expanded', 'false');
      if (panel) {
        panel.setAttribute('aria-hidden', 'true');
        panel.style.display = 'none';
      }
    };

    const openItem = (item) => {
      item.classList.add('is-open');
      const button = item.querySelector('.faq-trigger');
      const panel = item.querySelector('.faq-panel');
      if (button) button.setAttribute('aria-expanded', 'true');
      if (panel) {
        panel.setAttribute('aria-hidden', 'false');
        panel.style.display = 'block';
      }
    };

    faqItems.forEach((item, index) => {
      const trigger = item.querySelector('.faq-trigger');
      const panel = item.querySelector('.faq-panel');
      if (!trigger) return;
      if (panel) {
        panel.hidden = false;
        panel.removeAttribute('hidden');
        panel.setAttribute('aria-hidden', 'true');
        panel.style.display = 'none';
      }

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        faqItems.forEach(closeItem);
        if (!isOpen) openItem(item);
      });

      if (index !== 0) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  }

  const carousels = Array.from(document.querySelectorAll('[data-carousel]'));
  const lightbox = document.querySelector('[data-screen-lightbox]');
  const lightboxImage = lightbox ? lightbox.querySelector('[data-screen-lightbox-image]') : null;

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) return;
    lightbox.hidden = true;
    lightboxImage.src = '';
    lightboxImage.alt = '';
    document.body.style.overflow = '';
  };

  const openLightbox = (image) => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Capture d'ecran agrandie";
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const dotsWrap = carousel.querySelector('[data-carousel-dots]');
    const prevBtn = carousel.querySelector('.carousel-btn--prev');
    const nextBtn = carousel.querySelector('.carousel-btn--next');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    if (!slides.length) return;

    let currentIndex = 0;
    const dots = [];
    let isPointerDown = false;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    let dragged = false;
    let suppressClick = false;
    let clearSuppressClickTimer = null;

    const setActiveDot = (index) => {
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    const scrollToSlide = (index) => {
      const bounded = Math.max(0, Math.min(index, slides.length - 1));
      currentIndex = bounded;
      track.scrollTo({ left: slides[bounded].offsetLeft, behavior: 'smooth' });
      setActiveDot(bounded);
    };

    if (dotsWrap) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Aller a l'image ${index + 1}`);
        dot.addEventListener('click', () => scrollToSlide(index));
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
      setActiveDot(0);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => scrollToSlide(currentIndex - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => scrollToSlide(currentIndex + 1));
    }

    slides.forEach((slide) => {
      const image = slide.querySelector('img');
      if (!image) return;
      image.draggable = false;
      image.addEventListener('dragstart', (event) => event.preventDefault());
    });

    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse') return;
      if (event.button !== 0) return;
      isPointerDown = true;
      dragged = false;
      suppressClick = false;
      dragStartX = event.clientX;
      dragStartScrollLeft = track.scrollLeft;
      track.style.cursor = 'grabbing';
      track.style.scrollBehavior = 'auto';
      if (clearSuppressClickTimer) {
        clearTimeout(clearSuppressClickTimer);
        clearSuppressClickTimer = null;
      }
    });

    track.addEventListener('pointermove', (event) => {
      if (!isPointerDown) return;
      const deltaX = event.clientX - dragStartX;
      if (Math.abs(deltaX) > 10) dragged = true;
      track.scrollLeft = dragStartScrollLeft - deltaX;
    });

    const stopPointerDrag = (event) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      track.style.cursor = 'grab';
      track.style.scrollBehavior = '';
      if (dragged) {
        suppressClick = true;
        clearSuppressClickTimer = window.setTimeout(() => {
          suppressClick = false;
          clearSuppressClickTimer = null;
        }, 140);
      }
      dragged = false;
    };

    track.addEventListener('pointerup', stopPointerDrag);
    track.addEventListener('pointercancel', stopPointerDrag);
    track.addEventListener('pointerleave', stopPointerDrag);

    track.addEventListener('scroll', () => {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(trackCenter - slideCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      if (nearestIndex !== currentIndex) {
        currentIndex = nearestIndex;
        setActiveDot(nearestIndex);
      }
    }, { passive: true });

    track.addEventListener('click', (event) => {
      const image = event.target.closest('.carousel-slide img');
      if (!image || !track.contains(image)) return;
      if (suppressClick) {
        event.preventDefault();
        return;
      }
      openLightbox(image);
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target.closest('.screen-lightbox-close')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !lightbox.hidden) {
        closeLightbox();
      }
    });
  }

  const supportForm = document.getElementById('support-form');
  const supportFeedback = document.getElementById('form-feedback');

  if (supportForm && supportFeedback) {
    supportForm.addEventListener('submit', (event) => {
      event.preventDefault();
      supportFeedback.hidden = false;
      supportFeedback.textContent = 'Merci ! En V1, contactez-nous par email : support@getdoing.app';
    });
  }
})();
