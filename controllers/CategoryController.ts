import { Request, Response } from "express";
import { responseReturn } from "../utils/response";
import { RestError } from "../utils/RestError";

import categoryModel from "../models/categoryModel";

class CategoryController {
  create = async (req: Request, res: Response, next: any) => {
    const { name, designs } = req.body;
    try {
      if (await categoryModel.exists({ name })) {
        throw new RestError("Name already exist", {
          status: 400,
        });
      }

      const category = new categoryModel({ name, designs });
      await category.save();

      responseReturn(res, 200);
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };

  delete = async (req: Request, res: Response, next: any) => {
    const { name } = req.body;
    try {
      await categoryModel.deleteOne({ name });

      responseReturn(res, 200);
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };

  list = async (req: Request, res: Response, next: any) => {
    try {
      responseReturn(res, 200, { categories: await categoryModel.find() });
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };
}

export default new CategoryController();
