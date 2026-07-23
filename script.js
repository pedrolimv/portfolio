const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const storedTheme = localStorage.getItem("theme");

if (storedTheme === "light") {
  root.classList.add("light");
}

themeButton?.addEventListener("click", () => {
  root.classList.toggle("light");
  localStorage.setItem("theme", root.classList.contains("light") ? "light" : "dark");
});

const navLinks = [...document.querySelectorAll(".nav-dot")];
const sections = [...document.querySelectorAll("main section[id]")];

const syncNavDots = () => {
  const scrollMarker = window.innerHeight * 0.46;
  let activeIndex = 0;

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= scrollMarker) {
      activeIndex = index;
    }
  });

  navLinks.forEach((link, index) => {
    link.classList.toggle("active", index === activeIndex);
    link.classList.toggle("past", index < activeIndex);
  });
};

let ticking = false;

const requestNavSync = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    syncNavDots();
    ticking = false;
  });
};

syncNavDots();
window.addEventListener("scroll", requestNavSync, { passive: true });
window.addEventListener("resize", requestNavSync);

const budgetInput = document.querySelector("#budget-input");
const budgetButtons = [...document.querySelectorAll("[data-budget]")];

budgetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    budgetButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    budgetInput.value = button.dataset.budget;
  });
});
