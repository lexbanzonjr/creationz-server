import productModel, { IProduct } from "../models/productModel";
import BaseHandler from "./BaseHandler";

class ProductHandler extends BaseHandler<IProduct> {
  constructor() {
    super({ model: productModel });
  }
}

export default new ProductHandler();
