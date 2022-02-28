import { Router } from "express";
import { getGames, postGame } from "../controllers/gamesController.js";
import gameSchema from "../schemas/gameSchema.js";
import validSchema from "../middlewares/validSchema.js";

const gamesRouter = Router();
gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validSchema(gameSchema), postGame);

export default gamesRouter;
