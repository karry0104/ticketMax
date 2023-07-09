import { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import pool from "./databasePool.js";

function instanceOfSetHeader(object: any): object is ResultSetHeader {
  return "insertId" in object;
}

export async function createOrders(showId: number, userId: number) {
  const orders = await pool.query(
    `INSERT INTO orders (show_id, user_id) VALUES (?, ?)`,
    [showId, userId]
  );

  if (Array.isArray(orders) && instanceOfSetHeader(orders[0])) {
    return orders[0].insertId;
  }
}

export async function reserveSeat(
  seatData: {
    orderId: number;
    seat: number;
  }[]
) {
  try {
    const results = seatData.map((data) => {
      const { orderId, seat } = data;
      return [orderId, "Reserved", seat];
    });

    for (const result of results) {
      await pool.query(
        `UPDATE show_seat SET order_id = ?, status = ? WHERE show_seat.id = ?`,
        result
      );
    }
  } catch (err) {
    console.log(err);
  }
}

const OrderSchema = z.object({
  show_id: z.number(),
  price: z.number(),
  section: z.string(),
  seat_row: z.string(),
  seat_number: z.number(),
});

export async function getOrders(orderId: number) {
  const results = await pool.query(
    `SELECT show_seat.show_id, price, hall_seat.section, hall_seat.seat_row, hall_seat.seat_number FROM show_seat JOIN hall_seat ON hall_seat.id = show_seat.hallSeat_id WHERE order_id = ?`,
    [orderId]
  );
  const orders = z.array(OrderSchema).parse(results[0]);
  return orders;
}

const ShowInfoSchema = z.object({
  image: z.string(),
  name: z.string(),
  show_time: z.string(),
  hall_name: z.string(),
});

export async function getShowInfo(id: number) {
  const results = await pool.query(
    `SELECT shows.image, shows.name, shows.show_time, hall.hall_name FROM shows JOIN hall ON hall.id = shows.hall_id WHERE shows.id =?`,
    [id]
  );
  const showInfo = z.array(ShowInfoSchema).parse(results[0]);
  return showInfo;
}

const ReservedOrder = z.object({
  time: z.date(),
  id: z.number(),
  show_id: z.number(),
});

export async function getReservedOrder(id: number) {
  const result = await pool.query(
    `SELECT time, id, show_id FROM orders WHERE status='Reserved' AND user_id = ? `,
    [id]
  );
  const order = z.array(ReservedOrder).parse(result[0]);
  return order;
}

export async function createPayment(orderId: number, total: number) {
  await pool.query(`INSERT INTO payment (order_id, total) VALUES (?, ?)`, [
    orderId,
    total,
  ]);
}

export async function updateOrderStatus(orderId: number) {
  await pool.query(`UPDATE orders SET status = 'Paid' WHERE id = ?`, [orderId]);
}

export async function updateShowSeatStatus(orderId: number) {
  await pool.query(`UPDATE show_seat SET status = 'Paid' WHERE order_id = ?`, [
    orderId,
  ]);
}

export async function deleteOrder(id: number) {
  await pool.query(
    'UPDATE orders JOIN show_seat ON orders.id = show_seat.order_id SET orders.status = "canceled", show_seat.order_id = NULL, show_seat.status="NotReserved"  WHERE orders.id = ?',
    [id]
  );
}

const ShowSeatSchema = z.object({
  show_id: z.number(),
  id: z.number(),
});

export async function getShowIdByOrder(id: number) {
  const result = await pool.query(
    `SELECT show_id, id FROM show_seat WHERE order_id = ?`,
    [id]
  );

  const showInfo = z.array(ShowSeatSchema).parse(result[0]);
  return showInfo;
}

const StatusSchema = z.object({
  status: z.string(),
});

type status = z.infer<typeof StatusSchema>;

function instanceOrderStatus(object: any): object is status {
  return "status" in object;
}

export async function checkReserved(orderId: number) {
  const result = await pool.query(`SELECT status FROM orders WHERE id = ?`, [
    orderId,
  ]);

  if (Array.isArray(result[0]) && instanceOrderStatus(result[0][0])) {
    const orderStatus = StatusSchema.parse(result[0][0]);
    return orderStatus.status;
  }
}

export async function checkPaid(orderId: number) {
  const result = await pool.query(`SELECT status FROM orders WHERE id = ?`, [
    orderId,
  ]);

  if (Array.isArray(result[0]) && instanceOrderStatus(result[0][0])) {
    const orderStatus = StatusSchema.parse(result[0][0]);
    return orderStatus.status;
  }
}

export async function getPaidOrder(id: number) {
  const result = await pool.query(
    `SELECT id, show_id FROM shows WHERE order_id = ? `,
    [id]
  );
  const order = z.array(ReservedOrder).parse(result[0]);
  return order;
}

export async function getOrderTime(orderId: number) {
  const result = await pool.query(`SELECT time FROM orders WHERE id = ? `, [
    orderId,
  ]);
  return result[0];
}
