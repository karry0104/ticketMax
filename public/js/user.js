const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");

signupButton.addEventListener("click", () => {
  const signinForm = document.getElementById("signinForm");

  const signupForm = document.getElementById("signupForm");

  if (signupForm.style.display === "none") {
    signupForm.style.display = "block";
    signinForm.style.display = "none";
  }
});

loginButton.addEventListener("click", () => {
  const signinForm = document.getElementById("signinForm");

  const signupForm = document.getElementById("signupForm");

  if (signinForm.style.display === "none") {
    signinForm.style.display = "block";
    signupForm.style.display = "none";
  }
});
