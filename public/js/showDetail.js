const path = window.location.pathname;
const parts = path.split("/");
const id = parts[parts.length - 2];

async function getShowData() {
  const seatBtn = document.getElementById("seatBtn");

  seatBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    window.location.assign(`/seat/${id}`);
  });
}
getShowData();
