import * as employeeService from "../services/employee.service.ts";
import type { Request, Response } from "express";

interface empleadoController {
    idUser: number;
    nombre: string;
    correo: string;
    salario: number;
    telefono: string;
}

export const getEmployees = (req: Request, res: Response) => {
    employeeService.getEmployees()
        .then((result) => {
            res.status(200).json({
                message: 'Todo correcto',
                data: result
            });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error fetching employees', error });
        });
};

export const getEmployeeById = (req: Request, res: Response) => {
    const id: string = req.params.id;

    if (!id) { res.status(400).json({ message: 'Petición mal formada, posiblemente falta un parametro' }) }

    employeeService.getEmployeeById(id)
        .then((result) => {
            res.status(200).json({
                message: 'Proceso completado (Registro obtenido).',
                data: result
            });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error fetching employees', error });
        });
};

export const createEmployee = (req: Request, res: Response) => {
    const body: empleadoController = req.body;

    if (body.nombre == '' || body.correo == '' || body.salario == undefined || body.telefono == '') { res.status(400).json({ message: 'Petición mal formada, falta un parametro' }) }

    employeeService.createEmployee(body)
        .then((result) => {
            res.status(201).json({
                message: 'Proceso completado (Se creo un usuario).',
                data: result
            });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error fetching employees', error });
        });
};

export const updateEmployee = (req: Request, res: Response) => {
    const body: empleadoController = req.body;
    const id: string = req.params.id;

    if (body.nombre == '' || body.correo == '' || body.salario == undefined || body.telefono == '' || !id) { res.status(400).json({ message: 'Petición mal formada, falta un parametro' }) }

    employeeService.updateEmployee(id, body)
        .then((result) => {
            res.status(200).json({
                message: 'Proceso completado (se actualizo un usuario)',
                data: result
            });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error fetching employees', error });
        });
};

export const deleteEmployee = (req: Request, res: Response) => {
    const id: string = req.params.id;

    if (!id) { res.status(400).json({ message: 'Petición mal formada, posiblemente falta un parametro' }) }

    employeeService.deleteEmployee(id)
        .then((result) => {
            res.status(201).json({
                message: 'Proceso completado (se elimino un usuario).',
                data: result
            });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error to delete employee', error });
        });
};