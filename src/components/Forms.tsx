import React, { type ReactElement, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { useTabForm } from '../context/form.context.tsx';
import { useData } from "../context/data.context.tsx";

import type { formEmployeeValueType, formSaleValueType } from '../context/interfaceForms.tsx';
import { saveData, cancelUpdate, updateData } from '../context/ActionsEmployee.tsx';
import { saveDataSale, cancelUpdateSale, updateDataSale } from '../context/ActionsSale.tsx';

type GroupHooksType = {
    hookEmploye: formEmployeeValueType;
    sethookEmploye: React.Dispatch<
        React.SetStateAction<formEmployeeValueType>
    >;
    hookSale: formSaleValueType;
    sethookSale: React.Dispatch<
        React.SetStateAction<formSaleValueType>
    >;
};

export default function Forms({ groupHook }: { groupHook: GroupHooksType }): ReactElement {
    const { visibleForm, setVisibleForm } = useTabForm();

    const variantsForms: Variants = {
        initial: { opacity: 0, y: -10 },
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
    }

    return (
        <div className="grow w-[350px] p-3 bg-white rounded-sm animate-slide-in-bottom">
            <HeaderForms visibleForm={visibleForm} setVisibleForm={setVisibleForm} />
            <AnimatePresence>
                {visibleForm === "employee" ?
                    <FormEmployee variant={variantsForms} propsFormEmployee={groupHook.hookEmploye} setPropsFormEmployee={groupHook.sethookEmploye} />
                    : <FormSale variant={variantsForms} propsFormSale={groupHook.hookSale} setPropsFormSale={groupHook.sethookSale} />
                }
            </AnimatePresence>
        </div>
    );
}

// Header for the forms --------------------------------
function HeaderForms({ visibleForm, setVisibleForm }: { visibleForm?: string, setVisibleForm?: (form: string) => void }): ReactElement {
    return (
        <ul className="list-none flex items-center gap-4 flex-wrap mb-2 text-xl">
            <ElementHeader text="Creación de usuario" active={visibleForm === "employee"}
                handleEventClick={() => setVisibleForm?.("employee")}
                icon="fa-solid fa-user-plus"
            />
            <ElementHeader text="Ventas" active={visibleForm === "sale"}
                handleEventClick={() => setVisibleForm?.("sale")}
                icon="fa-solid fa-dollar-sign"
            />
        </ul>
    );
}

type PropsElementHeader = {
    text: string;
    active: boolean;
    handleEventClick?: () => void;
    icon?: string;
}

function ElementHeader({ text, active, handleEventClick, icon }: PropsElementHeader): ReactElement {
    const classActive: string = active ? "font-bold border-b-2 border-blue-500" : "";

    return (
        <li className={`${classActive} flex items-center gap-1 cursor-pointer transition-all`} onClick={handleEventClick}>
            <i className={icon}></i>
            {text}
        </li>
    );
}
// ---------------------------------------

// differents forms -------------

// =========== Form employee
interface formValueType {
    variant?: Variants;
    propsFormEmployee: formEmployeeValueType;
    setPropsFormEmployee: React.Dispatch<
        React.SetStateAction<formEmployeeValueType>
    >;
}

export function FormEmployee({ variant, propsFormEmployee, setPropsFormEmployee }: formValueType): ReactElement {
    const [typeAction, setTypeAction] = useState(''); // action of type save or update
    const [buttonSelect, setButtonSelect] = useState<React.ReactNode>(null); // differents buttons according to the type action.
    const [numTotalEmployee, setNumTotalEmployee] = useState(0);

    const { setData, data } = useData();
    const typeNum_typeAction = useRef<number>(0);

    useEffect(() => {
        setTypeAction(propsFormEmployee.typeAction);
    }, [propsFormEmployee])

    useEffect(() => {
        if (typeAction) {
            // num of form according to the type action
            typeNum_typeAction.current = typeAction != 'create' ?
                propsFormEmployee.idUser : 0;

            // according to the typeAction is the button
            setButtonSelect(
                typeAction == 'create' ?
                    (
                        <button type="submit" className="p-2 rounded bg-[#CA8641] text-white hover:bg-amber-600 active:scale-[0.90] active:bg-amber-700 transition-all cursor-pointer">Agregar empleado</button>
                    ) :
                    (
                        <div className="flex items-center gap-2 flex-wrap">
                            <button type="submit" className="p-2 rounded bg-[#CA8641] text-white hover:bg-amber-600 active:scale-[0.90] active:bg-amber-700 transition-all cursor-pointer">Actualizar registro</button>

                            <button type="button" className="p-2 rounded bg-[#CA8641] text-white hover:bg-amber-600 active:scale-[0.90] active:bg-amber-700 transition-all cursor-pointer"
                                onClick={() => { cancelUpdate(setPropsFormEmployee) }}>Cancelar acción</button>
                        </div>
                    )
            );

            if (typeNum_typeAction.current > 0) {
                setNumTotalEmployee(typeNum_typeAction.current);
            } else {
                const arrayData = [...data ?? []];
                const arrayIdUsers: Array<number> = [];
                arrayData.map((objectData) => {
                    arrayIdUsers.push(Number(objectData.idUser));
                })

                setNumTotalEmployee(Math.max(...arrayIdUsers) + 1);

                setPropsFormEmployee(prev => {
                    const copyPrev = { ...prev };
                    copyPrev.idUser = numTotalEmployee;
                    return copyPrev;
                })
            }
        }
    }, [typeAction, data])

    // saving values of inputs 
    function saveValue(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        // 👇 decirle a TS que name es una key válida
        const key = name as keyof formEmployeeValueType;

        setPropsFormEmployee(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <motion.form
            variants={variant}
            initial="initial"
            animate="enter"
            exit="exit"

            onSubmit={(e) => {
                if (typeAction == 'create') {
                    saveData(e, propsFormEmployee, setData, setPropsFormEmployee);
                } else {
                    updateData(e, propsFormEmployee, setPropsFormEmployee, setData);
                }
            }}
        >
            <div className="flex flex-col gap-2.5 mt-5">
                <InputForm placeholder="Nombre del empleado" name="nombre" type="text" value={propsFormEmployee.nombre} onChange={saveValue} />

                <InputForm placeholder="Correo del empleado" name="correo" type="email" value={propsFormEmployee.correo} onChange={saveValue} />

                <InputForm placeholder="Salario del empleado" name="salario" type="number" value={propsFormEmployee.salario} onChange={saveValue} />

                <InputForm placeholder="Telefono del empleado" name="telefono" type="text" value={propsFormEmployee.telefono} onChange={saveValue} />
            </div>

            <div className="mt-4 w-full flex items-center justify-between gap-2 flex-wrap">
                {buttonSelect}

                <p className="text-2xl">Id user: {numTotalEmployee}</p>
            </div>
        </motion.form>
    )
}
// ======================================

interface PropSaleType {
    variant: Variants;
    propsFormSale: formSaleValueType;
    setPropsFormSale: React.Dispatch<React.SetStateAction<formSaleValueType>>;
}

export function FormSale({ variant, propsFormSale, setPropsFormSale }: PropSaleType): ReactElement {
    const [typeAction, setTypeAction] = useState(''); // action of type save or update
    const [buttonSelect, setButtonSelect] = useState<React.ReactNode>(null); // differents buttons according to the type action.
    const [numTotalSale, setNumTotalSale] = useState(0);

    const { setDataSale, dataSale } = useData();
    const typeNum_typeAction = useRef<number>(0);

    useEffect(() => {
        setTypeAction(propsFormSale.typeAction);
    }, [propsFormSale])

    useEffect(() => {
        if (typeAction) {
            // num of form according to the type action
            typeNum_typeAction.current = typeAction != 'create' ?
                propsFormSale.idVenta : 0;

            // according to the typeAction is the button
            setButtonSelect(
                typeAction == 'create' ?
                    (
                        <button type="submit" className="p-2 rounded bg-[#CA8641] text-white hover:bg-amber-600 active:scale-[0.90] active:bg-amber-700 transition-all cursor-pointer">Agregar venta</button>
                    ) :
                    (
                        <div className="flex items-center gap-2 flex-wrap">
                            <button type="submit" className="p-2 rounded bg-[#CA8641] text-white hover:bg-amber-600 active:scale-[0.90] active:bg-amber-700 transition-all cursor-pointer">Actualizar registro</button>

                            <button type="button" className="p-2 rounded bg-[#CA8641] text-white hover:bg-amber-600 active:scale-[0.90] active:bg-amber-700 transition-all cursor-pointer"
                                onClick={() => { cancelUpdateSale(setPropsFormSale) }}>Cancelar acción</button>
                        </div>
                    )
            );

            if (typeNum_typeAction.current > 0) {
                setNumTotalSale(typeNum_typeAction.current);
            } else {
                const arrayData = [...dataSale ?? []];
                const arrayIdUsers: Array<number> = [];
                arrayData.map((objectData) => {
                    arrayIdUsers.push(Number(objectData.idVenta));
                })

                setNumTotalSale(Math.max(...arrayIdUsers) + 1);

                setPropsFormSale(prev => {
                    const copyPrev = { ...prev };
                    copyPrev.idVenta = Number(numTotalSale);
                    return copyPrev;
                })
            }
        }
    }, [typeAction, dataSale, numTotalSale])

    // saving values of inputs 
    function saveValue(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        // 👇 decirle a TS que name es una key válida
        const key = name as keyof formEmployeeValueType;

        setPropsFormSale(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <motion.form
            variants={variant}
            initial="initial"
            animate="enter"
            exit="exit"

            onSubmit={(e) => {
                if (typeAction == 'create') {
                    saveDataSale(e, propsFormSale, setDataSale, setPropsFormSale);
                } else {
                    updateDataSale(e, propsFormSale, setDataSale, setPropsFormSale);
                }
            }}
        >
            <div className="flex flex-col gap-2.5 mt-5">
                <InputForm placeholder="id empleado" name="idUser" type="text" value={propsFormSale.idUser} onChange={(e) => { saveValue(e) }} />

                <InputForm placeholder="descripción de la venta reciente" name="venta" type="text" value={propsFormSale.venta} onChange={(e) => { saveValue(e) }} />

                <InputForm placeholder="Precio total" name="precio" type="number" value={propsFormSale.precio} onChange={(e) => { saveValue(e) }} />

                <InputForm placeholder="Fecha" name="fecha" type="date"
                    value={String(new Date(propsFormSale.fecha).toISOString().split("T")[0])} onChange={(e) => { saveValue(e) }} />
            </div>

            <div className="mt-4 w-full flex items-center justify-between gap-2 flex-wrap">
                {buttonSelect}

                <p className="text-2xl">Id venta: {numTotalSale}</p>
            </div>
        </motion.form>
    );
}


type PropsInput = {
    placeholder: string;
    name: string;
    type: string;
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputForm({ placeholder, name, type, value, onChange }: PropsInput) {
    return (
        <input type={type} name={name} placeholder={placeholder} value={value}
            onChange={(e) => { onChange?.(e) }}
            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100 focus:bg-black/20 transition-all"
        />
    )
}