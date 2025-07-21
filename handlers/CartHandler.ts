import { Request, Response } from "express";
import { sendJsonResponse } from "../utils/response";
import productModel, { IProduct } from "../models/productModel";
import cartModel, { ICart, ICartItem } from "../models/cartModel";
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

    const item: ICartItem = {
      product: new Types.ObjectId(product._id),
      quantity,
    };

    try {
      cart.items.push(item);
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
      if (!foundCart) {
        return sendJsonResponse(res, 404, { error: "Cart not found" });
      }
      const items = foundCart.items;
      for (const item of items) {
        const product = await productModel.findById(item.product);
        if (product) {
          item.product = product; // Populate product details
        }
      }
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
      let subTotal = 0;
      for (const item of cart.items) {
        const product = await productModel.findById(item.product);
        if (!product) {
          continue; // Skip if product not found
        }
        subTotal += item.quantity * product.cost;
      }
      sendJsonResponse(res, 200, { subTotal });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }
}

export default new CartHandler();
