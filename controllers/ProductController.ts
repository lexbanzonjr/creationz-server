import productModel, { IProduct } from "../models/productModel";
import BaseController from "./BaseController";

class ProductController extends BaseController<IProduct> {
  constructor() {
    super({
      model: productModel,
      createModelOverride: async (props: IProduct) => {
        delete props.category_id;
        const product = new productModel(props);
        console.log(product);
        if (product.name === "") {
          let int = 0;
          product.name = "product" + int;
          while (null !== (await productModel.exists({ name: product.name }))) {
            product.name = "product" + int++;
          }
        }
        return product;
      },
    });
  }
}

export default new ProductController();
