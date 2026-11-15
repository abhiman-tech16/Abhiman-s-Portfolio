/* ==========================================================
   SETTINGS: fill these in when you have the details.
   Anything left empty stays hidden, so the site never shows
   a broken or fake link.
   ========================================================== */
var SITE = {
  // Full profile links, for example "https://www.linkedin.com/in/your-name"
  linkedin: "",
  github: ""
};

/* ---------- helpers ---------- */
function isWebUrl(value) {
  try {
    var url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch (error) {
    return false;
  }
}

function openInNewTab(link, url) {
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
}

/* 1. LinkedIn and GitHub links: shown only when a link is set */
document.querySelectorAll("[data-social]").forEach(function (link) {
  var url = SITE[link.getAttribute("data-social")];
  if (isWebUrl(url)) {
    openInNewTab(link, url);
    link.hidden = false;
  }
});

/* 2. Phone menu: open, close, and close again after tapping a link */
var menuButton = document.getElementById("menu-button");
var menu = document.getElementById("menu");

function closeMenu() {
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", function () {
  var isOpen = menu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

menu.addEventListener("click", function (event) {
  if (event.target.tagName === "A") closeMenu();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeMenu();
});

/* 3. Fade in items when you scroll to them */
document.documentElement.classList.add("js");
var items = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  var watcher = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        watcher.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(function (item) { watcher.observe(item); });
} else {
  items.forEach(function (item) { item.classList.add("show"); });
}

/* 4. Depth effect: layers in the hero move by different amounts with the mouse */
var hero = document.getElementById("top");
var canMove = window.matchMedia &&
              window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
              !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canMove) {
  var target = { x: 0, y: 0 };    // where the mouse is (-0.5 to 0.5)
  var current = { x: 0, y: 0 };   // where the layers are now (eases toward target)
  var running = false;

  function update() {
    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;
    hero.style.setProperty("--mx", current.x.toFixed(4));
    hero.style.setProperty("--my", current.y.toFixed(4));

    var moving = Math.abs(target.x - current.x) > 0.001 || Math.abs(target.y - current.y) > 0.001;
    if (moving) { requestAnimationFrame(update); } else { running = false; }
  }

  function start() {
    if (!running) { running = true; requestAnimationFrame(update); }
  }

  hero.addEventListener("mousemove", function (event) {
    var box = hero.getBoundingClientRect();
    target.x = (event.clientX - box.left) / box.width - 0.5;
    target.y = (event.clientY - box.top) / box.height - 0.5;
    start();
  });

  hero.addEventListener("mouseleave", function () {
    target.x = 0;
    target.y = 0;
    start();
  });
}

/* 5. Footer year */
document.getElementById("year").textContent = new Date().getFullYear();
