const btn = document.getElementById("submit-button");
const form = document.getElementById("payment-form");
const orderDeleteForm = document.getElementById("deleteOrder");
const deleteBtn = document.getElementById("deleteBtn");
const orderId = document.querySelector(".orderId");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const imgFigure = document.getElementById("imgFigure");
const showName = document.getElementById("showName");
const showTime = document.getElementById("showTime");
const showHall = document.getElementById("showHall");
const orderTable = document.getElementById("orderTable");
const images = document.getElementById("image");
const total = document.querySelector(".total");
const username = document.getElementById("username");
const email = document.getElementById("email");
const hiddenOrderId = document.getElementById("hiddenOrderId");
const hiddenTotal = document.getElementById("hiddenTotal");

const jwtToken = localStorage.getItem("jwtToken");

const handleErrorResponse = (errorMessage) => {
  const alertDiv = async () => {
    alert.style.display = "flex";
    alert.innerHTML = `
      <div class="massage bg-red-100 flex w-full relative">${errorMessage}
        <div>
          <button type="button" class="absolute" onclick="alert.style.display='none';" style="right:0;">X</button>
        </div>
      </div>
    `;
    setTimeout(() => {
      alert.style.display = "none";
    }, 5000);
  };
  alertDiv();
};

async function getPaymentData() {
  try {
    const paymentData = await axios.get(
      "https://yzuhyu.com/api/v1/ticket/checkout",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const data = paymentData.data;
    console.log(data);
    image.src = `/upload/main/${data.showId}_main.jpeg`;
    showName.textContent = `${data.orderData.showInfo[0].name}`;
    showTime.textContent = `${data.date} ${data.time}`;
    showHall.textContent = `${data.orderData.showInfo[0].hall_name}`;
    orderId.textContent = `${data.orderData.orderId}`;
    total.textContent = `${data.orderData.totalPrice}`;
    username.value = `${data.user.username}`;
    email.value = `${data.user.email}`;
    hiddenOrderId.value = `${data.orderData.orderId}`;
    hiddenTotal.value = `${data.orderData.totalPrice}`;
    imgFigure.appendChild(image);

    data.orderData.orders.forEach((order) => {
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
  } catch (error) {
    if (error.response.status === 401) {
      handleErrorResponse(error.response.data.errors);
      window.location.assign("/user");
    } else if (error.response.status === 400) {
      window.location.assign("/");
    }
  }
}
getPaymentData();

async function countdown() {
  const time = await axios.get("https://yzuhyu.com/api/v1/ticket/countDown");
  return time;
}

const x = setInterval(async function () {
  const now = new Date().getTime();

  const date = await countdown();
  const countDownDate = date.data.time;

  const distance = countDownDate - now;

  const minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const second = Math.floor((distance % (1000 * 60)) / 1000);

  minutes.textContent = minute.toString().padStart(2, "0");
  seconds.textContent = second.toString().padStart(2, "0");

  if (distance < 0) {
    clearInterval(x);
    minutes.textContent = "0";
    seconds.textContent = "0";
    //window.location.assign("/");
  }
}, 1000);

deleteBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  try {
    const res = await axios.delete(
      `https://yzuhyu.com/api/v1/order?id=${hiddenOrderId.value}`
    );
    if (res.data.message === "Order is canceled") {
      alert("已超過時間，訂單已取消");
    }

    window.location.assign("/");
  } catch (err) {
    console.log(err);
  }
});

btn.addEventListener("click", function handleClick() {
  btn.textContent = "Please wait...";
});

TPDirect.setupSDK(
  11327,
  "app_whdEWBH8e8Lzy4N6BysVRRMILYORF6UxXbiOFsICkz0J9j1C0JUlCHv1tVJC",
  "sandbox"
);

TPDirect.card.setup({
  fields: {
    number: {
      element: ".card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      element: ".expiration-date",
      placeholder: "MM / YY",
    },
    ccv: {
      element: ".card-ccv",
      placeholder: "後三碼",
    },
  },
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});
const submitButton = document.querySelector("#submit-button");
const cardViewContainer = document.querySelector("#container");

function onClick() {
  const formData = new FormData(form);
  const entFormData = Object.fromEntries(formData);
  console.log(entFormData);

  const token = localStorage.getItem("jwtToken");

  TPDirect.card.getPrime(async (result) => {
    if (result.status !== 0) {
      return;
    }

    const { prime } = result.card;

    try {
      const data = {
        prime,
        token,
        order: entFormData,
      };

      const goQueue = await axios.post("https://yzuhyu.com/api/v1/queue", data);
      console.log(goQueue.status);
      if (goQueue.data.message === "Order is canceled") {
        alert("已超過付款時間，請重新購票");
        window.location.assign(`/`);
      }

      async function checkPaid() {
        const result = await axios.post(
          "https://yzuhyu.com/api/v1/checkPaid",
          data
        );
        if (result.data.checkOrder === "Paid") {
          localStorage.setItem("orderId", `${hiddenOrderId.value}`);

          window.location.assign(`/order?id=${hiddenOrderId.value}`);
        }
      }
      setInterval(checkPaid, 500);
    } catch (err) {
      console.log(err);
    }
  });
}
