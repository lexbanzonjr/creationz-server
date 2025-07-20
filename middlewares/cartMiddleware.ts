import { Request, Response } from "express";
import cartModel from "../models/cartModel";
import userModel from "../models/userModel";

export const cartMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  let cart = null;
  if (res.locals.decodedToken.tokenType === "guest") {
    cart = await cartModel.findById(res.locals.decodedToken.cartId);
  } else if (res.locals.decodedToken.tokenType === "access") {
    const user = await userModel.findById(res.locals.decodedToken.userId);
    if (user) {
      cart = await cartModel.findById(user.cartId);
      if (!cart) {
        console.log("No cart found for user, creating a new one");
        cart = new cartModel();
        await cart.save();
        user.cartId = cart._id;
        await user.save();
      }
    }
  }

  res.locals.cart = cart;
  next();
};
