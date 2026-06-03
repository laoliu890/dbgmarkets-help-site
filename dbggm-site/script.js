const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const slides = [...document.querySelectorAll("[data-slide]")];
const dots = [...document.querySelectorAll("[data-dot]")];
const toast = document.querySelector("[data-toast]");
let activeSlide = 0;
let slideTimer;

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

const setActiveSlide = (index) => {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeSlide);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSlide);
  });
};

const startSlider = () => {
  if (!slides.length) return;
  window.clearInterval(slideTimer);
  slideTimer = window.setInterval(() => {
    setActiveSlide(activeSlide + 1);
  }, 5200);
};

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setActiveSlide(Number(dot.dataset.dot));
    startSlider();
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  header.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
});

const contactModal = document.querySelector("[data-contact-modal]");
const contactModalTitle = document.querySelector("[data-contact-title]");
const contactQrLabel = document.querySelector("[data-contact-qr-label]");
const contactModalNote = document.querySelector("[data-contact-note]");
const contactTriggers = [...document.querySelectorAll("[data-contact-trigger]")];
const contactStack = document.querySelector(".floating-contact-stack");
const floatingContactTriggers = contactStack
  ? [...contactStack.querySelectorAll("[data-contact-trigger]")]
  : [];
const contactEntry = document.querySelector("#contact");

const contactCopy = {
  qq: {
    title: "QQ 咨询二维码",
    label: "QQ",
    note: "使用 QQ 扫描二维码，咨询开户注册、入金、出金和账户使用流程。",
  },
  whatsapp: {
    title: "WhatsApp 咨询二维码",
    label: "WhatsApp",
    note: "使用 WhatsApp 扫描二维码，咨询账户流程和使用问题。",
  },
  telegram: {
    title: "Telegram 咨询二维码",
    label: "TG",
    note: "使用 Telegram 扫描二维码，咨询开户注册和平台使用流程。",
  },
  email: {
    title: "邮箱联系二维码",
    label: "邮箱",
    note: "扫描二维码查看邮箱联系方式，发送问题时建议附上流程节点或后台提示。",
  },
};

const closeContactModal = () => {
  if (!contactModal) return;
  contactModal.hidden = true;
  document.body.classList.remove("modal-open");
};

const openContactModal = (type) => {
  if (!contactModal) return;
  const copy = contactCopy[type] || contactCopy.qq;
  contactModalTitle.textContent = copy.title;
  contactQrLabel.textContent = copy.label;
  contactQrLabel.dataset.qrLabel = copy.label;
  contactModalNote.textContent = copy.note;
  contactModal.hidden = false;
  document.body.classList.add("modal-open");
};

if (contactStack && floatingContactTriggers.length) {
  const contactToggle = document.createElement("button");
  contactToggle.className = "floating-contact-main";
  contactToggle.type = "button";
  contactToggle.setAttribute("aria-expanded", "false");
  contactToggle.setAttribute("aria-label", "打开联系方式");
  contactToggle.textContent = "咨询";

  const contactPanel = document.createElement("div");
  contactPanel.className = "floating-contact-panel";

  floatingContactTriggers.forEach((trigger) => contactPanel.appendChild(trigger));
  contactStack.append(contactToggle, contactPanel);

  contactToggle.addEventListener("click", () => {
    const isOpen = contactStack.classList.toggle("is-open");
    contactToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

contactTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    contactStack?.classList.remove("is-open");
    contactStack
      ?.querySelector(".floating-contact-main")
      ?.setAttribute("aria-expanded", "false");
    openContactModal(trigger.dataset.contactType);
  });
});

document.addEventListener("click", (event) => {
  if (!contactStack || contactStack.contains(event.target)) return;
  contactStack.classList.remove("is-open");
  contactStack
    .querySelector(".floating-contact-main")
    ?.setAttribute("aria-expanded", "false");
});

if (contactEntry && "IntersectionObserver" in window) {
  const contactObserver = new IntersectionObserver(
    ([entry]) => {
      document.body.classList.toggle("contact-rail-hidden", entry.isIntersecting);
    },
    { threshold: 0.18 },
  );
  contactObserver.observe(contactEntry);
}

document.querySelectorAll("[data-contact-close]").forEach((button) => {
  button.addEventListener("click", closeContactModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeContactModal();
});

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm && toast) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2600);
  });
}

const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!activeEntry) return;

      sectionLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${activeEntry.target.id}`);
      });
    },
    {
      rootMargin: "-36% 0px -52% 0px",
      threshold: [0, 0.2, 0.5, 0.8],
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}
window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();
startSlider();
