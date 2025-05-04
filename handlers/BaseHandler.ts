import { Request, Response } from "express";
import { Document } from "mongoose";
import { ExModel } from "../models/mongoose";
import { sendJsonResponse } from "../utils/response";
import { RestError } from "../utils/RestError";

export interface BaseHandlerProps<T extends Document> {
  model: ExModel<T>;
}

export default class BaseHandler<T extends Document> {
  model: ExModel<T>;

  constructor({ model }: BaseHandlerProps<T>) {
    this.model = model;
  }

  async create(req: Request, res: Response, next: any) {
    // Remove _id property to avoid mongoose errors
    const props = { ...req.body };
    if (props.hasOwnProperty("_id")) {
      delete props._id;
    }

    try {
      // Look for object by indexes
      const indexes = await this.model.getIndexes();

      // Build the query
      const query = indexes.reduce((acc, name) => {
        acc[name] = props[name];
        return acc;
      }, {} as Record<string, any>);

      // Check if object exists
      if (await this.model.exists(query)) {
        throw new RestError("Name already exist", {
          status: 400,
        });
      }

      // Create and save the object
      const doc = await (await this.model.create(query)).save();

      // Create response
      const createResponse = async (doc: any, indexes: string[]) => {
        const response = { [this.model.modelName]: doc };

        // Don't include any buffers in response
        const buffers = await this.model.getBuffers();
        buffers.forEach(
          (buffer) => delete response[this.model.modelName][buffer]
        );

        return response;
      };
      const response = await createResponse(doc, indexes);
      console.log(response);

      sendJsonResponse(res, 200, response);
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
    next();
  }

  async get(req: Request, res: Response, next: any) {
    try {
      const doc = await this.model.findByIdEx(req.params._id);
      if (!doc)
        throw new RestError(
          `${this.model.modelName} "${req.params._id}" does not exist`,
          { status: 404 }
        );

      const response: any = { [this.model.modelName]: doc };
      sendJsonResponse(res, 200, response);
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
    next();
  }

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
      const list = (await this.model.find().populate<T>(models)) ?? [];

      const response = { [this.model.getListName()]: list };
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
      if (!model) {
        throw new RestError("Record not found", { status: 404 });
      }

      const response = { [this.model.modelName]: model };
      sendJsonResponse(res, 200, response);
    } catch (error: any) {
      sendJsonResponse(res, error.status || 500, { error: error.message });
    }
  };
}
