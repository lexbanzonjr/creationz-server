import { Request, Response } from "express";

export const sendJsonResponse = (res: Response, code: number, data?: any) => {
  return res.status(code).json(data);
};
