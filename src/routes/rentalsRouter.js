import { Router } from "express";
import {
  getRentals,
  postRental,
  returnRental,
  deleteRental,
} from "../controllers/rentalsController.js";
import rentalSchema from "../schemas/rentalSchema.js";
import validSchema from "../middlewares/validSchema.js";

const rentalsRouter = Router();
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validSchema(rentalSchema), postRental);
rentalsRouter.post("/rentals/:id/return", returnRental);
rentalsRouter.delete("/rentals/:id", deleteRental);
export default rentalsRouter;
