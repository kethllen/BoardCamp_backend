import { Router } from "express";
import {
  getCustomers,
  postCustomer,
  updateCustomer,
} from "../controllers/customersController.js";
import customerSchema from "../schemas/customerSchema.js";
import validSchema from "../middlewares/validSchema.js";

const customersRouter = Router();
customersRouter.get("/customers", getCustomers);
customersRouter.post("/customers", validSchema(customerSchema), postCustomer);
customersRouter.put("/customers", validSchema(customerSchema), updateCustomer);
export default customersRouter;
