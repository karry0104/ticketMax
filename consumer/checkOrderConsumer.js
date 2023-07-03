import amqp from "amqplib";
import * as ticketModel from "../dist/models/ticket.js";
import { prepare } from "../dist/utils/cache.js";
import { updateSeatInCache } from "../dist/controllers/ticket.js";

const orderQueue = "order";

const ORDER_EXPIRATION_TIME = 100 * 60 * 1000;

(async () => {
  try {
    const connection = await amqp.connect("amqp://127.0.0.1:5672");
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
              await updateSeatInCache(data.showId);
            }
          }, ORDER_EXPIRATION_TIME);

          console.log(" [x] Received '%s'", message.content);
        }
      },
      { noAck: true }
    );

    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (err) {
    console.warn(err);
  }
})();
