import categoryModel, { ICategory } from "../models/categoryModel";
import BaseController from "./BaseController";

class CategoryController extends BaseController<ICategory> {
  constructor() {
    super({ model: categoryModel });
  }
}

export default new CategoryController();
