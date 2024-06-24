"use strict";
console.log("connect");

document.addEventListener("DOMContentLoaded", function() {
  const registerForm = document.getElementById("registerForm");
  const profileForm = document.getElementById("profileForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
      event.preventDefault();
      resetValidationErrors(registerForm);

      if (validateForm(registerForm)) {
        console.log("Form is valid. Submitting...");
        registerForm.submit();
      } else {
        console.log("Form is invalid. Please check for errors.");
      }
    });
  }

  if (profileForm) {
    profileForm.addEventListener("submit", function(event) {
      event.preventDefault();
      resetValidationErrors(profileForm);

      if (validateForm(profileForm)) {
        console.log("Form is valid. Submitting...");
        profileForm.submit();
      } else {
        console.log("Form is invalid. Please check for errors.");
      }
    });
  }

  function validateForm(form) {
    let isFormValid = true;

    const usernameInput = form.querySelector('input[name="username"]');
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const passwordConfirmInput = form.querySelector('input[name="passwordConfirm"]');

    if (!isValidUsername(usernameInput.value)) {
      isFormValid = false;
      showValidationError(usernameInput, "Invalid username. Usernames must start with a letter and can contain letters, numbers, hyphens, and underscores. They should have 3 to 20 characters.");
    }

    if (!isValidEmail(emailInput.value)) {
      isFormValid = false;
      showValidationError(emailInput, "Invalid email address.");
    }

    if (!isValidPassword(passwordInput.value)) {
      isFormValid = false;
      showValidationError(passwordInput, "Invalid password. Passwords must have at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.");
    }

    if (passwordInput.value !== passwordConfirmInput.value) {
      isFormValid = false;
      showValidationError(passwordConfirmInput, "Passwords do not match.");
    }

    return isFormValid;
  }

  function isValidUsername(username) {
    const usernameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ][a-zA-ZÀ-ÖØ-öø-ÿ0-9_-]{2,20}$/;
    return usernameRegex.test(username);
  }

  function isValidEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  }
    

  function showValidationError(inputElement, errorMessage) {
    const formGroup = inputElement.closest(".form-group");
    let errorElement = formGroup.querySelector(".invalid-feedback");

    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.classList.add("invalid-feedback");
      formGroup.appendChild(errorElement);
    }

    errorElement.textContent = errorMessage;
    inputElement.classList.add("is-invalid");
  }

  function resetValidationErrors(form) {
    const errorMessages = form.querySelectorAll(".invalid-feedback");
    errorMessages.forEach(function(errorElement) {
      errorElement.textContent = "";
    });
  
    const invalidInputs = form.querySelectorAll(".is-invalid");
    invalidInputs.forEach(function(inputElement) {
      inputElement.classList.remove("is-invalid");
    });
  }
});

