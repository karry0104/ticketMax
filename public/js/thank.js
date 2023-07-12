const imgFigure = document.getElementById("imgFigure");
const image = document.getElementById("image");
const showName = document.getElementById("showName");
const showTime = document.getElementById("showTime");
const showHall = document.getElementById("showHall");
const orderId = document.querySelector(".orderId");
const orderTable = document.getElementById("orderTable");
const id = localStorage.getItem("orderId");

async function getpaidOrder() {
  const data = await axios.get(`https://yzuhyu.com/api/v1/order?id=${id}`);
  console.log(data.data);
  image.src = `/upload/main/${data.data.orders[0].show_id}_main.jpeg`;
  showName.textContent = `${data.data.showInfo[0].name}`;
  showTime.textContent = `${data.data.date} ${data.data.time}`;
  showHall.textContent = `${data.data.showInfo[0].hall_name}`;
  orderId.textContent = `${id}`;
  imgFigure.appendChild(image);

  data.data.orders.forEach((order) => {
    const tr = document.createElement("tr");

    const sectionTd = document.createElement("td");
    sectionTd.textContent = order.section;
    tr.appendChild(sectionTd);

    const seatTd = document.createElement("td");
    seatTd.textContent = order.seat_row + order.seat_number;
    tr.appendChild(seatTd);

    const priceTd = document.createElement("td");
    priceTd.textContent = order.price;
    tr.appendChild(priceTd);

    orderTable.appendChild(tr);
  });
}

getpaidOrder();
