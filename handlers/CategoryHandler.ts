import categoryModel, { ICategory } from "../models/categoryModel";
import BaseHandler from "./BaseHandler";

class CategoryHandler extends BaseHandler<ICategory> {
  constructor() {
    super({ model: categoryModel });
  }
}

export default new CategoryHandler();
