import { Router } from "express";
import {
  getCustomers,
  postCustomer,
  updateCustomer,
  getCustomer,
} from "../controllers/customersController.js";
import customerSchema from "../schemas/customerSchema.js";
import validSchema from "../middlewares/validSchema.js";

const customersRouter = Router();
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.post("/customers", validSchema(customerSchema), postCustomer);
customersRouter.put(
  " /customers/:id",
  validSchema(customerSchema),
  updateCustomer
);
export default customersRouter;
