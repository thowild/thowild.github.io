/* THOWILD redesign v1 — small vanilla JS: theme toggle, hero word rotator,
   scroll reveal, and a polite video autoplay policy. */
(function () {
  "use strict";

  /* Dark mode toggle (choice persisted in localStorage; initial theme is set
     by the inline script in <head> before first paint). */
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("thowild-theme", next); } catch (e) {}
    });
  }

  /* Hero rotating word. Without JS the first word simply stays put. */
  var rotator = document.querySelector(".rotator");
  if (rotator && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var words = (rotator.getAttribute("data-words") || "").split(",").filter(Boolean);
    if (words.length > 1) {
      var i = 0;
      setInterval(function () {
        rotator.classList.add("swap");
        setTimeout(function () {
          i = (i + 1) % words.length;
          rotator.textContent = words[i];
          rotator.classList.remove("swap");
        }, 300);
      }, 2400);
    }
  }

  /* Reveal on scroll. */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Video: respect reduced-motion and data-saver — no autoplay then. */
  var video = document.querySelector("video[data-loop]");
  if (video) {
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (navigator.connection && navigator.connection.saveData);
    if (calm) {
      video.removeAttribute("autoplay");
      video.pause();
      video.setAttribute("controls", "");
    }
  }
})();
