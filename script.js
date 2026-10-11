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

const typedLines = [...document.querySelectorAll(".typed-line")];
const greeting = ["Olá, seja", "bem-vindo!"];
const signature = ["Pedro Lima,", "aqui"];
const caret = document.querySelector(".caret");
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const typeText = async (lines) => {
  for (let i = 0; i < lines.length; i += 1) {
    typedLines[i].after(caret);
    for (const char of lines[i]) {
      typedLines[i].textContent += char;
      await wait(85);
    }
    await wait(120);
  }
};

const eraseText = async () => {
  for (let i = typedLines.length - 1; i >= 0; i -= 1) {
    typedLines[i].after(caret);
    while (typedLines[i].textContent.length) {
      typedLines[i].textContent = typedLines[i].textContent.slice(0, -1);
      await wait(40);
    }
  }
};

if (typedLines.length) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    signature.forEach((text, i) => (typedLines[i].textContent = text));
  } else {
    (async () => {
      await wait(400);
      await typeText(greeting);
      await wait(1600);
      await eraseText();
      await wait(350);
      await typeText(signature);
    })();
  }
}

const contactForm =document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector(".submit-btn");
  submitButton.disabled = true;
  formStatus.className = "form-status";
  formStatus.textContent = "Enviando...";

  try {
    const response = await fetch(contactForm.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(contactForm),
    });
    if (!response.ok) throw new Error(response.statusText);
    contactForm.reset();
    formStatus.classList.add("ok");
    formStatus.textContent = "Mensagem enviada! Retorno em breve.";
  } catch {
    formStatus.classList.add("error");
    formStatus.textContent = "Não foi possível enviar. Tente pelo e-mail ao lado.";
  } finally {
    submitButton.disabled = false;
  }
});
