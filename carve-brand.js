/* CARVE-BRAND — copy only. Structure/gradients/animations untouched. Re-runs to survive re-renders.
   EXACT map is built from ordara-content.json + carve-replacements.json (index-aligned, exact keys). */
(function () {
  var SHORT = { "Ordara": "Carve" }; /* wordmark + stray exact nodes */
  var HERO = { /* Ordara-original hero strings (not in the extracted list) — "New Carve" positioning */
    "Unlock deeper insights with AI-led conversational surveys.": "Give every product the attention only your best get.",
    "Describe your objective, choose the audience, and generate an AI-powered survey that feels like a real conversation, not a form.": "Carve finds what holds each product back and acts within your permissions—keeping you in control.",
    "Carve watches every product in your Shopify catalog, investigates what is holding it back, acts within the permissions you set and follows through on the result. Your judgment stays at the center.": "Carve finds what holds each product back and acts within your permissions—keeping you in control.",
    "Ordara raises $20M, Series A funding 2026": "Product-growth intelligence for Shopify brands"
  };
  var ROLL = { /* per-letter rolling-text labels (buttons + nav) */
    "Createasurvey": "Book a review", "ContactUs": "Try Carve on a product", "GetTemplate": "Book a review",
    "StartFree": "Start free", "GetStarted": "Book a review", "ContactSales": "Talk to a founder",
    "Product": "How it works", "Blog": "Insights"
  };
  /* (ANIM per-word blocks removed — the testimonial + Founder's Note sections they targeted are
     now hidden, and the full-subtree text scan they required was the main re-render hot spot.) */
  /* Ordara's own (beautiful) 3-card pricing section, kept — only the plan names + price
     that differ from Carve's tiers are swapped. Scoped to the Pricing Container. */
  var PRICING = {
    "Starter": "Free",
    "Pro": "Specialist",
    "$49": "$499",
    "per month per seat": "per month",
    "Everything in Starter, plus": "Everything in Free, plus",
    "Everything in Pro, plus": "Everything in Specialist, plus"
  };
  var EXACT = {};
  function norm(s) { return (s || "").replace(/\s+/g, ""); }
  function rebrandPricing() {
    var pc = document.querySelector('[data-framer-name="Pricing Container"]');
    if (!pc) return;
    var w = document.createTreeWalker(pc, NodeFilter.SHOW_TEXT, null), n, nodes = [];
    while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (tn) {
      var t = tn.nodeValue.trim();
      /* exact trimmed match; no replacement value is itself a key, so this is idempotent
         (a substring guard misfires here: "per month per seat" contains "per month") */
      if (PRICING.hasOwnProperty(t)) tn.nodeValue = tn.nodeValue.replace(t, PRICING[t]);
    });
  }
  function liveRoot() {
    var c = [].slice.call(document.querySelectorAll(".framer-tCkLZ"));
    return c.find(function (e) { return Object.keys(e).some(function (k) { return k.indexOf("__react") === 0; }); }) || null;
  }
  var TICKER_LOGOS = ["shopify_logo_whitebg.svg", "google-logo.svg", "OpenAI-black-wordmark.svg", "Anthropic_Logo_0.svg", "perplexity-logo.png", "feedonomics-logo.svg"];
  var TICKER_ALTS = ["Shopify", "Google", "OpenAI", "Anthropic", "Perplexity", "Feedonomics"];
  function setImg(el, src) { if (el && el.getAttribute("src") !== src) { el.setAttribute("src", src); el.removeAttribute("srcset"); } }
  function swapImages() {
    var foot = document.querySelector('img[alt="logomark"]');            /* footer wordmark → full lockup */
    if (foot) { setImg(foot, "./assets/carve/lockup-white.svg"); foot.alt = "Carve"; foot.style.objectFit = "contain"; foot.style.objectPosition = "center"; }
    var emblem = document.querySelector('img[alt="logo"]');
    setImg(emblem, "./assets/carve/orb.svg");  /* CTA emblem (section hidden; kept for safety) */
    if (emblem) emblem.alt = "";
    /* nav logo → carve.ac's real lockup (orb + wordmark in the brand's own logo typography). */
    ensureNavLogos();
    bindNavLogo();
    /* logo ticker → real partner logos, understated grayscale on the light strip */
    var tick = document.querySelector('[data-framer-name="Logo Ticker"]');
    if (tick) [].forEach.call(tick.querySelectorAll("img"), function (im, i) {
      var src = "./assets/carve/logos/" + TICKER_LOGOS[i % TICKER_LOGOS.length];
      if (im.getAttribute("src") !== src) { im.setAttribute("src", src); im.removeAttribute("srcset"); }
      im.alt = TICKER_ALTS[i % TICKER_ALTS.length];
      im.style.objectFit = "contain";
      im.style.setProperty("filter", "grayscale(1) brightness(0.24) contrast(1.08)", "important");
      im.style.setProperty("opacity", "0.92", "important");
      im.style.setProperty("mix-blend-mode", "normal", "important");
    });
  }
  /* Rebuilt in the template's design language, one section at a time. */
  var NEW_SECTIONS = [
    { id: "carve-sec-stories", src: "./carve-stories.html", rev: "20260728-narrative-21", title: "Catalog-wide product investigations", h: 830, bg: "#F5F0E8", full: true },
    { id: "carve-sec-channels", src: "./carve-channels.html", rev: "20260728-narrative-21", title: "Where Carve acts", h: 760, bg: "#F5F0E8", full: true },
    { id: "carve-sec-authorities", src: "./carve-authorities.html", rev: "20260728-narrative-21", title: "Carve intelligence and control", h: 700, bg: "#F5F0E8", full: true }
  ];
  function band(s) {
    var sec = document.createElement("section"); sec.id = s.id;
    sec.style.cssText = "width:100%;background:" + s.bg + ";display:flex;justify-content:center;align-items:center;overflow:hidden;"
      + (s.pt ? "padding-top:" + s.pt + "px;" : "") + (s.pb ? "padding-bottom:" + s.pb + "px;" : "");
    var f = document.createElement("iframe");
    f.src = s.src + (s.rev ? ((s.src.indexOf("?") === -1 ? "?" : "&") + "v=" + encodeURIComponent(s.rev)) : "");
    f.title = s.title || "Carve product information"; f.setAttribute("scrolling", "no"); f.loading = "lazy";
    f.setAttribute("data-carve-band", s.src);
    f.style.cssText = "width:" + (s.full ? "100%" : "min(100%,1160px)") + ";height:" + s.h + "px;border:0;background:transparent;display:block;transition:height .2s ease;";
    sec.appendChild(f); return sec;
  }
  /* Band pages report their real content height; grow the frame to fit so nothing clips when the
     layout stacks at narrower widths. Never shrink below the design height — that keeps the
     intended breathing room and stops the page jumping as frames settle. */
  window.addEventListener("message", function (e) {
    var d = e.data; if (!d || typeof d.carveHeight !== "number" || !d.carveSrc) return;
    var name = String(d.carveSrc).split("/").pop();
    var f = document.querySelector('iframe[data-carve-band$="' + name + '"]'); if (!f) return;
    var design = 0;
    NEW_SECTIONS.concat([{ src: "./carve-guarantee.html", h: 580 }]).forEach(function (s) {
      if (s.src.indexOf(name) !== -1) design = s.h;
    });
    var want = Math.max(design, Math.min(d.carveHeight, 2200));   /* cap: guard against runaway */
    if (Math.abs(parseInt(f.style.height, 10) - want) > 4) f.style.height = want + "px";
  });
  /* Native sticky How-it-works: replaces the Ordara HIW mockups. Built as real DOM
     (not an iframe) so the sticky rail ties to the PARENT page scroll. Fetched once,
     cached, re-placeable if React re-renders. */
  var hiwCache = null, hiwFetching = false, hiwTrackerBound = false, navLogoBound = false;
  /* Nav logo = carve.ac's real lockup on BOTH scroll-nav variants (Light over the dark hero,
     Normal on the white pill). Each variant's lockup is coloured by the background actually
     behind it, so it stays readable through the scroll-colour transition. */
  function lumaBehind(el) {
    var e = el;
    while (e) {
      var m = getComputedStyle(e).backgroundColor.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
      if (m) { var a = m[4] === undefined ? 1 : parseFloat(m[4]); if (a > 0.5) return 0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]; }
      e = e.parentElement;
    }
    return 26; /* page fell through → treat as dark */
  }
  function colorNavLogos() {   /* cheap: recolour existing lockups (scroll path) */
    [].forEach.call(document.querySelectorAll(".carve-lockup"), function (img) {
      var a = img.closest("a") || img.parentElement; if (!a) return;
      var want = lumaBehind(a) < 140 ? "./assets/carve/lockup-white.svg" : "./assets/carve/lockup-black.svg";
      if (img.getAttribute("src") !== want) img.setAttribute("src", want);
    });
  }
  function ensureNavLogos() {   /* structure: create lockup + hide template logo (interval path) */
    [].forEach.call(document.querySelectorAll('[data-framer-name="Logotype"]'), function (lt) {
      var a = lt.closest("a"); if (!a) return;
      [].forEach.call(a.children, function (c) { if (!c.classList.contains("carve-lockup")) c.style.display = "none"; });
      if (!a.querySelector(".carve-lockup")) {
        a.style.overflow = "visible";
        var img = document.createElement("img"); img.className = "carve-lockup";
        img.alt = "Carve";
        img.style.cssText = "height:25px;width:auto;display:block;";
        a.appendChild(img);
      }
      a.classList.add("carve-brand-slot");
      if (a.parentElement) a.parentElement.classList.add("carve-brand-host");
    });
    colorNavLogos();
  }
  function bindNavLogo() {
    if (navLogoBound) return; navLogoBound = true;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; colorNavLogos(); }); }
    }, { passive: true });
  }
  /* PINNED scrollytelling driver: the section pins (position:sticky), and scroll progress
     through the tall .cx-hiw-scroll maps to a step index — the active card rises in place,
     earlier cards leave, the left rail ticks forward in order. Never stale, binds once. */
  function bindHiwTracker() {
    if (hiwTrackerBound) return; hiwTrackerBound = true;
    var ticking = false;
    function update() {
      ticking = false;
      var scrollEl = document.getElementById("cx-hiw-scroll"); if (!scrollEl) return;
      var scenes = scrollEl.querySelectorAll(".cx-hiw-scene");
      var links = scrollEl.querySelectorAll(".cx-hiw-rail-link");
      var rail = scrollEl.querySelector(".cx-hiw-rail-items");
      var N = scenes.length; if (!N) return;
      var rect = scrollEl.getBoundingClientRect();
      var total = scrollEl.offsetHeight - window.innerHeight;
      var progressed = Math.min(Math.max(-rect.top, 0), total > 0 ? total : 0);
      var p = total > 0 ? progressed / total : 0;
      var idx = Math.min(N - 1, Math.floor(p * N));
      for (var i = 0; i < N; i++) {
        scenes[i].classList.toggle("active", i === idx);
        scenes[i].classList.toggle("past", i < idx);
      }
      for (var j = 0; j < links.length; j++) {
        links[j].classList.toggle("active", j === idx);
        links[j].classList.toggle("done", j < idx);
      }
      if (rail) rail.style.setProperty("--rail-fill", (N > 1 ? (idx / (N - 1)) * 100 : 0) + "%");
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }
  function placeHiw(anchor) {
    if (!document.getElementById("cx-hiw-style")) {
      var st = document.createElement("style"); st.id = "cx-hiw-style"; st.textContent = hiwCache.css; document.head.appendChild(st);
    }
    anchor.style.display = "none";
    var w = document.createElement("div"); w.innerHTML = hiwCache.sectionHTML;
    var sec = w.querySelector("#cx-hiw"); if (!sec) return;
    sec.style.width = "100%";
    anchor.insertAdjacentElement("afterend", sec);
    bindHiwTracker();
  }
  function injectHowItWorks() {
    var anchor = document.querySelector('[data-framer-name="How It Works Container"]');
    if (!anchor) return;
    if (document.getElementById("cx-hiw")) return;      /* already placed */
    if (hiwCache) { placeHiw(anchor); return; }          /* cached → place synchronously */
    if (hiwFetching) return; hiwFetching = true;
    fetch("./carve-howitworks.html?v=20260728-narrative-21").then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var style = doc.getElementById("cx-hiw-style"), section = doc.getElementById("cx-hiw");
      if (style && section) {
        hiwCache = { css: style.textContent, sectionHTML: section.outerHTML };
        if (!document.getElementById("cx-hiw")) placeHiw(anchor);
      }
      hiwFetching = false;
    }).catch(function () { hiwFetching = false; });
  }
  /* Footer → only carve.ac-matching info. Rewrites the 4 template columns (title + links) to
     Carve's real links, keeps LinkedIn (carve.ac's) + william@carve.ac, drops all Ordara cruft
     (Home/Benefits/Blog/Contact/404, X/Instagram/Youtube, samyadeep credit links). Idempotent. */
  var FOOTER_COLS = [
    { wrap: "Section links", title: "Product", items: [
        { t: "How it works", href: "./how-it-works/" },
        { t: "Pricing", href: "./pricing/" }, null, null, null ] },
    { wrap: "Page links", title: "Start", items: [
        { t: "Talk to a founder", href: "https://calendar.app.google/TA9Xv89TnJkJidm78", ext: true },
        { t: "Try Carve on a product", href: "https://carve.ac/demo", ext: true },
        { t: "Log in", href: "https://carve.ac/login", ext: true }, null ] },
    { wrap: "Legal Links", title: "Legal", items: [
        { t: "Privacy", href: "https://carve.ac/privacy", ext: true },
        { t: "Terms", href: "https://carve.ac/terms", ext: true } ] },
    { wrap: "Social Links", title: "Company", items: [
        { t: "Insights", href: "./insights/" },
        { t: "william@carve.ac", href: "mailto:william@carve.ac" },
        { t: "LinkedIn", href: "https://www.linkedin.com/company/carve-ai/", ext: true }, null ] }
  ];
  function fixFooter() {
    var foot = document.querySelector('[data-framer-name="Footer Container"]');
    if (!foot) return;
    FOOTER_COLS.forEach(function (col) {
      var wrap = foot.querySelector('[data-framer-name="' + col.wrap + '"]'); if (!wrap) return;
      var tEl = wrap.querySelector("p.framer-text");   /* title lives inside the column wrap */
      if (tEl && tEl.textContent.trim() !== col.title) tEl.textContent = col.title;
      [].slice.call(wrap.querySelectorAll("a")).forEach(function (a, i) {
        var it = col.items[i];
        if (!it) { if (a.style.display !== "none") a.style.display = "none"; a.removeAttribute("href"); a.removeAttribute("target"); a.removeAttribute("rel"); return; }
        if (a.style.display === "none") a.style.display = "";
        if (a.getAttribute("href") !== it.href) a.setAttribute("href", it.href);
        if (it.ext) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer"); }
        a.removeAttribute("data-framer-page-link-current");
        if (a.textContent.trim() !== it.t) a.textContent = it.t;
      });
    });
    /* bottom bar: repoint stray Ordara/Framer credit links to carve.ac */
    [].forEach.call(foot.querySelectorAll("a"), function (a) {
      var h = a.getAttribute("href") || "";
      if (h.indexOf("samyadeep") !== -1 || h.indexOf("framer.link") !== -1) {
        a.setAttribute("href", "https://carve.ac/"); a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer");
      }
    });
  }
  /* CTA buttons → carve.ac's real destinations (they still point at Ordara's samyadeep /
     framer.link / Polar checkout / dead javascript:void(0)). Matched by normalized label. */
  var CTA_HREFS = {
    "Book a review": "https://calendar.app.google/TA9Xv89TnJkJidm78",
    "Talk to a founder": "https://calendar.app.google/TA9Xv89TnJkJidm78",
    "Try Carve on a product": "https://carve.ac/demo",
    "Start free": "https://carve.ac/login"
  };
  var CTA_KEYS = Object.keys(CTA_HREFS);
  function fixCtas() {
    [].forEach.call(document.querySelectorAll('[class*="rolling-text-inner"]'), function (el) {
      if (el.closest('[data-framer-name="Footer Container"]')) return;
      var a = el.closest("a"); if (!a) return;
      var nt = (el.textContent || "").replace(/\s+/g, "");
      for (var i = 0; i < CTA_KEYS.length; i++) {
        if (nt.indexOf(CTA_KEYS[i].replace(/\s+/g, "")) === 0) {
          var href = CTA_HREFS[CTA_KEYS[i]];
          if (a.getAttribute("href") !== href) { a.setAttribute("href", href); a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer"); }
          return;
        }
      }
    });
  }
  /* Main navigation now points to the complete local pages. */
  var NAV_MAP = {
    "Product": { t: "How it works", href: "./how-it-works/" },
    "How it works": { t: "How it works", href: "./how-it-works/" },
    "Pricing": { t: "Pricing", href: "./pricing/" },
    "Blog": { t: "Insights", href: "./insights/" },
    "Insights": { t: "Insights", href: "./insights/" }
  };
  /* Decorative wrappers (e.g. the hero badge) ship as <a href="javascript:void(0)"> — they look
     clickable and go nowhere. Strip the href so they read as plain text, not dead links. */
  function killDeadLinks() {
    [].forEach.call(document.querySelectorAll('a[href="javascript:void(0)"]'), function (a) {
      a.removeAttribute("href"); a.style.cursor = "default";
    });
    [].forEach.call(document.querySelectorAll('[data-framer-name="Hero Container"] a'), function (a) {
      if ((a.textContent || "").indexOf("Product-growth intelligence for Shopify brands") !== -1) {
        a.removeAttribute("href"); a.removeAttribute("target"); a.removeAttribute("rel"); a.style.cursor = "default";
      }
    });
  }
  function fixNav() {
    [].forEach.call(document.querySelectorAll("a"), function (a) {
      if (a.closest('[data-framer-name="Footer Container"]')) return;
      var t = (a.textContent || "").trim();
      if (t.length && t.length % 2 === 0 && t.slice(0, t.length / 2) === t.slice(t.length / 2)) t = t.slice(0, t.length / 2);
      var m = NAV_MAP[t]; if (!m) return;
      if (a.getAttribute("href") !== m.href) a.setAttribute("href", m.href);
      if (m.ext) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer"); }
      else { a.removeAttribute("target"); a.removeAttribute("rel"); }
      if (a.textContent.trim() !== m.t) a.textContent = m.t;
    });
  }
  /* Give our injected sections the same scroll-in motion Framer gives its own, so the page reads
     as one piece. Observed once each; the class is what CSS animates. */
  var revealIO = null;
  function armReveals() {
    if (!("IntersectionObserver" in window)) return;
    if (!revealIO) revealIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("cx-in"); revealIO.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.06 });
    var targets = [].slice.call(document.querySelectorAll(
      "#carve-sec-channels iframe, #carve-sec-stories iframe, #carve-sec-authorities iframe, #carve-guarantee-band iframe, #cx-hiw .cx-hiw-intro"));
    targets.forEach(function (el) {
      if (el.classList.contains("cx-reveal")) return;
      el.classList.add("cx-reveal");
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add("cx-in"); /* already in view on load */
      else revealIO.observe(el);
    });
  }
  /* Concentrate Williams' five-part story inside the existing Framer sections. The hero stays
     untouched: this starts with the attention gap immediately below it, then closes on outcomes. */
  var ATTENTION_BADGES = {
    "Every product watched": "Priority products · closely watched",
    "Evidence before action": "Weak visibility · unseen",
    "Your judgment stays in the loop": "Conversion gaps · unseen",
    "Acts only with permission": "Missed demand · unseen",
    "Measures what changed": "The rest of the catalog · waiting"
  };
  function setNarrativeText(el, text) {
    if (el && el.textContent.trim() !== text) el.textContent = text;
  }
  function shapeNarrative() {
    var benefits = document.querySelector('[data-framer-name="Benefits Container"]');
    if (benefits) {
      setNarrativeText(benefits.querySelector('[data-framer-name="Main Heading"] h2'), "Your catalog is bigger than your team’s attention.");
      var main = benefits.querySelector('[data-framer-name="Main Content Text"]');
      if (main) {
        var lede = main.querySelector(".carve-attention-copy");
        if (!lede) { lede = document.createElement("p"); lede.className = "carve-attention-copy"; main.appendChild(lede); }
        setNarrativeText(lede, "Your team gives priority products the judgment they need. Across the rest, weak visibility, conversion gaps and missed demand can stay hidden until performance is already lost.");
      }
      [].forEach.call(benefits.querySelectorAll('[data-framer-name="Badges"] p'), function (p) {
        var current = p.textContent.trim();
        if (ATTENTION_BADGES[current]) { p.textContent = ATTENTION_BADGES[current]; current = p.textContent; }
        var card = p.closest('[data-framer-name="Badges"]'); if (!card) return;
        var focus = current.indexOf("Priority products") === 0;
        var muted = current.indexOf("· unseen") !== -1 || current.indexOf("· waiting") !== -1;
        card.classList.toggle("carve-attention-focus", focus);
        card.classList.toggle("carve-attention-muted", muted);
      });
    }
    var features = document.querySelector('[data-framer-name="Features Container"]');
    if (features) {
      setNarrativeText(features.querySelector('[data-framer-name="Main Heading"] h2'), "The catalog performs better. Your team knows why.");
      setNarrativeText(features.querySelector('[data-framer-name="Subheading"] p'), "Carve helps recover slipping performance, improve unrealized potential and capture demand your catalog can already serve. Every result stays tied to the evidence and action behind it.");
    }
  }
  function injectSections() {
    injectHowItWorks();
    /* The product stories zoom out immediately after the single-product walkthrough, followed
       by the surfaces where those products perform and the control model behind each action. */
    var hiw = document.getElementById("cx-hiw");
    if (hiw && !document.getElementById(NEW_SECTIONS[0].id)) {
      var prev = hiw;
      NEW_SECTIONS.forEach(function (s) { var sec = band(s); prev.insertAdjacentElement("afterend", sec); prev = sec; });
    }
    var testi = document.querySelector('[data-framer-name="Testimonial Container"]');
    if (testi) testi.style.display = "none";
    var guarantee = document.getElementById("carve-guarantee-band");
    if (guarantee) guarantee.remove();
    /* remove sections we don't want (per request): generic final CTA + Founder's Note */
    var cta = document.querySelector('[data-framer-name="CTA Container"]');
    if (cta) cta.style.display = "none";
    var founder = document.querySelector("[data-framer-name=\"Founder's Note Container\"]");
    if (founder) founder.style.display = "none";
  }
  function apply() {
    var root = liveRoot(); if (!root) return;
    /* 1) exact text-node replacement (keeps span structure & Framer text styling) */
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, nodes = [];
    while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (tn) {
      var t = tn.nodeValue.trim();
      if (EXACT.hasOwnProperty(t) && tn.nodeValue.indexOf(EXACT[t]) === -1) { tn.nodeValue = tn.nodeValue.replace(t, EXACT[t]); return; }
      if (SHORT.hasOwnProperty(t) && tn.nodeValue.indexOf(SHORT[t]) === -1) { tn.nodeValue = tn.nodeValue.replace(t, SHORT[t]); }
    });
    /* 2) rolling-text button/nav labels */
    [].forEach.call(root.querySelectorAll('[class*="rolling-text-inner"]'), function (el) {
      var k = norm(el.textContent);
      if (ROLL.hasOwnProperty(k)) el.textContent = ROLL[k];
    });
    /* 3) brand image swaps (nav logo, footer lockup, logo ticker) */
    swapImages();
    /* 4) rebrand Ordara's own pricing section (names + price only) */
    rebrandPricing();
    /* 5) shape the attention-gap and outcome sections without changing their layout */
    shapeNarrative();
    /* 6) inject the rich carve.ac sections + guarantee, hide removed sections */
    injectSections();
    /* 7) footer + CTA buttons + nav links → only carve.ac-matching info / destinations */
    fixFooter();
    fixCtas();
    fixNav();
    killDeadLinks();   /* after nav/CTA wiring, so only truly decorative anchors are stripped */
    armReveals();      /* match Framer's scroll-in motion on our sections */
  }
  /* Hydration can replace the root once. Observe that short burst, coalesce mutations into
     animation frames, then disconnect; no recurring full-page scans while people scroll. */
  function start() {
    var queued = false, passes = 0, observer;
    function schedule() {
      if (queued || passes >= 12) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        if (!liveRoot()) return;
        passes++; apply();
        if (passes >= 12 && observer) observer.disconnect();
      });
    }
    schedule();
    [120, 420, 900, 1800].forEach(function (ms) { setTimeout(schedule, ms); });
    window.addEventListener("load", schedule, { once: true });
    if (window.MutationObserver) {
      observer = new MutationObserver(schedule);
      observer.observe(document.getElementById("main") || document.body, { childList: true, subtree: true });
      setTimeout(function () { observer.disconnect(); schedule(); }, 3500);
    }
  }
  Promise.all([
    fetch("./ordara-content.json").then(function (r) { return r.json(); }),
    fetch("./carve-replacements.json").then(function (r) { return r.json(); })
  ]).then(function (res) {
    var keys = res[0], vals = res[1];
    keys.forEach(function (k, i) { if (vals[i] !== undefined && vals[i] !== k) EXACT[k] = vals[i]; });
    Object.keys(HERO).forEach(function (k) { EXACT[k] = HERO[k]; });
    start();
  }).catch(function () { start(); });
})();

