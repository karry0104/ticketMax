// const paymentData = axios
//   .get("/ticket/checkout")
//   .then((res) => console.log(res));

async function getPaymentData() {
  const paymentData = await axios.get("/ticket/checkout");
  console.log(paymentData);
}
getPaymentData();

const btn = document.getElementById("submit-button");
const form = document.getElementById("payment-form");
const orderDeleteForm = document.getElementById("deleteOrder");
const deleteBtn = document.getElementById("deleteBtn");
const orderId = document.querySelector(".orderId");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const orderIdValue = orderId.innerText;
const total = document.querySelector(".total");
const totalValue = total.innerText;

// async function timer() {
//   axios
//     .get("/ticket/countDown")
//     .then((res) => {
//       console.log(res);
//       // minutes.textContent = padZero(res.data.minutes);
//       // seconds.textContent = padZero(res.data.seconds);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }
// setInterval(timer, 1000);

deleteBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const formData = new FormData(orderDeleteForm);

  try {
    const orderId = "<%= orderData.orderId %>";
    const res = await axios.delete(`/order?id=${orderId}`, formData);
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
  formData.append("orderId", orderIdValue);
  formData.append("total", totalValue);
  const entFormData = Object.fromEntries(formData);

  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)jwtoken\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

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

      const goQueue = await axios.post("/queue", data);
      console.log(goQueue.status);
      if (goQueue.data.message === "Order is canceled") {
        alert("已超過付款時間，請重新購票");
        window.location.assign(`/`);
      }

      async function checkPaid() {
        const result = await axios.post("/checkPaid", data);
        if (result.data.checkOrder === "Paid") {
          window.location.assign(`/order?id=${orderIdValue}`);
        }
      }
      setInterval(checkPaid, 500);
    } catch (err) {
      console.log(err);
    }
  });
}
