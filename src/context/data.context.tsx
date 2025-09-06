import { createContext, useContext, useState, useEffect, type ReactElement, type ReactNode } from "react";
import axios, { AxiosError } from 'axios';
import Swal from "sweetalert2";
type ApiError = { message: string };

interface objectTypes {
    idUser?: number;
    nombre?: string;
    email?: string;
    salario?: number;
    telefono?: string;
}

interface saleTypes {
    idVenta?: number;
    idUser?: number;
    venta?: string;
    precio?: number;
    fecha?: Date | string;
}

interface DataContextType {
    data?: objectTypes[];
    setData?: React.Dispatch<React.SetStateAction<objectTypes[]>>;
    dataSale?: saleTypes[];
    setDataSale?: React.Dispatch<React.SetStateAction<saleTypes[]>>;
}

const DataContext = createContext<DataContextType>({});

export function DataProvider({ children }: { children: ReactNode }): ReactElement {
    const [data, setData] = useState<objectTypes[]>([]);
    const [dataSale, setDataSale] = useState<saleTypes[]>([]);
    const [token, setToken] = useState<string | null>(null);

    // ✅ Pedir token solo una vez
    useEffect(() => {
        async function fetchToken() {
            try {
                const response = await axios.get('https://apirestsale.onrender.com/GetToken' , 
                {headers: {passget: '$2y$06$k6g.jmkN8MYo9cqfgmnSaOXhKxoB7tSe2E0/1rRxHQuTEEBLyHS3W'}});
                
                if (response.data.message) {
                    Swal.fire(`Error desconocido: ${response.data.message}`);
                }
               
                setToken(response.data.AccessToken);
            } catch (err) {
                handleAxiosError(err);
            }
        }
        fetchToken();
    }, []);

    // ✅ Cuando ya tengo el token, pido data
    useEffect(() => {
        if (!token) return;

        async function SearchData() {
            try {
                const response = await axios.get('https://apirestsale.onrender.com/api/empleado', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setData(response.data.data);
            } catch (err) {
                handleAxiosError(err);
            }
        }

        async function SearchDataSale() {
            try {
                const fechingData = await axios.get('https://apirestsale.onrender.com/api/venta', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setDataSale(fechingData.data.data);
            } catch (err) {
                handleAxiosError(err);
            }
        }

        SearchData();
        SearchDataSale();
    }, [token]); // 🔑 solo corre cuando token ya existe

    return (
        <DataContext.Provider value={{ data, setData, dataSale, setDataSale }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);

function handleAxiosError(err: unknown) {
    if (axios.isAxiosError(err)) {
        const Error = err as AxiosError<ApiError>;
        if (Error.response) Swal.fire(Error.response.data.message);
        else if (Error.status == 429) Swal.fire("⚠️ Demasiadas peticiones. Intenta más tarde.");
        else if (Error.request) Swal.fire("El servidor no respondió");
        else Swal.fire("Error al configurar la petición");
    } else {
        Swal.fire(`Error desconocido: ${err}`);
    }
}
