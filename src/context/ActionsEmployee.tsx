import Swal from "sweetalert2";
import axios, { AxiosError } from 'axios';
type apiError = { message: string };
import type { formEmployeeValueType } from '../context/interfaceForms.tsx';
import getToken from "./getToken.ts";

interface objectTypes {
    idUser?: number;
    nombre?: string;
    email?: string;
    salario?: number;
    telefono?: string;
}

// function for save in the server
type saveDataType = (
    e: React.FormEvent<HTMLFormElement>,
    propsFormEmployee: formEmployeeValueType,
    setData?: React.Dispatch<React.SetStateAction<objectTypes[]>>,
    setPropsFormEmployee?: React.Dispatch<React.SetStateAction<formEmployeeValueType>>
) => Promise<void>;

const saveData: saveDataType = async (e, propsFormEmployee, setData, setPropsFormEmployee) => {
    e.preventDefault();

    const { idUser, nombre, correo, telefono, salario } = propsFormEmployee;

    if (nombre == '' || correo == '' || telefono == '' || salario == '') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, completa todos los campos.'
        });
        return;
    }

    const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{3,}$/;
    if (!emailRegex.test(correo)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, Ingrese un correo con este formato [(a-z@gmail-otros.com-otros)].'
        });
        return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(telefono)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, Ingrese un telefono sin guiones ni simbolos.'
        });
        return;
    }

    try {
        const token = await getToken();
        const response = await axios.post('https://apirestsale.onrender.com/api/empleado', { nombre, correo, telefono, salario },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
            icon: 'success',
            title: response.data.message,
        });

        setData?.(prev => {
            const copyPrev = [...prev];
            const arrayValues = {
                idUser: idUser,
                nombre: nombre,
                email: correo,
                salario: Number(salario),
                telefono: telefono,
            };

            copyPrev.push(arrayValues);
            return copyPrev;
        });

        setPropsFormEmployee?.(prev => {
            const copyPrev = { ...prev };
            copyPrev.nombre = '';
            copyPrev.correo = '';
            copyPrev.telefono = '';
            copyPrev.salario = '';
            return copyPrev;
        });
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const Error = err as AxiosError<apiError>;

            if (Error.response) {
                // Aquí ya está tipado
                Swal.fire(Error.response.data.message);
            } else if (Error.request) {
                Swal.fire("El servidor no respondió");
            } else {
                Swal.fire("Error al configurar la petición");
            }
        } else {
            Swal.fire(`Error desconocido: ${err}`);
        }
    }
}

// function for cancel the action update.
const cancelUpdate = (setPropsFormEmployee: React.Dispatch<React.SetStateAction<formEmployeeValueType>>) => {
    setPropsFormEmployee((prev) => {
        const copyPrev = { ...prev };
        copyPrev.nombre = '';
        copyPrev.salario = '';
        copyPrev.telefono = '';
        copyPrev.correo = '';
        copyPrev.typeAction = 'create';

        return copyPrev;
    })
}

// function for update data in the server
const updateData = async (e: React.FormEvent<HTMLFormElement>, propsFormEmployee: formEmployeeValueType, setPropsFormEmployee?: React.Dispatch<React.SetStateAction<formEmployeeValueType>>, setData?: React.Dispatch<React.SetStateAction<objectTypes[]>>) => {
    e.preventDefault();
    const { nombre, correo, telefono, salario, idUser } = propsFormEmployee;

    if (nombre == '' || correo == '' || telefono == '' || salario == '') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, completa todos los campos.'
        });
        return;
    }

    const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{3,}$/;
    if (!emailRegex.test(correo)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, Ingrese un correo con este formato [(a-z@gmail-otros.com-otros)].'
        });
        return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(telefono)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, Ingrese un telefono sin guiones ni simbolos.'
        });
        return;
    }

    try {
        const token = await getToken();
        const response = await axios.put(`https://apirestsale.onrender.com/api/empleado/${idUser}`, { nombre, correo, telefono, salario },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire(response.data.message);

        setData?.(prev => {
            const copyPrev = [...prev]; // copia el array
            const index = copyPrev.findIndex(obj => obj.idUser === idUser);

            if (index !== -1) {
                copyPrev[index] = {
                    ...copyPrev[index],
                    nombre: nombre,
                    email: correo,
                    salario: Number(salario),
                    telefono: telefono,
                };
            }

            return copyPrev;
        });

        setPropsFormEmployee?.(prev => {
            const copyPrev = { ...prev };
            copyPrev.nombre = '';
            copyPrev.correo = '';
            copyPrev.telefono = '';
            copyPrev.salario = '';
            copyPrev.typeAction = 'create';
            copyPrev.idUser = 0;
            return copyPrev;
        });
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const Error = err as AxiosError<apiError>;

            if (Error.response) {
                // Aquí ya está tipado
                Swal.fire(Error.response.data.message);
            } else if (Error.request) {
                Swal.fire("El servidor no respondió");
            } else {
                Swal.fire("Error al configurar la petición");
            }
        } else {
            Swal.fire(`Error desconocido: ${err}`);
        }
    }
}

export { saveData, cancelUpdate, updateData };