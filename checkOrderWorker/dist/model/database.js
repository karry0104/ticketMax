import { z } from "zod";
import pool from "./databasePool.js";
const StatusSchema = z.object({
    status: z.string(),
});
function instanceOrderStatus(object) {
    return "status" in object;
}
export async function checkReserved(orderId) {
    const result = await pool.query(`SELECT status FROM orders WHERE id = ?`, [
        orderId,
    ]);
    if (Array.isArray(result[0]) && instanceOrderStatus(result[0][0])) {
        const orderStatus = StatusSchema.parse(result[0][0]);
        return orderStatus.status;
    }
}
const ShowSeatSchema = z.object({
    show_id: z.number(),
    id: z.number(),
});
export async function getShowIdByOrder(id) {
    const result = await pool.query(`SELECT show_id, id FROM show_seat WHERE order_id = ?`, [id]);
    const showInfo = z.array(ShowSeatSchema).parse(result[0]);
    return showInfo;
}
export async function deleteOrder(id) {
    await pool.query('UPDATE orders JOIN show_seat ON orders.id = show_seat.order_id SET orders.status = "canceled", show_seat.order_id = NULL, show_seat.status="NotReserved"  WHERE orders.id = ?', [id]);
}
const SeatSchema = z.object({
    show_id: z.number(),
    id: z.number(),
    name: z.string(),
    status: z.string(),
    price: z.number(),
    section: z.string(),
    seat_row: z.string(),
    seat_number: z.number(),
});
export async function getShowSeat(id) {
    const results = await pool.query(`SELECT show_seat.show_id, show_seat.id, shows.name,show_seat.status, show_seat.price, hall_seat.section, hall_seat.seat_row,hall_seat.seat_number FROM shows JOIN show_seat ON shows.id = show_seat.show_id JOIN hall_seat ON show_seat.hallSeat_id = hall_seat.id WHERE shows.id = ? ORDER BY hall_seat.seat_number ASC`, [id]);
    const showSeat = z.array(SeatSchema).parse(results[0]);
    return showSeat;
}
