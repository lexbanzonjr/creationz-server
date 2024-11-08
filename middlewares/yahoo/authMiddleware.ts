import { Request, Response } from "express";
import { decodeToken } from "../../utils/token";
import userModel from "../../models/yahoo/userModel";
import { RestError } from "../../utils/RestError";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(409).json({ error: "Please login." });
  }

  try {
    const data = decodeToken(accessToken);
    const user = await userModel.findOne({ userId: data.id });
    if (null === user) throw new RestError("Please login.", { status: 400 });
    res.locals = { user };
  } catch (error) {
    return res.status(409).json({ error });
  }
  next();
};
