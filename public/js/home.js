const bgimage = document.querySelector(".bgimage");
const image = document.querySelector(".image");
const show = document.getElementById(".show");

const campaign = axios.get("http://13.115.196.55/show/campaign").then((res) => {
  console.log(res);
  const campaignImage = res.data.campaign[0].image;
  const id = res.data.campaign[0].show_id;
  console.log(id);

  // image.innerHTML = `<a href="/show/detail?id=${id}"><img src="http://localhost:3000/uploads/${campaignImage}"  >`;

  bgimage.innerHTML = `<a href="/show?id=${id}"><div
        class="bg-cover"
        style="background-image: url('http://13.115.196.55/uploads/${campaignImage}'); height: 430px"
      ></div>`;
});

const shows = axios
  .get("http://13.115.196.55/api/v1/shows")
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
  image.src = `http://13.115.196.55/uploads/${show.image}`;
  image.alt = show.id;

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("py-5", "text-center");

  const nameHeading = document.createElement("h1");
  nameHeading.classList.add("name");
  nameHeading.innerText = show.name;

  const startTimeSpan = document.createElement("span");
  startTimeSpan.classList.add(
    "startTime",
    "text-sm",
    "text-gray-700",
    "dark:text-gray-200"
  );
  startTimeSpan.innerText = `開賣時間：${show.start_time}`;

  infoDiv.appendChild(nameHeading);
  infoDiv.appendChild(startTimeSpan);

  showDiv.appendChild(image);
  showDiv.appendChild(infoDiv);

  container.appendChild(showDiv);

  return container;
}
