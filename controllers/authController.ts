import { Request, Response } from "express";

class authController {
  admin_login = (req: Request, res: Response, next: any) => {
    console.log(req.body);
    res.json({ you: "fuck" });
    next();
  };
}

module.exports = new authController();
