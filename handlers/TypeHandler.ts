import { Request, Response } from "express";
import { sendJsonResponse } from "../utils/response";

import typeModel, { IType } from "../models/typeModel";
import optionModel, { IOption } from "../models/optionModel";
import { Types } from "mongoose";
import BaseHandler from "./BaseHandler";

class TypeHandler extends BaseHandler<IType> {
  constructor() {
    super({
      model: typeModel,
    });
  }

  createOption = async (req: Request, res: Response, next: any) => {
    try {
      // Get Type object
      const { type_id } = req.params;
      let type = await typeModel.get({ _id: type_id });

      // Make sure we have Option object
      const newOption = req.body.option as IOption;
      let option = await optionModel.findOne({ name: newOption.name });
      if (null == option) {
        option = new optionModel({ name: newOption.name });
        option = await option.save();
      }

      type.options.push({
        _id: option._id,
      } as Types.ObjectId & IOption);
      type = await type.save();

      sendJsonResponse(res, 200, { option });
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
    next();
  };
}

export default new TypeHandler();
