import amqp from "amqplib";
import * as dotenv from "dotenv";
import * as ticketModel from "../dist/models/ticket.js";
import { prepare } from "../dist/utils/cache.js";
import { updateSeatInCache } from "../dist/controllers/ticket.js";

dotenv.config();

const orderQueue = "order";

const ORDER_EXPIRATION_TIME = 5 * 60 * 1000;
const rabbitMQ_name = process.env.RABBITMQ_NAME;
const rabbitMQ_password = process.env.RABBITMQ_PASSWORD;
const rabbitMQ_ip = process.env.RABBITMQ_IP;

(async () => {
  try {
    const connection = await amqp.connect(
      `amqp://${rabbitMQ_name}:${rabbitMQ_password}@${rabbitMQ_ip}:5672`
    );
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(orderQueue, { durable: false });
    await channel.consume(
      orderQueue,
      async (message) => {
        if (message) {
          const msg = JSON.parse(message.content.toString());

          const data = {
            orderId: msg.orderId,
            showId: msg.showId,
          };

          setTimeout(async () => {
            const checkResvered = await ticketModel.checkReserved(data.orderId);
            if (checkResvered && checkResvered === "Reserved") {
              const showIdAndShowSeatId = await ticketModel.getShowIdByOrder(
                data.orderId
              );

              if (
                Array.isArray(showIdAndShowSeatId) &&
                showIdAndShowSeatId.length > 0
              ) {
                const idValues = showIdAndShowSeatId.map((obj) => obj.id);
                idValues.map(async (id) => {
                  await prepare(id);
                });
              }
              ticketModel.deleteOrder(data.orderId);

              setTimeout(() => {
                updateSeatInCache(data.showId);
              }, "500");

              await updateSeatInCache(data.showId);
            }
          }, ORDER_EXPIRATION_TIME);
        }
      },
      { noAck: true }
    );
  } catch (err) {
    console.warn(err);
  }
})();
