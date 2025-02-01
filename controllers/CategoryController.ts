import categoryModel, { ICategory } from "../models/categoryModel";
import BaseController from "./BaseController";

class CategoryController extends BaseController<ICategory> {
  constructor() {
    super({
      model: categoryModel,
      modifyProps: async (props: ICategory) => {
        if (props.name === "") {
          let int = 0;
          props.name = "category" + int;
          while (null !== (await categoryModel.exists({ name: props.name }))) {
            props.name = "category" + int++;
          }
        }
      },
    });
  }
}

export default new CategoryController();
