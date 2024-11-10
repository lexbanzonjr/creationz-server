import userModel from "../../models/yahoo/userModel";

class UserServices {
  get = async (params: { _id: string }) => {
    return await userModel.findById(params._id);
  };
}

export default new UserServices();
