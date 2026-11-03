/* Lumière motion: Lenis + GSAP on one ticker. Expo-out reveals, quart-out UI, linear scrub.
   Start states are CSS-only under (prefers-reduced-motion: no-preference) + html.js, so the page is
   complete without JS or with reduced motion. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reveal = () => document.documentElement.classList.remove("js");
  const failSafe = setTimeout(reveal, 3000);

  /* Header */
  const header = $("#site-header");
  const onScroll = () => header && header.classList.toggle("is-solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const menu = $("#mobile-menu"), openBtn = $("#menu-btn"), closeBtn = $("#close-menu");
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle("open", open);
    openBtn && openBtn.setAttribute("aria-expanded", String(open));
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) closeBtn && closeBtn.focus(); else openBtn && openBtn.focus();
  };
  openBtn && openBtn.addEventListener("click", () => setMenu(true));
  closeBtn && closeBtn.addEventListener("click", () => setMenu(false));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && menu && menu.classList.contains("open")) setMenu(false); });

  /* Toasts fade after a while */
  setTimeout(() => $$(".message-toast").forEach((el) => { el.style.transition = "opacity .5s"; el.style.opacity = "0"; }), 5000);

  const boot = () => {
    if (!window.gsap || !window.ScrollTrigger) return reveal();
    clearTimeout(failSafe);
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    if (reduce) return reveal();

    if (window.Lenis) {
      const lenis = new window.Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    /* Desktop cursor ring, eased on the same ticker */
    const ring = $("#cursor");
    if (ring && fine) {
      let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
      addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; ring.classList.add("is-on"); }, { passive: true });
      document.addEventListener("pointerleave", () => ring.classList.remove("is-on"));
      $$("a, button, summary").forEach((el) => {
        el.addEventListener("pointerenter", () => ring.classList.add("is-link"));
        el.addEventListener("pointerleave", () => ring.classList.remove("is-link"));
      });
      gsap.ticker.add(() => { rx += (x - rx) * 0.18; ry += (y - ry) * 0.18; ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`; });
    }

    /* Hero arrival (settled in ~1.1 s) */
    const lines = $$(".hero-in .line > span");
    if (lines.length) {
      gsap.to(lines, { yPercent: 0, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, startAt: { yPercent: 110 } });
      gsap.to(".hero-fade", { opacity: 1, duration: 0.9, ease: "power4.out", stagger: 0.08, delay: 0.35 });
    }
    if ($("[data-hero-media]")) {
      gsap.fromTo("[data-hero-media]", { scale: 1.06 }, { scale: 1, duration: 1.8, ease: "expo.out" });
      gsap.to("[data-hero-media] img", { yPercent: 10, ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true } });
    }

    /* Signature: a framed picture opens to the full width as it rises */
    $$("[data-open]").forEach((el) => {
      const side = innerWidth < 768 ? 5 : 14;
      gsap.fromTo(el, { "--cx": side + "%", "--ci": "6%" }, {
        "--cx": "0%", "--ci": "0%", ease: "none",
        scrollTrigger: { trigger: el, start: "top 95%", end: "top 15%", scrub: true },
      });
      const img = $("img", el);
      if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });

    /* Gentle depth on paired pictures */
    $$("[data-drift]").forEach((el) => {
      const d = +el.dataset.drift || 6;
      gsap.fromTo(el, { yPercent: d }, { yPercent: -d, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });

    /* Entrances: once, at 88% */
    ScrollTrigger.batch(".rv", {
      start: "top 88%", once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true }),
    });

    /* Statement fills word by word */
    $$("[data-fill]").forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.setAttribute("aria-label", words.join(" "));
      el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w === "intention." ? "<em>intention</em>." : w}</span>`).join(" ");
      const spans = $$(".w", el);
      spans.forEach((s) => s.style.setProperty("--o", "0.2"));
      ScrollTrigger.create({
        trigger: el, start: "top 80%", end: "bottom 50%", scrub: true,
        onUpdate: (st) => { const p = st.progress * spans.length; spans.forEach((s, k) => s.style.setProperty("--o", String(0.2 + 0.8 * Math.min(1, Math.max(0, p - k))))); },
      });
    });

    /* Counters */
    $$("[data-count]").forEach((el) => {
      const end = +el.dataset.count, suffix = el.textContent.includes("+") ? "+" : "";
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.6, ease: "power4.out", delay: 0.5, onUpdate: () => { el.textContent = Math.round(o.v) + suffix; } });
    });
  };
  boot();
})();
