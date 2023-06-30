const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// Events Listeners
loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const loginFormData = new FormData(loginForm);
  const loginPayload = Object.fromEntries(loginFormData);

  try {
    await fetch("http://localhost:8080/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(loginPayload),
    });
    window.location.href = "http://localhost:8080/products";

    loginForm.reset();
  } catch (error) {
    console.log(error);
    window.location.href = "http://localhost:8080/";
  }
});

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const registerFormData = new FormData(registerForm);
  const registerPayload = Object.fromEntries(registerFormData);

  try {
    await fetch("http://localhost:8080/api/sessions/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerPayload),
    });
    window.location.href = "http://localhost:8080/products";
    registerForm.reset();
  } catch (error) {
    console.log(error);
    window.location.href = "http://localhost:8080/register";
  }
});

const logout = () => {
  fetch("http://localhost:8080/api/sessions/logout");
  window.location.href = "http://localhost:8080/";
};
