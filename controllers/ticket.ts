import path from "path";
import { Request, Response, NextFunction } from "express";
import * as cache from "../utils/cache.js";
import * as dotenv from "dotenv";
import * as ticketModel from "../models/ticket.js";
import * as showModel from "../models/show.js";
import { prepare } from "../utils/cache.js";
import { checkOrderPaymentStatus } from "../controllers/queue.js";

const __dirname = path.resolve();

dotenv.config();

export async function checkoutPage(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/html/checkout.html"));
}

export async function thankPage(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/html/thank.html"));
}

//create order, updateSeatStatus , update redis seat
export async function createOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { showSeatId, showId } = req.body;

    const userId = res.locals.userId;

    const reservedOrderByUser = await ticketModel.getReservedOrder(userId);

    if (reservedOrderByUser[0]) {
      if (Array.isArray(showSeatId)) {
        showSeatId.map(async (seat) => {
          await prepare(seat);
        });
        return res.status(400).json({
          errors: "請先支付原訂單",
          orderId: reservedOrderByUser[0].id,
        });
      }
    }

    const orderId = await ticketModel.createOrders(showId, userId);

    if (typeof orderId !== "number") {
      return;
    }

    if (Array.isArray(showSeatId) && showSeatId.length > 1) {
      const reservedSeats = showSeatId.map((seats) => {
        return {
          orderId,
          seat: seats,
        };
      });
      await ticketModel.reserveSeat(reservedSeats);
    } else {
      await ticketModel.reserveSeat([
        {
          orderId: orderId,
          seat: showSeatId,
        },
      ]);
    }
    await updateSeatInCache(showId);

    await checkOrderPaymentStatus(orderId, showId);

    res.status(200).json({ orderId });
  } catch (err) {
    next(err);
  }
}

export async function getPayment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = {
      userId: res.locals.userId,
      username: res.locals.username,
      email: res.locals.email,
    };

    const orderIdAndShowId = await ticketModel.getReservedOrder(user.userId);

    if (!orderIdAndShowId[0]) {
      throw new Error("無尚未付款訂單");
    }

    const limitTime = 5 * 60 * 1000;

    const countDownTime = orderIdAndShowId[0].time.getTime() + limitTime;

    const orderId = orderIdAndShowId[0].id;
    const showId = orderIdAndShowId[0].show_id;

    const orders = await ticketModel.getOrders(orderId);
    const showInfo = await ticketModel.getShowInfo(showId);

    const date = showInfo[0].show_time.split("T")[0];
    const time = showInfo[0].show_time.split("T")[1];

    const totalPrice = orders.reduce((sum, i) => sum + i.price, 0);
    const orderData = {
      showInfo,
      orderId,
      totalPrice,
      orders,
      countDownTime,
    };

    res.status(200).json({ user, orderData, date, time, showId });
  } catch (err) {
    next(err);
  }
}

export async function updateSeatInCache(id: number) {
  const seatData = await showModel.getShowSeat(id);
  await cache.set(`showSeat:${id}`, JSON.stringify(seatData));
  await cache.get(`showSeat:${id}`);
}

export async function getPaidOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.query;
  try {
    const orders = await ticketModel.getOrders(Number(id));

    if (!orders[0]) {
      throw new Error("查無此訂單");
    }

    const showInfo = await ticketModel.getShowInfo(orders[0].show_id);

    const date = showInfo[0].show_time.split("T")[0];
    const time = showInfo[0].show_time.split("T")[1];

    res.status(200).json({ id, orders, showInfo, date, time });
  } catch (err) {
    next(err);
  }
}

//delete order, update redis seat and prepare seat
export async function deleteOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.query;
  const orderId = Number(id);

  try {
    const orderStatus = await ticketModel.checkReserved(orderId);
    if (orderStatus && orderStatus === "Canceled") {
      throw new Error("訂單已被取消");
    }

    const showIdAndShowSeatId = await ticketModel.getShowIdByOrder(orderId);

    if (Array.isArray(showIdAndShowSeatId)) {
      const idValues = showIdAndShowSeatId.map((obj) => obj.id);
      idValues.map(async (id) => {
        await prepare(id);
      });
    }
    await ticketModel.deleteOrder(orderId);
    await updateSeatInCache(showIdAndShowSeatId[0].show_id);

    res.status(200).json({ id });
  } catch (err) {
    next(err);
  }
}

export async function checkPaid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const orderId = req.body.order.orderId;
  try {
    const checkOrder = await ticketModel.checkPaid(orderId);

    res.status(200).json({ checkOrder });
  } catch (err) {
    next(err);
  }
}
