import { NextFunction, Request, Response } from "express";
import amqp from "amqplib";
import * as dotenv from "dotenv";
import * as ticketModel from "../models/ticket.js";

dotenv.config();

const queue = "queue";

export async function waitPayment(req: Request, res: Response) {
  const { prime, order, token } = req.body;

  const orderStatus = await ticketModel.checkReserved(order.orderId);
  if (orderStatus && orderStatus === "Canceled") {
    return res.status(200).json({ message: "Order is canceled" });
  }

  const data = {
    prime,
    token,
    amount: order.total,
    details: order.orderId,
    phone_number: order.phone,
    name: order.username,
    email: order.email,
    address: order.address,
    order_number: order.orderId,
  };

  let connection;
  try {
    connection = await amqp.connect("amqp://127.0.0.1:5672");
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    console.log(" [x] Sent '%s'", data);
    await channel.close();
    res.send("put to queue");
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) await connection.close();
  }
}
