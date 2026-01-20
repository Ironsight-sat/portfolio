document.addEventListener("DOMContentLoaded", () => {

  /* PAGE LOAD */
  document.querySelectorAll(".load-in").forEach(el => {
    requestAnimationFrame(() => {
      el.classList.add("is-loaded");
    });
  });

  /* SCROLL REVEAL */
 const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.35,
    rootMargin: "0px 0px -40px 0px"
  }
);


  document.querySelectorAll(".reveal, .reveal-fade").forEach(el => {
    observer.observe(el);
  });

});
