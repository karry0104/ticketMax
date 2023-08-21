import express from "express";
import amqp from "amqplib";
import * as dotenv from "dotenv";
import { checkReserved, getShowIdByOrder, deleteOrder, getShowSeat, } from "./model/database.js";
import { prepare, set } from "./model/redis.js";
const app = express();
const port = process.env.PORT || 3001;
dotenv.config();
const orderQueue = "order";
const ORDER_EXPIRATION_TIME = 5 * 60 * 1000;
const rabbitMQ_name = process.env.RABBITMQ_NAME;
const rabbitMQ_password = process.env.RABBITMQ_PASSWORD;
const rabbitMQ_ip = process.env.RABBITMQ_IP;
export async function updateSeatInCache(id) {
    const seatData = await getShowSeat(id);
    await set(`showSeat:${id}`, JSON.stringify(seatData));
}
(async () => {
    try {
        const connection = await amqp.connect(`amqp://${rabbitMQ_name}:${rabbitMQ_password}@${rabbitMQ_ip}:5672`);
        const channel = await connection.createChannel();
        process.once("SIGINT", async () => {
            await channel.close();
            await connection.close();
        });
        await channel.assertQueue(orderQueue, { durable: false });
        await channel.consume(orderQueue, async (message) => {
            if (message) {
                const msg = JSON.parse(message.content.toString());
                const data = {
                    orderId: msg.orderId,
                    showId: msg.showId,
                };
                setTimeout(async () => {
                    const checkResvered = await checkReserved(data.orderId);
                    if (checkResvered && checkResvered === "Reserved") {
                        const showIdAndShowSeatId = await getShowIdByOrder(data.orderId);
                        if (Array.isArray(showIdAndShowSeatId) &&
                            showIdAndShowSeatId.length > 0) {
                            const idValues = showIdAndShowSeatId.map((obj) => obj.id);
                            idValues.map(async (id) => {
                                await prepare(id);
                            });
                        }
                        deleteOrder(data.orderId);
                        setTimeout(() => {
                            updateSeatInCache(data.showId);
                        }, 500);
                        await updateSeatInCache(data.showId);
                    }
                }, ORDER_EXPIRATION_TIME);
            }
        }, { noAck: true });
    }
    catch (err) {
        console.warn(err);
    }
})();
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
export default app;
