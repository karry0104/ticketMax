const bgimage = document.querySelector(".bgimage");
const image = document.querySelector(".image");
const show = document.getElementById(".show");

const campaign = axios.get("https://yzuhyu.com/show/campaign").then((res) => {
  const campaignImage = res.data.campaign[0].image;
  const id = res.data.campaign[0].show_id;

  bgimage.innerHTML = `<div
        class="bg-cover"
        style="background-image: url('https://yzuhyu.com/uploads/${campaignImage}'); height: 430px"
      ></div>`;
});

const shows = axios
  .get("https://yzuhyu.com/api/v1/shows")
  .then((response) => {
    const shows = response.data.shows;

    shows.forEach((show) => {
      const showElement = createShowElement(show);
      document.getElementById("showsContainer").appendChild(showElement);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function createShowElement(show) {
  const container = document.createElement("a");
  container.href = `/show/${show.id}`;
  container.classList.add("max-w-[30%]");

  const showDiv = document.createElement("div");
  showDiv.classList.add(
    "mt-10",
    "mx-auto",
    "overflow-hidden",
    "bg-white",
    "rounded-lg",
    "shadow-lg",
    "grow"
  );

  const image = document.createElement("img");
  image.classList.add("object-cover", "w-full", "h-56");
  image.src = `/upload/main/${show.id}_main.jpeg`;
  image.alt = show.id;

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("py-5", "text-center");

  const nameHeading = document.createElement("h1");
  nameHeading.classList.add("name", "text-gray-700");
  nameHeading.innerText = show.name;

  const startTimeSpan = document.createElement("span");
  startTimeSpan.classList.add("startTime", "text-sm", "text-gray-500");
  startTimeSpan.innerText = `開賣時間：${show.start_time}`;

  infoDiv.appendChild(nameHeading);
  infoDiv.appendChild(startTimeSpan);

  showDiv.appendChild(image);
  showDiv.appendChild(infoDiv);

  container.appendChild(showDiv);

  return container;
}
