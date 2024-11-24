import axios from "axios";
import userModel, { IUser } from "../models/userModel";
import { parseStringPromise } from "xml2js";
import LeagueServices from "./LeagueServices";

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

  sync = async (params: { access_token: string; user: IUser }) => {
    let user = params.user;
    // sync user properties
    user.guid = await this.get_guid({
      access_token: params.access_token,
    });

    // sync fantasy
    LeagueServices.sync(params);

    user.lastSync = new Date();
    user = await user.save();
  };
}

export default new UserServices();
