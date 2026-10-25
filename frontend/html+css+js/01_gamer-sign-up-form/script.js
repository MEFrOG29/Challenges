const form = document.querySelector(".auth-form");
const submitBtn = document.querySelector(".submit-btn");
const showBtn = document.querySelectorAll(".show-btn");
const checkbox = document.querySelector(".checkbox");
const accept = document.getElementById("accept");
const password = document.getElementById("password");
const checkPassword = document.getElementById("check-password");
const statusBar = document.querySelectorAll(".status-bar");
const fields = document.querySelectorAll(".field");

const customRules = {
  callsign: {
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: "Only Latin letters, numbers, _ or -",
  },
};

function validateField(input) {
  const formGroup = input.closest(".auth-form__field");
  const inputField = input.closest(".input-container");
  const field = Array.from(fields).find((f) => f.classList.contains(input.id));
  const status = field ? field.querySelector(".field-status") : null;

  if (!formGroup || !inputField) return;

  const errorSpan = formGroup.querySelector(".error-message");

  input.setCustomValidity("");

  if (input.id === "check-password" || input.id === "password") {
    if (password && checkPassword) {
      if (password.value !== checkPassword.value) {
        checkPassword.setCustomValidity("Passwords do not match");
      } else {
        checkPassword.setCustomValidity("");
      }
    }
  }

  const ruleName = input.dataset.rule;
  if (ruleName && customRules[ruleName]) {
    const rule = customRules[ruleName];
    let isInvalid = false;

    if (rule.pattern && !rule.pattern.test(input.value)) {
      isInvalid = true;
    }

    if (isInvalid) {
      input.setCustomValidity(rule.message);
    }
  }

  if (!input.checkValidity()) {
    inputField.classList.add("error");
    errorSpan.textContent = input.validationMessage;
    errorSpan.classList.add("show");
    status.textContent = "PENDING";
  } else {
    inputField.classList.remove("error");
    errorSpan.textContent = "";
    errorSpan.classList.remove("show");
    status.textContent = "COMPLETE";
  }
}

function toggleSubmitButton() {
  submitBtn.disabled = !form.checkValidity();
  if (submitBtn.disabled) {
    submitBtn.classList.add("disabled");
  } else {
    submitBtn.classList.remove("disabled");
  }
}

form.addEventListener(
  "blur",
  (event) => {
    const target = event.target;

    if (target.matches('input:not([type="submit"]):not([type="button"])')) {
      validateField(target);

      if (target.id === "password") {
        const checkPassword = document.getElementById("check-password");
        if (checkPassword && checkPassword.value !== "") {
          validateField(checkPassword);
        }
      }
    }
  },
  true,
);

function getPasswordDifficulty(password) {
  statusBar.forEach((sb) => {
    sb.classList.remove("complete");
  });
  let score = 0;

  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[.,\/#!$%\^&\*;:{}=\-_`~()?[\]]/.test(password)) score++;

  for (let i = 0; i < score; i++) {
    statusBar[i].classList.add("complete");
  }
}

form.addEventListener("input", (event) => {
  const target = event.target;
  if (target.matches('input:not([type="submit"]):not([type="button"])')) {
    if (target.id === "password" || target.id === "check-password") {
      const password = document.getElementById("password");
      const checkPassword = document.getElementById("check-password");
      if (password && checkPassword) {
        if (password.value === checkPassword.value) {
          checkPassword.setCustomValidity("");
          const cpContainer = checkPassword.closest(".input-container");
          if (cpContainer) cpContainer.classList.remove("error");
        } else {
          checkPassword.setCustomValidity("Passwords do not match");
        }
      }
    }
    if (password) {
      getPasswordDifficulty(password.value);
    }
    if (target.checkValidity()) {
      const formGroup = target.closest(".input-container");
      if (formGroup) formGroup.classList.remove("error");
    }
    toggleSubmitButton();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.checkValidity() && accept.checked) {
    const formData = new FormData(form);
    console.log("Данные готовы к отправке:", Object.fromEntries(formData));
  }
});

showBtn.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const input = button.parentElement.querySelector("input");
    input.type = input.type === "text" ? "password" : "text";
  });
});

checkbox.addEventListener("click", () => {
  if (checkbox.classList.contains("checked")) {
    checkbox.classList.remove("checked");
    accept.checked = false;
  } else {
    checkbox.classList.add("checked");
    accept.checked = true;
  }

  toggleSubmitButton();
});

toggleSubmitButton();
