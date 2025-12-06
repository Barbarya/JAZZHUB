
document.documentElement.style.scrollBehavior = 'smooth';

(function () {
  const links = Array.from(document.querySelectorAll('.sidenav a[href^="#"]')); /* all in-page links in sidenav */
  const indicator = document.getElementById('sidenav-indicator'); /* small-screen active link indicator */

  function getSections() {
    return links
      .map(l => {
        const id = (l.getAttribute('href') || '').slice(1); /* remove leading # */
        return id ? document.getElementById(id) : null; /* get section by id */
      })
      .filter(Boolean); /* remove nulls */
  }

  function getOffset() { /* get offset for active section calculation */
    try {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height') || ''; /* get CSS variable */
      const n = parseFloat(raw); /* parse to number */
      if (Number.isFinite(n) && n > 0) return n;
    } catch (e) {
    }
    return 110; // fallback offset in pixels
  }

  function setActive() {
    const sections = getSections(); /* get current sections */
    const offset = getOffset(); /* get offset */
    let activeIndex = -1; /* index of active section */

    for (let i = 0; i < sections.length; i++) {
      const r = sections[i].getBoundingClientRect(); /* get section position */
      if (r.top - offset <= 0) activeIndex = i; /* section top is above offset */
    }

    links.forEach(l => l.classList.remove('active')); /* clear all active states */

    let chosenLink = null; /* link to be marked active */
    if (activeIndex >= 0) {
      const id = sections[activeIndex].id; /* get active section id */
      chosenLink = document.querySelector('.sidenav a[href="#' + id + '"]'); /* find corresponding link */
    } else {
      chosenLink = document.querySelector('.sidenav a[href="#header"]') || links[0] || null; /* default to top link */
    }

    if (chosenLink) {
      chosenLink.classList.add('active'); /* mark link active */
      if (indicator) indicator.textContent = chosenLink.textContent.trim(); /* update indicator text */
    }

    if (indicator) {
      if (window.innerWidth <= 900) { /* show indicator on small screens */
        indicator.style.display = 'block';
        indicator.setAttribute('aria-hidden', 'false');
      } else {
        indicator.style.display = 'none';
        indicator.setAttribute('aria-hidden', 'true');
      }
    }
  }

  window.addEventListener('scroll', setActive, { passive: true }); /* update active link on scroll */
  window.addEventListener('resize', setActive); /* update on resize */
  window.addEventListener('DOMContentLoaded', setActive); /* initial setup */
  window.addEventListener('load', setActive); // extra guard for images/layout

  const title = document.querySelectorAll('.title'); // elements to animate
  if (title.length > 0) {
    if ('IntersectionObserver' in window) { // modern browsers
      const io = new IntersectionObserver((entries, observer) => { 
        entries.forEach(entry => { // for each observed entry
          if (entry.isIntersecting) { // element is in view
            // entry.target is the observed DOM element
            entry.target.classList.add('in-view'); // add class to trigger animation
            observer.unobserve(entry.target); // animate only once
          }
        });
      }, { threshold: 0.15 });

      title.forEach(el => io.observe(el)); // observe each title element
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
    const sidenav = document.querySelector('.sidenav'); // main sidenav element
    if (!sidenav) return;

    // ensure there's an id for aria-controls
    if (!sidenav.id) sidenav.id = 'sidenav-main'; // assign id if missing

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
