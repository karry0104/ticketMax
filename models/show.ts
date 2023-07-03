import { ResultSetHeader } from "mysql2";
import { z } from "zod";
import pool from "./databasePool.js";

function instanceOfSetHeader(object: any): object is ResultSetHeader {
  return "insertId" in object;
}

function hallId(object: any): object is ResultSetHeader {
  return "id" in object;
}

const ShowSchema = z.object({
  id: z.number(),
  name: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  introduction: z.string(),
});

const hallIdSchema = z.object({
  id: z.number(),
});

type hallId = z.infer<typeof hallIdSchema>;

function instanceOfhallId(object: any): object is hallId {
  return "id" in object;
}

export async function getHallIdByName(name: string) {
  try {
    const results = await pool.query(
      `SELECT id FROM hall WHERE hall_name = ?`,
      [name]
    );
    if (Array.isArray(results[0]) && instanceOfhallId(results[0][0])) {
      const hallId = hallIdSchema.parse(results[0][0]);
      return hallId.id;
    }
  } catch (err) {
    console.log(err);
  }
}

const ShowSeatIdSchema = z.object({
  id: z.number(),
});

export async function getShowSeatByHallId(id: number) {
  try {
    const results = await pool.query(
      `SELECT id FROM hall_seat WHERE hall_id = ?`,
      [id]
    );
    const result = z.array(ShowSeatIdSchema).parse(results[0]);
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function createShow(showData: {
  name: string;
  startTime: string;
  endTime: string;
  introduction: string;
  image: string;
  seatChart: string;
  hallId: number;
  showTime: string;
}) {
  try {
    const {
      name,
      startTime,
      endTime,
      introduction,
      image,
      seatChart,
      hallId,
      showTime,
    } = showData;
    const results = await pool.query(
      `INSERT INTO shows (name, start_time, end_time, introduction, image, seat_chart, hall_id, show_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        startTime,
        endTime,
        introduction,
        image,
        seatChart,
        hallId,
        showTime,
      ]
    );
    if (Array.isArray(results) && instanceOfSetHeader(results[0])) {
      return results[0].insertId;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function createShowSeat(
  showSeatData: {
    showId: number;
    status: string;
    price: number;
    hallSeatId: number;
  }[]
) {
  try {
    await pool.query(
      `INSERT INTO show_seat (status, price, hallSeat_id, show_id) VALUES ?`,
      [
        showSeatData.map((data) => {
          const { status, price, hallSeatId, showId } = data;
          return [status, price, hallSeatId, showId];
        }),
      ]
    );
  } catch (err) {
    console.log(err);
  }
}

export async function getShowSeatByShowId(id: number) {
  try {
    const results = await pool.query(
      `SELECT id FROM show_seat WHERE show_id = ?`,
      [id]
    );
    const result = z.array(ShowSeatIdSchema).parse(results[0]);
    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getShows() {
  try {
    const results = await pool.query(
      `SELECT id, name, start_time, end_time, image FROM shows`
    );
    if (Array.isArray(results)) {
      return results[0];
    }
  } catch (err) {
    console.log(err);
  }
}

// const ShowInfoSchema = z.object({
//   name: z.string(),
//   introduction: z.string(),
//   show_time: z.string(),
//   seat_chart: z.string(),
//   hall_name: z.string(),
// });

export async function getShow(id: number) {
  try {
    const results = await pool.query(
      `SELECT shows.name, shows.introduction, shows.singer_introduction, shows.image, shows.show_time, shows.seat_chart, hall.hall_name FROM shows JOIN hall ON hall.id = shows.hall_id WHERE shows.id = ?`,
      [id]
    );
    if (Array.isArray(results)) {
      return results[0];
    }
  } catch (err) {
    console.log(err);
  }
}

const ShowSeatSchema = z.object({
  show_id: z.number(),
  id: z.number(),
  name: z.string(),
  status: z.string(),
  price: z.number(),
  section: z.string(),
  seat_row: z.string(),
  seat_number: z.number(),
});

export async function getShowSeat(id: number) {
  const results = await pool.query(
    `SELECT show_seat.show_id, show_seat.id, shows.name,show_seat.status, show_seat.price, hall_seat.section, hall_seat.seat_row,hall_seat.seat_number FROM shows JOIN show_seat ON shows.id = show_seat.show_id JOIN hall_seat ON show_seat.hallSeat_id = hall_seat.id WHERE shows.id = ? ORDER BY hall_seat.seat_number ASC`,
    [id]
  );
  const showSeat = z.array(ShowSeatSchema).parse(results[0]);
  return showSeat;
}

export async function createShowCampaign(id: number, imageName: string) {
  try {
    await pool.query(`INSERT INTO campaigns (show_id, image) VALUES (?, ?)`, [
      id,
      imageName,
    ]);
  } catch (err) {
    console.log(err);
  }
}

export async function getShowCampaign() {
  try {
    const results = await pool.query(`SELECT * FROM campaigns`);
    if (Array.isArray(results)) {
      return results[0];
    }
  } catch (err) {
    console.log(err);
  }
}
