const form = document.querySelector(".auth-form");
const submitBtn = document.querySelector(".submit-btn");
const showBtn = document.querySelectorAll(".show-btn");
const checkboxSpan = document.querySelector(".checkbox");
const accept = document.getElementById("accept");
const password = document.getElementById("password");
const checkPassword = document.getElementById("check-password");
const statusBar = document.querySelectorAll(".status-bar");
const fields = document.querySelectorAll(".field");
const scoreMobile = document.querySelector(".score-mobile");
const scoreDesktop = document.querySelector(".score-desktop");

const customRules = {
  callsign: {
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: "Only Latin letters, numbers, _ or -",
  },
};

function updateProgress() {
  let currentScore = 0;

  const inputsToTrack = [
    document.getElementById("callsign"),
    document.getElementById("email"),
    document.getElementById("password"),
    document.getElementById("check-password"),
    accept,
  ];

  inputsToTrack.forEach((input) => {
    if (!input) return;

    const lookupClass = input.id === "accept" ? "terms" : input.id;
    const fieldBlock = Array.from(fields).find((f) =>
      f.classList.contains(lookupClass),
    );
    const statusText = fieldBlock
      ? fieldBlock.querySelector(".field-status")
      : null;
    if (input.checkValidity() && (input.type !== "checkbox" || input.checked)) {
      currentScore++;
      if (statusText) statusText.textContent = "COMPLETE";
    } else {
      if (statusText) {
        statusText.textContent = input.id === "accept" ? "REQUIRED" : "PENDING";
      }
    }
  });

  if (scoreMobile) scoreMobile.textContent = currentScore;
  if (scoreDesktop) scoreDesktop.textContent = currentScore;
}

function validateField(input) {
  const formGroup = input.closest(".auth-form__field");
  const inputField = input.closest(".input-container");

  if (!formGroup || !inputField) return;

  const errorSpan = formGroup
    ? formGroup.querySelector(".error-message")
    : null;

  input.setCustomValidity("");

  if (input.id === "check-password" || input.id === "password") {
    if (password && checkPassword && password.value !== checkPassword.value) {
      checkPassword.setCustomValidity("Passwords do not match");
    }
  }

  const ruleName = input.dataset.rule;
  if (ruleName && customRules[ruleName]) {
    const rule = customRules[ruleName];
    if (rule.pattern && !rule.pattern.test(input.value)) {
      input.setCustomValidity(rule.message);
    }
  }

  if (inputField) {
    if (!input.checkValidity()) {
      inputField.classList.add("error");
      if (errorSpan) {
        errorSpan.textContent = input.validationMessage;
        errorSpan.classList.add("show");
      }
    } else {
      inputField.classList.remove("error");
      if (errorSpan) {
        errorSpan.textContent = "";
        errorSpan.classList.remove("show");
      }
    }
  }

  updateProgress();
}

function toggleSubmitButton() {
  const isValid = form.checkValidity() && accept.checked;
  submitBtn.disabled = !isValid;
  if (submitBtn.disabled) {
    submitBtn.classList.add("disabled");
  } else {
    submitBtn.classList.remove("disabled");
  }
}

function getPasswordDifficulty(password) {
  statusBar.forEach((sb) => sb.classList.remove("complete"));
  let difficultyScore = 0;

  if (/[a-z]/.test(password)) difficultyScore++;
  if (/[A-Z]/.test(password)) difficultyScore++;
  if (/[0-9]/.test(password)) difficultyScore++;
  if (/[.,\/#!$%\^&\*;:{}=\-_`~()?[\]]/.test(password)) difficultyScore++;

  for (let i = 0; i < difficultyScore; i++) {
    if (statusBar[i]) statusBar[i].classList.add("complete");
  }
}

form.addEventListener("input", (event) => {
  const target = event.target;
  if (
    target.matches(
      'input:not([type="submit"]):not([type="button"]):not([type="checkbox"])',
    )
  ) {
    validateField(target);
    if (target.id === "password" && checkPassword.value !== "") {
      validateField(checkPassword);
    }
    if (password) {
      getPasswordDifficulty(password.value);
    }
    toggleSubmitButton();
  }
});

form.addEventListener(
  "blur",
  (event) => {
    const target = event.target;

    if (
      target.matches(
        'input:not([type="submit"]):not([type="button"]):not([type="checkbox"])',
      )
    ) {
      validateField(target);
    }
  },
  true,
);

accept.addEventListener("change", () => {
  if (accept.checked) {
    checkboxSpan.classList.add("checked");
  } else {
    checkboxSpan.classList.remove("checked");
  }
  updateProgress();
  toggleSubmitButton();
});

const checkboxContainer = document.querySelector(".checkbox-container");
if (checkboxContainer) {
  checkboxContainer.addEventListener("click", () => {
    accept.checked = !accept.checked;
    accept.dispatchEvent(new Event("change"));
  });
}

showBtn.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const input = button.parentElement.querySelector("input");
    input.type = input.type === "text" ? "password" : "text";
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.checkValidity() && accept.checked) {
    const formData = new FormData(form);
    console.log("Данные готовы к отправке:", Object.fromEntries(formData));
  }
});

toggleSubmitButton();
updateProgress();
