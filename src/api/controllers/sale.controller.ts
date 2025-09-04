import type { Request, Response } from "express";
import * as SaleService from '../services/sale.service.js';

export const getSales = (req: Request, res: Response) => {
    SaleService.getSales().then((result) => {
        res.status(200).json({
            message: 'Proceso completado (Seleccionar todos los datos)',
            data: result
        })
    }).catch(() => {
        res.status(500).json({ message: 'Ocurrio un error en el server' });
    })
};

export const getSale = (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).json({ message: 'Petición mal formada, posiblemente falta un parametro' });
    }

    SaleService.getSale(id).then((result) => {
        res.status(200).json({
            message: 'Proceso completado (Seleccionar un dato)',
            data: result
        })
    }).catch(() => {
        res.status(500).json({ message: 'Ocurrio un error en el server' });
    })
};

export const postSale = (req: Request, res: Response) => {
    const body = req.body;
    const { idUser, venta, precio, fecha } = body;
    
    // Format : "yyyy-mm-dd"
    const regexDate = /^\d{4}-\d{2}-\d{2}$/;

    if (idUser == undefined || venta == '' || precio == undefined || fecha == undefined || fecha == '') { res.status(400).json({ message: 'Petición mal formada, falta un parametro' }) }

    if (!regexDate.test(fecha)) {
        res.status(400).json({ message: 'Error: Formato no valido, el formato valido es(yyyy-mm-dd).' });
    }

    console.log(fecha);
    

    SaleService.postSale(body).then((result) => {
        res.status(200).json({
            message: 'Proceso completado (insertar un dato)',
            data: result
        })
    }).catch(() => {
        res.status(500).json({ message: 'Ocurrio un error en el server' });
    })
};

export const putSale = (req: Request, res: Response) => {
    const body = req.body;
    const id = req.params.id;
    const { idUser, venta, precio, fecha } = body;

    // Format : "yyyy-mm-dd"
    const regexDate = /^\d{4}-\d{2}-\d{2}$/;

    if (!id) {
        res.status(400).json({ message: 'Petición mal formada, posiblemente falta un parametro' });
    }

    if (idUser == undefined || venta == '' || precio == undefined || fecha == '' || fecha == undefined) { res.status(400).json({ message: 'Petición mal formada, falta un parametro' }) }

    if (!regexDate.test(fecha)) {
        res.status(400).json({ message: 'Error: Formato no valido, el formato valido es(yyyy-mm-dd).' });
    }

    SaleService.putSale(id, body).then((result) => {
        res.status(200).json({
            message: 'Proceso completado (actualizar un dato)',
            data: result
        })
    }).catch(() => {
        res.status(500).json({ message: 'Ocurrio un error en el server' });
    })
};


export const deleteSale = (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).json({ message: 'Petición mal formada, posiblemente falta un parametro' });
    }

    SaleService.deleteSale(id).then((result) => {
        res.status(200).json({
            message: 'Proceso completado (eliminar un dato)',
            data: result
        })
    }).catch(() => {
        res.status(500).json({ message: 'Ocurrio un error en el server' });
    })
};