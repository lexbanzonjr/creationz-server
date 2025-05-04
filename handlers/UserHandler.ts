import userModel, { IUser } from "../models/userModel";
import BaseHandler from "./BaseHandler";

class UserHandler extends BaseHandler<IUser> {
  constructor() {
    super({
      model: userModel,
    });
  }
}

export default new UserHandler();
