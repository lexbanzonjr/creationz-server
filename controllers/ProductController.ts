import { Request, Response } from "express";
import { responseReturn } from "../utils/response";
import { RestError } from "../utils/RestError";

import productModel, { IProduct } from "../models/productModel";

class ProductController {
  create = async (req: Request, res: Response, next: any) => {
    const { name, description, category_id } = req.body as IProduct;
    try {
      if (await productModel.exists({ name })) {
        throw new RestError("Name already exist", {
          status: 400,
        });
      }

      const product = new productModel({
        name,
        description,
        category_id,
      });
      await product.save();

      responseReturn(res, 200);
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };

  delete = async (req: Request, res: Response, next: any) => {
    const { _id } = req.query;
    try {
      await productModel.findByIdAndDelete(_id);

      responseReturn(res, 200);
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };

  list = async (req: Request, res: Response, next: any) => {
    try {
      responseReturn(res, 200, { products: await productModel.find() });
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };
}

export default new ProductController();
