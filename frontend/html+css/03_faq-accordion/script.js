const infoButtons = document.querySelectorAll(".card__question__top-btn");

infoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;
    const targetText = document.getElementById(targetId);

    if (button.classList.contains("active")) {
      button.classList.remove("active");
      targetText.classList.remove("show");
    } else {
      button.classList.add("active");
      targetText.classList.add("show");
    }
  });
});
