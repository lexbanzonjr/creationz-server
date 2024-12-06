import productModel, { IProduct } from "../models/productModel";
import BaseController from "./BaseController";

class ProductController extends BaseController<IProduct> {
  constructor() {
    super({
      model: productModel,
      createModel: (props) => new productModel(props),
    });
  }
}

export default new ProductController();
