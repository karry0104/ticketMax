const form = document.getElementById("form");
const message = document.getElementById("message");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const res = await axios.post("https://yzuhyu.com/admin/show", formData);

    showSuccessMessage();
  } catch (err) {
    console.log(err);
  }
});

function showSuccessMessage() {
  message.textContent = "Show created successfully";
  message.style.display = "block";
}
