const form = document.getElementById("form");
const message = document.getElementById("message");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  console.log([...formData]);

  try {
    const res = await axios.post("/admin/show", formData);
    console.log(res);
    showSuccessMessage();
  } catch (err) {
    console.log(err);
  }
});

function showSuccessMessage() {
  message.textContent = "Show created successfully";
  message.style.display = "block";
}
