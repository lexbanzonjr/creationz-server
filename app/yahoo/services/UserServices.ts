import axios from "axios";
import userModel, { userSchema } from "../models/userModel";
import { parseStringPromise } from "xml2js";
import { RestError } from "../../../utils/RestError";

class UserServices {
  get = async (params: { _id: string }) => {
    return await userModel.findById(params._id);
  };

  get_guid = async (params: { access_token: string }) => {
    const response = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1`,
      {
        headers: {
          Authorization: `Bearer ${params.access_token}`,
        },
      }
    );

    // xml to json
    const jsonResponse = await parseStringPromise(response.data);
    return jsonResponse.fantasy_content.users[0].user[0].guid[0];
  };

  sync = async (params: { access_token: string; userId: string }) => {
    let user = await userModel.findById(params.userId);
    if (null === user) {
      throw new RestError("User not found", { status: 400 });
    }
    user.guid = await this.get_guid(params);
    user = await user.save();

    return { user };
  };
}

export default new UserServices();