/* STATIC NO-DISPLAY HERO TEST — keeps the approved hero and static dot field. */
(function () {
  var queued = false;
  var navBound = false;
  var navTicking = false;

  function setImportant(element, property, value) {
    if (!element) return;
    if (
      element.style.getPropertyValue(property).trim() === value &&
      element.style.getPropertyPriority(property) === "important"
    ) return;
    element.style.setProperty(property, value, "important");
  }

  function paintTickerContrast() {
    [].forEach.call(
      document.querySelectorAll('[data-framer-name="Logo Ticker"]'),
      function (ticker) {
        setImportant(ticker, "-webkit-mask-image", "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)");
        setImportant(ticker, "mask-image", "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)");
        [].forEach.call(ticker.querySelectorAll('[data-framer-name="Logo"]'), function (wrapper) {
          setImportant(wrapper, "-webkit-filter", "none");
          setImportant(wrapper, "filter", "none");
          setImportant(wrapper, "opacity", "1");
        });
      }
    );
    [].forEach.call(
      document.querySelectorAll('[data-framer-name="Logo Ticker"] img'),
      function (image) {
        setImportant(image, "filter", "grayscale(1) brightness(0.24) contrast(1.08)");
        setImportant(image, "opacity", "0.92");
        setImportant(image, "mix-blend-mode", "normal");
      }
    );
  }

  function paintNavSurface(nav, overLight) {
    var ink = overLight ? "#1A1410" : "#F5F0E8";
    var surface = overLight ? "rgba(255, 255, 255, 0.94)" : "rgba(26, 20, 16, 0.86)";
    var border = overLight ? "rgba(26, 20, 16, 0.08)" : "rgba(255, 255, 255, 0.12)";
    var shadow = overLight
      ? "0 8px 28px rgba(26, 20, 16, 0.07)"
      : "0 10px 34px rgba(10, 7, 5, 0.16)";
    var buttonSurface = overLight ? "#F5F0E8" : "rgba(255, 255, 255, 0.07)";
    var buttonBorder = overLight ? "rgba(26, 20, 16, 0.08)" : "rgba(255, 255, 255, 0.14)";
    var container = nav.querySelector('[data-framer-name="Container"]');
    var button = nav.querySelector('[data-framer-name="Buttons"] a');

    nav.setAttribute("data-cx-surface", overLight ? "light" : "dark");
    if (container) {
      setImportant(container, "background", surface);
      setImportant(container, "background-color", surface);
      setImportant(container, "--border-color", border);
      setImportant(container, "border-color", border);
      setImportant(container, "box-shadow", shadow);
      setImportant(container, "backdrop-filter", "blur(18px)");
      setImportant(container, "-webkit-backdrop-filter", "blur(18px)");
    }

    [].forEach.call(
      nav.querySelectorAll('[data-framer-name="Navigation"] a, [data-framer-name="Navigation"] p'),
      function (text) {
        setImportant(text, "--framer-text-color", ink);
        setImportant(text, "color", ink);
      }
    );

    if (button) {
      setImportant(button, "background", buttonSurface);
      setImportant(button, "background-color", buttonSurface);
      setImportant(button, "--border-color", buttonBorder);
      setImportant(button, "border-color", buttonBorder);
      setImportant(button, "box-shadow", "none");
      [].forEach.call(button.querySelectorAll('[class*="rolling-text-inner"], [class*="rolling-text-inner"] span'), function (text) {
        setImportant(text, "--text", ink);
        setImportant(text, "color", ink);
      });
    }

    [].forEach.call(nav.querySelectorAll('[data-framer-name="Menu Button"] > div'), function (bar) {
      setImportant(bar, "background-color", ink);
    });

    [].forEach.call(nav.querySelectorAll(".carve-lockup"), function (lockup) {
      var source = overLight
        ? "./assets/carve/lockup-black.svg"
        : "./assets/carve/lockup-white.svg";
      if (lockup.getAttribute("src") !== source) lockup.setAttribute("src", source);
    });
  }

  function updateNavSurface() {
    navTicking = false;
    var hero = document.querySelector('[data-framer-name="Hero Container"]');
    var navs = [].slice.call(document.querySelectorAll("nav"));
    if (!hero || !navs.length) return;

    var overLight = true;

    document.documentElement.classList.toggle("cx-nav-over-light", overLight);
    document.documentElement.classList.toggle("cx-nav-over-dark", !overLight);
    navs.forEach(function (nav) { paintNavSurface(nav, overLight); });
    paintTickerContrast();
  }

  function queueNavSurface() {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(updateNavSurface);
  }

  function bindNavSurface() {
    if (navBound) {
      queueNavSurface();
      return;
    }
    navBound = true;
    window.addEventListener("scroll", queueNavSurface, { passive: true });
    window.addEventListener("resize", queueNavSurface);
    queueNavSurface();
  }

  function applyStaticHero() {
    queued = false;
    var hero = document.querySelector('[data-framer-name="Hero Container"]');
    if (!hero) return;

    var display = hero.querySelector('[data-framer-name="Bottom Stack"]');
    if (display) {
      display.hidden = true;
      display.setAttribute("aria-hidden", "true");
    }

    [].forEach.call(
      hero.querySelectorAll('[data-framer-name="Top Stack"] [data-nce-scroll]'),
      function (element) {
        element.removeAttribute("data-nce-scroll");
        element.removeAttribute("data-nce-scroll-delay");
      }
    );

    paintTickerContrast();
    document.documentElement.classList.add("cx-static-hero-ready");
    bindNavSurface();
    queueNavSurface();
    document.title = "Carve — Static no-display hero";
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(applyStaticHero);
  }

  [0, 80, 220, 500, 900, 1600, 2800, 5000, 8000].forEach(function (delay) {
    setTimeout(queue, delay);
  });

  /* Framer may replace the hydrated navbar after its first render. Keep this cheap
     child-list observer alive so every replacement receives the same surface state. */
  if (window.MutationObserver) {
    var observer = new MutationObserver(queue);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  window.addEventListener("load", queue, { once: true });
})();
