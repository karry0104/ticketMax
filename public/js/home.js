const bgimage = document.querySelector(".bgimage");
const image = document.querySelector(".image");

const campaign = axios.get("/show/campaign").then((res) => {
  console.log(res);
  const campaignImage = res.data.campaign[7].image;
  const id = res.data.campaign[7].show_id;
  console.log(id);

  // image.innerHTML = `<a href="/show/detail?id=${id}"><img src="http://localhost:3000/uploads/${campaignImage}"  >`;

  bgimage.innerHTML = `<a href="/show/detail?id=${id}"><div
        class="bg-cover"
        style="background-image: url('http://localhost:3000/uploads/${campaignImage}'); height: 430px"
      ></div>`;
});
