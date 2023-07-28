import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;

const __dirname = path.resolve();
const filePath = path.join(__dirname, "/views/html/showDetailS3.html");

const client = new S3Client({
  region: bucketRegion,
});

export async function uplaodShowDetailToS3(
  showDetail: any,
  images: any,
  showId: number
) {
  try {
    const { name, introduction, singerIntroduction, showTime, hall } =
      showDetail;

    const date = showTime.split("T")[0];
    const time = showTime.split("T")[1];

    const file = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="/src/output.css" rel="stylesheet" />
          <link rel="icon" type="image/png" href="/src/favicon.png" />
          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
          <title>TicketMax</title>
          <style>
            #image {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          </style>
        </head>
        <body style="background-color: #ffffff">
          <div class="navbar shadow-md bg-white fixed z-50 top-0">
            <div class="flex-1">
              <a href="/" class="font-bold pl-4 normal-case text-4xl text-amber-300"
                >TicketMax</a
              >
            </div>
            <div class="flex-none">
              <ul
                class="menu menu-horizontal px-1 text-2xl font-bold text-indigo-800"
              >
                <li><a href="/user/profile">PROFILE</a></li>
              </ul>
            </div>
          </div>
          <div class="bg-white">
            <div class="relative mt-20 bg-white">
              <div class="bgimage" id="bgimage">
                <div
                  class="bg-cover blur"
                  style="
                    background-image: url('/upload/main/${showId}_main.jpeg');
                    height: 430px;
                  "
                ></div>
              </div>
              <div class="image bg-white" id="image">
                <img src="/upload/main/${showId}_main.jpeg" alt="main" />
              </div>
            </div>
      
            <div
              class="info mt-14 mx-auto flex flex-col justify-center items-center bg-white"
            >
              <div class="mt-6 w-7/12 font-mono">
                <div class="flex items-center py-4">
                  <div class="flex-grow h-px bg-gray-400"></div>
      
                  <span class="flex-shrink text-2xl text-gray-500 px-4 font-mono"
                    >歌手介紹</span
                  >
      
                  <div class="flex-grow h-px bg-gray-400"></div>
                </div>
              </div>
      
              <div
                class="singerIntro w-7/12 text-lg font-mono text-black"
                id="singerIntro"
              >${singerIntroduction}</div>
      
              <div class="mt-6 w-7/12 font-mono">
                <div class="flex items-center py-4">
                  <div class="flex-grow h-px bg-gray-400"></div>
      
                  <span class="flex-shrink text-2xl text-gray-500 px-4 font-mono"
                    >活動介紹</span
                  >
      
                  <div class="flex-grow h-px bg-gray-400"></div>
                </div>
              </div>
      
              <div class="showIntro w-7/12 text-lg font-mono text-black" id="showIntro">
              ${introduction}
              </div>
      
              <!-- <h1
              class="border-2 rounded-lg text-3xl mt-6 p-2 px-80 bg-amber-300 border-amber-300"
            >
              購票前請先登入
            </h1> -->
              <div class="mt-6 w-7/12 font-mono">
                <div class="flex items-center py-4">
                  <div class="flex-grow h-px bg-gray-400"></div>
      
                  <span class="flex-shrink text-2xl text-gray-500 px-4 font-mono"
                    >活動</span
                  >
      
                  <div class="flex-grow h-px bg-gray-400"></div>
                </div>
              </div>
              <div class="overflow-x-auto w-7/12 flex justify-between">
                <table class="table font-mono">
             
                  <thead class="text-xl">
                    <tr class="text-gray-500">
                      <th>演出時間</th>
                      <th>活動名稱</th>
                      <th>場地</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                   
                    <tr class="text-black">
                      <td>
                        <h3 class="showTime hidden"></h3>
                        <h3 class="date">${date}</h3>
                        <h3 class="time mt-3 ml-6">${time}</h3>
                      </td>
                      <td><h3 class="showName">${name}</h3></td>
                      <td><h3 class="showHall">${hall}</h3></td>
                      <th>
                        <div id="seatForm">
                          <button
                            id="seatBtn"
                            class="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 border rounded font-mono"
                            type="click"
                          >
                            我要買票
                          </button>
                        </div>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-6 w-7/12 font-mono">
                <h3 class="text-xl text-gray-500">座位圖僅供參考</h3>
                <div
                  class="seatChart w-7/12 mt-8"
                  id="seatChart"
                >
                  <img
                    src="/upload/chart/${showId}_chart.jpeg"
                    alt="seatChart"
                    class="chart-size"
                  />
                </div>
              </div>
            </div>
          </div>
          <footer class="footer p-4 bg-gray-100 text-lg mt-36">
            <div>
              <p>TicketMax© 2023</p>
            </div>
          </footer>
          <script src="/js/showDetail.js"></script>
        </body>
      </html>
      `;
    await fs.promises.writeFile(filePath, file, "utf8");

    fs.readFile(filePath, "utf8", async function (err, html) {
      if (err) {
        console.log(err);
        throw err;
      }

      const showDetailPath = `show/${showId}/index.html`;

      const uploadShow = async () => {
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: showDetailPath,
          Body: html,
          ContentType: "text/html",
        });

        try {
          const res = await client.send(command);
        } catch (err) {
          console.error(err);
        }
      };

      uploadShow();
    });

    const imagePath = `upload/main/${showId}_main.jpeg`;
    const chartPath = `upload/chart/${showId}_chart.jpeg`;

    const uploadImage = async () => {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: imagePath,
        Body: images.image[0].buffer,
        ContentType: images.image[0].mimetype,
      });

      try {
        await client.send(command);
      } catch (err) {
        console.error(err);
      }
    };

    const uploadChart = async () => {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: chartPath,
        Body: images.seatChart[0].buffer,
        ContentType: images.seatChart[0].mimetype,
      });

      try {
        await client.send(command);
      } catch (err) {
        console.error(err);
      }
    };

    uploadImage();
    uploadChart();

    return file;
  } catch (err) {
    console.log(err);
  }
}
