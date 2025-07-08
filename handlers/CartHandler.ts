import { Request, Response } from "express";

import { sendJsonResponse } from "../utils/response";
import { IProduct } from "../models/productModel";

class CartHandler {
  async add(req: Request, res: Response, next: any) {
    const { product, quantity } = { ...req.body } as {
      product: IProduct;
      quantity: number;
    };

    try {
      res.locals.cart.products.push({ productId: product._id, quantity });
      await res.locals.cart.save();
      sendJsonResponse(res, 200);
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }

  async get(req: Request, res: Response, next: any) {
    try {
      sendJsonResponse(res, 200, { cart: res.locals.cart });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }
}

export default new CartHandler();
