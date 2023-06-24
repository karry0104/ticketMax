import { Request, Response, NextFunction } from "express";
import verifyJWT from "../utils/verifyJWT.js";

async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.jwtoken;
    if (!token) {
      return res.redirect("/user");
    }
    const decoded = await verifyJWT(token);
    res.locals.username = decoded.username;
    res.locals.userId = decoded.userId;
    res.locals.email = decoded.email;
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ errors: err.message });
      return;
    }
    res.status(401).json({ errors: "authenticate failed" });
  }
}

export default authenticate;
