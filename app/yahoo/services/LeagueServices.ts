import axios from "axios";
import { parseStringPromise } from "xml2js";
import leagueModel, { ILeague } from "../models/leagueModel";
import userModel, { IUser } from "../models/userModel";
import { Types } from "mongoose";

export class LeagueServices {
  getRecord = async (params: { _id?: string; league_key?: string }) => {
    const league = await leagueModel.find({
      _id: params._id,
      league_key: params.league_key,
    });
    if (league === undefined) {
      throw new Error("Unknown league: " + params);
    }
    return league[0];
  };

  sync = async (params: {
    access_token: string;
    user: IUser;
    name?: string;
  }) => {
    const leagues: ILeague[] = [];
    const response = await axios.get(
      "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games/leagues",
      {
        headers: {
          Authorization: `Bearer ${params.access_token}`,
        },
      }
    );
    const jsonResponse = await parseStringPromise(response.data);
    interface jsonGame {
      leagues?: jsonLeague[];
    }
    interface jsonLeague {
      league: jsonLeagueDetails[];
    }
    interface jsonLeagueDetails {
      league_key: String;
      name: String;
      end_date: String;
    }
    const jsonGames: jsonGame[] =
      jsonResponse.fantasy_content.users[0].user[0].games[0].game;

    // Loop through each league you've ever been in
    for (const game of jsonGames) {
      const jsonLeagues = game.leagues;

      if (jsonLeagues === undefined) continue;

      for (const jsonLeague of jsonLeagues) {
        const league_key = jsonLeague.league[0].league_key[0];
        const name = jsonLeague.league[0].name[0];
        const end_date = jsonLeague.league[0].end_date[0];

        // Add to the list
        const paramExists = params.name;
        const doesOneParamMatch = name === params.name;
        if (paramExists ? doesOneParamMatch : true) {
          let league = await leagueModel.findOne({ league_key });
          if (league === null) {
            league = new leagueModel({});
            league.league_key = league_key;
            league.name = name;
            league = await league.save();
          }

          // check if league has ended
          league.ended = new Date() > new Date(end_date);
          leagues.push(league);
        }
      }
    }

    await userModel.findByIdAndUpdate(params.user._id, {
      $set: { "fantasy.leagues": [] },
    });

    await userModel.findByIdAndUpdate(params.user.id, {
      $addToSet: { "fantasy.leagues": leagues },
    });

    return { leagues };
  };
}

export default new LeagueServices();