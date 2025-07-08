import { Request, Response } from "express";

import cartModel from "../models/cartModel";
import userModel from "../models/userModel";
import { sendJsonResponse } from "../utils/response";
import { createToken, refreshToken } from "../utils/token";

class AuthHandler {
  async guestToken(req: Request, res: Response, next: any) {
    const cart = new cartModel({});
    await cart.save();
    const token = createToken({
      cartId: cart._id,
      tokenType: "guest",
    });
    sendJsonResponse(res, 200, { token });
    next();
  }

  async login(req: Request, res: Response, next: any) {
    const authHeader = req.headers["authorization"]; // Get the Authorization header

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).send("Missing or invalid Authorization header");
    }

    // Extract the Base64 encoded part (after "Basic ")
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf8"
    );

    // Split the credentials into username and password
    const [email, password] = credentials.split(":");

    if (!email || !password) {
      return res.status(401).send("Invalid Basic Authentication credentials");
    }

    try {
      let user = await userModel.findOne({ email, password });
      if (null === user) {
        throw new Error("User not found");
      }

      const token = createToken({
        userId: user._id,
        roles: user.roles,
        tokenType: "access",
      });
      const idToken = {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      };
      user.lastLogIn = new Date();
      user = await user.save();
      sendJsonResponse(res, 200, { token, idToken });
    } catch (error: any) {
      sendJsonResponse(res, 500, { error: error.message });
    }
    next();
  }

  async register(req: Request, res: Response, next: any) {
    const { name, email, password } = req.body;
    const user = new userModel({ name, email, password, roles: ["customer"] });
    await user.save();
    sendJsonResponse(res, 200);
    next();
  }

  async refreshToken(req: Request, res: Response, next: any) {
    const { token } = req.body;
    const newToken = refreshToken(token);
    sendJsonResponse(res, 200, { token: newToken });
    next();
  }
}

export default new AuthHandler();
