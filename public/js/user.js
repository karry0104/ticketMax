const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const signinFormButton = document.getElementById("signinFormButton");
const signupFormButton = document.getElementById("signupFormButton");
const signinForm = document.getElementById("signinForm");
const signupForm = document.getElementById("signupForm");

signupButton.addEventListener("click", () => {
  if (signupForm.style.display === "none") {
    signupForm.style.display = "block";
    signinForm.style.display = "none";
  }
});

loginButton.addEventListener("click", () => {
  if (signinForm.style.display === "none") {
    signinForm.style.display = "block";
    signupForm.style.display = "none";
  }
});

signinForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(signinForm);
  const entFormData = Object.fromEntries(formData);
  console.log([...formData]);

  try {
    const res = await axios.post(
      "http://13.115.196.55/user/signin",
      entFormData
    );
    console.log(res.data.data);
    localStorage.setItem("jwtToken", res.data.data.token);
    window.location.href = "/user/profile";
  } catch (err) {
    console.log(err);
  }
});

signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(signupForm);
  const entFormData = Object.fromEntries(formData);
  console.log([...formData]);

  try {
    const res = await axios.post(
      "http://13.115.196.55/user/signup",
      entFormData
    );
    console.log(res.data);
    localStorage.setItem("jwtToken", res.data.data.token);
    window.location.href = "/user/profile";
  } catch (err) {
    console.log(err);
  }
});
