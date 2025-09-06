import React, { createContext, useContext, useState, type ReactNode } from "react";


interface TabFormType {
    visibleForm?: string;
    setVisibleForm?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const TabForm = createContext<TabFormType>({});

export function TabformProvider({children} : {children : ReactNode}) {
    const [visibleForm, setVisibleForm] = useState<string | undefined>("employee");

    return (
        <TabForm.Provider value={{visibleForm, setVisibleForm}}>
            {children}
        </TabForm.Provider>
    );
}

export function useTabForm() {
    const atributesTabForm = useContext(TabForm);
    if (!atributesTabForm) {
        console.log('form.context debe de usarse dentro de un provider.');
    }
    return atributesTabForm;
}