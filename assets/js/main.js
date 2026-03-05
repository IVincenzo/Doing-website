(function () {
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
