import { Router } from "express";
import type { Request, Response } from "express";
import employeeRouter from './employee.route.ts';
import saleRouter from './sale.route.ts';

const indexRouter = Router();

indexRouter.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello, welcome to the api.' });
});

indexRouter.use('/empleado', employeeRouter);
indexRouter.use('/venta', saleRouter);


export default indexRouter;