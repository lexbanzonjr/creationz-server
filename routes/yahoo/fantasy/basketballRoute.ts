import { Router } from "express";
import { authMiddleware } from "../../../middlewares/yahoo/authMiddleware";
import basketball from "../../../controllers/yahoo/fantasy/basketballController";
import { tokenMiddleware } from "../../../middlewares/yahoo/tokenMiddleware";

namespace Yahoo {
  export namespace Fantasy {
    export namespace Basketball {
      export let router = Router();
      router.get("/team", [authMiddleware, tokenMiddleware], basketball.team);
    }
  }
}

module.exports = Yahoo.Fantasy.Basketball.router;
