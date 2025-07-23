import { Request, Response } from "express";
import cartModel from "../models/cartModel";
import orderModel from "../models/orderModel";
import userModel from "../models/userModel";
import { sendJsonResponse } from "../utils/response";

class OrderHandler {
  async create(req: Request, res: Response, next: any) {
    // Make sure the cart does not have an order already
    const existingOrder = await orderModel.exists({
      cart: res.locals.cart._id,
    });
    if (existingOrder) {
      return sendJsonResponse(res, 400, {
        error: "Order already exists for this cart",
      });
    }

    // Make sure there is at least one item in the cart
    if (res.locals.cart.items.length === 0) {
      return sendJsonResponse(res, 400, {
        error: "Cart is empty",
      });
    }

    // Create the order
    try {
      const order = new orderModel({
        customer: res.locals.user._id,
        cart: res.locals.cart._id,
        status: "pending",
      });

      const savedOrder = await order.save();

      // After saving the order, create a new cart for the user
      const newCart = new cartModel({ user: res.locals.user._id });
      await newCart.save();

      // Get the user and update the cart
      const user = res.locals.user;
      user.cart = newCart._id;
      await user.save();

      sendJsonResponse(res, 201, { order: savedOrder, newCart });
    } catch (error: any) {
      sendJsonResponse(res, 500, { error: error.message });
    }
    next();
  }
  async list(req: Request, res: Response, next: any) {
    try {
      const orders = await orderModel
        .find()
        .populate("customer")
        .populate({
          path: "cart",
          populate: {
            path: "items.product",
            model: "product",
          },
        });

      sendJsonResponse(res, 200, { orders });
    } catch (error: any) {
      sendJsonResponse(res, 500, { error: error.message });
    }
    next();
  }

  async getById(req: Request, res: Response, next: any) {
    try {
      const { order_id } = req.params;
      const order = await orderModel
        .findById(order_id)
        .populate("customer")
        .populate({
          path: "cart",
          populate: {
            path: "items.product",
            model: "product",
          },
        });

      if (!order) {
        return sendJsonResponse(res, 404, { error: "Order not found" });
      }

      sendJsonResponse(res, 200, order);
    } catch (error: any) {
      sendJsonResponse(res, 500, { error: error.message });
    }
    next();
  }
}

export default new OrderHandler();
