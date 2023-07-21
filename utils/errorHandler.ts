import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof Error) {
    res.status(400).json({ errors: err.message });
    return;
  }
  res.status(500).send("Oops, unknown error");
  return;
}
