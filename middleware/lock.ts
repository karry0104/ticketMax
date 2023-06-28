import { Request, Response, NextFunction } from "express";

import { prepare, secKill } from "../utils/cache.js";

export async function killTicket(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { showSeatId, showId } = req.body;

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
        res.send("sorry, no ticket");
      }
    } else {
      const result = await secKill(showSeatId, userId);
      console.log("single" + result);

      if (result.result === 1) {
        next();
      } else {
        //console.log(result);
        res.send("sorry, no ticket");
      }
    }
  } catch (error) {
    next(error);
  }
}
