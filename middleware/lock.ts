import { Request, Response, NextFunction } from "express";

import { prepare, secKill } from "../utils/cache.js";

export async function killTicket(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const showSeatId = req.body.showSeatId;
  console.log(showSeatId);

  const showId = Number(req.body.showId);

  const userId = 123;

  try {
    //console.time("secKill");

    if (Array.isArray(showSeatId)) {
      const showSeats = showSeatId.map(async (showSeat) => {
        //prepare(showSeat);
        const result = await secKill(showSeat, userId);
        return result;
      });
      const results = await Promise.all(showSeats);
      if (results.every((i) => i.result === 1)) {
        next();
      } else {
        const prepareSeats = results.filter((i) => i.result === 1);
        prepareSeats.map(async (showSeat) => {
          prepare(showSeat.showSeatId);
        });
        res.send("sorry, no ticket");
      }
    } else {
      //prepare(showSeatId);
      const result = await secKill(showSeatId, userId);

      if (result.result === 1) {
        next();
      } else {
        res.send("sorry, no ticket");
      }
    }

    //console.timeEnd("secKill");
  } catch (error) {
    next(error);
  }
}
