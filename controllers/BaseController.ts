import { Request, Response } from "express";
import { Document } from "mongoose";
import { ExModel } from "../models/mongoose";
import { responseReturn } from "../utils/response";
import { RestError } from "../utils/RestError";

export interface BaseControllerProps<T extends Document<unknown, any, any>> {
  model: ExModel<T>;

  createModel: (props: any) => T;
}

export default class BaseController<T extends Document<unknown, any, any>> {
  model: ExModel<T>;

  createModel: (props: any) => T;

  constructor({ model, createModel }: BaseControllerProps<T>) {
    this.model = model;
    this.createModel = createModel;
  }

  create = async (req: Request, res: Response, next: any) => {
    const props = req.body;
    if (props.hasOwnProperty("_id")) {
      delete props._id;
    }

    try {
      // look for object by indexes
      const indexes = await this.model.getIndexes();
      let query: any = {};
      indexes.forEach((name) => (query[name] = props[name]));

      if (await this.model.exists(query)) {
        throw new RestError("Name already exist", {
          status: 400,
        });
      }
      let doc = this.createModel(props);
      doc = await doc.save();

      const response: any = {};
      response[this.model.modelName] = doc;

      responseReturn(res, 200, response);
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };

  delete = async (req: Request, res: Response, next: any) => {
    const { _id } = req.query;
    try {
      await this.model.findByIdAndDelete(_id);

      responseReturn(res, 200);
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };

  list = async (req: Request, res: Response, next: any) => {
    await this.model.getIndexes();
    const populate = req.query.populate as string;
    try {
      const models = await this.model.getReferencedModels(populate);
      let list: any = await this.model.find().populate<T>(models);
      if (list === undefined) {
        list = [];
      }
      let response: any = {};
      response[this.model.getListName()] = list;
      responseReturn(res, 200, response);
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };

  update = async (req: Request, res: Response, next: any) => {
    const props = req.body;
    try {
      const model = await this.model.findByIdAndUpdate(props._id, props, {
        new: true,
        runValidators: true,
      });
      if (null === model) {
        throw new RestError("Record not found", { status: 404 });
      }

      const response: any = {};
      response[this.model.modelName] = model;

      responseReturn(res, 200, response);
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
  };
}
