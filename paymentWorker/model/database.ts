import pool from "./databasePool.js";

export async function updateOrderStatus(orderId: number) {
  await pool.query(`UPDATE orders SET status = 'Paid' WHERE id = ?`, [orderId]);
}

export async function updateShowSeatStatus(orderId: number) {
  await pool.query(`UPDATE show_seat SET status = 'Paid' WHERE order_id = ?`, [
    orderId,
  ]);
}
