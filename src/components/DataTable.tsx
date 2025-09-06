import { useEffect, useState, type ReactElement, type ReactNode } from "react"
import { motion, AnimatePresence, type Variants } from "motion/react";
import { useData } from "../context/data.context.tsx";
import { useTabForm } from '../context/form.context.tsx';
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import type { formEmployeeValueType, formSaleValueType } from '../context/interfaceForms.tsx';
type apiError = { message: string };
import getToken from '../context/getToken.ts';


export default function DataTable(
    { setPropsFormEmployee, setPropsFormSale }:
        {
            setPropsFormEmployee: React.Dispatch<React.SetStateAction<formEmployeeValueType>>,
            setPropsFormSale: React.Dispatch<React.SetStateAction<formSaleValueType>>
        }) {
    const [showTypeTable, setShowTypeTable] = useState<"employee" | "sale">("employee");
    const { setVisibleForm } = useTabForm();

    const variantsForms: Variants = {
        initial: { opacity: 0, y: -10 },
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
    }

    useEffect(() => {
        setVisibleForm?.(showTypeTable);
    }, [showTypeTable])

    return (
        <div className="grow w-[350px] animate-slide-in-top">
            <HeaderDataTable setShowTypeTable={setShowTypeTable} />
            <AnimatePresence>
                {showTypeTable === "employee"
                    ? <TableEmployee variant={variantsForms} setPropsFormEmployee={setPropsFormEmployee} />
                    : <TableSale variant={variantsForms} setPropsFormSale={setPropsFormSale} />}
            </AnimatePresence>
        </div>
    )
}

function HeaderDataTable({ setShowTypeTable }: { setShowTypeTable: React.Dispatch<React.SetStateAction<"employee" | "sale">> }): ReactElement {

    function handleShowTypeTable() {
        setShowTypeTable(prev => {
            const newValue = prev === "employee" ? "sale" : "employee";
            console.log(newValue);
            return newValue;
        });
    }

    return (
        <div className="grow flex items-center gap-3 mb-3 font-medium">
            <p>Empleados</p>

            <label className="inline-flex items-center cursor-pointer" htmlFor="toogleTableInfo">
                <input type="checkbox" defaultValue={''} className="sr-only peer" id="toogleTableInfo" onChange={() => { handleShowTypeTable() }} />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            </label>

            <p>Ventas</p>
        </div>
    )
}

type propsTables = {
    variant: Variants;
    setPropsFormEmployee: React.Dispatch<React.SetStateAction<formEmployeeValueType>>;
}


// ======================= Table employee =========================
interface objectTypesDataEmployee {
    idUser?: number;
    nombre?: string;
    email?: string;
    salario?: number;
    telefono?: string;
}

function TableEmployee({ variant, setPropsFormEmployee }: propsTables) {
    const { data, setData } = useData();
    const urlEmployeeApi: string = 'https://apirestsale.onrender.com/api/empleado';

    return (
        <motion.div className="relative overflow-x-auto rounded"
            variants={variant}
            initial="initial"
            animate="enter"
            exit="exit"
        >
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nombre
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Salario
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Telefono
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && (data.map((objectData: objectTypesDataEmployee, index) => (
                            <RowTable objectValue={objectData} key={index}>
                                <td className="px-6 py-4">
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            update_searchData(urlEmployeeApi, String(objectData.idUser), setPropsFormEmployee, undefined);
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button className="font-medium text-red-600 dark:text-red-500 hover:underline" onClick={(e) => {
                                        e.preventDefault();
                                        deleteRegister(urlEmployeeApi, String(objectData.idUser), setData)
                                    }}>
                                        Eliminar
                                    </button>
                                </td>
                            </RowTable>
                        ))
                        )
                    }
                </tbody>
            </table>
        </motion.div>
    )
}
// ========================================================

// ======================= Table Sale =========================
interface saleTypesDataSale {
    idVenta?: number;
    idUser?: number;
    venta?: string;
    precio?: number;
    fecha?: Date | string;
}

type propsTablesSale = {
    variant: Variants;
    setPropsFormSale: React.Dispatch<React.SetStateAction<formSaleValueType>>;
}

function TableSale({ variant, setPropsFormSale }: propsTablesSale) {
    const { dataSale, setDataSale } = useData();
    const urlEmployeeApi: string = 'https://apirestsale.onrender.com/api/venta';

    return (
        <motion.div className="relative overflow-x-auto rounded"
            variants={variant}
            initial="initial"
            animate="enter"
            exit="exit"
        >
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            idUser
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Venta
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Precio
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Fecha
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Controles
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dataSale && (dataSale.map((objectDataSale: saleTypesDataSale, index) => (
                            <RowTable objectDataSale={objectDataSale} key={index}>
                                <td className="px-6 py-4">
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            update_searchData(urlEmployeeApi, String(objectDataSale.idVenta), undefined, setPropsFormSale);
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button className="font-medium text-red-600 dark:text-red-500 hover:underline" onClick={(e) => {
                                        e.preventDefault();
                                        deleteRegister(urlEmployeeApi, String(objectDataSale.idVenta), undefined, setDataSale)
                                    }}>
                                        Eliminar
                                    </button>
                                </td>
                            </RowTable>
                        ))
                        )
                    }
                </tbody>
            </table>
        </motion.div>
    )
}
// ========================================================

