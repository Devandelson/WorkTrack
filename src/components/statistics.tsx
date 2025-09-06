import type { ChangeEvent, ReactElement } from "react"
import React, { useState, useEffect } from "react"
import { useData } from '../context/data.context.tsx';

export default function Statistics() {
    return (
        <div className="w-full h-auto flex gap-5 items-center justify-center flex-wrap">
            <EmployeeStatistics />
            <AmountStatistics />
        </div>
    )
}

function EmployeeStatistics() {
    const { data } = useData();
    const [numEmployee, setNumEmployee] = useState<number>(0);
    const [numStepsAnimation, setNumStepsAnimation] = useState<number>(345);
    const [numAnimationEmployee, setNumAnimationEmployee] = useState<number>(0);

    // 👉 mover la lógica que depende de `data` a un efecto
    useEffect(() => {
        if (!data) return;

        // reset values
        setNumEmployee(data.length);
        setNumAnimationEmployee(0);
        setNumStepsAnimation(345);

        // Circle animation
        const intervalCircle = setInterval(() => {
            setNumStepsAnimation((prev) => {
                const numStepOnload = 345 / 4;
                const copyPrev = prev - numStepOnload;

                if (copyPrev < 0) {
                    clearInterval(intervalCircle);
                    return 0;
                }
                return copyPrev;
            });
        }, 500);

        // 👉 animación de número de empleados
        const intervalAnimationNumEmployee = setInterval(() => {
            setNumAnimationEmployee((prev) => {
                const copyPrev = prev + 1;
                if (copyPrev >= numEmployee) {
                    clearInterval(intervalAnimationNumEmployee);
                    return numEmployee;
                }
                return copyPrev;
            });
        }, 30);

        return () => {clearInterval(intervalAnimationNumEmployee);  clearInterval(intervalCircle)};
    }, [data, numEmployee]);

    return (
        <section className="grow p-5 rounded-lg shadow-md bg-blue-500 text-white animate-slide-in-left">
            <HeaderStatistics title="Total de empleados" icon="fas fa-users" />
            <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                <span className="size-30 ">
                    <div className="flex items-center justify-center w-full h-full">
                        <svg className="w-full h-full">
                            <circle cx={55} cy={55} r={55} className="stroke-[5] stroke-black fill-transparent translate-y-1 translate-x-1"></circle>

                            <circle cx={55} cy={55} r={55} className="stroke-2 stroke-green-500 fill-transparent translate-y-1 translate-x-1 transition-all" style={{ strokeDasharray: 346, strokeDashoffset: numStepsAnimation }}></circle>
                        </svg>
                    </div>
                </span>
                <p className="text-8xl">{numAnimationEmployee}</p>
            </div>
        </section>
    )
};

function AmountStatistics() {
    const { dataSale } = useData();
    const [amount, setAmount] = useState(0);
    const [lastDate, setLastDate] = useState<Date | null>(null);
    const [typeSearch, setTypeSearch] = useState('');
    const [dateSpecific, setDateSpecific] = useState('');
    const [loading, setLoading] = useState(false); // estado de carga
    const [valueForInput, setValueForInput] = useState(''); // estado de carga

    useEffect(() => {
        if (!dataSale) return;

        let prevAmount = 0;
        const prevLastDate: number[] = [];

        dataSale.forEach((objectValue) => {
            // condition for filter according to month and year
            if (typeSearch === "especific") {
                const dateSale = new Date(objectValue.fecha ?? "")
                    .toISOString()
                    .slice(0, 7); // yyyy-MM

                if (dateSpecific === dateSale) {
                    prevAmount += Number(objectValue.precio ?? 0);
                }
            } else {
                prevAmount += Number(objectValue.precio ?? 0);
            }

            // save all dates enable
            if (objectValue.fecha) {
                prevLastDate.push(new Date(objectValue.fecha).getTime());
            }
        });

        const dateLastSubtotal = Math.max(...prevLastDate);
        const dateLastTotal = new Date(dateLastSubtotal);

        setAmount(prevAmount);
        setLastDate(dateLastTotal);
    }, [dataSale, typeSearch, dateSpecific]);

    
    useEffect(() => {
        if (lastDate) {
            const year = lastDate.getFullYear().toString(); // año completo
            const month = String(lastDate.getMonth() + 1).padStart(2, "0"); // mes 01-12
            setValueForInput(`${year}-${month}`); // formato correcto yyyy-MM
            
            setLoading(true);
        }
    }, [lastDate])

    function changeTypeSearchAmount(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setDateSpecific(e.target.value);
        setTypeSearch('especific');
        setAmount(0);
    }

    return (
        <section className="grow p-5 rounded-lg shadow-md bg-green-700 text-white grid grid-rows-[auto,1fr,auto] animate-slide-in-right">
            {loading == false && !valueForInput ? (<p>Cargando...</p>) : (<>
                <HeaderStatistics title="Ganancias de la empresa" icon="fas fa-dollar-sign" icon2="fa-solid fa-arrows-rotate" setTypeSearch={setTypeSearch} />

                <p className="text-6xl">${amount} DOP</p>

                <div className="mt-8 w-full flex h-auto items-center flex-wrap justify-between gap-2.5">
                    <p>
                        {'Ultima fecha registrada: ' + ((lastDate?.getMonth() ?? 0) + 1) + ' - ' + lastDate?.getFullYear()}
                    </p>

                    <span className="flex items-center gap-2">
                        <p>Elegir fecha:</p>
                        <input type="month" value={valueForInput}
                            className="border rounded-sm p-0.5 bg-black/20 border-green-900"
                            onChange={(e) => { changeTypeSearchAmount(e) }}
                        />
                    </span>
                </div>
            </>)}
        </section>
    )
}

function HeaderStatistics({ title, icon, icon2, setTypeSearch }: { title: string, icon: string, icon2?: string, setTypeSearch?: React.Dispatch<React.SetStateAction<string>> }): ReactElement {

    function handleTypeSearch(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        setTypeSearch?.('normal');
    }

    return (
        <div className="flex items-center gap-2 mb-4 text-2xl flex-wrap">
            <i className={icon}></i>
            <h2>{title}</h2>
            {icon2 && (<i className={`${icon2} ml-auto transition-all hover:animate-rotate-180 cursor-pointer hover:animate-duration-300 active:scale-[0.90]`}
                onClick={(e) => { handleTypeSearch(e) }}
            ></i>)}
        </div>
    )
}