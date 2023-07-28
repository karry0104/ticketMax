const name = document.getElementById("name");
const email = document.getElementById("email");

const jwtToken = localStorage.getItem("jwtToken");

axios
  .get("https://yzuhyu.com/api/v1/user/profile", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
  })
  .then((response) => {
    name.textContent = `${response.data.data.username}`;
    email.textContent = `${response.data.data.email}`;
  })
  .catch((error) => {
    if (error.response) {
      window.location.assign("/user");
    } else if (error.request) {
    } else {
      alert(error.message);
      window.location.assign("/user");
    }
  });
