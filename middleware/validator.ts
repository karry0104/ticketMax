import { Request, Response, NextFunction } from "express";
import { Result, validationResult } from "express-validator";

export const handleResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: Result = validationResult(req);
  if (!result.isEmpty()) {
    const [errors] = result.array();
    const { path, msg } = errors;
    return res.status(400).json({ errors: `${path} ${msg}` });
  }
  next();
};
