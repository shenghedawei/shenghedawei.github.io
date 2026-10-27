/* 北京 11 月 · 使馆文化月历 — 交互脚本
   职责：① 滚动入场（IntersectionObserver）② 按国别筛选 ③ 尊重降级动效 */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. 滚动入场 ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // 错峰：同一批进入视口的元素间隔 70ms
          var delay = (entry.target.dataset.delay || (i * 70));
          setTimeout(function () { entry.target.classList.add("in"); }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2. 国别筛选 ---------- */
  var chips = document.querySelectorAll(".chip");
  var cards = document.querySelectorAll(".card");

  function applyFilter(value) {
    cards.forEach(function (card) {
      var match = (value === "all") || (card.dataset.country === value);
      card.classList.toggle("is-hidden", !match);
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", "true");
      applyFilter(chip.dataset.filter);
    });
  });

  // 动态注入隐藏样式（避免污染 css 文件）
  var style = document.createElement("style");
  style.textContent = ".card.is-hidden{display:none!important;}";
  document.head.appendChild(style);
})();
