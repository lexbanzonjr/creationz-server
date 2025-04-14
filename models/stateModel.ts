import { Document, Schema, model } from "mongoose";
import { addExMethods, ExModel } from "./mongoose";
import { BaseModel } from "./BaseModel";

export interface IState extends BaseModel {
  data: Object;
}

const stateSchema = new Schema<IState>({
  data: {
    type: Object,
  },
});

addExMethods(stateSchema, { listName: "states" });

export default model<IState, ExModel<IState>>("state", stateSchema);
