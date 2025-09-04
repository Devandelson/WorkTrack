import { Router } from "express";
import * as saleController from '../controllers/sale.controller';
const saleRotuer = Router();

saleRotuer.get('/', saleController.getSales);
saleRotuer.get('/:id', saleController.getSale);
saleRotuer.post('/', saleController.postSale);
saleRotuer.delete('/:id', saleController.deleteSale);
saleRotuer.put('/:id', saleController.putSale);

export default saleRotuer;