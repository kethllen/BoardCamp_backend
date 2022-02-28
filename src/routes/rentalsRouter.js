import { Router } from "express";
import {
  getRentals,
  postRental,
  updateRental,
  deleteRental,
} from "../controllers/rentalsController.js";
import rentalSchema from "../schemas/rentalSchema.js";
import validSchema from "../middlewares/validSchema.js";

const rentalsRouter = Router();
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validSchema(rentalSchema), postRental);
rentalsRouter.put("/rentals", validSchema(rentalSchema), updateRental);
rentalsRouter.delete("/rentals", deleteRental);
export default rentalsRouter;
