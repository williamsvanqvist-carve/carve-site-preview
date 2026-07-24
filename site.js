(function () {
  "use strict";

  var nav = document.querySelector(".site-nav");
  var brandImage = nav && nav.querySelector(".nav-brand img");
  var toggle = nav && nav.querySelector(".nav-toggle");
  var mobileMenu = nav && nav.querySelector(".nav-mobile");
  var navFrame = 0;

  function setNavTone() {
    navFrame = 0;
    if (!nav) return;
    var scrolled = window.scrollY > 54;
    nav.classList.toggle("is-scrolled", scrolled);
    if (brandImage) {
      var source = scrolled || nav.dataset.tone === "light"
        ? brandImage.dataset.logoDark
        : brandImage.dataset.logoLight;
      if (source && brandImage.getAttribute("src") !== source) brandImage.setAttribute("src", source);
    }
  }

  function queueNavTone() {
    if (navFrame) return;
    navFrame = requestAnimationFrame(setNavTone);
  }

  if (nav) {
    setNavTone();
    window.addEventListener("scroll", queueNavTone, { passive: true });
  }

  function closeMenu() {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      mobileMenu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    });
    mobileMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".question > button"), function (button) {
    button.addEventListener("click", function () {
      var wasOpen = button.getAttribute("aria-expanded") === "true";
      var group = button.closest(".questions");
      if (group) {
        Array.prototype.forEach.call(group.querySelectorAll(".question > button"), function (other) {
          if (other !== button) other.setAttribute("aria-expanded", "false");
        });
      }
      button.setAttribute("aria-expanded", String(!wasOpen));
    });
  });

  var journey = document.querySelector("[data-journey]");
  if (journey && "IntersectionObserver" in window) {
    var stages = Array.prototype.slice.call(journey.querySelectorAll("[data-journey-stage]"));
    var links = Array.prototype.slice.call(journey.querySelectorAll("[data-journey-link]"));
    var rail = journey.querySelector(".journey-links");
    var current = -1;

    function activateJourney(index) {
      if (index < 0 || index === current) return;
      current = index;
      links.forEach(function (link, linkIndex) {
        link.classList.toggle("active", linkIndex === index);
        link.classList.toggle("done", linkIndex < index);
        if (linkIndex === index) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
      if (rail) {
        var progress = links.length > 1 ? index / (links.length - 1) * 100 : 0;
        rail.style.setProperty("--journey-progress", progress + "%");
      }
    }

    var stageObserver = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) {
          return Math.abs(a.boundingClientRect.top - innerHeight * 0.35) -
            Math.abs(b.boundingClientRect.top - innerHeight * 0.35);
        });
      if (!visible.length) return;
      activateJourney(stages.indexOf(visible[0].target));
    }, { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.05] });

    stages.forEach(function (stage) { stageObserver.observe(stage); });
    activateJourney(0);
  }
})();
