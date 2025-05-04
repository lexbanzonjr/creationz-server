import { Model, Schema, Types, model } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";
import { BaseModel } from "./BaseModel";

export interface IProduct extends BaseModel {
  name: string;
  description: string;
  cost: number;
  category_id?: Types.ObjectId;
  image_id?: Types.ObjectId[];
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    require: true,
    index: true,
  },
  cost: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "category",
  },
  image_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "binary",
    },
  ],
});

addExMethods(productSchema, { listName: "products" });

productSchema.pre("save", async function (next) {
  const model = this.constructor as Model<IProduct>;
  delete this.category_id;
  if (this.name === "") {
    let counter = 0;
    this.name = "product" + counter;
    while (await model.exists({ name: this.name })) {
      this.name = "product" + counter++;
    }
  }
  next();
});

export default model<IProduct, ExModel<IProduct>>("product", productSchema);
