import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
type ApiError = { message: string };

export default async function getToken() {
    try {
        const response = await axios.get('https://apirestsale.onrender.com/GetToken', 
        {headers: {passGet: '$2y$06$k6g.jmkN8MYo9cqfgmnSaOXhKxoB7tSe2E0/1rRxHQuTEEBLyHS3W'}});
        const  result = await response.data.AccessToken; 

        return result;
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const axiosError = err as AxiosError<ApiError>;
            if (axiosError.response) {
                // Aquí ya está tipado
                Swal.fire(axiosError.response.data.message);
            } else if (axiosError.request) {
                Swal.fire("El servidor no respondió");
            } else {
                Swal.fire("Error al configurar la petición");
            }
        } else {
            Swal.fire(`Error desconocido: ${err}`);
        }
    }
}