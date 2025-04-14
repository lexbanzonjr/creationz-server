import { Request, Response } from "express";
import { Document } from "mongoose";
import { ExModel } from "../models/mongoose";
import { sendJsonResponse } from "../utils/response";
import { RestError } from "../utils/RestError";

export interface BaseControllerProps<T extends Document<unknown, any, any>> {
  model: ExModel<T>;

  createModelOverride?: (req: Request, res: Response, props: T) => Promise<T>;
  getOverride?: (req: Request, res: Response) => Promise<void>;
}

export default class BaseController<T extends Document<unknown, any, any>> {
  model: ExModel<T>;

  createModelOverride: (req: Request, res: Response, props: T) => Promise<T>;
  getOverride: (req: Request, res: Response) => Promise<void>;

  constructor({
    model,
    createModelOverride,
    getOverride,
  }: BaseControllerProps<T>) {
    this.model = model;
    this.createModelOverride = createModelOverride!;
    this.getOverride = getOverride!;
  }

  create = async (req: Request, res: Response, next: any) => {
    // Remove _id property to avoid mongoose errors
    const props = { ...req.body };
    if (props.hasOwnProperty("_id")) {
      delete props._id;
    }

    try {
      // Look for object by indexes
      const indexes = await this.model.getIndexes();
      let query: any = {};
      indexes.forEach((name) => (query[name] = props[name]));

      // Check if object exists
      if (await this.model.exists(query)) {
        throw new RestError("Name already exist", {
          status: 400,
        });
      }

      // Create and save the object
      let doc: T;
      if (this.createModelOverride!) {
        doc = await this.createModelOverride(req, res, props);
      } else {
        doc = this.createModel(props);
      }
      doc = await doc.save();

      // Create response
      const response = await this.createResponse(doc, indexes);
      console.log(response);

      sendJsonResponse(res, 200, response);
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
    next();
  };

  createModel = (props: any) => new this.model(props);

  createResponse = async (doc: any, indexes: string[]) => {
    const response: any = {};
    response[this.model.modelName] = doc;

    // Don't include any buffers in response
    const buffers = await this.model.getBuffers();
    buffers.forEach((buffer) => delete response[this.model.modelName][buffer]);

    return response;
  };

  get = async (req: Request, res: Response, next: any) => {
    try {
      if (this.getOverride!) {
        await this.getOverride(req, res);
      } else {
        let doc = await this.model.findByIdEx(req.params._id);
        if (null === doc)
          throw new RestError(
            `${this.model.modelName} "${req.params._id}" does not exist`,
            { status: 404 }
          );

        const response: any = {};
        response[this.model.modelName] = doc;
        sendJsonResponse(res, 200, response);
      }
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
    next();
  };

  delete = async (req: Request, res: Response, next: any) => {
    const { _id } = req.query;
    try {
      await this.model.findByIdAndDelete(_id);

      sendJsonResponse(res, 200);
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
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
      sendJsonResponse(res, 200, response);
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
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

      sendJsonResponse(res, 200, response);
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  };
}
