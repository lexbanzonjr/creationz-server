import { Request, Response } from "express";
import { Locals } from "./types";

export const syncMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { sync } = req.query;
  (res.locals as Locals).sync = sync !== undefined;
  if (sync !== undefined) {
    console.log("syncing...");
  }
  next();
};
