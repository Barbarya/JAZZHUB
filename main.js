(() => {
  "use strict";

  // -----------------------------
  // Header: add/remove .scrolled on scroll
  // -----------------------------
  // Find the header element (site navbar). If it exists, add a scroll listener
  // that toggles the CSS class `scrolled` once the page is scrolled past 80px.
  // Using `classList.toggle` with a condition is concise and avoids branching.
  const navbar = document.querySelector('.header');
  if (navbar) {
    document.addEventListener('scroll', () => {
      const scrolled = document.scrollingElement?.scrollTop ?? window.scrollY ?? 0;
      // `scrolled > 80` — change this number to adjust when the header changes
      navbar.classList.toggle('scrolled', scrolled > 80);
    }, { passive: true });
  }

  // -----------------------------
  // Reveal on scroll: IntersectionObserver
  // -----------------------------
  // Observe elements with the `.text_block` class and add `.in-view` when
  // they enter the viewport. We `unobserve` after they become visible so
  // the animation runs only once per element. A fallback adds `.in-view`
  // immediately when the browser doesn't support IntersectionObserver.
  const textBlocks = document.querySelectorAll('.text_block');
  if (textBlocks.length > 0) {
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

      textBlocks.forEach(el => io.observe(el));
    } else {
      // Older browsers: reveal immediately
      textBlocks.forEach(el => el.classList.add('in-view'));
    }
  }

  // -----------------------------
  // Smooth scroll helper for the header link
  // -----------------------------
  // Attach a click handler to the element with id `scrollInfo` that
  // scrolls the section with id `Info` into view using smooth behavior.
  const scrollBtn = document.getElementById('scrollInfo');
  const infoSection = document.getElementById('Info');
  if (scrollBtn && infoSection) {
    scrollBtn.addEventListener('click', () => infoSection.scrollIntoView({ behavior: 'smooth' }));
  }
})();