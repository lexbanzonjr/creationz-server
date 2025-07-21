import { Request, Response } from "express";
import productModel, { IProduct } from "../models/productModel";
import BaseHandler from "./BaseHandler";
import { sendJsonResponse } from "../utils/response";

class ProductHandler extends BaseHandler<IProduct> {
  constructor() {
    super({ model: productModel });
  }

  async create(req: Request, res: Response, next: any) {
    const { name, description, cost, categories, image_id, materials } =
      req.body;
    const product = new productModel({
      name,
      description,
      cost,
      categories,
      image_id,
      materials,
    });
    await product.save();
    sendJsonResponse(res, 200, { product });
  }

  async getById(req: Request, res: Response, next: any) {
    try {
      const product = await productModel.findById(req.params._id);
      if (!product) {
        return sendJsonResponse(res, 404, { error: "Product not found" });
      }
      sendJsonResponse(res, 200, { product });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  }

  list = async (req: Request, res: Response, next: any) => {
    console.log("Listing products");
    try {
      const products = await productModel.find();
      sendJsonResponse(res, 200, { products });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  };
}

export default new ProductHandler();
