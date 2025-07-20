import { Request, Response } from "express";

import { sendJsonResponse } from "../utils/response";
import { IProduct } from "../models/productModel";
import cartModel, { ICart, ICartProduct } from "../models/cartModel";
import { Types } from "mongoose";

class CartHandler {
  async add(req: Request, res: Response, next: any) {
    const { product, quantity } = { ...req.body } as {
      product: IProduct;
      quantity: number;
    };
    const cart = res.locals.cart as ICart;
    const item = {
      productId: new Types.ObjectId(product._id),
      quantity: quantity,
    } as ICartProduct;

    try {
      cart.products.push(item);
      await cart.save();
      sendJsonResponse(res, 200, { cart });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }

  async get(req: Request, res: Response, next: any) {
    if (!res.locals.cart) {
      return sendJsonResponse(res, 404, { error: "Cart not found" });
    }
    try {
      const cart = await cartModel.findById(res.locals.cart._id);
      sendJsonResponse(res, 200, { cart });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }
}

export default new CartHandler();
