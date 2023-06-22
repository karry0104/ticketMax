import { ResultSetHeader } from "mysql2";
import { z } from "zod";
import pool from "./databasePool.js";

function instanceOfSetHeader(object: any): object is ResultSetHeader {
  return "insertId" in object;
}

const ShowDeatSchema = z.object({
  id: z.number(),
  name: z.string(),
  seat_chart: z.string(),
  status: z.string(),
  price: z.number(),
  hallSeat_id: z.number(),
  section: z.string(),
  seat_row: z.string(),
  seat_number: z.number(),
});

// const ShowInfoSchema = z.object({
//   name: z.string(),
//   seat_chart: z.string(),
// });

export async function getShowSeat(id: number) {
  const results = await pool.query(
    `SELECT shows.id, shows.name, shows.seat_chart, show_seat.status, show_seat.price, show_seat.hallSeat_id,hall_seat.section, hall_seat.seat_row,hall_seat.seat_number FROM shows JOIN show_seat ON shows.id = show_seat.show_id JOIN hall_seat ON show_seat.hallSeat_id = hall_seat.id WHERE shows.id = ? ORDER BY hall_seat.seat_number ASC`,
    [id]
  );
  const showSeat = z.array(ShowDeatSchema).parse(results[0]);
  return showSeat;
}

export async function createOrders(
  showId: number,
  userId: number
  //status: string
) {
  const orders = await pool.query(
    `INSERT INTO orders (show_id, user_id) VALUES (?, ?)`,
    [showId, userId]
  );

  if (Array.isArray(orders) && instanceOfSetHeader(orders[0])) {
    return orders[0].insertId;
  }
}

const orderIdSchema = z.object({
  id: z.number(),
});

type orderId = z.infer<typeof orderIdSchema>;

function instanceOforderId(object: any): object is orderId {
  return "id" in object;
}

export async function reserveSeat(
  seatData: {
    orderId: number;
    seat: number;
    showId: number;
  }[]
) {
  try {
    const results = seatData.map((data) => {
      const { orderId, seat, showId } = data;
      return [orderId, "Reserved", seat, showId];
    });

    for (const result of results) {
      await pool.query(
        `UPDATE show_seat SET order_id = ?, status = ? WHERE hallSeat_id = ? AND show_id = ?`,
        result
      );
    }
  } catch (err) {
    console.log(err);
  }
}

const CheckOrderSchema = z.object({
  hall_name: z.string(),
  name: z.string(),
  show_time: z.string(),
  email: z.string(),
  username: z.string(),
  section: z.string(),
  seat_row: z.string(),
  seat_number: z.number(),
  price: z.number(),
  order_id: z.number(),
});

export async function getOrders(userId: number) {
  const results = await pool.query(
    `SELECT hall.hall_name, shows.name, shows.show_time, user.email, user.username, hall_seat.section,hall_seat.seat_row, hall_seat.seat_number, show_seat.price, show_seat.order_id FROM orders JOIN show_seat ON orders.id = show_seat.order_id JOIN hall_seat ON 
    hall_seat.id = show_seat.hallSeat_id JOIN user ON user.id = orders.user_id JOIN shows ON shows.id = orders.show_id JOIN hall ON hall.id = shows.hall_id WHERE orders.user_id = ? AND orders.status = 'Reserved'`,
    [userId]
  );

  const orders = z.array(CheckOrderSchema).parse(results[0]);
  return orders;
}

// export async function getShowInfo(id: number) {
//   const results = await pool.query(
//     `SELECT shows.name, shows.seat_chart FROM shows WHERE shows.id = ?`,
//     [id]
//   );
//   const showInfo = z.array(ShowInfoSchema).parse(results[0]);
//   return showInfo;
// }

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

export async function checkSeat(id: number) {}
