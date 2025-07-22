import { Request, Response } from "express";
import orderModel from "../models/orderModel";
import { sendJsonResponse } from "../utils/response";

class OrderHandler {
  async create(req: Request, res: Response, next: any) {
    try {
      const order = new orderModel({
        customer: res.locals.user,
        cart: res.locals.cart,
        status: "pending",
      });

      const savedOrder = await order.save();
      sendJsonResponse(res, 201, savedOrder);
    } catch (error: any) {
      sendJsonResponse(res, 500, { error: error.message });
    }
    next();
  }

  async list(req: Request, res: Response, next: any) {
    try {
      const orders = await orderModel
        .find()
        .populate("user", "name email")
        .populate("cart");

      sendJsonResponse(res, 200, orders);
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
        .populate("user", "name email")
        .populate("cart");

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
