const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const showIntro = document.querySelectorAll(".showIntro");
const showName = document.querySelectorAll(".showName");
const showTime = document.querySelectorAll(".showTime");
const date = document.querySelector(".date");
const time = document.querySelector(".time");
const showHall = document.querySelectorAll(".showHall");
const bgimage = document.querySelector(".bgimage");
const image = document.querySelector(".image");
const seatChart = document.getElementById("seatChart");
async function getShowData() {
  const showDetail = await axios.get(`/api/v1/show?id=${id}`);
  console.log(showDetail.data);

  document.getElementById(
    "image"
  ).innerHTML = `<img src="http://localhost:3000/uploads/${showDetail.data.show[0].image}" alt="seatChart" >`;

  document.getElementById("bgimage").innerHTML = `<div
  class="bg-cover blur"
  style="background-image: url('http://localhost:3000/uploads/${showDetail.data.show[0].image}'); height: 430px"
></div>`;

  document.querySelector(
    ".singerIntro"
  ).innerText = `${showDetail.data.show[0].singer_introduction}`;

  showName.forEach((el) => {
    el.textContent = `${showDetail.data.show[0].name}`;
  });

  showIntro.forEach((el) => {
    el.textContent = `${showDetail.data.show[0].introduction}`;
  });

  showTime.forEach((el) => {
    const value = (el.textContent = `${showDetail.data.show[0].show_time}`);
    const date = value.substr(0, 10);
    const time = value.substr(11);

    document.querySelector(".date").innerText = `${date}`;
    document.querySelector(".time").innerText = `${time}`;
  });

  showHall.forEach((el) => {
    el.textContent = `${showDetail.data.show[0].hall_name}`;
  });

  seatChart.innerHTML = `<img src="http://localhost:3000/uploads/${showDetail.data.show[0].seat_chart}" alt="seatChart" class="chart-size ">`;
  console.log(id);
  document.getElementById(
    "seatForm"
  ).innerHTML = `<form action="/ticket?id=${id}" method="POST">
    <input type="hidden" name="id" value="${id}" />
    <button class="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 border rounded font-mono" type="submit">我要買票</button>
  </form>`;
  // document.getElementById("seatForm").innerHTML = `
  //   <button id="seatBtn" class="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 border rounded font-mono" type="click">我要買票</button>
  // `;

  // const seatBtn = document.getElementById("seatBtn");

  // seatBtn.addEventListener("click", async function (e) {
  //   e.preventDefault();

  //   window.location.assign(
  //     `https://s3.ap-northeast-1.amazonaws.com/ticketmax.yzuhyu.com/${id}/showSeat.html`
  //   );
  // });
}
getShowData();
