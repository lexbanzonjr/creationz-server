import categoryModel, { ICategory } from "../models/categoryModel";
import BaseController from "./BaseController";

class CategoryController extends BaseController<ICategory> {
  constructor() {
    super({
      model: categoryModel,
      createModel: async (props: ICategory) => {
        const category = new categoryModel(props);
        if (category.name === "") {
          let int = 0;
          category.name = "category" + int;
          while (
            null !== (await categoryModel.exists({ name: category.name }))
          ) {
            category.name = "category" + int++;
          }
        }
        return category;
      },
    });
  }
}

export default new CategoryController();
