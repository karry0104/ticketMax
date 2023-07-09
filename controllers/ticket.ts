import { NextFunction, Request, Response } from "express";
import AWS from "aws-sdk";
import * as cache from "../utils/cache.js";
import * as dotenv from "dotenv";
import * as ticketModel from "../models/ticket.js";
import * as showModel from "../models/show.js";
import { prepare } from "../utils/cache.js";
import { checkOrderPaymentStatus } from "../controllers/queue.js";
import path from "path";

const __dirname = path.resolve();

dotenv.config();

const ORDER_EXPIRATION_TIME = 5 * 60 * 1000;

export async function checkoutPage(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/html/checkout.html"));
}

export async function thankPage(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/html/thank.html"));
}

export async function getShowSeat(req: Request, res: Response) {
  try {
    const id = Number(req.query.id);
    const cachedShowSeat = await cache.get(`showSeat:${id}`);
    if (cachedShowSeat) {
      const seatData = JSON.parse(cachedShowSeat);
      return res.render("test", { seatData, id });
    }
    // res.render("showSeat");
    // res.sendFile(path.join(__dirname, "/views/html/showSeat.html"));
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
  }
}

//create order, updateSeatStatus , update redis seat
export async function createOrders(req: Request, res: Response) {
  try {
    const showSeatId = req.body.showSeatId;

    const showId = req.body.showId;

    const userId = res.locals.userId;

    const orderId = await ticketModel.createOrders(showId, userId);

    if (typeof orderId !== "number") {
      return;
    }

    if (Array.isArray(showSeatId) && showSeatId.length > 0) {
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

    res.json({ showId });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
  }
}

export async function getPayment(req: Request, res: Response) {
  try {
    const user = {
      userId: res.locals.userId,
      username: res.locals.username,
      email: res.locals.email,
    };

    const orderIdAndShowId = await ticketModel.getReservedOrder(user.userId);

    console.log(orderIdAndShowId);

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
    };

    res.status(200).json({ user, orderData, date, time });
    //res.render("checkout", { user, orderData, date, time });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
  }
}

export async function updateSeatInCache(id: number) {
  const seatData = await showModel.getShowSeat(id);
  await cache.set(`showSeat:${id}`, JSON.stringify(seatData));
  const updateSeat = await cache.get(`showSeat:${id}`);
}

export async function getPaidOrders(req: Request, res: Response) {
  const { id } = req.query;
  try {
    const orders = await ticketModel.getOrders(Number(id));

    const showInfo = await ticketModel.getShowInfo(orders[0].show_id);

    const date = showInfo[0].show_time.split("T")[0];
    const time = showInfo[0].show_time.split("T")[1];

    res.status(200).json({ id, orders, showInfo, date, time });

    //res.render("thank", { id, orders, showInfo, date, time });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
  }
}

//delete order, update redis seat and prepare seat
export async function deleteOrder(req: Request, res: Response) {
  const { id } = req.query;
  const orderId = Number(id);

  try {
    const orderStatus = await ticketModel.checkReserved(orderId);
    if (orderStatus && orderStatus === "Canceled") {
      return res.status(200).json({ message: "Order is canceled" });
    }

    const showIdAndShowSeatId = await ticketModel.getShowIdByOrder(orderId);

    if (Array.isArray(showIdAndShowSeatId) && showIdAndShowSeatId.length > 0) {
      const idValues = showIdAndShowSeatId.map((obj) => obj.id);
      idValues.map(async (id) => {
        await prepare(id);
      });
    }
    await ticketModel.deleteOrder(orderId);
    await updateSeatInCache(showIdAndShowSeatId[0].show_id);

    res.status(200).json(id);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
  }
}

export async function checkPaid(req: Request, res: Response) {
  const orderId = req.body.order.orderId;
  try {
    const checkOrder = await ticketModel.checkPaid(orderId);
    console.log(checkOrder);
    res.status(200).json({ checkOrder });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
  }
}

const limitTime = 5 * 60 * 1000;
export async function countDown(req: Request, res: Response) {
  const userId = 2;
  const orderDate = await ticketModel.getReservedOrder(userId);
  const time = orderDate[0].time.getTime() + limitTime;

  res.send({ time });
}
