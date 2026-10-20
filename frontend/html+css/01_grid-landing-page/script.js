const openBtn = document.getElementById("openBtn");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

openBtn.addEventListener("click", () => {
  if (sideMenu.classList.contains("active")) {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
    openBtn.classList.remove("close");
  } else {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
    openBtn.classList.add("close");
  }
});

overlay.addEventListener("click", () => {
  sideMenu.classList.remove("active");
  overlay.classList.remove("active");
  openBtn.classList.remove("close");
});
