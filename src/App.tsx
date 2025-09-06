import Header from './components/header.tsx';
import Statistics from './components/statistics.tsx';
import Forms from './components/Forms.tsx';
import DataTable from './components/DataTable.tsx';
// ---------------------------------------------------------
import { DataProvider } from "./context/data.context.tsx";
import { TabformProvider } from "./context/form.context.tsx";

import { useState } from 'react';
import type { formEmployeeValueType, formSaleValueType } from './context/interfaceForms.tsx';

function App() {
  // Hook of the employee
  const FormValueEmployee: formEmployeeValueType = {
    nombre: '',
    correo: '',
    salario: '',
    telefono: '',
    typeAction: 'create',
    idUser: 0
  };
  const [propsFormEmployee, setPropsFormEmployee] = useState<formEmployeeValueType>(FormValueEmployee);

  // Hook of the sale
  const FormValueSale: formSaleValueType = {
    idVenta: 0,
    idUser: '',
    venta: '',
    precio: '',
    fecha: new Date(),
    typeAction: 'create'
  };
  const [propsFormSale, setPropsFormSale] = useState<formSaleValueType>(FormValueSale);

  // -- group of hook sale and hook employee
  const GroupHooks = {
    hookEmploye: propsFormEmployee,
    sethookEmploye: setPropsFormEmployee,
    hookSale: propsFormSale,
    sethookSale: setPropsFormSale,
  };

  return (
    <div className='w-full min-h-screen h-auto p-7 max-w-5xl m-auto animate-zoom-in'>
      <DataProvider>
        <Header />
        <TabformProvider>
          <Statistics />

          <section className='w-full h-auto flex items-start gap-5 flex-wrap mt-6'>
            <Forms groupHook={GroupHooks} />
            <DataTable setPropsFormEmployee={setPropsFormEmployee} setPropsFormSale={setPropsFormSale} />
          </section>
        </TabformProvider>
      </DataProvider>
    </div>
  )
}

export default App