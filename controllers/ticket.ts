import { NextFunction, Request, Response } from "express";
import * as cache from "../utils/cache.js";
import * as dotenv from "dotenv";
import * as ticketModel from "../models/ticket.js";
import * as showModel from "../models/show.js";
import { prepare } from "../utils/cache.js";

dotenv.config();

export async function getShowSeat(req: Request, res: Response) {
  try {
    const id = Number(req.query.id);

    const cachedShowSeat = await cache.get(`showSeat:${id}`);

    if (cachedShowSeat) {
      const seatData = JSON.parse(cachedShowSeat);

      return res.render("test", { seatData, id });
    }
  } catch (error) {
    console.log(error);
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

    res.redirect("/ticket/checkout");
  } catch (error) {
    console.log(error);
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

    const orderId = orderIdAndShowId[0].id;
    const showId = orderIdAndShowId[0].show_id;

    const orders = await ticketModel.getOrders(orderId);
    const showInfo = await ticketModel.getShowInfo(showId);

    const totalPrice = orders.reduce((sum, i) => sum + i.price, 0);
    const orderData = {
      showInfo,
      orderId,
      totalPrice,
      orders,
    };

    res.render("checkout", { user, orderData });
  } catch (error) {
    console.log(error);
  }
}

async function updateSeatInCache(id: number) {
  const seatData = await showModel.getShowSeat(id);
  await cache.set(`showSeat:${id}`, JSON.stringify(seatData));
}

export async function getAllOrders(req: Request, res: Response) {
  const { id } = req.query;

  res.json(id);
}

//delete order, update redis seat and prepare seat
export async function deleteOrder(req: Request, res: Response) {
  const { id } = req.query;
  const orderId = Number(id);

  const showIdAndShowSeatId = await ticketModel.getShowIdByOrder(orderId);

  if (Array.isArray(showIdAndShowSeatId) && showIdAndShowSeatId.length > 0) {
    const idValues = showIdAndShowSeatId.map((obj) => obj.id);
    idValues.map(async (id) => {
      await prepare(id);
    });
  }
  await ticketModel.deleteOrder(orderId);
  await updateSeatInCache(showIdAndShowSeatId[0].show_id);

  res.json(id);
}

export async function checkPaid(req: Request, res: Response) {
  const orderId = req.body.order.orderId;
  const checkOrder = await ticketModel.checkPaid(orderId);
  console.log(checkOrder);
  res.status(200).json({ checkOrder });
}
