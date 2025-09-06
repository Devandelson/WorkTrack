import Swal from "sweetalert2";
import axios, { AxiosError } from 'axios';
type apiError = { message: string };
import type { formSaleValueType } from '../context/interfaceForms.tsx';
import getToken from "./getToken.ts";

interface saleTypes {
    idVenta?: number;
    idUser?: number;
    venta?: string;
    precio?: number;
    fecha?: Date | string;
}

// function for save in the server
type saveDataType = (
    e: React.FormEvent<HTMLFormElement>,
    propsFormSale: formSaleValueType,
    setDataSale?: React.Dispatch<React.SetStateAction<saleTypes[]>>,
    setPropsFormSale?: React.Dispatch<React.SetStateAction<formSaleValueType>>
) => Promise<void>;

const saveDataSale: saveDataType = async (e, propsFormSale, setDataSale, setPropsFormSale) => {
    e.preventDefault();
    const { idUser, venta, precio, idVenta } = propsFormSale;
    console.log(idVenta);
    
    let { fecha } = propsFormSale;

    if (idUser == undefined || venta == '' || precio == '' || fecha == undefined) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, completa todos los campos.'
        });
        return;
    }

    const dateFormatter = new Date(fecha).toISOString().split("T")[0];
    fecha = dateFormatter;

    try {
        const token = await getToken();
        const response = await axios.post('https://apirestsale.onrender.com/api/venta', { idUser, venta, precio, fecha }, {
            headers: {Authorization: `Bearer ${token}`}
        });

        Swal.fire({
            icon: 'success',
            title: response.data.message,
        });

        setDataSale?.(prev => {
            const copyPrev = [...prev];

            const arrayValue = {
                idVenta: Number(idVenta),
                idUser: Number(idUser),
                venta: venta,
                precio: Number(precio),
                fecha: fecha,
            }

            copyPrev.push(arrayValue);
            return copyPrev;
        });

        setPropsFormSale?.(prev => {
            const copyPrev = { ...prev };
            copyPrev.idUser = '';
            copyPrev.venta = '';
            copyPrev.precio = '';
            copyPrev.fecha = new Date();
            copyPrev.typeAction = 'create';
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
const cancelUpdateSale = (setPropsFormSale: React.Dispatch<React.SetStateAction<formSaleValueType>>) => {
    setPropsFormSale((prev) => {
        const copyPrev = { ...prev };
        copyPrev.idUser = '';
        copyPrev.fecha = new Date();
        copyPrev.venta = '';
        copyPrev.precio = '';
        copyPrev.typeAction = 'create';

        return copyPrev;
    })
}

// function for update data in the server
const updateDataSale: saveDataType = async (e, propsFormSale, setDataSale, setPropsFormSale) => {
    e.preventDefault();
    const { idUser, venta, precio, idVenta } = propsFormSale;
    let { fecha } = propsFormSale;

    if (idUser == undefined || venta == '' || precio == '' || fecha == undefined) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, completa todos los campos.'
        });
        return;
    }

    const dateFormatter = new Date(fecha).toISOString().split("T")[0];
    fecha = dateFormatter;

    try {
        const token = await getToken();
        const response = await axios.put(`https://apirestsale.onrender.com/api/venta/${idVenta}`, { idUser, venta, precio, fecha }, {
            headers: {Authorization: `Bearer ${token}`}
        });

        Swal.fire(response.data.message);

        setDataSale?.(prev => {
            const copyPrev = [...prev];
            const index = copyPrev.findIndex(obj => obj.idVenta === idVenta);

            if (index !== -1) {
                copyPrev[index] = {
                    ...copyPrev[index],
                    idUser: Number(idUser),
                    venta: venta,
                    precio: Number(precio),
                    fecha: fecha,
                };
            }

            return copyPrev;
        });

        setPropsFormSale?.(prev => {
            const copyPrev = { ...prev };
            copyPrev.idUser = '';
            copyPrev.venta = '';
            copyPrev.precio = '';
            copyPrev.fecha = new Date();
            copyPrev.typeAction = 'create';
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

export { saveDataSale, cancelUpdateSale, updateDataSale };