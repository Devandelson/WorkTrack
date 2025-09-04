import conex from '../config/db.ts';

interface SaleTypes {
    idVenta: number;
    idUser: number;
    venta: string;
    precio: number;
    fecha: Date | string;
};

export const getSales = () => {
    return new Promise((resolve, rejects) => {
        const query = 'SELECT * FROM venta';

        conex.execute(query).then((result) => {
            resolve(result[0])
        }).catch((err) => {
            rejects(`Ha ocurrido un error al seleccionar los datos: ${err}`)
        })
    })
};

export const getSale = (id: string) => {
    return new Promise((resolve, rejects) => {
        const query = 'SELECT * FROM venta WHERE idVenta = ?';

        conex.execute(query, [id]).then((result) => {
            resolve(result[0])
        }).catch((err) => {
            rejects(`Ha ocurrido un error al seleccionar el dato: ${err}`)
        })
    })
};

export const postSale = (body: SaleTypes) => {
    return new Promise((resolve, rejects) => {
        const query = 'insert into venta(idUser,venta,precio,fecha) value(?,?,?,?);';
        const { idUser, venta, precio, fecha } = body;

        conex.execute(query, [idUser, venta, precio, fecha]).then((result) => {
            resolve(result[0])
        }).catch((err) => {
            rejects(`Ha ocurrido un error al insertar el dato: ${err}`)
        })
    })
};

export const putSale = (id: string, body: SaleTypes) => {
    return new Promise((resolve, rejects) => {
        const query = "UPDATE venta SET idUser=?,venta=?,precio=?,fecha=? WHERE idVenta=?";
        const { idUser, venta, precio, fecha } = body;

        conex.execute(query, [idUser, venta, precio,fecha, id]).then((result) => {
            resolve(result[0])
        }).catch((err) => {
            rejects(`Ha ocurrido un error al actualizar el dato: ${err}`)
        })
    })
};


export const deleteSale = (id: string) => {
    return new Promise((resolve, rejects) => {
        const query = 'delete FROM venta WHERE idVenta = ?';

        conex.execute(query, [id]).then((result) => {
            resolve(result[0])
        }).catch((err) => {
            rejects(`Ha ocurrido un error al eliminar el dato: ${err}`)
        })
    })
};