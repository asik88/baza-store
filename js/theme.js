"use strict";

// Подключается в <head> без defer, чтобы тема применилась до отрисовки и не было вспышки.
(() => {
  document.documentElement.classList.add("js");

  try {
    const saved = localStorage.getItem("baza-theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.dataset.theme = saved;
    }
  } catch {
    // localStorage недоступен — остаётся системная тема
  }
})();
