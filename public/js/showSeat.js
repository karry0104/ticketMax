const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const stepper = document.getElementById("stepper");
const queueMsg = document.getElementById("queue");
const message = document.getElementById("response");
const waitCount = document.getElementById("waitCount");
const word = document.getElementById("word");

function generateRandomString(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomCodeArray = Array.from({ length: length }, () =>
    charset.charAt(Math.floor(Math.random() * charset.length))
  );
  return randomCodeArray.join("");
}

const randomString = generateRandomString(10);

const data = {
  data: {
    id,
    randomString,
  },
};

console.log(data.data);

const sendMessage = axios
  .post(
    `https://llibq3igv0.execute-api.ap-northeast-1.amazonaws.com/v1/mes${id}`,
    data
  )
  .then((response) => {
    console.log(response);
    const MessageId =
      response.data.SendMessageResponse.SendMessageResult.MessageId;
    message.textContent = `排隊序號： ${MessageId}`;

    const sqs = axios.post("/checkSQS", { id }).then((res) => {
      if (res.data.data > 0) {
        waitCount.textContent = `${res.data.data}`;
        word.textContent = `位用戶在您前面`;
      } else {
        queueMsg.remove();
      }
    });
  })
  .catch((error) => {
    console.error(error);
  });

function fetchData() {
  const getSeatData = axios
    .post(
      `https://18jihetbil.execute-api.ap-northeast-1.amazonaws.com/prod/seat/${id}`,
      data
    )
    .then((response) => {
      console.log(response.data);
      console.log(response.data.data.checkKey);
      if (response.data.data.checkKey === 1) {
        const data = JSON.parse(response.data.showSeat);
        myForm.className = "w-full flex flex-col justify-center";
        const seatDataContainer = document.getElementById("seatDataContainer");
        const showName = document.getElementById("showName");
        const stage = document.getElementById("stage");
        const alertMsg = document.getElementById("alertMsg");
        const chooseMsg = document.getElementById("chooseMsg");
        const statusMsg = document.getElementById("statusMsg");
        // stepper.innerHTML = ``;
        alertMsg.innerHTML = `<div class="text-center text-base text-gray-500">購票過程請勿重新整理，否則須重新排隊</div>`;
        chooseMsg.innerHTML = `<div class="text-center text-2xl mt-16">請選擇座位</div>`;
        statusMsg.innerHTML = `<div class="statusInfo flex justify-center mt-4">
        <div
          class="h-8 w-8 border border-gray-300 rounded-md bg-white"
        ></div>
        <div class="ml-4 mr-8 my-auto">空位</div>

        <div
          class="h-8 w-8 border border-yellow-500 rounded-md bg-yellow-500"
        ></div>
        <div class="ml-4 mr-8 my-auto">目前選位</div>
        <div
          class="h-8 w-8 border border-gray-300 rounded-md bg-gray-300"
        ></div>
        <div class="ml-4 my-auto">已售出</div>
      </div>`;
        showName.textContent = `${data[0].name}`;
        stage.innerHTML = `<div class="bg-gray-100 w-1/2 text-center text-lg h-20 font-mono py-6">Stage</div>`;

        const seatArr = data.forEach((seat) => {
          const seatDiv = document.createElement("div");
          seatDiv.id = seat.id;
          seatDiv.className =
            "seat w-12 h-12 ml-2 mb-8 border border-gray-300 rounded-md text-center";
          seatDiv.textContent = seat.seat_row + seat.seat_number;

          if (seat.status === "NotReserved") {
            seatDiv.classList.add("bg-white");
            seatDiv.addEventListener("click", () => {
              seatDiv.classList.add("showSeatId");
              seatDiv.setAttribute("value", seat.id);
              seatDiv.classList.toggle("bg-yellow-500");
              seatDiv.classList.toggle("border-yellow-500");
            });

            //seat data
          } else if (seat.status === "Reserved" || seat.status === "Paid") {
            seatDiv.classList.add("bg-gray-300");
            seatDiv.classList.add("text-gray-500");

            seatDiv.setAttribute("disabled", true);
          }

          seatDataContainer.appendChild(seatDiv);
        });

        document.getElementById(
          "btn"
        ).innerHTML = `<button class="bg-yellow-500 rounded-md h-12 w-28 text-lg" type="submit">確認座位</button>`;

        queueMsg.remove();
      } else {
        setTimeout(fetchData, 1000);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
fetchData();

const form = document.getElementById("myForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const selectedSeat = document.querySelectorAll(".showSeatId");

  const selectedSeatIds = Array.from(selectedSeat).map((seat) => seat.id);

  const data = {
    showSeatId: selectedSeatIds,
    showId: id,
  };

  console.log(data);
  try {
    const res = await axios.post("/order", data);
    console.log(res);
    if (res.data === "sorry, no ticket") {
      alert("sorry, no ticket");
      location.reload();
    } else {
      window.location.assign("/ticket/checkout");
    }
  } catch (err) {
    console.log(err);
  }
});
