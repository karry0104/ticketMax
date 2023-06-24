import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const JWT_KEY = process.env.JWT_KEY || "";
export const EXPIRE_TIME = 60 * 60 * 60;

export default function signJWT(
  userId: number,
  username: string,
  email: string
) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId, username, email },
      JWT_KEY,
      { expiresIn: EXPIRE_TIME },
      function (err, token) {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
}
