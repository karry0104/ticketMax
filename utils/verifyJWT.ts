import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_KEY = process.env.JWT_KEY || "";

const DecodedSchema = z.object({
  userId: z.number(),
  username: z.string(),
  email: z.string(),
});

type Decoded = z.infer<typeof DecodedSchema>;

export default function verifyJWT(token: string): Promise<Decoded> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_KEY, (err, decoded) => {
      try {
        if (err) reject(err);
        const result = DecodedSchema.parse(decoded);
        resolve(result);
      } catch (err) {
        reject(new Error("invalid decoded value"));
      }
    });
  });
}
