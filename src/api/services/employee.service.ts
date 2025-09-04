import conex from "../config/db";

interface empleado {
    idUser: number;
    nombre: string;
    correo: string;
    salario: number;
    telefono: string;
}

export const getEmployees = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM empleado';
        conex.execute(query).then((result) => {
            resolve(result[0]);
        }).catch((error) => {
            reject(error);
        })
    });
};

export const getEmployeeById = (id: string) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM empleado WHERE idUser = ?';
        conex.execute(query, [id]).then((result) => {
            resolve(result[0]);
        }).catch(() => {
            reject('Error fetching employee');
        });
    });
};

export const createEmployee = (body: empleado) => {
    return new Promise((resolve, reject) => {
        const { nombre, correo, salario, telefono } = body;
        const query = 'insert into empleado(nombre,email,salario,telefono) value(?,?,?,?)';
        conex.execute(query, [nombre, correo, salario, telefono]).then((result) => {
            resolve(result[0]);
        }).catch(() => {
            reject('Error creating employee');
        });
    });
};

export const updateEmployee = (id: string, body: empleado) => {
    return new Promise ((resolve, reject) => {
        const { nombre, correo, salario, telefono } = body;
        const query = 'UPDATE empleado SET nombre = ?, email = ?, salario = ?, telefono = ? WHERE idUser = ?';

        conex.execute(query, [nombre, correo, salario, telefono, id])
            .then((result) => {resolve(result[0]);})
            .catch(() => {reject('Error updating employee');}); 
    })
};

export const deleteEmployee = (id: string) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM empleado WHERE idUser = ?';
        conex.execute(query, [id]).then((result) => {
            resolve(result[0]);
        }).catch(() => {
            reject('Error deleting employee');
        });
    });
};