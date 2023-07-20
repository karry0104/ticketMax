const path = window.location.pathname;
const parts = path.split("/");
const id = parts[parts.length - 2];
const queueCard = document.getElementById("queue");
const stepper = document.getElementById("stepper");
const queueMsg = document.getElementById("queue");
const message = document.getElementById("response");
const waitCount = document.getElementById("waitCount");
const word = document.getElementById("word");
const alert = document.getElementById("alert");

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
console.log(id);

const sendMessage = axios
  .post(
    ` https://ssub96p2v2.execute-api.ap-northeast-1.amazonaws.com/v1/mes${id}`,
    data
  )
  .then((response) => {
    console.log(response);
    const MessageId =
      response.data.SendMessageResponse.SendMessageResult.MessageId;
    message.textContent = `排隊序號： ${MessageId}`;

    function countTotal() {
      const countSqs = axios
        .post(
          ` https://8tqvd2l76i.execute-api.ap-northeast-1.amazonaws.com/prod/queue/${id}`
        )
        .then((response) => {
          console.log(response.data.messages);
          if (response.data.messages > 0) {
            waitCount.textContent = `${response.data.messages}`;
            queueCard.style.display = "flex";
            word.textContent = `位用戶在您前面`;
          } else {
            queueMsg.remove();
          }
        });
    }

    countTotal();

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
            const seatDataContainer =
              document.getElementById("seatDataContainer");
            const showName = document.getElementById("showName");
            const stage = document.getElementById("stage");
            const alertMsg = document.getElementById("alertMsg");
            const ticketMsg = document.getElementById("ticketMsg");
            const chooseMsg = document.getElementById("chooseMsg");
            const statusMsg = document.getElementById("statusMsg");
            alertMsg.innerHTML = `<div class="text-center text-base text-gray-500">購票過程請勿重新整理，否則須重新排隊</div>`;
            ticketMsg.innerHTML = `<div class="text-center text-base text-gray-500 mt-4">每次限購4張票</div>`;
            chooseMsg.innerHTML = `<div class="text-center text-2xl mt-16 text-black">請選擇座位</div>`;
            statusMsg.innerHTML = `<div class="statusInfo flex justify-center mt-4 text-black">
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
                  seatDiv.classList.toggle("showSeatId");
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
            ).innerHTML = `<button class="bg-yellow-500 rounded-md h-12 w-28 text-lg text-black" type="submit">確認座位</button>`;

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
  });

const form = document.getElementById("myForm");

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

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const selectedSeat = document.querySelectorAll(".showSeatId");

  const selectedSeatIds = Array.from(selectedSeat).map((seat) => seat.id);
  console.log(selectedSeatIds);

  if (selectedSeatIds.length === 0) {
    handleErrorResponse("請先選購座位");
    return;
  }

  if (selectedSeatIds.length > 4) {
    handleErrorResponse("一次最多選購4個座位");
    return;
  }

  const data = {
    showSeatId: selectedSeatIds,
    showId: id,
  };

  console.log(data);
  const jwtToken = localStorage.getItem("jwtToken");
  try {
    const res = await axios.post("https://yzuhyu.com/api/v1/order", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    window.location.assign("/checkout");
  } catch (error) {
    if (error.response.status === 400) {
      if (error.response.data.errors === "請先支付原訂單") {
        handleErrorResponse(error.response.data.errors);
        window.location.assign("/checkout");
      } else {
        handleErrorResponse(error.response.data.errors);
      }
    } else if (error.response.status === 401) {
      handleErrorResponse("請先登入");
      window.location.assign("/user");
    }
  }
});
