import { Router } from "express";
import * as employeeController from "../controllers/employee.controller";
const employeeRouter = Router();

employeeRouter.get(`/`, employeeController.getEmployees);
employeeRouter.get(`/:id`, employeeController.getEmployeeById);
employeeRouter.post(`/`, employeeController.createEmployee);
employeeRouter.put(`/:id`, employeeController.updateEmployee);
employeeRouter.delete(`/:id`, employeeController.deleteEmployee);

export default employeeRouter;