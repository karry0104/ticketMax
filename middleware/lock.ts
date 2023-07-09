import { Request, Response, NextFunction } from "express";

import { prepare, secKill } from "../utils/cache.js";

export async function killTicket(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { showSeatId, showId } = req.body;

  console.log(typeof showSeatId);
  if (showSeatId.length > 4) {
    throw new Error("一次最多選擇４個位置");
  }
  const userId = res.locals.userId;

  try {
    if (Array.isArray(showSeatId)) {
      const showSeats = showSeatId.map(async (showSeat) => {
        const result = await secKill(showSeat, userId);
        return result;
      });
      const results = await Promise.all(showSeats);
      console.log("arr" + results);
      if (results.every((i) => i.result === 1)) {
        next();
      } else {
        const prepareSeats = results.filter((i) => i.result === 1);
        prepareSeats.map(async (showSeat) => {
          prepare(showSeat.showSeatId);
        });
        throw new Error("座位已被購買，請重新選擇座位");
      }
    } else {
      const result = await secKill(showSeatId, userId);
      console.log("single" + result);

      if (result.result === 1) {
        next();
      } else {
        throw new Error("座位已被購買，請重新選擇座位");
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "buy ticket failed" });
  }
}
