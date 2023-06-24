import { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import pool from "./databasePool.js";

function instanceOfSetHeader(object: any): object is ResultSetHeader {
  return "insertId" in object;
}

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  const results = await pool.query(
    `
      INSERT INTO user (username, email, password)
      VALUES(?, ?, ?)
    `,
    [name, email, password]
  );
  if (Array.isArray(results) && instanceOfSetHeader(results[0])) {
    return results[0].insertId;
  }
  throw new Error("create user failed");
}

const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export async function checkUser(email: string) {
  const results = await pool.query(
    `
      SELECT id, username,email,password
      FROM user
      WHERE email = ?
    `,
    [email]
  );
  const users = z.array(UserSchema).parse(results[0]);
  return users[0];
}
