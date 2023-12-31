import { Request, Response } from "express";
import amqp from "amqplib";
import * as dotenv from "dotenv";
import * as ticketModel from "../models/ticket.js";

dotenv.config();

const rabbitMQ_name = process.env.RABBITMQ_NAME;
const rabbitMQ_password = process.env.RABBITMQ_PASSWORD;
const rabbitMQ_ip = process.env.RABBITMQ_IP;

const queue = "queue";

const orderQueue = "order";

export async function waitPayment(req: Request, res: Response) {
  const { prime, order, token } = req.body;

  const orderStatus = await ticketModel.checkReserved(order.orderId);
  if (orderStatus && orderStatus === "Canceled") {
    throw new Error("Order is canceled");
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
    connection = await amqp.connect(
      `amqp://${rabbitMQ_name}:${rabbitMQ_password}@${rabbitMQ_ip}:5672`
    );
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));

    await channel.close();
    res.send("put to queue");
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "something went wrong" });
  } finally {
    if (connection) await connection.close();
  }
}

export async function checkOrderPaymentStatus(orderId: number, showId: number) {
  const data = {
    orderId,
    showId,
  };

  let connection;
  try {
    connection = await amqp.connect(
      `amqp://${rabbitMQ_name}:${rabbitMQ_password}@${rabbitMQ_ip}:5672`
    );
    const channel = await connection.createChannel();

    await channel.assertQueue(orderQueue, { durable: false });
    channel.sendToQueue(orderQueue, Buffer.from(JSON.stringify(data)));

    await channel.close();
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) await connection.close();
  }
}
