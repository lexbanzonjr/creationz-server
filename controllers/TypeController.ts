import { Request, Response } from "express";
import { responseReturn } from "../utils/response";

import typeModel, { IType } from "../models/typeModel";
import optionModel, { IOption } from "../models/optionModel";
import { Types } from "mongoose";
import BaseController from "./BaseController";

class TypeController extends BaseController<IType> {
  constructor() {
    super({ model: typeModel, createModel: (props) => new typeModel(props) });
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

      responseReturn(res, 200, { option });
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };
}

export default new TypeController();
