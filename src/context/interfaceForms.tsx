interface formEmployeeValueType {
  nombre: string;
  correo: string;
  salario: number | string;
  telefono: string;
  typeAction: string;
  idUser: number;
}

interface formSaleValueType {
  idVenta: number;
  idUser: number | string;
  venta: string;
  precio: number | string;
  fecha: Date | string;
  typeAction: string;
}

export type { formEmployeeValueType, formSaleValueType };