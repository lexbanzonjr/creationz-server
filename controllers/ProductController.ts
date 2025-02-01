import { Request, Response } from "express";
import productModel, { IProduct } from "../models/productModel";
import BaseController from "./BaseController";

class ProductController extends BaseController<IProduct> {
  constructor() {
    super({
      model: productModel,
      createModelOverride: async (
        req: Request,
        res: Response,
        props: IProduct
      ) => {
        delete props.category_id;
        if (props.name === "") {
          let int = 0;
          props.name = "product" + int;
          while (null !== (await productModel.exists({ name: props.name }))) {
            props.name = "product" + int++;
          }
        }
        return props;
      },
    });
  }
}

export default new ProductController();
