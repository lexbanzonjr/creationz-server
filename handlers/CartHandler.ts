import { Request, Response } from "express";
import { sendJsonResponse } from "../utils/response";
import { IProduct } from "../models/productModel";
import cartModel, { ICart, ICartProduct } from "../models/cartModel";
import { Types } from "mongoose";

class CartHandler {
  async add(req: Request, res: Response, next: any) {
    const { product, quantity }: { product: IProduct; quantity: number } =
      req.body;
    const cart = res.locals.cart as ICart;

    if (!product || !quantity) {
      return sendJsonResponse(res, 400, {
        error: "Product and quantity required",
      });
    }

    const item: ICartProduct = {
      productId: new Types.ObjectId(product._id),
      quantity,
    };

    try {
      cart.products.push(item);
      await cart.save();
      sendJsonResponse(res, 200, { cart });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }

  async get(req: Request, res: Response, next: any) {
    const cart = res.locals.cart as ICart;
    if (!cart) {
      return sendJsonResponse(res, 404, { error: "Cart not found" });
    }
    try {
      const foundCart = await cartModel.findById(cart._id);
      sendJsonResponse(res, 200, { cart: foundCart });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }

  async getSubTotal(req: Request, res: Response, next: any) {
    const cart = res.locals.cart as ICart;
    if (!cart) {
      return sendJsonResponse(res, 404, { error: "Cart not found" });
    }

    try {
      const subTotal = cart.products.reduce((total, item) => {
        return total + item.quantity * (item.productId as any).price;
      }, 0);
      sendJsonResponse(res, 200, { subTotal });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }
}

export default new CartHandler();
