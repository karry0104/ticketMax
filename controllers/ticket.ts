import { NextFunction, Request, Response } from "express";
import axios from "axios";
import pool from "../models/databasePool.js";
import { Connection } from "mysql2/promise";
import * as dotenv from "dotenv";
import * as ticketModel from "../models/ticket.js";

dotenv.config();

const TAPPAY_PARTNER_KEY = process.env.TAPPAY_PARTNER_KEY;
const TAPPAY_MERCHANT_ID = process.env.TAPPAY_MERCHANT_ID;

export async function getShowSeat(req: Request, res: Response) {
  try {
    const id = Number(req.query.id);

    const seatData = await ticketModel.getShowSeat(id);

    if (seatData.length === 0) {
      res.redirect("/");
    }

    res.render("showSeat", { seatData });
  } catch (error) {
    console.log(error);
  }
}

//not yet to get user info
export async function createOrders(req: Request, res: Response) {
  try {
    const seat = req.body.seat;
    const showId = Number(req.body.showId);

    if (!seat || seat.length > 4) {
      return res.send("not more than 4 seat or seat is empty");
    }

    // 1 = user_id
    const orderId = await ticketModel.createOrders(showId, 1);

    if (typeof orderId !== "number") {
      return;
    }

    if (Array.isArray(seat) && seat.length > 0) {
      const reservedSeats = seat.map((seats) => {
        return {
          seat: seats,
          showId: showId,
        };
      });

      //await ticketModel.checkSeat(reservedSeats);
    } else {
      //await ticketModel.checkSeat(seat);
    }

    if (Array.isArray(seat) && seat.length > 0) {
      const reservedSeats = seat.map((seats) => {
        return {
          orderId: orderId,
          seat: seats,
          showId: showId,
        };
      });

      await ticketModel.reserveSeat(reservedSeats);
    } else {
      await ticketModel.reserveSeat([
        {
          orderId: orderId,
          seat,
          showId: showId,
        },
      ]);
    }

    res.redirect("/ticket/checkout");
  } catch (error) {
    console.log(error);
  }
}

export async function getPayment(req: Request, res: Response) {
  try {
    const userId = 1;
    //const showId = Number(req.query.id);
    const orders = await ticketModel.getOrders(userId);

    const totalPrice = orders.reduce((sum, i) => sum + i.price, 0);

    const orderData = {
      totalPrice,
      orders,
    };

    res.render("checkout", { orderData });
  } catch (error) {
    console.log(error);
  }
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

  const connection = await pool.getConnection();
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
  const { orderNumber } = req.query;

  res.json(orderNumber);
}
