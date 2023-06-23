import { NextFunction, Request, Response } from "express";
import axios from "axios";
import pool from "../models/databasePool.js";
import * as cache from "../utils/cache.js";
import { Connection } from "mysql2/promise";
import * as dotenv from "dotenv";
import * as ticketModel from "../models/ticket.js";
import { prepare } from "../utils/cache.js";

dotenv.config();

const TAPPAY_PARTNER_KEY = process.env.TAPPAY_PARTNER_KEY;
const TAPPAY_MERCHANT_ID = process.env.TAPPAY_MERCHANT_ID;

const connection = await pool.getConnection();

export async function getShowSeat(req: Request, res: Response) {
  try {
    const id = Number(req.query.id);

    const cachedShowSeat = await cache.get(`showSeat:${id}`);

    if (cachedShowSeat) {
      const seatData = JSON.parse(cachedShowSeat);

      return res.render("showSeat", { seatData, id });
    } else {
      const seatData = await ticketModel.getShowSeat(id);

      await cache.set(`showSeat:${id}`, JSON.stringify(seatData));

      return res.render("showSeat", { seatData, id });
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

    const userId = 2;

    const orderId = await ticketModel.createOrders(showId, userId);

    console.log(orderId);

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
      userId: 2,
      username: "karry",
      email: "aa.gmail.com",
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
  const seatData = await ticketModel.getShowSeat(id);
  await cache.set(`showSeat:${id}`, JSON.stringify(seatData));
}

export async function checkout(req: Request, res: Response) {
  const { prime, order } = req.body;

  const data = {
    prime,
    partner_key: TAPPAY_PARTNER_KEY,
    merchant_id: TAPPAY_MERCHANT_ID,
    amount: order.total,
    details: order.name,
    cardholder: {
      phone_number: order.phone,
      name: order.username,
      email: order.email,
      address: order.address,
    },
    remember: false,
    order_number: order.orderId,
  };

  try {
    await ticketModel.createPayment(order.orderId, order.total);
    await connection.query("BEGIN");
    const result = await axios.post(
      "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",
      data,
      {
        headers: {
          "x-api-key": process.env.TAPPAY_PARTNER_KEY,
        },
      }
    );
    if (result.data.status !== 0) {
      throw new Error(result.data.msg);
    }

    connection.query("COMMIT");

    await ticketModel.updateOrderStatus(order.orderId);

    await ticketModel.updateShowSeatStatus(order.orderId);

    res.status(200).json({ data: { orderId: order.orderId } });
  } catch (err) {
    connection.query("ROLLBACK");
    throw err;
  }
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
  console.log(showIdAndShowSeatId);

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
