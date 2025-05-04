import { Model, Schema, model } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";
import { BaseModel } from "./BaseModel";

export interface ICategory extends BaseModel {
  name: string;
  description: string;
  designs: {
    name: string;
    type: string;
  }[];
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    require: true,
    index: true,
  },
  description: {
    type: String,
  },
  designs: [
    {
      name: {
        type: String,
      },
      type: {
        type: String,
      },
    },
  ],
});

addExMethods(categorySchema, { listName: "categories" });

categorySchema.pre("save", async function (next) {
  const model = this.constructor as Model<ICategory>;

  if (this.name === "") {
    let int = 0;
    this.name = "category" + int;
    while (await model.exists({ name: this.name })) {
      this.name = "category" + int++;
    }
  }

  next();
});

export default model<ICategory, ExModel<ICategory>>("category", categorySchema);