// ================= Components general =========================
function RowTable({ objectValue, objectDataSale, children }: { objectValue?: objectTypesDataEmployee, objectDataSale?: saleTypesDataSale, children?: ReactNode }): ReactElement {
    const ArrayValues: Array<string | undefined> = [
        String(objectValue?.idUser ?? ""),
        objectValue?.nombre,
        objectValue?.email,
        String(objectValue?.salario ?? ""),
        objectValue?.telefono];


    const ArrayValuesSale: (string | undefined)[] = [
        objectDataSale?.idVenta?.toString(),
        objectDataSale?.idUser?.toString(),
        objectDataSale?.venta,
        objectDataSale?.precio?.toString(),
        objectDataSale?.fecha ? new Date(objectDataSale.fecha).toLocaleDateString() : undefined
    ];

    const typeDataSelect = objectValue ? ArrayValues : objectDataSale ? ArrayValuesSale : [];

    return (
        <>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                {
                    typeDataSelect.map((data, index) => (
                        <ColumnTable key={index} typeColumn={index == 0 ? 'main' : 'normal'} value={String(data ?? "")}></ColumnTable>
                    ))
                }
                {children}
            </tr>
        </>
    )
}

function ColumnTable({ typeColumn, value }: { typeColumn: string, value: string }): ReactElement {
    const columnSelect =
        typeColumn == 'main' ?
            (
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {value}
                </th>
            ) :
            (
                <td className="px-6 py-4">
                    {value}
                </td>
            );

    return (
        <>
            {columnSelect}
        </>
    )
}
// ==============================================================


// Actions of the tables
interface saleTypes {
    idVenta?: number;
    idUser?: number;
    venta?: string;
    precio?: number;
    fecha?: Date | string;
}

interface objectTypes {
    idUser?: number;
    nombre?: string;
    email?: string;
    salario?: number;
    telefono?: string;
}

function deleteRegister(urlApi: string, id: string, setData?: React.Dispatch<React.SetStateAction<objectTypes[]>>, setDataSale?: React.Dispatch<React.SetStateAction<saleTypes[]>>) {
    Swal.fire({
        title: "¿Estas seguro de eliminar este registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const token = await getToken();
                const response = await axios.delete(`${urlApi}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                Swal.fire({
                    title: response.data.message,
                    icon: "success"
                });

                if (setData) {
                    setData?.(prev => {
                        const copyPrev = [...prev];
                        const index = copyPrev.findIndex(obj => obj.idUser === Number(id));

                        if (index !== -1) {
                            copyPrev.splice(index, 1);
                        }

                        return copyPrev;
                    });
                }

                if (setDataSale) {
                    setDataSale?.(prev => {
                        const copyPrev = [...prev];
                        const index = copyPrev.findIndex(obj => obj.idVenta === Number(id));

                        if (index !== -1) {
                            copyPrev.splice(index, 1);
                        }

                        return copyPrev;
                    });
                }
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
    });
}

async function update_searchData(
    urlApi: string, id: string,
    setPropsFormEmployee?: React.Dispatch<React.SetStateAction<formEmployeeValueType>>,
    setPropsSale?: React.Dispatch<React.SetStateAction<formSaleValueType>>) {
    try {
        const token = await getToken();
        const response = await axios.get(`${urlApi}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        Swal.fire({
            title: response.data.message,
            icon: "success"
        });

        if (setPropsFormEmployee) {
            setPropsFormEmployee((prev: formEmployeeValueType) => {
                const copyPrev = { ...prev };
                copyPrev.nombre = response.data.data[0].nombre;
                copyPrev.correo = response.data.data[0].email;
                copyPrev.salario = response.data.data[0].salario;
                copyPrev.telefono = response.data.data[0].telefono;
                copyPrev.idUser = response.data.data[0].idUser;
                copyPrev.typeAction = 'update';
                return copyPrev;
            });
        }

        if (setPropsSale) {
            setPropsSale((prev: formSaleValueType) => {
                const copyPrev = { ...prev };
                copyPrev.idVenta = response.data.data[0].idVenta;
                copyPrev.idUser = response.data.data[0].idUser;
                copyPrev.venta = response.data.data[0].venta;
                copyPrev.precio = parseInt(response.data.data[0].precio);
                copyPrev.fecha = response.data.data[0].fecha;
                copyPrev.typeAction = 'update';
                return copyPrev;
            });
        }
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