import { Request, Response } from "express";
import categoryModel, { ICategory } from "../models/categoryModel";
import BaseHandler from "./BaseHandler";

class CategoryHandler extends BaseHandler<ICategory> {
  constructor() {
    super({ model: categoryModel });
  }

  async create(req: Request, res: Response, next: any) {
    const { name, description } = req.body;
    const category = new categoryModel({ name, description });
    await category.save();
    res.status(201).json({ category });
  }
}

export default new CategoryHandler();
