import amqp from "amqplib";
import * as dotenv from "dotenv";
import axios from "axios";
import * as ticketModel from "./dist/models/ticket.js";

dotenv.config();

const TAPPAY_PARTNER_KEY = process.env.TAPPAY_PARTNER_KEY;
const TAPPAY_MERCHANT_ID = process.env.TAPPAY_MERCHANT_ID;

const queue = "queue";

(async () => {
  try {
    const connection = await amqp.connect("amqp://127.0.0.1:5672");
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(queue, { durable: false });
    await channel.consume(
      queue,
      async (message) => {
        if (message) {
          const msg = JSON.parse(message.content.toString());

          const data = {
            prime: msg.prime,
            token: msg.token,
            partner_key: TAPPAY_PARTNER_KEY,
            merchant_id: TAPPAY_MERCHANT_ID,
            amount: msg.amount,
            details: msg.details,
            cardholder: {
              phone_number: msg.phone_number,
              name: msg.name,
              email: msg.email,
              address: msg.address,
            },
            remember: false,
            order_number: msg.order_number,
          };

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

          await ticketModel.updateOrderStatus(data.order_number);

          await ticketModel.updateShowSeatStatus(data.order_number);

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
