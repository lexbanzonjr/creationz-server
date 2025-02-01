import productModel, { IProduct } from "../models/productModel";
import BaseController from "./BaseController";

class ProductController extends BaseController<IProduct> {
  constructor() {
    super({
      model: productModel,
    });
  }
}

export default new ProductController();
