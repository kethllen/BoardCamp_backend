import { Router } from "express";
import {
  getCategories,
  postCategory,
} from "../controllers/categoriesController.js";
import categorySchema from "../schemas/categorySchema.js";
import validSchema from "../middlewares/validSchema.js";

const categoriesRouter = Router();
categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", validSchema(categorySchema), postCategory);

export default categoriesRouter;
