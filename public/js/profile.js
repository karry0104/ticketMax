const name = document.getElementById("name");
const email = document.getElementById("email");

const jwtToken = localStorage.getItem("jwtToken");
console.log(jwtToken);

axios
  .get("http://13.115.196.55/api/v1/user/profile", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
  })
  .then((response) => {
    console.log(response);
    name.textContent = `${response.data.data.username}`;
    email.textContent = `${response.data.data.email}`;
  })
  .catch((error) => {
    if (error.response) {
      console.log(error.response.data.errors);
      window.location.assign("/user");
    } else if (error.request) {
      console.log("No response received");
    } else {
      console.log("Error:", error.message);
      alert(error.message);
      window.location.assign("/user");
    }
  });
