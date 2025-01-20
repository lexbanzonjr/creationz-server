import userModel, { IUser } from "../models/userModel";
import BaseController from "./BaseController";

class UserController extends BaseController<IUser> {
  constructor() {
    super({
      model: userModel,
    });
  }
}

export default new UserController();
