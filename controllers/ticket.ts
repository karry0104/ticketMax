import { NextFunction, Request, Response } from "express";
import AWS from "aws-sdk";
import * as cache from "../utils/cache.js";
import * as dotenv from "dotenv";
import * as ticketModel from "../models/ticket.js";
import * as showModel from "../models/show.js";
import { io } from "../index.js";
import { prepare } from "../utils/cache.js";
import path from "path";

const __dirname = path.resolve();
const ORDER_EXPIRATION_TIME = 5 * 60 * 1000;

dotenv.config();

export async function checkoutPage(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/checkout.html"));
}

export async function getShowSeat(req: Request, res: Response) {
  try {
    // const id = Number(req.query.id);
    // const cachedShowSeat = await cache.get(`showSeat:${id}`);
    // if (cachedShowSeat) {
    //   const seatData = JSON.parse(cachedShowSeat);
    //   return res.render("test", { seatData, id });
    // }
    return res.render("showSeat");
  } catch (error) {
    console.log(error);
  }
}

//create order, updateSeatStatus , update redis seat
export async function createOrders(req: Request, res: Response) {
  try {
    const showSeatId = req.body.showSeatId;
    console.log("createOrders" + showSeatId);

    const showId = req.body.showId;
    console.log("orders" + showId);

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

    setTimeout(async () => {
      const checkResvered = await ticketModel.checkReserved(orderId);
      if (checkResvered && checkResvered === "Reserved") {
        const showIdAndShowSeatId = await ticketModel.getShowIdByOrder(orderId);

        if (
          Array.isArray(showIdAndShowSeatId) &&
          showIdAndShowSeatId.length > 0
        ) {
          const idValues = showIdAndShowSeatId.map((obj) => obj.id);
          idValues.map(async (id) => {
            await prepare(id);
          });
        }

        ticketModel.deleteOrder(orderId);
        await updateSeatInCache(showId);
      }
    }, ORDER_EXPIRATION_TIME);

    res.json({ showId });
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

    console.log(orderIdAndShowId);

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

    //res.status(200).json({ user, orderData });

    res.render("checkout", { user, orderData });
  } catch (error) {
    console.log(error);
  }
}

async function updateSeatInCache(id: number) {
  const seatData = await showModel.getShowSeat(id);
  await cache.set(`showSeat:${id}`, JSON.stringify(seatData));
  const updateSeat = await cache.get(`showSeat:${id}`);

  io.emit("updateSeat", updateSeat);
}

export async function getAllOrders(req: Request, res: Response) {
  const { id } = req.query;

  res.render("thank", { id });
  //res.status(200).json(id);
}

//delete order, update redis seat and prepare seat
export async function deleteOrder(req: Request, res: Response) {
  const { id } = req.query;
  const orderId = Number(id);

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

  res.json(id);
}

export async function checkPaid(req: Request, res: Response) {
  const orderId = req.body.order.orderId;
  const checkOrder = await ticketModel.checkPaid(orderId);
  console.log(checkOrder);
  res.status(200).json({ checkOrder });
}

export async function checkSQS(req: Request, res: Response) {
  const sqs = new AWS.SQS({ region: "ap-northeast-1" });
  const { id } = req.body;

  const queueUrl = `https://sqs.ap-northeast-1.amazonaws.com/649086394704/mes${id}.fifo`;

  const attributeParams = {
    QueueUrl: queueUrl,
    AttributeNames: ["All"],
  };

  sqs.getQueueAttributes(attributeParams, (err, data) => {
    if (err) {
      console.log("Error getting queue attributes:", err);
    } else {
      const attributes = data.Attributes;
      // console.log(attributes);
      if (attributes) {
        const messages = attributes.ApproximateNumberOfMessages;

        res.status(200).json({ data: messages });
      }
    }
  });
}
