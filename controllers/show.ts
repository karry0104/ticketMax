import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import { NextFunction, Request, Response } from "express";
import { fileTypeFromBuffer } from "file-type";
import * as showModel from "../models/show.js";
import * as cache from "../utils/cache.js";
import { prepare } from "../utils/cache.js";

const __dirname = path.resolve();

export async function showForm(req: Request, res: Response) {
  try {
    res.render("createShow");
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "create product failed" });
  }
}

export async function showDetailPage(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/showDetail.html"));
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

    if (Array.isArray(ShowSeatIds) && ShowSeatIds.length > 0) {
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
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "create product failed" });
  }
}

export async function getShows(req: Request, res: Response) {
  try {
    const shows = await showModel.getShows();

    res.render("home", { shows });

    //res.status(200).json({ shows });
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
