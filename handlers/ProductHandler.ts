import { Request, Response } from "express";
import productModel, { IProduct } from "../models/productModel";
import BaseHandler from "./BaseHandler";
import { sendJsonResponse } from "../utils/response";

class ProductHandler extends BaseHandler<IProduct> {
  constructor() {
    super({ model: productModel });
  }

  async create(req: Request, res: Response, next: any) {
    const { name, description, cost, category_id, image_id, materials } =
      req.body;
    const product = new productModel({
      name,
      description,
      cost,
      category_id,
      image_id,
      materials,
    });
    await product.save();
    sendJsonResponse(res, 200, { [productModel.modelName]: product });
  }
}

export default new ProductHandler();
