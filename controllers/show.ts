import path from "path";
import { Request, Response, NextFunction } from "express";
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

export async function createShow(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

    await uplaodShowDetailToS3(createImages[0], images, showId as number);

    if (Array.isArray(ShowSeatIds)) {
      const showSeat = ShowSeatIds.map((seat) => {
        return {
          status: "NotReserved",
          price: req.body.price,
          showId: showId as number,
          hallSeatId: seat,
        };
      });
      await showModel.createShowSeat(showSeat);
    }

    //put new seat to cache
    if (showId) {
      const seatData = await showModel.getShowSeat(showId);

      await cache.set(`showSeat:${showId}`, JSON.stringify(seatData));
      const showSeat = await showModel.getShowSeatByShowId(showId);
      if (showSeat) {
        showSeat.map(async (seat) => {
          await prepare(seat.id);
          return;
        });
      }
    }

    res.send("sucess to create show");
  } catch (err) {
    next(err);
  }
}

export async function createShowCampaign(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;
  const image = req.files;

  try {
    if (image && typeof image === "object") {
      if (Array.isArray(image)) {
      } else if (image.image && Array.isArray(image.image)) {
        const imageName = image.image[0].filename;

        await showModel.createShowCampaign(id, imageName);
      }
    }
    res.send("sucess to create campaign");
  } catch (err) {
    next(err);
  }
}

export async function getShowCampagin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const campaign = await showModel.getShowCampaign();

    res.status(200).json({ campaign });
  } catch (err) {
    next(err);
  }
}

export async function getShows(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const shows = await showModel.getShows();

    res.status(200).json({ shows });
  } catch (err) {
    next(err);
  }
}
