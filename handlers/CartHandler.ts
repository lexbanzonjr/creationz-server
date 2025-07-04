import { Request, Response } from "express";

import { sendJsonResponse } from "../utils/response";
import { IProduct } from "../models/productModel";
import { RestError } from "../utils/RestError";
import userModel from "../models/userModel";

class CartHandler {
  async add(req: Request, res: Response, next: any) {
    const { product, quantity } = { ...req.body } as {
      product: IProduct;
      quantity: number;
    };

    const userId = res.locals.userId;
    try {
      if (!userId) {
        throw new RestError("Only for registered users", { status: 400 });
      }

      const user = await userModel.get({ _id: userId });
      user.cart.items.push({ product: product._id, quantity });
      await user.save();

      sendJsonResponse(res, 200);
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }

  async get(req: Request, res: Response, next: any) {
    const userId = res.locals.userId;
    try {
      if (!userId) {
        throw new RestError("Only for registered users", { status: 400 });
      }

      const user = await (
        await userModel.get({ _id: userId })
      ).populate("cart.items.product");
      sendJsonResponse(res, 200, { cart: user.cart });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }

  async getSubtotal(req: Request, res: Response, next: any) {
    const userId = res.locals.userId;
    try {
      if (!userId) {
        throw new RestError("Only for registered users", { status: 400 });
      }

      const user = await (
        await userModel.get({ _id: userId })
      ).populate("cart.items.product");

      const subTotal = user.cart.items.reduce(
        (sum, item) => sum + (item.product as IProduct).cost * item.quantity,
        0
      );

      sendJsonResponse(res, 200, { subTotal });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }
}

export default new CartHandler();
