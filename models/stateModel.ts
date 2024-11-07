import { Schema, model, now } from "mongoose";

export interface IState {
  data: Object;
}

const stateSchema = new Schema<IState>({
  data: {
    type: Object,
  },
});

export default model<IState>("users", stateSchema);
