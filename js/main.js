"use strict";

(() => {
  const root = document.documentElement;

  /* Тема */
  const themeToggle = document.querySelector(".theme-toggle");
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const currentTheme = () => root.dataset.theme || (darkQuery.matches ? "dark" : "light");

  const updateThemeLabel = () => {
    const next = currentTheme() === "dark" ? "светлую" : "тёмную";
    themeToggle.setAttribute("aria-label", `Включить ${next} тему`);
  };

  if (themeToggle) {
    updateThemeLabel();
    darkQuery.addEventListener("change", updateThemeLabel);

    themeToggle.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("baza-theme", next);
      } catch {
        // без сохранения — тема действует до перезагрузки
      }
      updateThemeLabel();
    });
  }

  /* Мобильное меню */
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuToggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("nav--open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    };

    menuToggle.addEventListener("click", () => {
      setOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest(".nav__link")) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        menuToggle.focus();
      }
    });
  }

  /* Форма */
  const form = document.querySelector("#order-form");

  if (form) {
    const nameInput = form.elements.name;
    const phoneInput = form.elements.phone;
    const messageInput = form.elements.message;
    const status = form.querySelector(".form__status");

    // Кнопка «Заказать» у товара подставляет его название в сообщение
    document.querySelectorAll("[data-product]").forEach((link) => {
      link.addEventListener("click", () => {
        messageInput.value = `Хочу заказать: ${link.dataset.product}. Размер: `;
      });
    });

    const setError = (input, text) => {
      const error = form.querySelector(`#${input.id}-error`);
      error.textContent = text;
      input.setAttribute("aria-invalid", String(Boolean(text)));
      if (text) {
        input.setAttribute("aria-describedby", error.id);
      } else {
        input.removeAttribute("aria-describedby");
      }
    };

    const validate = () => {
      let firstInvalid = null;

      if (nameInput.value.trim().length < 2) {
        setError(nameInput, "Введите имя");
        firstInvalid = firstInvalid || nameInput;
      } else {
        setError(nameInput, "");
      }

      const digits = phoneInput.value.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 12) {
        setError(phoneInput, "Введите номер в формате +7 700 000 00 00");
        firstInvalid = firstInvalid || phoneInput;
      } else {
        setError(phoneInput, "");
      }

      return firstInvalid;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      status.textContent = "";

      const firstInvalid = validate();
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // TODO: здесь отправить данные формы на сервер (fetch) — сейчас заявка никуда не уходит
      status.textContent = `Спасибо, ${nameInput.value.trim()}! Мы перезвоним вам в ближайшее время.`;
      form.reset();
    });
  }

  /* Год в подвале */
  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
