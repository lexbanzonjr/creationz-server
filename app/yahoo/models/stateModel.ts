import { Document, Schema, model } from "mongoose";
import { addExMethods, BaseModel, ExModel } from "./mongoose";

export interface IState extends BaseModel {
  data: Object;
}

const stateSchema = new Schema<IState>({
  data: {
    type: Object,
  },
});

addExMethods(stateSchema);

export default model<IState, ExModel<IState>>("state", stateSchema);
