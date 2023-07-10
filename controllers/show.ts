import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import { NextFunction, Request, Response } from "express";
import { fileTypeFromBuffer } from "file-type";
import * as showModel from "../models/show.js";
import * as cache from "../utils/cache.js";
import { prepare } from "../utils/cache.js";
import { uplaodShowDetailToS3 } from "../models/s3.js";

const __dirname = path.resolve();

export async function showForm(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/html/createShow.html"));
}

export async function campaignForm(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/html/createCampaign.html"));
}

export async function showDetailPage(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/html/showDetail.html"));
}

export async function homePage(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/html/index.html"));
}

export async function createShow(req: Request, res: Response) {
  try {
    const images = req.files;
    const getHallId = Number(await showModel.getHallIdByName(req.body.hall));
    const getShowSeatByHallId = await showModel.getShowSeatByHallId(getHallId);
    const ShowSeatIds = getShowSeatByHallId.map((result) => result.id);

    if (!images || typeof images !== "object") {
      return;
    }

    const imagesArray = Object.values(images);
    if (!Array.isArray(imagesArray) || imagesArray.length === 0) {
      return;
    }

    const createImages = imagesArray.map((image, i) => {
      return {
        ...req.body,
        hallId: getHallId,
        image: imagesArray[i]?.[0]?.filename || "",
        seatChart: imagesArray[i + 1]?.[0]?.filename || "",
      };
    });

    const showId = await showModel.createShow(createImages[0]);
    console.log("show" + showId);

    await uplaodShowDetailToS3(createImages[0], images, showId as number);

    // if (Array.isArray(ShowSeatIds) && ShowSeatIds.length > 0) {
    //   const showSeat = ShowSeatIds.map((seat) => {
    //     return {
    //       status: "NotReserved",
    //       price: req.body.price,
    //       showId: showId as number,
    //       hallSeatId: seat,
    //     };
    //   });
    //   await showModel.createShowSeat(showSeat);
    // }

    //put new seat to cache
    // if (showId) {
    //   const seatData = await showModel.getShowSeat(showId);

    //   await cache.set(`showSeat:${showId}`, JSON.stringify(seatData));
    //   const showSeat = await showModel.getShowSeatByShowId(showId);
    //   if (showSeat) {
    //     showSeat.map(async (seat) => {
    //       await prepare(seat.id);
    //       return;
    //     });
    //   }
    // }

    res.send("sucess to create show");
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "create product failed" });
  }
}

// export async function updateShowToS3() {
//   try {
//     const showDetailFile = fs.readFile(
//       "showDetail.html",
//       "utf8",
//       (err, data) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//       }
//     );
//     const modified = showDetailFile.replace(
//       `<div
//         class="singerIntro w-7/12 text-lg font-mono"
//         id="singerIntro"
//       ></div>`,
//       `${1}`
//     );
//   } catch (err) {
//     if (err instanceof Error) {
//       console.log(err.message);
//       return;
//     }
//   }
// }

export async function createShowCampaign(req: Request, res: Response) {
  const { id } = req.body;
  const image = req.files;

  try {
    if (image && typeof image === "object") {
      if (Array.isArray(image)) {
        console.log(image[0].filename);
      } else if (image.image && Array.isArray(image.image)) {
        const imageName = image.image[0].filename;

        await showModel.createShowCampaign(id, imageName);
      }
    }
    res.send("sucess to create campaign");
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "create campaign failed" });
  }
}

export async function getShowCampagin(req: Request, res: Response) {
  try {
    const campaign = await showModel.getShowCampaign();

    res.status(200).json({ campaign });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
  }
}

export async function getShows(req: Request, res: Response) {
  try {
    const shows = await showModel.getShows();

    res.status(200).json({ shows });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "get shows failed" });
  }
}

export async function getShow(req: Request, res: Response) {
  try {
    const id = Number(req.query.id);

    const show = await showModel.getShow(id);

    res.status(200).json({ show });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "get show failed" });
  }
}

// async function red() {
//   const seatData = await showModel.getShowSeat(69);

//   await cache.set(`showSeat:${69}`, JSON.stringify(seatData));
//   const showSeat = await showModel.getShowSeatByShowId(69);
//   if (showSeat) {
//     showSeat.map(async (seat) => {
//       await prepare(seat.id);
//       return;
//     });
//   }
// }

// red();
