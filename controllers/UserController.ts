import userModel, { IUser } from "../models/userModel";
import BaseController from "./BaseController";

class UserController extends BaseController<IUser> {
  constructor() {
    super({
      model: userModel,
      createModel: async (props) => new userModel(props),
    });
  }
}

export default new UserController();
