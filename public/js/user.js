const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const signinFormButton = document.getElementById("signinFormButton");
const signupFormButton = document.getElementById("signupFormButton");
const signinForm = document.getElementById("signinForm");
const signupForm = document.getElementById("signupForm");
const alert = document.getElementById("alert");

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
    const res = await axios.post("https://yzuhyu.com/user/signin", entFormData);
    console.log(res.data.data);
    localStorage.setItem("jwtToken", res.data.data.token);
    window.location.href = "/user/profile";
  } catch (error) {
    if (error.response.status === 400) {
      const alertDiv = async function () {
        alert.style.display = "flex";
        alert.innerHTML = `<div class="massage bg-red-100 flex w-full relative">${error.response.data.errors}
        <div><button type="button" class="absolute" onclick="alert.style.display='none';" style="right:0;">X</button>
      </div>
      </div>`;
        setTimeout(function () {
          alert.style.display = "none";
        }, 5000);
      };
      alertDiv();
    }
  }
});

signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(signupForm);
  const entFormData = Object.fromEntries(formData);
  console.log([...formData]);

  try {
    const res = await axios.post("https://yzuhyu.com/user/signup", entFormData);
    console.log(res.data);
    localStorage.setItem("jwtToken", res.data.data.token);
    window.location.href = "/user/profile";
  } catch (error) {
    if (error.response.status === 400) {
      const alertDiv = async function () {
        alert.style.display = "flex";
        alert.innerHTML = `<div class="massage bg-red-100 flex w-full relative">${error.response.data.errors}
        <div><button type="button" class="absolute" onclick="alert.style.display='none';" style="right:0;">X</button>
      </div>
      </div>`;
        setTimeout(function () {
          alert.style.display = "none";
        }, 5000);
      };
      alertDiv();
    }
  }
});
