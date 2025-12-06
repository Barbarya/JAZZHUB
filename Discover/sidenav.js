
document.documentElement.style.scrollBehavior = 'smooth';

(function () {
  const links = Array.from(document.querySelectorAll('.sidenav a[href^="#"]'));
  const indicator = document.getElementById('sidenav-indicator');

  function getSections() {
    return links
      .map(l => {
        const id = (l.getAttribute('href') || '').slice(1);
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);
  }

  function getOffset() {
    try {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '';
      const n = parseFloat(raw);
      if (Number.isFinite(n) && n > 0) return n;
    } catch (e) {
    }
    return 110; // fallback offset in pixels
  }

  function setActive() {
    const sections = getSections();
    const offset = getOffset();
    let activeIndex = -1;

    for (let i = 0; i < sections.length; i++) {
      const r = sections[i].getBoundingClientRect();
      if (r.top - offset <= 0) activeIndex = i;
    }

    links.forEach(l => l.classList.remove('active'));

    let chosenLink = null;
    if (activeIndex >= 0) {
      const id = sections[activeIndex].id;
      chosenLink = document.querySelector('.sidenav a[href="#' + id + '"]');
    } else {
      chosenLink = document.querySelector('.sidenav a[href="#header"]') || links[0] || null;
    }

    if (chosenLink) {
      chosenLink.classList.add('active');
      if (indicator) indicator.textContent = chosenLink.textContent.trim();
    }

    if (indicator) {
      if (window.innerWidth <= 900) {
        indicator.style.display = 'block';
        indicator.setAttribute('aria-hidden', 'false');
      } else {
        indicator.style.display = 'none';
        indicator.setAttribute('aria-hidden', 'true');
      }
    }
  }

  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive);
  window.addEventListener('DOMContentLoaded', setActive);
  window.addEventListener('load', setActive); // extra guard for images/layout

  if (indicator) {
    indicator.addEventListener('click', () => {
      const active = document.querySelector('.sidenav a.active');
      let id = null;
      if (active) id = (active.getAttribute('href') || '').slice(1);
      else if (links[0]) id = (links[0].getAttribute('href') || '').slice(1);
      if (id) {
        location.hash = '#' + id;
      }
    });
  }

  const title = document.querySelectorAll('.title');
  if (title.length > 0) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // entry.target is the observed DOM element
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // animate only once
          }
        });
      }, { threshold: 0.15 });

      title.forEach(el => io.observe(el));
    } else {
      // Older browsers: reveal immediately
      title.forEach(el => el.classList.add('in-view'));
    }
  }

  const quote = document.querySelectorAll('.quote');
  if (quote.length > 0) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // entry.target is the observed DOM element
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // animate only once
          }
        });
      }, { threshold: 0.15 });

      quote.forEach(el => io.observe(el));
    } else {
      // Older browsers: reveal immediately
      quote.forEach(el => el.classList.add('in-view'));
    }
  }

  
  /* --- Small-screen toggle for the sidenav --- */
  (function attachToggle() {
    const sidenav = document.querySelector('.sidenav');
    if (!sidenav) return;

    // ensure there's an id for aria-controls
    if (!sidenav.id) sidenav.id = 'sidenav-main';

    // create toggle button if not present
    if (!document.getElementById('sidenav-toggle')) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.id = 'sidenav-toggle';
      toggle.className = 'sidenav-toggle';
      toggle.setAttribute('aria-controls', sidenav.id);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Toggle navigation');
      toggle.innerHTML = '\u2630'; // hamburger
      document.body.appendChild(toggle);

      toggle.addEventListener('click', (e) => {
        const opened = sidenav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(opened));
        e.stopPropagation();
      });

      // Close when navigation link clicked on small screens
      links.forEach(l => l.addEventListener('click', () => {
        if (window.innerWidth <= 600 && sidenav.classList.contains('open')) {
          sidenav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      }));

      // Click outside to close
      document.addEventListener('click', (ev) => {
        if (window.innerWidth <= 600 && sidenav.classList.contains('open')) {
          if (!sidenav.contains(ev.target) && !toggle.contains(ev.target)) {
            sidenav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }
  })();

})();
